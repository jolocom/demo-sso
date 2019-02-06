import { SSO } from 'jolocom-lib/js/sso/sso'
import * as io from 'socket.io'
import { credentialRequirements, serviceUrl } from '../config'
import * as http from 'http'
import { DbWatcher } from './dbWatcher'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { RedisApi } from './types'
import { JolocomLib } from 'jolocom-lib'
import { publicKeyToAddress } from 'jolocom-lib/js/utils/helper'
const SHA3 = require('sha3')

export const configureSockets = (
  server: http.Server,
  identityWallet: IdentityWallet,
  password: string,
  dbWatcher: DbWatcher,
  redisApi: RedisApi
) => {
  const { getAsync, delAsync } = redisApi

  const baseSocket = io(server).origins('*:*')

  const authQrCodeSocket = baseSocket.of('/qr-auth')
  const credReceiveQrCodeSocket = baseSocket.of('/qr-credReceive')
  const paymentQrCodeSocket = baseSocket.of('/qr-payment')
  const userDataSocket = baseSocket.of('/sso-status')
  
 /**
  * @description Used by the frontend to request credential request QR codes
  * @param {string} userId - The session identifier
  * @emits qrCode - encoded credential request JWT
  */

  authQrCodeSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query

    const callbackURL = `${serviceUrl}/authentication/${userId}`
    const credentialRequest = await identityWallet.create.interactionTokens.request.share(
      {
        callbackURL,
        credentialRequirements
      },
      password
    )

    /** Encoded credential request is saved for validation purposes later */
    await redisApi.setAsync(userId, JSON.stringify({ userId, request: credentialRequest.encode(), status: 'pending' }))
    const qrCode = await new SSO().JWTtoQR(credentialRequest.encode())

    console.log(`[DEBUG] : JWT for ${userId} : ${credentialRequest.encode()}`)
    socket.emit(userId, qrCode)
  })

  /**
   * @description Used by frontend to broadcast issue of credential by service
   * @param {string} did - did of user requesting credential
   * @param {string} answer - answer to the data question on webpage
   * @emits qrCode - ecoded credential offer request JWT
   */

  credReceiveQrCodeSocket.on('connection', async socket => {
    const { did, answer } = socket.handshake.query

    const didHash = SHA3.SHA3Hash()
    didHash.update(did)
    await redisApi.setAsync(`ans:${didHash.digest('hex')}`, answer)

    const credOfferRequest = await identityWallet.create.interactionTokens.request.offer(
      {
        instant: true,
        requestedInput: {},
        callbackURL: `${serviceUrl}/credentialReceive/`
      },
      password
    )

    const qrCode = await new SSO().JWTtoQR(credOfferRequest.encode())
    socket.emit(did, qrCode)
  })

  
  /**
   * @description Used by frontend to request payment request QR codes
   * @param {string} userId - session identifier
   * @emits qrCode - ecoded payment request JWT
   */

  paymentQrCodeSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query

    const callbackURL = `${serviceUrl}/payment-confirmation/${userId}`
    const serviceEthAddress = publicKeyToAddress(identityWallet.getPublicKey({
      derivationPath: JolocomLib.KeyTypes.ethereumKey,
      encryptionPass: password
    }))
  
    const paymentRequest = await identityWallet.create.interactionTokens.request.payment({
      callbackURL,
      description: `Special edition Jolocom t-shirt`,
      transactionDetails: {
        receiverAddress: serviceEthAddress,
        amountInEther: `0.0033`
      }
    }, password)

    // Encoded payment request is saved for validation purposes later
    await redisApi.setAsync(userId, JSON.stringify({ userId, paymentRequest: paymentRequest.encode()}))
    
    const qrCode = await new SSO().JWTtoQR(paymentRequest.encode())
    socket.emit(userId, qrCode)
  })

  /**
   * @description queries data for userId
   * @param {srting} userId - session identifier
   * @emits userData - temporary stored data connected to userId
   */

  userDataSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query

    dbWatcher.addSubscription(userId)
    dbWatcher.on(userId, async () => {
      const userData = await getAsync(userId)
      await delAsync(userId)
      socket.emit(userId, userData)
    })
  })
}
