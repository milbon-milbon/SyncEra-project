'use client';
import React, { useState } from 'react';

// 問い合わせフォームの送信ボタンクリック
export default function ContactFormButton() {
  const [formData, setFormData] = useState({
    company_name: '',
    department: '',
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/client/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      // メッセージを更新
      setResponseMessage('問い合わせが正常に送信されました。ありがとうございます。');

      // フォームデータをリセット
      setFormData({
        company_name: '',
        department: '',
        name: '',
        email: '',
        message: '',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage(`エラーが発生しました: ${error.message}`);
      } else {
        setResponseMessage('不明なエラーが発生しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <input
        type="text"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        placeholder="会社・団体名"
        className="w-full p-3 rounded border border-gray-300"
      />
      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="部署名（任意）"
        className="w-full p-3 rounded border border-gray-300"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="お名前"
        className="w-full p-3 rounded border border-gray-300"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="メールアドレス"
        className="w-full p-3 rounded border border-gray-300"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="メッセージ"
        className="w-full p-3 rounded border border-gray-300"
        rows={5}
      ></textarea>
      <button
        type="submit"
        className="bg-[#003366] text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-colors duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? '送信中...' : 'メッセージを送信'}
      </button>
      {responseMessage && <p className="mt-4 text-green-600">{responseMessage}</p>}
    </form>
  );
}
