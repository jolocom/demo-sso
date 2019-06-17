import * as path from 'path'
import { credentialRequirements, serviceUrl } from '../config'
import { Express } from 'express'
import { extractDataFromClaims } from '../src/utils/'
import { RedisApi } from './types'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { keyIdToDid, publicKeyToAddress } from 'jolocom-lib/js/utils/helper'
import { CredentialResponse } from 'jolocom-lib/js/interactionTokens/credentialResponse'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/credentialOffer'
import { JolocomLib } from 'jolocom-lib'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { PaymentResponse } from 'jolocom-lib/js/interactionTokens/paymentResponse'


export const configureRoutes = async (app: Express, redisApi: RedisApi, iw: IdentityWallet, password: string) => {
  const { setAsync, getAsync } = redisApi

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

  app.get('/assets/:name', (req, res) => {
    const { name } = req.params
    res.sendFile(path.join(__dirname, `../dist/img/${name}`))
  })

  /// Endpoints for demo-sso-mobile app  ///

  /**
   * An authentication endpoint route for deep linking for demo-sso-mobile;
   */

  app.get('/mobile/credentialRequest', async (req, res, next) => {
    try {
      const credentialRequest = await iw.create.interactionTokens.request.share(
        {
          callbackURL: 'demosso://interaction/',
          credentialRequirements
        },
        password
      )

      const jwtCR = credentialRequest.encode()
      res.send(jwtCR)
    } catch (err) {
      next(err)
    }
  })

  /**
   * An endpoint route for deep linking for demo-sso-mobile to start the credential receive flow;
   */

  app.get('/mobile/credentialOfferRequest', async (req, res, next) => {
    try {
      const credentialOfferRequest = await iw.create.interactionTokens.request.offer(
        {
          callbackURL: `${serviceUrl}/credentialReceive/`,
          instant: true,
          requestedInput: {}
        },
        password
      )

      const jwtCR = credentialOfferRequest.encode()
      res.send(jwtCR)
    } catch (err) {
      next(err)
    }
  })

  /**
   * Route for mobile payment interaction
   */

  app.get('/mobile/paymentRequest', async (req, res, next) => {
    try {
      const serviceEthAddress = publicKeyToAddress(iw.getPublicKey({
        derivationPath: JolocomLib.KeyTypes.ethereumKey,
        encryptionPass: password
      }))

      const paymentRequest = await iw.create.interactionTokens.request.payment({
        callbackURL: 'demosso://interaction/',
        description: 'Buy the Jolocom t-shirt on the go',
        transactionDetails: {
          receiverAddress: serviceEthAddress,
          amountInEther: '0.00001'
        }}, password)

      const jwtCR = paymentRequest.encode()
      res.send(jwtCR)
    } catch (err) {
      next(err)
    }
  })

  /// web page endpoints ///

  /**
   * Route which expects the credential response from user
   */

  app.post('/authentication/:clientId', async (req, res, next) => {
    const { clientId } = req.params
    const { token } = req.body

    try {
      const localRecord = await getAsync(clientId)
      const encodedRequest: string = JSON.parse(localRecord).request

      const request: JSONWebToken<CredentialRequest> = JolocomLib.parse.interactionToken.fromJWT(encodedRequest)
      const response: JSONWebToken<CredentialResponse> = JolocomLib.parse.interactionToken.fromJWT(token)

      await iw.validateJWT(response, request)

      const userData = {
        ...extractDataFromClaims(response.interactionToken),
        did: keyIdToDid(response.issuer),
        status: 'success'
      }

      await setAsync(clientId, JSON.stringify({ status: 'success', data: userData }))

      res.json('OK')
    } catch (err) {
      next(err)
    }
  })

  /**
   * Route to get the credential offer request (broadcast)
   */

  app.get('/credentialOffer', async (req, res, next) => {
    try {
      const credOffer = await iw.create.interactionTokens.request.offer(
        {
          instant: true,
          requestedInput: {},
          callbackURL: `${serviceUrl}/credentialReceive/`
        },
        password
      )

      res.json({ token: credOffer.encode() })
    } catch (err) {
      next(err)
    }
  })

  /**
   * Route which expects the credential offer response from user
   * and sends an encoded signed credential
   */

  app.post('/credentialReceive', async (req, res, next) => {
    const { token } = req.body

    const credentialOfferResponse = JSONWebToken.decode<CredentialOffer>(token)

    try {
      await iw.validateJWT(credentialOfferResponse)

      const tinkererToken = await iw.create.signedCredential(
        {
          metadata: {
            type: ['Credential', 'ProofOfTinkererCredential'],
            name: 'Tinkerer',
            context: [
              {
                ProofOfTinkererCredential: 'https://identity.jolocom.com/terms/ProofOfTinkererCredential'
              }
            ]
          },
          claim: {
            note:
              'Thank you for your participation and contribution our ongoing efforts to make self sovereign identity a reality'
          },
          subject: keyIdToDid(credentialOfferResponse.issuer)
        },
        password
      )

      const credentialReceive = await iw.create.interactionTokens.response.issue(
        {
          signedCredentials: [tinkererToken.toJSON()]
        },
        password,
        credentialOfferResponse
      )

      res.json({ token: credentialReceive.encode() })
    } catch (err) {
      next(err)
    }
  })

  
  app.post('/payment-confirmation/:userId', async (req, res, next) => {
    const { userId } = req.params
    const { token } = req.body
    
    try {
      const localRecord = await getAsync(userId)
      const encodedRequest: string = JSON.parse(localRecord).paymentRequest

      const request: JSONWebToken<PaymentRequest> = JolocomLib.parse.interactionToken.fromJWT(encodedRequest)
      const response: JSONWebToken<PaymentResponse> = JolocomLib.parse.interactionToken.fromJWT(token)

      await iw.validateJWT(response, request)

      const parsedUserData = JSON.parse(localRecord)
      const userData = {
        ...parsedUserData.userData,
        txHash: response.interactionToken.txHash
      }

      await setAsync(userId, JSON.stringify({ data: userData }))

      res.json('OK')
    } catch (err) {
      next(err)
    }
  })
}
