import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;

  // 仮のサマリーデータ
  const summaries = {
    みきこ: "今日はプロジェクトの進捗を報告しました。",
    めめ: "クライアントからのフィードバックを反映しました。",
    さよこ: "コードの最適化を行いました。",
    くーみん: "新しい機能のテストを実施しました。",
  };

  // 指定された名前に対するサマリーを返す
  const summary = summaries[name as string] || "サマリーが見つかりません。";

  res.status(200).json({ summary });
}
