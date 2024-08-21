import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
    await page.goto('http://frontend:3000/employee-list'); //社員一覧ページを指定
    const title = await page.title();
    expect(title).toBe('SyncEra');  //ブラウザタブの表示をチェック
});
