// 画面遷移用として仮作成（メインmanager画面の代わりにテストで作成）マージの際は認証部分は残さないとセキュリティに影響。
// src/app/manager-dashboard/page.tsx
'use client';
{
  /*認証部分はメインの管理画面にマージして！*/
}
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '@/firebase/config'; // Firebase 初期化ファイルをインポート

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // ユーザーの役割を確認（ファイアーベースで設定している役職）
        const userDoc = await getDoc(doc(db, 'employees', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role !== 'manager') {
            // マネージャーでない場合は適切なダッシュボードにリダイレクト
            router.push(userData.role === 'staff' ? '/staff-dashboard' : '/employee-dashboard');
          }
        } else {
          // ユーザーデータが見つからない場合
          console.error('User data not found');
          router.push('/login/employee');
        }
      } else {
        router.push('/login/employee');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // または適切なエラーメッセージを表示
  }
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ここまで認証残し＝＝＝＝＝＝＝
  return (
    <div>
      <h1>マネージャーダッシュボード</h1>
      <p>ようこそ、{user.email}さん</p>
      {/* ここにマネージャー向けの機能を追加 */}
    </div>
  );
}
