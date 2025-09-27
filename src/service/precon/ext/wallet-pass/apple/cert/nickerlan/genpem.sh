openssl pkcs12 -in nickerlanpass2.p12 -clcerts -nokeys -out signerCert.pem -passin pass:12AVB@cw -legacy &&
openssl pkcs12 -in nickerlanpass2.p12 -nocerts -out signerKey.pem -passin pass:12AVB@cw -passout pass:12AVB@cw -legacy


