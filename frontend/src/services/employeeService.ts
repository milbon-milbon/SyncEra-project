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
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'; // 追加
import app from '@/firebase/config'; // appのインポート

const db = getFirestore(app);

// 新規登録
export async function addEmployee(companyId: string, employeeData: any) {
  const employeesRef = collection(db, `companies/${companyId}/employees`);

  // Firebase Authentication でアカウントを作成する
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    employeeData.email,
    employeeData.password,
  );

  // Firestore に追加情報を保存
  await setDoc(doc(employeesRef, userCredential.user.uid), {
    name: employeeData.name,
    department: employeeData.department,
    role: employeeData.role,
    email: employeeData.email,
    uid: userCredential.user.uid,
  });
}

// 更新
export async function updateEmployee(companyId: string, employeeId: string, employeeData: any) {
  const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
  await updateDoc(employeeRef, employeeData);
}

// 削除
export async function deleteEmployee(companyId: string, employeeId: string) {
  const employeeRef = doc(db, `companies/${companyId}/employees`, employeeId);
  await deleteDoc(employeeRef);

  // Firebase Authentication のアカウントも削除する
  const auth = getAuth();
  const user = auth.currentUser;
  if (user && user.uid === employeeId) {
    await deleteUser(user); // 現在のユーザーを削除
  } else {
    throw new Error('Cannot delete other users from the client side.');
  }
}
// 社員情報取得
export async function getEmployee(employeeId: string) {
  const employeeRef = doc(db, `companies/${employeeId}/employees`, employeeId);
  const employeeDoc = await getDoc(employeeRef);
  return employeeDoc.exists() ? employeeDoc.data() : null;
}
