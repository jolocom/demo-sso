import { SSO } from 'jolocom-lib/js/sso/index'
import * as io from 'socket.io'
import { credentialRequirements, baseUrl, frontEndUrl } from '../config'
import * as http from 'http'
import { DbWatcher } from './dbWatcher'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { RedisApi } from './types'
import { InteractionType } from 'jolocom-lib/js/interactionFlows/types'

export const configureSockets = (
  server: http.Server,
  identityWallet: IdentityWallet,
  dbWatcher: DbWatcher,
  redisApi: RedisApi
) => {
  const { getAsync, delAsync } = redisApi

  const baseSocket = io(server, { origins: frontEndUrl })
  const qrCodeSocket = baseSocket.of('/qr-code')
  const dataSocket = baseSocket.of('/sso-status')

  qrCodeSocket.on('connection', async socket => {
    const { userId } = socket.handshake.query

    const callbackURL = `${baseUrl}/authentication/${userId}`

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
