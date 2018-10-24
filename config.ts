// Private key associated with the service's identity
export const privateIdentityKey = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')

// Where is your service deployed. E.g. https://demo-sso.jolocom.com
export const serviceUrl = ''

// What credentials do you require during authentication, and associated constraints
export const credentialRequirements = [
  {
    type: ['Credential', 'ProofOfNameCredential'],
    constraints: [{ '==': [true, true] }]
  }
]
