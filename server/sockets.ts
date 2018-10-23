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

    const credOffer = await identityWallet.create.credentialOfferRequestJSONWebToken({
      typ: InteractionType.CredentialOfferRequest,
      credentialOffer: {
        instant: true,
        challenge: '12345',
        requestedInput: {},
        callbackURL: `${serviceUrl}/receive/`
      }
    })

    const qrCode = await new SSO().JWTtoQR(credOffer.encode())
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
