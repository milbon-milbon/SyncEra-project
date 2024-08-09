/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // React の厳密モードを有効化
  env: {
    BACKEND_URL: "http://backend:8000", // ここにバックエンドのURLを設定
  },
};

export default nextConfig;
