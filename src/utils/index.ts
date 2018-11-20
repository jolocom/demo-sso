import { JolocomLib } from 'jolocom-lib'
import { getIssuerPublicKey } from 'jolocom-lib/js/utils/helper'
import { CredentialResponse } from 'jolocom-lib/js/interactionTokens/credentialResponse'

export const validateCredentialSignatures = async (credentialResponse: CredentialResponse): Promise<boolean> => {
  const suppliedCredentials = credentialResponse.suppliedCredentials
  const registry = JolocomLib.registries.jolocom.create()

  /** The process of performing batch verifications will be improved soon */
  const credSignatureValidity = await Promise.all(
    suppliedCredentials.map(async cred => {
      const issuer = await registry.resolve(cred.issuer)
      const issuerPublicKey = getIssuerPublicKey(cred.signer.keyId, issuer.didDocument)
      return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, cred)
    })
  )

  if (!credSignatureValidity.every(entry => entry)) {
    throw new Error('Invalid signature on presented credentials')
  }

  return true
}

interface IdentityData {
  id?: string
  givenName: string
  familyName: string
}

export const extractDataFromClaims = (credentialResponse: CredentialResponse): IdentityData => {
  let response: IdentityData = {
    givenName: '',
    familyName: ''
  }

  credentialResponse.suppliedCredentials.forEach(credential => {
    response = { ...response, ...credential.claim }
  })

  return response
}

export const randomString = (length: number) => {
  return Math.random()
    .toString(36)
    .substr(2, length)
}
