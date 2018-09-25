import { CredentialResponse } from 'jolocom-lib/js/credentialResponse/credentialResponse';
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential';
import { IClaimMetadata } from 'jolocom-lib/js/credentials/credential/types';
import { claimsMetadata } from 'jolocom-lib'

export const validateCredentialSignatures = async (credentialResponse: CredentialResponse) => {
  const suppliedCredentials = credentialResponse.getSuppliedCredentials()

  const credSignatureValidity = await Promise.all(
    suppliedCredentials.map(suppliedCred => {
      return SignedCredential.fromJSON(suppliedCred.credential).validateSignature()
    })
  )

  if (!credSignatureValidity.every(entry => entry)) {
    throw new Error('Invalid signature on presented credentials')
  }
}

interface TypeMap {
  [x: string]: IClaimMetadata
}

interface IdentityData {
  [key: string]: string
  email: string
  givenName: string
  familyName: string
}

export const extractDataFromClaims = (credentialResponse: CredentialResponse): IdentityData => {
  const typeToMetadataMap: TypeMap = {
    ProofOfNameCredential: claimsMetadata.name,
    ProofOfEmailCredential: claimsMetadata.emailAddress
  }

  const response: IdentityData = {
    email: '',
    givenName: '',
    familyName: ''
  }

  credentialResponse.getSuppliedCredentials().forEach(credential => {
    const metadata: IClaimMetadata = typeToMetadataMap[credential.type[1]]

    if (metadata) {
      metadata.fieldNames.forEach((fieldName: string) => {
        response[fieldName] = credential.credential.claim[fieldName] as string
      })
    }
  })

  return response
}
