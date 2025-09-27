openssl pkcs12 -in pderm.p12 -clcerts -nokeys -out signerCert.pem -passin pass:Ea1ziekiis7 -legacy &&
openssl pkcs12 -in pderm.p12 -nocerts -out signerKey.pem -passin pass:Ea1ziekiis7 -passout pass:Ea1ziekiis7 -legacy


