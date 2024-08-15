// 社員登録のボタン関数

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    // バックエンドAPIにデータを送信
    const response = await fetch('/api/add_employee/', {
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
      throw new Error('Failed to register employee');
    }

    // 成功したら社員一覧ページにリダイレクト
    router.push('/employee-list');
  } catch (error) {
    console.error('Error registering employee:', error);
    alert('社員登録に失敗しました。');
  }
};
