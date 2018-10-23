import { SSO } from 'jolocom-lib/js/sso/index'
import * as io from 'socket.io'
import { credentialRequirements, serviceUrl } from '../config'
import * as http from 'http'
import { DbWatcher } from './dbWatcher'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { RedisApi } from './types'
import { InteractionType } from 'jolocom-lib/js/interactionFlows/types'
const SHA3 = require('sha3')

export const configureSockets = (
  server: http.Server,
  identityWallet: IdentityWallet,
  dbWatcher: DbWatcher,
  redisApi: RedisApi
) => {
  const { getAsync, delAsync } = redisApi

  const baseSocket = io(server).origins('*:*')

  const qrCodeSocket = baseSocket.of('/qr-code')
  const qrCodeReceive = baseSocket.of('/qr-receive')
  const dataSocket = baseSocket.of('/sso-status')

  qrCodeReceive.on('connection', async socket => {
    const { did, answer } = socket.handshake.query

    const didHash = SHA3.SHA3Hash()
    didHash.update(did)

    await redisApi.setAsync(`ans:${didHash.digest('hex')}`, answer)

    const tinkererToken = await identityWallet.create.signedCredential({
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
        note: 'Thank you for participating! This might come in handy later!'
      },
      subject: did
    })

    const encodedCredential = await identityWallet.create
      .credentialsReceiveJSONWebToken({
        iss: identityWallet.getIdentity().getDID(),
        typ: InteractionType.CredentialsReceive,
        credentialsReceive: {
          signedCredentials: [tinkererToken.toJSON()]
        }
      })
      .encode()

    const qrCode = await new SSO().JWTtoQR(encodedCredential, {
      errorCorrectionLevel: 'L',
      version: 40
    })

    socket.emit(did, qrCode)
  })

  qrCodeSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query

    const callbackURL = `${serviceUrl}/authentication/${userId}`

    const credentialRequest = await identityWallet.create.credentialRequestJSONWebToken({
      typ: InteractionType.CredentialRequest,
      credentialRequest: {
        callbackURL,
        credentialRequirements
      }
    })

    const qrCode = await new SSO().JWTtoQR(credentialRequest.encode())
    socket.emit(userId, qrCode)
  })

  dataSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query
    dbWatcher.addSubscription(userId)
    dbWatcher.on(userId, async () => {
      const userData = await getAsync(userId)
      await delAsync(userId)
      socket.emit(userId, userData)
    })
  })
}
