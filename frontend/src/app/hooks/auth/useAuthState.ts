// hooks/useAuthState.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import app from '@/firebase/config';
import clientLogger from '@/lib/clientLogger';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  role: string | null;
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    role: null,
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // カスタムクレームを取得
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const companyId = idTokenResult.claims.companyId;

          if (!companyId) {
            clientLogger.error('===カスタムクレームにcompanIDがみつかりませんでした。===');
            throw new Error('Company ID not found in custom claims');
          }
          clientLogger.debug(`Company ID: ${companyId}`);
          const userDoc = await getDoc(
            doc(db, `companies/${companyId}/employees`, currentUser.uid),
          );

          if (userDoc.exists()) {
            const userData = userDoc.data();
            clientLogger.debug(`User data:, ${JSON.stringify(userData)}`);

            // 確認: role や companyId が期待通りに存在しているか
            if (userData?.role && userData?.companyId) {
              setAuthState({
                user: currentUser,
                loading: false,
                error: null,
                role: userData.role,
              });
            } else {
              clientLogger.error(
                `役職別 or Company ID が一致しません。:,${JSON.stringify(userData)}`,
              );
              throw new Error('Role or Company ID is missing in user data');
            }
          } else {
            clientLogger.error('=========ユーザーデータが見つかりません。=======');
            throw new Error('User data not found');
          }
        } catch (error) {
          setAuthState({
            user: null,
            loading: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred'),
            role: null,
          });
          clientLogger.error(`===user data フェッチできませんでした。 :,${error}`);
        }
      } else {
        setAuthState({ user: null, loading: false, error: null, role: null });
      }
    });

    return () => unsubscribe();
  }, [router]);

  return authState;
}
