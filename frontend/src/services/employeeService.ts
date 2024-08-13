// src/services/employeeService.ts
'use client';

import {
  getFirestore,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  signInWithEmailAndPassword,
  IdTokenResult,
} from 'firebase/auth';

import app from '@/firebase/config';
import { getFunctions, httpsCallable } from 'firebase/functions';
import clientLogger from '@/lib/clientLogger';

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

interface EmployeeData {
  name: string;
  department: string;
  role: string;
  email: string;
  password: string;
}
// カスタムクレームの型定義
interface CustomClaims {
  companyId?: string;
  // その他のカスタムクレームがあればここに追加
}

// 新規登録
export async function addEmployee(companyId: string, employeeData: EmployeeData) {
  try {
    // Firebase Authentication でアカウントを作成する
    // 新しいユーザーを作成するが、サインインはしない
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      employeeData.email,
      employeeData.password,
    );
    const user = userCredential.user;

    // Cloud Functionを使用してカスタムクレームを設定
    const setCustomClaims = httpsCallable(functions, 'setCustomClaims');
    await setCustomClaims({ uid: user.uid, companyId: companyId });
    // トークンを強制的に更新
    await user.getIdToken(true);
    // Firestore に追加情報を保存
    const employeeDocRef = doc(db, `companies/${companyId}/employees`, userCredential.user.uid);
    await setDoc(employeeDocRef, {
      name: employeeData.name,
      department: employeeData.department,
      role: employeeData.role,
      email: employeeData.email,
      uid: user.uid,
      companyId: companyId, // companyIdも保存
    });

    console.log(`Employee added to Firestore: ${employeeDocRef.path}`);
    // 新規職員作成後、現在のユーザーをサインアウトする
    // await signOut(auth);
    return userCredential.user.uid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('このメールアドレスは既に使用されています。');
    }
    console.error('===追加できませんでした===:', error);
    throw error;
  }
}

// // 更新
// export async function updateEmployee(
//   companyId: string,
//   employeeId: string,
//   employeeData: Partial<EmployeeData>,
// ) {
//   const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
//   try {
//     await updateDoc(employeeRef, employeeData);
//   } catch (error) {
//     console.error('Error updating employee:', error);
//     throw error;
//   }
// }

// 仮
// 更新
export async function updateEmployee(
  companyId: string,
  employeeId: string,
  employeeData: Partial<EmployeeData>,
) {
  const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
  try {
    // Firestoreのデータを更新
    await updateDoc(employeeRef, employeeData);

    // メールアドレスの更新が含まれている場合
    if (employeeData.email) {
      // Cloud Functionを呼び出してメールアドレスを更新
      const updateEmployeeEmail = httpsCallable(functions, 'updateEmployeeEmail');
      await updateEmployeeEmail({ employeeId, newEmail: employeeData.email });
    }

    clientLogger.info(`Employee updated successfully: ${employeeId}`);
  } catch (error) {
    clientLogger.error(`Error updating employee:, ${error}`);
    throw error;
  }
}

// 削除
export async function deleteEmployee(companyId: string, employeeId: string) {
  try {
    const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
    await deleteDoc(employeeRef);
    const auth = getAuth();
    // Firebase Authentication のアカウントも削除する
    const user = await auth.currentUser;
    if (user && user.uid === employeeId) {
      await deleteUser(user);
    } else {
      throw new Error('Cannot delete other users from the client side.');
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// // 社員情報取得（修正版）更新できた
export async function getEmployee(companyId: string, employeeId: string): Promise<any | null> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('管理者が認証されていません。');
  }

  try {
    // Firestoreのデータを更新
    const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      return null;
    }

    return employeeDoc.data();
  } catch (error) {
    clientLogger.error(`Error in getEmployee:, ${error}`);
    throw error;
  }
}
