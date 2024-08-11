// frontend/src/app/admin-dashboard/page.tsx===「管理者（ログイン職員）」登録画面＝＝＝

'use client';

import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    department: '',
    position: '',
    email: '',
  });

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
      setEmployees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Employee)));
    });
    return () => unsubscribe();
  }, []);

  const handleAddEmployee = async () => {
    const db = getFirestore();
    await addDoc(collection(db, 'employees'), newEmployee);
    setNewEmployee({ name: '', department: '', position: '', email: '' });
  };

  const handleUpdateEmployee = async (id: string, data: Partial<Employee>) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'employees', id), data);
  };

  const handleDeleteEmployee = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, 'employees', id));
  };

  return (
    <div>
      <h1>社員管理</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddEmployee();
        }}
      >
        {/* 新規社員追加フォーム */}
      </form>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>{/* 社員情報表示と編集、削除ボタン */}</li>
        ))}
      </ul>
    </div>
  );
}
