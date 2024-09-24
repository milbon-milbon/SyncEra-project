// src/services/employeeService.ts
'use client';

import { getFirestore, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/firebase/config';
import clientLogger from '@/lib/clientLogger';

// Firebase サービスの初期化
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// 型定義
interface EmployeeData {
  name: string;
  department: string;
  role: string;
  email: string;
  password: string;
}

interface CustomClaims {
  companyId?: string;
  // その他のカスタムクレームがあればここに追加
}

/**
 * 新規従業員を追加する
 * @param companyId 会社ID
 * @param employeeData 従業員データ
 * @returns 作成された従業員のUID
 * @throws Error メールアドレスが既に使用されている場合やその他のエラー
 */
export async function addEmployee(companyId: string, employeeData: EmployeeData): Promise<string> {
  try {
    // Firebase Authentication でアカウントを作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      employeeData.email,
      employeeData.password,
    );
    const user = userCredential.user;

    // Cloud Function を使用してカスタムクレームを設定
    const setCustomClaims = httpsCallable<{ uid: string; companyId: string }, void>(
      functions,
      'setCustomClaims',
    );
    await setCustomClaims({ uid: user.uid, companyId });

    // トークンを強制的に更新
    await user.getIdToken(true);

    // Firestore に従業員情報を保存
    const employeeDocRef = doc(db, `companies/${companyId}/employees`, user.uid);
    await setDoc(employeeDocRef, {
      name: employeeData.name,
      department: employeeData.department,
      role: employeeData.role,
      email: employeeData.email,
      uid: user.uid,
      companyId: companyId,
    });

    clientLogger.debug(`New employee added successfully: ${user.uid}`);
    return user.uid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('このメールアドレスは既に使用されています。');
    }
    clientLogger.error(`Error adding new employee: ${error}`);
    throw error;
  }
}

/**
 * 従業員情報を更新する
 * @param companyId 会社ID
 * @param employeeId 従業員ID
 * @param employeeData 更新する従業員データ
 * @throws Error 更新中にエラーが発生した場合
 */
export async function updateEmployee(
  companyId: string,
  employeeId: string,
  employeeData: Partial<EmployeeData>,
): Promise<void> {
  const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
  try {
    // Firestore のデータを更新
    await updateDoc(employeeRef, employeeData);

    // メールアドレスの更新が含まれている場合
    if (employeeData.email) {
      const updateEmployeeEmail = httpsCallable<{ employeeId: string; newEmail: string }, void>(
        functions,
        'updateEmployeeEmail',
      );
      await updateEmployeeEmail({ employeeId, newEmail: employeeData.email });
    }

    clientLogger.debug(`Employee updated successfully: ${employeeId}`);
  } catch (error) {
    clientLogger.error(`Error updating employee: ${error}`);
    throw error;
  }
}

/**
 * 従業員を削除する
 * @param companyId 会社ID
 * @param employeeId 従業員ID
 * @throws Error 削除中にエラーが発生した場合や、他のユーザーを削除しようとした場合
 */
export async function deleteEmployee(companyId: string, employeeId: string): Promise<void> {
  try {
    const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
    await deleteDoc(employeeRef);

    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === employeeId) {
      await deleteUser(currentUser);
    } else {
      throw new Error('Cannot delete other users from the client side.');
    }

    clientLogger.debug(`Employee deleted successfully: ${employeeId}`);
  } catch (error) {
    clientLogger.error(`Error deleting employee: ${error}`);
    throw error;
  }
}

/**
 * 従業員情報を取得する
 * @param companyId 会社ID
 * @param employeeId 従業員ID
 * @returns 従業員データ、存在しない場合は null
 * @throws Error 取得中にエラーが発生した場合や、管理者が認証されていない場合
 */
export async function getEmployee(companyId: string, employeeId: string): Promise<any | null> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('管理者が認証されていません。');
  }

  try {
    const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      return null;
    }

    return employeeDoc.data();
  } catch (error) {
    clientLogger.error(`Error in getEmployee: ${error}`);
    throw error;
  }
}
