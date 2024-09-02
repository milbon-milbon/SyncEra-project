import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
    await page.goto('http://localhost:3000/employee-list'); //社員一覧ページを指定
    const title = await page.title();
    expect(title).toBe('SyncEra');  //ブラウザタブの表示をチェック
});

test('homepage test', async ({ page }) => {
    // ステップ0: ホームページにアクセスする
    await page.goto('http://localhost:3000');

    // ステップ1: 「Welcome to SyncEra」のタイトルが表示されることを確認する
    const title = await page.title();
    expect(title).toBe('SyncEra');

    // ステップ2: 「管理画面」ボタンが表示されることを確認する
    const managementButton = page.locator('text=管理画面');
    await expect(managementButton).toBeVisible();

    // ステップ3: 「ログイン」「今すぐはじめる」のボタンが表示されることを確認する
    const loginButton = page.locator('text=ログイン');
    const startButton = page.locator('text=今すぐ始める');
    await expect(loginButton).toBeVisible();
    await expect(startButton).toBeVisible();

    // ステップ4: ページ末尾に「© 2024 SyncEra. All rights reserved.」が表示されることを確認する
    const footerText = page.locator('footer').locator('text=© 2024 SyncEra. All rights reserved.');
    await expect(footerText).toBeVisible();
});

test('should log in and verify employee list page', async ({ page }) => {
    // ログインページにアクセス
    await page.goto('http://localhost:3000/login/employee');
    await page.waitForLoadState('networkidle'); // ページが完全にロードされるまで待機

    // メールアドレスを入力
    await page.fill('input[type="email"]', 'kkk@gmail.com');

    // パスワードを入力
    await page.fill('input[type="password"]', '000000');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // 社員一覧ページに遷移するのを待機
    await page.waitForURL('http://localhost:3000/employee-list');

    // ページが社員一覧に遷移したことを確認
    const url = page.url();
    expect(url).toBe('http://localhost:3000/employee-list');

    // ステップ1: 「社員一覧」の文字が表示されることを確認する
    const header = page.locator('h1:has-text("社員一覧")');
    await expect(header).toBeVisible();

    // ステップ2: 「KU-MIN」「SAYOKO」「MIKIKO」「MEME」が表示されることを確認する
    const employeeNames = ['KU-MIN', 'SAYOKO', 'MIKIKO', 'MEME'];
    for (const name of employeeNames) {
        const employee = page.locator(`h2:has-text("${name}")`);
        await expect(employee).toBeVisible();
    }

    // ステップ3: サイドバーに「社員登録」「ホーム」が表示されることを確認する
    const sidebarItems = ['社員登録', 'ホーム'];
    for (const item of sidebarItems) {
        const sidebar = page.locator(`text=${item}`);
        await expect(sidebar).toBeVisible();
    }

    // ステップ4: 各社員の表示に「日報」「1on1アドバイス」「キャリアアンケート分析結果」のボタンが表示されていることを確認する
    // 単一表示ではないため、社員の数を首藤し、その数だけ要素が表示されているかを確認している

    const employeeCards = await page.locator('div.bg-white.p-6.rounded-lg.shadow-md').count();
    for (let i = 0; i < employeeCards; i++) {
        // 日報を見るボタンの確認
        const showSummaryButton = page.locator('div.bg-white.p-6.rounded-lg.shadow-md').nth(i).locator('text=日報を見る');
        await expect(showSummaryButton).toBeVisible();

        // 1on1アドバイスを見るボタンの確認
        const showAdvicesButton = page.locator('div.bg-white.p-6.rounded-lg.shadow-md').nth(i).locator('text=1on1 アドバイスを見る');
        await expect(showAdvicesButton).toBeVisible();

        // キャリアアンケート結果を見るボタンの確認
        const showSurveyResultButton = page.locator('div.bg-white.p-6.rounded-lg.shadow-md').nth(i).locator('text=キャリアアンケート結果を見る');
        await expect(showSurveyResultButton).toBeVisible();
    }


    // // MEMEの日報を見るボタンをクリック
    const memeReportButton = page.locator('div.bg-white.p-6.rounded-lg.shadow-md:has-text("MEME")').locator('text=日報を見る');
    await expect(memeReportButton).toBeVisible();
    await memeReportButton.click();

    // 「MEMEの日報」「社員情報」「最新の日報」が表示されることを確認
    await page.waitForURL('http://localhost:3000/employee-list/summary/sample_4');
    await expect(page.locator('h1:has-text("MEMEの日報")')).toBeVisible();
    await expect(page.locator('h3:has-text("社員情報")')).toBeVisible();
    await expect(page.locator('h3:has-text("最新の日報")')).toBeVisible();

    // // サイドバーに「社員一覧」「ホーム」が表示されることを確認
    const sidebar = page.locator('aside ul');
    await expect(sidebar.locator('text=社員一覧トップ')).toBeVisible();
    await expect(sidebar.locator('text=ホーム')).toBeVisible();


    // // 左下にログアウトボタンがあることを確認
    const logoutButton = page.locator('text=ログアウト');
    await expect(logoutButton).toBeVisible();

    // // 「日報サマリーを見る」ボタンを確認
    const summaryButton = page.locator('text=日報サマリーを見る');
    await expect(summaryButton).toBeVisible();

    // // 「日報サマリーを見る」ボタンをクリック
    await summaryButton.click();

    // // 日報サマリーページに遷移することを確認
    await page.waitForURL('http://localhost:3000/employee-list/summaried_report/sample_4');
    // 現在のURLを取得して、期待するURLと一致するか確認する
    const currentUrl = page.url();
    await expect(currentUrl).toBe('http://localhost:3000/employee-list/summaried_report/sample_4');

    const headerText = page.locator('text=日報サマリー')
    await expect(headerText).toBeVisible();

    // 「新しいサマリーを生成」見出しが表示されることを確認
    const summaryHeading = page.locator('h2:has-text("新しいサマリーを生成")');
    await expect(summaryHeading).toBeVisible();

    // 「サマリーを生成」ボタンが表示されることを確認
    const generateSummaryButton = page.locator('button:has-text("サマリーを生成")');
    await expect(generateSummaryButton).toBeVisible();

    // 保存履歴一覧が表示されることを確認
    const savedList = page.locator('text=保存履歴一覧');
    await expect(savedList).toBeVisible();

    // 1on1アドバイスを見るボタンを確認
    const showAdvicesButton = page.locator('text=1on1 アドバイスを見る');
    await expect(showAdvicesButton).toBeVisible();

    // 1on1アドバイスを見るボタンをクリック
    await showAdvicesButton.click();

    // 1on1アドバイスページに遷移(http://localhost:3000/employee-list/OneOnOneAdvice/sample_4)
    // URLが期待するものと一致するか確認
    await page.waitForURL('http://localhost:3000/employee-list/OneOnOneAdvice/sample_4');
    await expect(page.url()).toBe('http://localhost:3000/employee-list/OneOnOneAdvice/sample_4');

    // 1on1アドバイス生成 の文字(h1)表示を確認
    const oneOnOneAdviceHeader = page.locator('h1:has-text("1on1アドバイス生成")');
    await expect(oneOnOneAdviceHeader).toBeVisible();

    // 新しいアドバイスを生成 の文字(h2)表示を確認
    const newAdviceHeading = page.locator('h2:has-text("新しいアドバイスを生成")');
    await expect(newAdviceHeading).toBeVisible();

    // 開始日、終了日 の文字表示を確認
    const startDateLabel = page.locator('label:has-text("開始日")');
    await expect(startDateLabel).toBeVisible();

    const endDateLabel = page.locator('label:has-text("終了日")');
    await expect(endDateLabel).toBeVisible();

    // アドバイス生成 のボタン表示を確認
    const generateAdviceButton = page.locator('button:has-text("アドバイス生成")');
    await expect(generateAdviceButton).toBeVisible();

    // 保存履歴一覧　の文字表示を確認
    const adviceSavedList = page.locator('text=保存履歴一覧');
    await expect(adviceSavedList).toBeVisible();

    // キャリアアンケート結果を見る のボタン表示を確認
    const showSurveyResultButton = page.locator('text=キャリアアンケート結果を見る');
    await expect(showSurveyResultButton).toBeVisible();

    // キャリアアンケート結果を見る　のボタンをクリック
    await showSurveyResultButton.click();

    // キャリアアンケート結果のページに遷移(http://localhost:3000/employee-list/career-survey/sample_4)
    // URLが期待するものと一致するかの確認
    await page.waitForURL('http://localhost:3000/employee-list/career-survey/sample_4');
    await expect(page.url()).toBe('http://localhost:3000/employee-list/career-survey/sample_4');

    // キャリアアンケート結果(h1)の文字表示を確認
    const careerSurveyHeader = page.locator('h1:has-text("キャリアアンケート結果")');
    await expect(careerSurveyHeader).toBeVisible();

    // アンケート回答履歴(h2)の文字表示を確認
    const surveyHistoryHeading = page.locator('h2:has-text("アンケート回答履歴")');
    await expect(surveyHistoryHeading).toBeVisible();

    // 左側のリストからアンケートを選択してください。の文章表示を確認
    const selectSurveyText = page.locator('text=左側のリストからアンケートを選択してください。');
    await expect(selectSurveyText).toBeVisible();

});
