import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      id,
      fiscalYear,
      companyName,
      personInCharge,
      employees,
      totalAssets,
      sales,
      currentPeriodNetAsset,
      previousPeriodNetAsset,
      netAssetTaxValue,
      currentPeriodProfit,
      previousPeriodProfit,
      previousPreviousPeriodProfit,
      investors,
    } = data;

    // バリデーション
    if (!id || !fiscalYear || !companyName || !personInCharge) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // 既存のデータをチェック
    const existing = db.prepare('SELECT id FROM valuations WHERE id = ?').get(id);

    if (existing) {
      // 更新
      const stmt = db.prepare(`
        UPDATE valuations SET
          fiscal_year = ?,
          company_name = ?,
          person_in_charge = ?,
          employees = ?,
          total_assets = ?,
          sales = ?,
          current_period_net_asset = ?,
          previous_period_net_asset = ?,
          net_asset_tax_value = ?,
          current_period_profit = ?,
          previous_period_profit = ?,
          previous_previous_period_profit = ?,
          investors = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        fiscalYear,
        companyName,
        personInCharge,
        employees,
        totalAssets,
        sales,
        currentPeriodNetAsset,
        previousPeriodNetAsset,
        netAssetTaxValue,
        currentPeriodProfit,
        previousPeriodProfit,
        previousPreviousPeriodProfit,
        JSON.stringify(investors),
        id
      );
    } else {
      // 新規作成
      const stmt = db.prepare(`
        INSERT INTO valuations (
          id,
          fiscal_year,
          company_name,
          person_in_charge,
          employees,
          total_assets,
          sales,
          current_period_net_asset,
          previous_period_net_asset,
          net_asset_tax_value,
          current_period_profit,
          previous_period_profit,
          previous_previous_period_profit,
          investors
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        fiscalYear,
        companyName,
        personInCharge,
        employees,
        totalAssets,
        sales,
        currentPeriodNetAsset,
        previousPeriodNetAsset,
        netAssetTaxValue,
        currentPeriodProfit,
        previousPeriodProfit,
        previousPreviousPeriodProfit,
        JSON.stringify(investors)
      );
    }

    return NextResponse.json({ success: true, message: 'データを保存しました' });
  } catch (error) {
    console.error('データベースエラー:', error);
    return NextResponse.json(
      { error: 'データの保存に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const db = getDatabase();

    if (id) {
      // 特定のIDのデータを取得
      const stmt = db.prepare('SELECT * FROM valuations WHERE id = ?');
      const data = stmt.get(id);

      if (!data) {
        return NextResponse.json(
          { error: 'データが見つかりません' },
          { status: 404 }
        );
      }

      // investorsをJSONパース
      const result = {
        ...data,
        investors: JSON.parse((data as any).investors),
      };

      return NextResponse.json(result);
    } else {
      // 全データを取得
      const stmt = db.prepare('SELECT * FROM valuations ORDER BY updated_at DESC');
      const rows = stmt.all();

      const results = rows.map((row: any) => ({
        ...row,
        investors: JSON.parse(row.investors),
      }));

      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('データベースエラー:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'IDが指定されていません' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // データの存在確認
    const existing = db.prepare('SELECT id FROM valuations WHERE id = ?').get(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'データが見つかりません' },
        { status: 404 }
      );
    }

    // 削除
    const stmt = db.prepare('DELETE FROM valuations WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true, message: 'データを削除しました' });
  } catch (error) {
    console.error('データベースエラー:', error);
    return NextResponse.json(
      { error: 'データの削除に失敗しました' },
      { status: 500 }
    );
  }
}
