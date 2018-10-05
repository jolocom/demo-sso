// Private key associated with the service's identity
export const privateIdentityKey = Buffer.from('7A59BC95029803EC082BFEBBA8094F9D6B58AAB1A23B7CA2D9C6B96F21E1A0A4', 'hex')

// Where is your service deployed. E.g. https://demo-sso.jolocom.com
export const serviceUrl = 'http://localhost:9000'

// What credentials do you require during authentication, and associated constraints
export const credentialRequirements = [
  {
    type: ['Credential', 'ProofOfEmailCredential'],
    constraints: [{ '==': [true, true] }]
  },
  {
    type: ['Credential', 'ProofOfNameCredential'],
    constraints: [{ '==': [true, true] }]
  }
]
