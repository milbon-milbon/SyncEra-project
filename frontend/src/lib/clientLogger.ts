// src/lib/clientLogger.ts
//ブラウザによる確認のみ可能、サーバーサイドに連携するにはコード訂正必要。
'use client';
const clientLogger = {
  debug: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`DEBUG: ${message}`);
    }
  },
  info: (message: string) => {
    console.log(`INFO: ${message}`);
  },
  error: (message: string) => {
    console.error(`ERROR: ${message}`);
  },
};

export default clientLogger;
