// functions/src/index.ts

// 必要なモジュールのインポート
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Firebase adminの初期化
admin.initializeApp();

// Expressアプリケーションの設定
const app = express();
app.use(cors({ origin: true })); // CORSを有効化
app.use(express.json()); // JSONボディパーサーを使用

// インターフェース定義
interface AdminClaimsResponse {
  message: string;
}

// ヘルパー関数
/**
 * ユーザーのメールアドレスに基づいて会社IDを取得する
 * @param user - Firebase Authenticationのユーザーオブジェクト
 * @returns 会社ID
 * @throws ユーザーにメールアドレスが設定されていない場合にエラーをスロー
 */
async function getCompanyIdForUser(
  user: admin.auth.UserRecord
): Promise<string> {
  if (!user.email) {
    throw new Error("User does not have an email address.");
  }
  return user.email.endsWith("@example.com")
    ? "exampleCompanyId"
    : "defaultCompanyId";
}

// Expressミドルウェア
/**
 * リクエストボディ内のUIDを検証するミドルウェア
 */
const validateUid = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { uid } = req.body.data;
  if (!uid || typeof uid !== "string" || uid.length > 128) {
    res.status(400).json({ data: { error: "Invalid UID" } });
    return;
  }
  next();
};

// エラーハンドリングミドルウェア
const errorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error(err); // エラーをログに記録
  res.status(500).json({
    data: { error: "Internal server error" },
  });
};

// Expressルート
/**
 * 管理者権限を設定するエンドポイント
 */
app.post("/setAdminClaims", validateUid, async (req, res) => {
  const { uid } = req.body.data;
  try {
    await admin.auth().setCustomUserClaims(uid, { isCompanyAdmin: true });
    const response: AdminClaimsResponse = {
      message: "Success! Admin claims set.",
    };
    res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error setting admin claims:", error);
    res.status(500).json({ data: { error: "Failed to set admin claims" } });
  }
});

// エラーハンドリングミドルウェアを適用
app.use(errorHandler);

// Firebase Functions

/**
 * シンプルなHello Worldファンクション
 */
export const helloWorld = functions.https.onRequest((_req, res) => {
  res.send("Hello from Firebase!");
});

/**
 * 管理者権限を設定するHTTPSファンクション
 */
export const setAdminClaims = functions.https.onRequest(app);

/**
 * 新規ユーザー作成時に会社IDを設定するファンクション
 */
export const setCompanyIdClaim = functions.auth
  .user()
  .onCreate(async (user) => {
    const companyId = await getCompanyIdForUser(user);
    await admin.auth().setCustomUserClaims(user.uid, { companyId });
  });

/**
 * カスタムクレームを設定するCallableファンクション
 */
export const setCustomClaims = functions.https.onCall(async (data, context) => {
  const { uid, companyId } = data;

  if (typeof uid !== "string" || typeof companyId !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with uid and companyId arguments."
    );
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { companyId });
    return { message: "Custom claims set successfully" };
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to set custom claims"
    );
  }
});

/**
 * ユーザーとそのデータを削除するCallableファンクション
 */
export const deleteUserAndData = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { employeeId, companyId } = data;

    try {
      // Firestoreからユーザーデータを削除
      await admin
        .firestore()
        .doc(`companies/${companyId}/employees/${employeeId}`)
        .delete();
      // Authenticationからユーザーを削除
      await admin.auth().deleteUser(employeeId);
      return { success: true, message: "User and data deleted successfully" };
    } catch (error) {
      console.error("Error deleting user and data:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to delete user and data"
      );
    }
  }
);

/**
 * 従業員のメールアドレスを更新するCallableファンクション
 * 注: この操作には管理者権限が必要
 */
export const updateEmployeeEmail = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.token.isCompanyAdmin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can update employee emails."
      );
    }

    const { employeeId, newEmail } = data;

    try {
      await admin.auth().updateUser(employeeId, { email: newEmail });
      return { success: true, message: "Email updated successfully" };
    } catch (error) {
      console.error("Error updating email:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to update email"
      );
    }
  }
);
