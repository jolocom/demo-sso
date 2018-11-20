import { IConstraint } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

/**
 * The seed to instantiate a vaulted key provider and password for seed encryption / decryption
 * The need to persist the seed in clear text will be addressed in the next minor release
 */
export const seed = Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex')
export const password = 'correct horse battery staple'

/** Where is your service deployed. E.g. https://demo-sso.jolocom.com */
export const serviceUrl = 'https://demo-sso.jolocom.com'

/** What credentials do you require during authentication, and associated constraints */
export const credentialRequirements = [
  {
    type: ['Credential', 'ProofOfNameCredential'],
    constraints: [] as IConstraint[]
  }
]
