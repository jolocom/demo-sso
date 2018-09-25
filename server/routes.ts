import path from 'path'
import { JolocomLib } from 'jolocom-lib'
import { requestCreationArgs } from '../config'
import { Express } from 'express'
import { validateCredentialSignatures, extractDataFromClaims } from '../src/utils/'
import { RedisApi } from './types'

export const configureRoutes = async (app: Express, redisApi: RedisApi) => {

  const { setAsync } = redisApi

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

  app.post('/authentication/:clientId', async (req, res, next) => {
    const { clientId } = req.params
    const { token } = req.body

    try {
      const signedCredentialResponse = JolocomLib.parse.signedCredentialResponse.fromJWT(token)
      const credentialResponse = signedCredentialResponse.getCredentialResponse()

      const validSignature = await signedCredentialResponse.validateSignature()

      const credentialRequest = JolocomLib.unsigned.createCredentialRequest({ ...requestCreationArgs, callbackURL: '' })
      const validCredentials = credentialResponse.satisfiesRequest(credentialRequest)

      if (!validCredentials) {
        throw new Error('The supplied credentials do not match the types of the requested credentials')
      }

      if (!validSignature) {
        throw new Error('The signature on the credential response is not valid')
      }

      await validateCredentialSignatures(credentialResponse)

      const userData = {
        ...extractDataFromClaims(credentialResponse),
        did: signedCredentialResponse.getIssuer(),
        status: 'success'
      }

      await setAsync(clientId, JSON.stringify({ status: 'success', data: userData }))

      res.json('OK')
    } catch (err) {
      next(err)
    }
  })
}
