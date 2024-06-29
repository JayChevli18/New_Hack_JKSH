const axios = require("axios");
const environment = require("../utils/environment");

const authString = `${environment.smscountry.authKey}:${environment.smscountry.authToken}`;
const authS = `Basic ${Buffer.from(authString).toString("base64")}`;

const smsCountryAPI = {
  sendsms(text, number, allowInDev = false) {
    if (environment.nodeEnv === "production" || allowInDev) {
      return axios.post(
        `${environment.smscountry.apiUrl}/v0.1/Accounts/${environment.smscountry.authKey}/SMSes/`,
        {
          Text: text,
          Number: number,
          SenderId: environment.smscountry.senderId,
          DRNotifyUrl: `${environment.server}/api/webhook/message/callback`,
          DRNotifyHttpMethod: "POST",
          Tool: "API",
        },
        {
          headers: {
            Authorization: authS,
          },
        }
      );
    } else {
      return Promise.resolve({ mock: true });
    }
  },
};

module.exports = smsCountryAPI;
