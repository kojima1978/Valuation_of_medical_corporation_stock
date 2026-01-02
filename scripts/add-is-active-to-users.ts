/**
 * マイグレーション: users テーブルに is_active カラムを追加
 * 無効化（論理削除）機能を実装するため
 */

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'doctor.db');
const db = new Database(dbPath);

try {
  console.log('マイグレーション開始: users テーブルに is_active カラムを追加');

  // is_active カラムを追加（デフォルト値: 1 = 有効）
  db.exec(`
    ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
  `);

  // 既存データを有効状態に設定
  const result = db.prepare('UPDATE users SET is_active = 1').run();

  console.log(`✓ 既存の ${result.changes} 件のデータを有効状態に設定しました`);
  console.log('✓ マイグレーション完了');
} catch (error) {
  console.error('マイグレーションエラー:', error);
  process.exit(1);
} finally {
  db.close();
}
