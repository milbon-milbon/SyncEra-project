// 社員登録のボタン関数
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 入力が必要な項目（ Slack ユーザーIDはバックエンド側でメールアドレスからIDを取得するように実装しています ）
type Employee = {
  name: string;
  email: string;
  department: string;
  role: string;
  project: string;
};

export const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    project: '',
  });
  try {
    // バックエンドAPI（エンドポイント/client/add_employee_info/ )にデータを送信
    const response = await fetch('http://localhost:8000/client/add_employee_info/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        project: formData.project,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail); // サーバーからのエラーメッセージを取得
    }

    // 成功したら社員一覧ページにリダイレクト
    router.push('/employee-list');
  } catch (error) {
    console.error('Error registering employee:', error);
    alert('社員登録に失敗しました。');
  }
};
