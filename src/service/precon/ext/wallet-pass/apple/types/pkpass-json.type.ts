interface PkPassField {
  key: string;
  label: string;
  value: string;
}

export interface AppleWalletPkpassJsonType {
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  authenticationToken: string;
  webServiceURL: string;
  description: string;
  organizationName?: string;
  teamIdentifier?: string;
  passTypeIdentifier?: string;
  formatVersion: number;
  eventTicket: {
    headerFields: PkPassField[];
    auxiliaryFields: PkPassField[];
    primaryFields: PkPassField[];
    secondaryFields: PkPassField[];
    backFields: PkPassField[];
  };
}
