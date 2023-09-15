import { google } from "googleapis";
import readline from "readline";
import { Application } from "express";
import config from "@config";
import { getCache, setCache } from "@services/cache";
import fs from "fs";

export let googleClient = null;

export default ({ app }: { app: Application }): void => {
  const SCOPES = ["https://www.googleapis.com/auth/youtube"];
  const OAuth2 = google.auth.OAuth2;

  app.get("/auth", (req, res) => {
    const { code } = req.query;

    console.log(code);
    res.sendStatus(200);
  });

  const authorizeClient = async (): Promise<any> => {
    const clientSecret = config.youtube.secret;
    const clientId = config.youtube.client;
    const redirectUrl = `${config.bot_url}/auth`;
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    googleClient = oauth2Client;

    fs.readFile("./auth.json", async (err, token) => {
      if (err) {
        await getNewToken(oauth2Client);
      } else {
        oauth2Client.credentials = JSON.parse(token as any);
        await setCache("token", JSON.parse(token as any));
        console.log(JSON.parse(token as any));
      }
    });
  };

  const getNewToken = async (client) =>
    new Promise((resolve, reject) => {
      const authUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url: ", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Enter the code from that page here: ", function (code) {
        rl.close();
        client.getToken(code, function (err, token) {
          if (err) {
            console.log("Error while trying to retrieve access token", err);
            reject(err);
            return;
          }
          client.credentials = token;
          storeToken(token);

          resolve(true);
        });
      });
    });

  const storeToken = async (token): Promise<void> => {
    fs.writeFile("./auth.json", JSON.stringify(token), (err) => {
      if (err) throw err;

      setCache("token", token);
    });
  };

  authorizeClient();
};
