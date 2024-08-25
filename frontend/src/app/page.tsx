'use client';

import CompanyLoginButton from '@/components/signup_and_login/CompanyLoginButton';
import LoginButton from '@/components/signup_and_login/LoginButton';
import Link from 'next/link'; // Linkをインポート
import { useState } from 'react';
import PlanIntro from '../components/payment/PlanIntro';
import ContactForm from './hooks/fetch_contact/postContactForm';
export default function Home() {
  const [activeTab, setActiveTab] = useState<'none' | 'syncEra' | 'appInfo'>('none');

  return (
    <main className='min-h-screen flex flex-col bg-white text-gray-900 text-[#003366]'>
      {/* Header */}
      <header className='bg-[#003366] text-white p-4 md:p-4 flex items-center justify-between fixed top-0 left-0 w-full z-20'>
        <div className='flex items-center space-x-4'>
          <img
            src='/image/SyncEra(blue_white).png'
            alt='SyncEra Logo'
            className='h-[65px] w-[207px] mt-2 ml-2'
          />
        </div>

        <nav className='flex-1  '>
          {' '}
          <ul className='flex justify-center space-x-4'>
            {' '}
            <li>
              <a href='#features' className='hover:underline px-2'>
                機能
              </a>
            </li>
            <li>
              <a href='#use-cases' className='hover:underline px-2'>
                ユースケース
              </a>
            </li>
            <li>
              <a href='#contact' className='hover:underline px-2'>
                お問い合わせ
              </a>
            </li>
            <li>
              <a href='#pricing' className='hover:underline px-2'>
                料金
              </a>
            </li>
          </ul>
        </nav>

        {/* ログインと新規登録ボタンを右側に配置 */}
        <div className='flex items-center space-x-4'>
          <LoginButton />
          <CompanyLoginButton />
        </div>
      </header>{' '}
      <div className='mt-[80px]'>
        {/* Hero Section */}
        <section className='flex flex-col items-center justify-center bg-[#003366] text-white text-center py-20 relative overflow-hidden'>
          <div className='absolute inset-0 bg-hero-pattern opacity-20'></div>
          <h1 className='text-6xl font-bold mb-4 relative z-10 font-sans'>Welcome to SyncEra</h1>
          <p className='text-xl mb-8 relative z-10'>
            頼れるパートナーとして、コミュニケーションを円滑にサポート
          </p>
          <Link href='/signup'>
            <button className='text-xl bg-white text-[#003366] px-4 py-2 rounded font-bold hover:bg-gray-200       active:transform active:translate-y-1 transition-colors duration-300 relative z-10'>
              今すぐ始める
            </button>
          </Link>
        </section>
        {/* Features Section */}
        <section id='features' className='py-20 bg-gray-100'>
          <h2 className='text-4xl font-bold mb-8 text-center font-sans  text-[#003366]'>機能</h2>
          <p className='max-w-2xl mx-auto text-lg mb-8 text-center font-sans'>
            Slackから日報や趣味、キャリア志向の情報をサマリー表示し、1on1の準備をサポート。AIが会話でのアドバイスも提供し、コミュニケーションを円滑にします。
          </p>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <div className='p-6 bg-white rounded-lg shadow-lg'>
                <h3 className='text-2xl font-bold mb-4 font-sans  text-[#003366]'>Slack連携</h3>
                <p className='text-lg'>
                  社員のSlack情報を集約し、日報や趣味、キャリア志向を一元管理します。
                </p>
              </div>
              <div className='p-6 bg-white rounded-lg shadow-lg'>
                <h3 className='text-2xl font-bold mb-4 font-sans  text-[#003366]'>
                  情報のサマリー表示
                </h3>
                <p className='text-lg'>
                  日報や趣味、定期的なキャリア志向のサマリーを表示し、1on1に必要な情報を提供します。
                </p>
              </div>
              <div className='p-6 bg-white rounded-lg shadow-lg'>
                <h3 className='text-2xl font-bold mb-4 font-sans  text-[#003366]'>
                  AIによる会話サポート
                </h3>
                <p className='text-lg'>
                  AIが1on1の会話に関するアドバイスを提供し、効果的なコミュニケーションをサポートします。
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Use Cases Section */}
        <section id='use-cases' className='py-20 bg-gray-100'>
          <h2 className='text-4xl font-bold mb-8 text-center text-[#003366] font-sans'>
            ユースケース
          </h2>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* ユースケースカード1 */}
              <div className='bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl'>
                <div className='mb-4'>
                  <img src='/image/04_01_017.png' alt='Icon1' className='w-24 h-24 mx-auto' />
                </div>
                <h3 className='text-2xl font-bold mb-4 bg-[#003366] text-white p-4 rounded font-sans'>
                  1on1 ミーティングの準備
                </h3>
                <p className='text-lg'>
                  マネージャーが1on1ミーティングを実施する前に、社員の最近の活動や進捗、キャリア志向についてのサマリーを確認します。
                  社員との会話がより効果的に進められるようになり、ミーティングの内容が深くなります。
                </p>
              </div>
              {/* ユースケースカード2 */}
              <div className='bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl'>
                <div className='mb-4 font-sans'>
                  <img src='/image/04_05_005.png' alt='Icon2' className='w-24 h-24 mx-auto' />
                </div>
                <h3 className='text-2xl font-bold mb-4 bg-[#003366] text-white p-4 rounded'>
                  チームメンバーの全体像の把握
                </h3>
                <p className='text-lg'>
                  プロジェクトリーダーが新しいチームメンバーを迎える際に、その人のバックグラウンドや趣味、キャリア志向を事前に把握します。
                  新しいチームメンバーとのスムーズなコミュニケーションと、チーム内の信頼関係の構築が促進されます。
                </p>
              </div>
              {/* ユースケースカード3 */}
              <div className='bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl'>
                <div className='mb-4'>
                  <img src='/image/04_01_008.png' alt='Icon3' className='w-24 h-24 mx-auto' />
                </div>
                <h3 className='text-2xl font-bold mb-4 bg-[#003366] text-white p-4 rounded font-sans'>
                  パフォーマンスレビューの補助
                </h3>
                <p className='text-lg'>
                  人事部門が社員の年間パフォーマンスレビューを行う際に、過去のフィードバックや日報のデータを分析し、評価の参考にします。
                  より客観的で具体的な評価が可能になり、社員へのフィードバックが充実します。
                </p>
              </div>
            </div>
            {/* 下2枚のカードを横に並べる */}
            <div className='flex flex-wrap gap-8 justify-center mt-8'>
              {/* ユースケースカード4 */}
              <div className='bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl w-full sm:w-1/2 md:w-1/3'>
                <div className='mb-4'>
                  <img src='/image/04_01_027.png' alt='Icon4' className='w-24 h-24 mx-auto' />
                </div>
                <h3 className='text-2xl font-bold mb-4 bg-[#003366] text-white p-4 rounded font-sans'>
                  キャリア開発の支援
                </h3>
                <p className='text-lg'>
                  社員がキャリアの方向性について相談する際に、AIからのアドバイスや過去のデータを基に、具体的なキャリアパスを提示します。
                  社員のキャリア開発をサポートし、モチベーション向上に寄与します。
                </p>
              </div>
              {/* ユースケースカード5 */}
              <div className='bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl w-full sm:w-1/2 md:w-1/3'>
                <div className='mb-4'>
                  <img src='/image/04_01_004.png' alt='Icon5' className='w-24 h-24 mx-auto' />
                </div>
                <h3 className='text-2xl font-bold mb-4 bg-[#003366] text-white p-4 rounded font-sans'>
                  社内コミュニケーションの改善
                </h3>
                <p className='text-lg'>
                  チーム内の定期的なミーティングやプロジェクトの進捗報告で、社員の状態や業務内容をサマリーとして確認する。
                  情報の共有がスムーズになり、チーム全体のコミュニケーションが向上します。
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id='pricing'>
          <PlanIntro />
        </section>
        {/* Contact Section */}
        <section id='contact' className='py-20 bg-gray-100 text-center font-sans'>
          <h2 className='text-4xl font-bold mb-8 text-[#003366]'>お問い合わせ</h2>
          <ContactForm /> {/* 問い合わせフォームを表示 */}
        </section>
        {/* Footer */}
        <footer className='bg-[#003366] text-white text-center p-4 font-sans'>
          <p>&copy; 2024 SyncEra. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
