// import { Configuration } from "@azure/msal-browser";

export const msalConfig: any = {
  auth: {
    clientId: `${process.env.REACT_APP_MICROSOFT_CLIENT_ID}`,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MICROSOFT_TENANT_ID}`,
    redirectUri: "https://boligkonfigurator.mintomt.no/auth/callback",
    clientSecret: "d3881780-ec21-4384-b782-ca44e48ab076",
  },
};
