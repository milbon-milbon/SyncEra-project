// functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
interface AdminClaimsResponse {
  message: string;
}
app.post("/", (req, res) => {
  const {data} = req.body;
  const {uid} = data;
  console.log("Received request body:", req.body);
  console.log("Received UID:", uid);

  if (!uid || typeof uid !== "string" || uid.length > 128) {
    res.status(400).json({data: {error: "Invalid UID"}});
    return;
  }

  admin
    .auth()
    .setCustomUserClaims(uid, {isCompanyAdmin: true})
    .then(() => {
      const response: AdminClaimsResponse = {
        message: "Success! Admin claims set.",
      };
      res.status(200).json({data: response});
    })
    .catch((error) => {
      console.error("Error setting custom claims:", error);
      res.status(500).json({data: {error: "Internal server error"}});
    });
});

// エラーハンドリングミドルウェア
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({data: {error: "Something broke!"}});
});

export const setAdminClaims = functions.https.onRequest(app);
