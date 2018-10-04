import * as path from 'path'
import { credentialRequirements } from '../config'
import { Express } from 'express'
import { validateCredentialSignatures, extractDataFromClaims } from '../src/utils/'
import { RedisApi } from './types'
import { JSONWebToken } from 'jolocom-lib/js/interactionFlows/JSONWebToken';
import { CredentialRequest } from 'jolocom-lib/js/interactionFlows/credentialRequest/credentialRequest';

export const configureRoutes = async (app: Express, redisApi: RedisApi) => {

  const { setAsync } = redisApi

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

  app.get('/assets/:name', (req, res) => {
    const { name } = req.params
    res.sendFile(path.join(__dirname, `../dist/img/${name}`))
  })

  app.post('/authentication/:clientId', async (req, res, next) => {
    const { clientId } = req.params
    const { token } = req.body

    try {
      const { credentialResponse } = await JSONWebToken.decode(token)
      await validateCredentialSignatures(credentialResponse)

      const credentialRequest = CredentialRequest.create({
        callbackURL: '',
        credentialRequirements
      })

      if (!credentialResponse.satisfiesRequest(credentialRequest)) {
        throw new Error('The supplied credentials do not match the types of the requested credentials')
      }

      const userData = {
        ...extractDataFromClaims(credentialResponse),
        did: credentialResponse.issuer,
        status: 'success'
      }

      await setAsync(clientId, JSON.stringify({ status: 'success', data: userData }))

      res.json('OK')
    } catch (err) {
      next(err)
    }
  })
}
