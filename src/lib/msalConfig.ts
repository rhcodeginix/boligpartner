export const msalConfig: any = {
  auth: {
    clientId: `${process.env.REACT_APP_MICROSOFT_CLIENT_ID}`,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MICROSOFT_TENANT_ID}`,
    redirectUri: "https://boligkonfigurator.mintomt.no/auth/callback",
    clientSecret: `${process.env.REACT_APP_MICROSOFT_CLIENT_SECRET}`,
  },
};
