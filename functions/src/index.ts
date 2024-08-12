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

/**
 * This function handles the setting of admin claims.
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object.
 */
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

/**
 * Error handling middleware.
 * @param {Error} err - The error object.
 * @param {express.Request} _req - The express request object.
 * @param {express.Response} res - The express response object.
 */
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    data: {error: "Something broke!"},
  });
});

/**
 * Sets admin claims for the user.
 * @param {functions.https.Request} req - The HTTP request object.
 * @param {functions.Response} res - The HTTP response object.
 */
export const setAdminClaims = functions.https.onRequest(app);

export const setCompanyIdClaim = functions.auth
  .user()
  .onCreate(async (user) => {
    // ユーザーに対応する会社IDを取得する関数
    const companyId = await getCompanyIdForUser(user);
    await admin.auth().setCustomUserClaims(user.uid, {
      companyId,
    });
  });

/**
 * Determines the company ID based on the user's email address.
 * @param {admin.auth.UserRecord} user - The user record object.
 * @return {Promise<string>} A promise that resolves to the company ID.
 * @throws Will throw an error if the user does not have an email address.
 */
async function getCompanyIdForUser(
  user: admin.auth.UserRecord
): Promise<string> {
  if (user.email) {
    if (user.email.endsWith("@example.com")) {
      return "exampleCompanyId";
    } else {
      return "defaultCompanyId";
    }
  } else {
    throw new Error("ユーザーにメールアドレスが設定されていません。");
  }
}
export const setCustomClaims = functions.https.onCall(async (data) => {
  const {uid, companyId} = data;

  if (!(typeof uid === "string") || !(typeof companyId === "string")) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " + "uid and companyId arguments."
    );
  }

  try {
    await admin.auth().setCustomUserClaims(uid, {companyId: companyId});
    console.log(`Custom claims set for user ${uid}: companyId = ${companyId}`);
    return {message: "Custom claims set successfully"};
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while setting custom claims"
    );
  }
});

// 新しい関数を追加
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const companyId = await getCompanyIdForUser(user);
  await admin.auth().setCustomUserClaims(user.uid, {companyId});
  console.log(`CompanyId set for new user ${user.uid}: ${companyId}`);
});
