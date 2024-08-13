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
import clientLogger from '@/lib/clientLogger';
import Link from 'next/link';
import LogoutButton from '@/components/signup_and_login/LoguoutButton';

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.push('/login/employee');
    }
  }, [router]);
  useEffect(() => {
    const auth = getAuth(app); // Firebase 認証オブジェクトを取得
    const db = getFirestore(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // カスタムクレームを取得
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const companyId = idTokenResult.claims.companyId;

          if (!companyId) {
            console.error('Company ID not found in custom claims');
            router.push('/login/employee');
            return;
          }

          clientLogger.debug(`Company ID: ${companyId}`);
          // Firestoreからのデータ取得
          const userDoc = await getDoc(
            doc(db, `companies/${companyId}/employees`, currentUser.uid),
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            clientLogger.debug(`User data:, ${JSON.stringify(userData)}`);

            // 確認: role や companyId が期待通りに存在しているか
            if (userData?.role && userData?.companyId) {
              if (userData.role !== 'manager') {
                router.push(userData.role === 'staff' ? '/staff-dashboard' : '/employee-dashboard');
              }
            } else {
              clientLogger.error(
                `Role or Company ID is missing in user data:,${JSON.stringify(userData)}`,
              );
              router.push('/login/employee');
            }
          } else {
            clientLogger.error('=========ユーザーデータが見つかりません。=======');
            router.push('/login/employee');
          }
        } catch (error) {
          clientLogger.error(`Error fetching user data:,${error}`);
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
    return '予期せぬ操作が発生しました！'; // 適切なエラーメッセージを表示
  }
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ここまで認証残し＝＝＝＝＝＝＝

  return (
    <div className='text-[50px] text-[#003366]'>
      <h1>マネージャーダッシュボード</h1>
      <p>ようこそ、{user.email}さん</p>
      {/* ログアウト機能を追加 */}

      <div className='text-[25px]'>
        <Link href='/'>戻る</Link>
        <LogoutButton />
      </div>
    </div>
  );
}
