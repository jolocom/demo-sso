import { CredentialResponse } from 'jolocom-lib/js/interactionFlows/credentialResponse/credentialResponse'
import { JolocomLib } from 'jolocom-lib'

export const validateCredentialSignatures = async (credentialResponse: CredentialResponse): Promise<boolean> => {
  const suppliedCredentials = credentialResponse.getSuppliedCredentials()
  const registry = JolocomLib.registry.jolocom.create()

  const credSignatureValidity = await Promise.all(suppliedCredentials.map(cred => registry.validateSignature(cred)))

  if (!credSignatureValidity.every(entry => entry)) {
    throw new Error('Invalid signature on presented credentials')
  }

  return true
}

interface IdentityData {
  id?: string
  email: string
  givenName: string
  familyName: string
}

export const extractDataFromClaims = (credentialResponse: CredentialResponse): IdentityData => {
  let response: IdentityData = {
    email: '',
    givenName: '',
    familyName: ''
  }

  credentialResponse.getSuppliedCredentials().forEach(credential => {
    const claim = credential.getCredentialSection()
    response = { ...response, ...claim }
  })

  return response
}
