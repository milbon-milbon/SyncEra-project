// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import { v4 as uuidv4 } from "uuid";

// admin.initializeApp();

// interface CompanyData {
//   userId: string;
//   email: string;
//   companyName: string;
//   firstName: string;
//   lastName: string;
// }

// export const generateCompanyIdAndSendEmail = functions.pubsub
//   .topic("generate_company_id_and_send_email")
//   .onPublish(async (message) => {
//     const { userId, email, companyName, firstName, lastName }: CompanyData =
//       message.json;
//     const companyId = `COMPANY-${uuidv4()}`;

//     try {
//       // Firestoreに企業情報を保存
//       await admin.firestore().collection("companies").doc(userId).set({
//         companyId,
//         companyName,
//         email,
//         firstName,
//         lastName,
//       });

//       // Authenticationのユーザーにcompany_idを追加
//       await admin.auth().setCustomUserClaims(userId, { companyId });

//       // メール送信ロジック（ここでは簡略化）
//       await sendEmail(email, companyId);

//       console.log(`企業ID ${companyId} を生成し、${email} に送信しました。`);
//     } catch (error) {
//       console.error("エラーが発生しました:", error);
//     }
//   });

// async function sendEmail(email: string, companyId: string): Promise<void> {
//   // ここに実際のメール送信ロジックを実装
//   console.log(`${email}に企業ID: ${companyId}を送信しました。`);
// }
