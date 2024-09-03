import 'dotenv/config';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/create-checkout-session/route';
import Stripe from 'stripe';

jest.mock('stripe', () => {
  const stripeMock = {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://example.com/checkout-session' }),
      },
    },
    errors: {
      StripeError: class extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'StripeError';
        }
      },
    },
  };
  return jest.fn(() => stripeMock);
});

describe('POST /api/create-checkout-session', () => {
  // 環境変数をテスト前に設定
  beforeAll(() => {
    process.env.STRIPE_SECRET_KEY = 'test_stripe_secret_key';
    process.env.NEXT_PUBLIC_DOMAIN = 'http://localhost:3000';
  });

  // 各テスト後に環境をクリーンアップ
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. 正常系のテスト
  it('正常にセッションが作成され、URLが返される', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ priceId: 'price_12345' }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: 'https://example.com/checkout-session' });
  });

  // 2. 環境変数が設定されていない場合のエラーハンドリング
  it('環境変数が設定されていない場合のエラーハンドリング', async () => {
    const originalEnv = { ...process.env };
    delete process.env.STRIPE_SECRET_KEY;

    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: '環境変数の設定エラー' });

    process.env = originalEnv;
  });

  // 3. バリデーションのテスト
  it('無効な priceId でエラーが返される', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ priceId: '' }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: '無効な priceId' });
  });

  // 4. Stripe APIがエラーを返した場合のハンドリング
  it('Stripe APIがエラーを返した場合のハンドリング', async () => {
    const stripeError = new Error('Stripe API Error');
    stripeError.name = 'StripeError';
    jest
      .spyOn(jest.requireMock('stripe')().checkout.sessions, 'create')
      .mockRejectedValueOnce(stripeError);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ priceId: 'price_12345' }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Stripe API Error' });
  });

  // 5. レスポンスの形式確認
  it('レスポンスが期待通りの形式か', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ priceId: 'price_12345' }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    const jsonResponse = await response.json();
    expect(response.status).toBe(200);
    expect(jsonResponse).toHaveProperty('url');
    expect(typeof jsonResponse.url).toBe('string');
  });

  // 6. パフォーマンスのテスト
  it('APIレスポンスタイムの確認', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ priceId: 'price_12345' }),
    } as unknown as NextRequest;

    const start = Date.now();
    await POST(mockRequest);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});
