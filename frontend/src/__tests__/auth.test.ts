import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

// Firebase Authのモック
jest.mock('firebase/auth', () => {
  let currentUser: User | null = null; // Type explicitly defined here
  return {
    getAuth: jest.fn(() => ({
      get currentUser() {
        return currentUser;
      },
      set currentUser(user) {
        currentUser = user;
      },
    })),
    signOut: jest.fn(() => {
      currentUser = null;
      return Promise.resolve();
    }),
    signInWithEmailAndPassword: jest.fn((auth, email, password) => {
      if (email === 'test@example.com' && password === 'password') {
        currentUser = { email } as User; // Type assertion for mock user
        return Promise.resolve({ user: { email } });
      } else if (email === 'invalid@example.com') {
        return Promise.reject(new Error('auth/user-not-found'));
      } else if (password === '') {
        return Promise.reject(new Error('auth/invalid-password'));
      } else {
        return Promise.reject(new Error('auth/invalid-email'));
      }
    }),
  };
});

describe('Firebase Authentication', () => {
  // 1. 正常なサインインのテスト
  it('ユーザーが正しくサインインできる', async () => {
    const auth = getAuth(); // モックされたauthを取得
    const userCredential = await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
    expect(userCredential.user.email).toBe('test@example.com');
  });

  // 2. 正常なサインアウトのテスト
  it('ユーザーが正しくサインアウトできる', async () => {
    const auth = getAuth(); // モックされたauthを取得
    await signOut(auth);
    expect(auth.currentUser).toBeNull();
  });

  // 3. サインアウト後の認証状態を確認するテスト
  it('ユーザーがサインアウト後に認証状態がnullになる', async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
    expect(auth.currentUser).toEqual({ email: 'test@example.com' });
    await signOut(auth);
    expect(auth.currentUser).toBeNull();
  });

  // 4. 無効なパスワードでサインインしようとしたときのエラーハンドリング
  it('無効なパスワードでサインインするとエラーが返る', async () => {
    const auth = getAuth(); // モックされたauthを取得
    await expect(
      signInWithEmailAndPassword(auth, 'test@example.com', 'wrongpassword'),
    ).rejects.toThrow('auth/invalid-email');
  });

  // 5. 無効なメールアドレスでサインインしようとしたときのエラーハンドリング
  it('無効なメールアドレスでサインインしようとしたときにエラーが返される', async () => {
    const auth = getAuth(); // モックされたauthを取得
    await expect(
      signInWithEmailAndPassword(auth, 'invalid@example.com', 'password'),
    ).rejects.toThrow();
  });

  // 6. 空のメールアドレスやパスワードでサインインを試みた場合のテスト
  it('空のメールアドレスでサインインしようとしたときにエラーが返される', async () => {
    const auth = getAuth(); // モックされたauthを取得
    await expect(signInWithEmailAndPassword(auth, '', 'password')).rejects.toThrow(
      'auth/invalid-email',
    );
  });

  it('空のパスワードでサインインしようとしたときにエラーが返される', async () => {
    const auth = getAuth();
    await expect(signInWithEmailAndPassword(auth, 'test@example.com', '')).rejects.toThrow(
      'auth/invalid-password',
    );
  });

  // 7. ユーザーの認証状態を確認するテスト
  it('ユーザーがサインイン後に認証状態が正しく設定される', async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
    expect(auth.currentUser).toEqual({ email: 'test@example.com' });
  });
});
