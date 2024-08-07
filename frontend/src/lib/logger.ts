// src/lib/logger.ts
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info', // ログレベルを指定
  format: format.combine(
    format.colorize(), // 色付きの出力を有効にする
    format.simple(), // シンプルなフォーマットを使用
  ),
  transports: [
    new transports.Console(), // コンソールへの出力を設定
  ],
});

export default logger;
