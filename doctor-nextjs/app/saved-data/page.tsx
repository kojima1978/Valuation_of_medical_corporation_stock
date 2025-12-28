'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';

type SavedValuation = {
  id: string;
  fiscal_year: string;
  company_name: string;
  person_in_charge: string;
  employees: string;
  total_assets: string;
  sales: string;
  current_period_net_asset: number;
  previous_period_net_asset: number;
  net_asset_tax_value: number;
  current_period_profit: number;
  previous_period_profit: number;
  previous_previous_period_profit: number;
  investors: any; // Already parsed by API
  created_at: string;
  updated_at: string;
};

type SortField = 'fiscal_year' | 'person_in_charge' | 'updated_at';
type SortOrder = 'asc' | 'desc';

export default function SavedDataPage() {
  const router = useRouter();
  const [data, setData] = useState<SavedValuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 絞り込み用のstate
  const [filterYear, setFilterYear] = useState('');
  const [filterCompanyName, setFilterCompanyName] = useState('');
  const [filterPersonInCharge, setFilterPersonInCharge] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/valuations');

      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('読み込みエラー:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadRecord = (record: SavedValuation) => {
    const formData = {
      id: record.id,
      fiscalYear: record.fiscal_year,
      companyName: record.company_name,
      personInCharge: record.person_in_charge,
      employees: record.employees,
      totalAssets: record.total_assets,
      sales: record.sales,
      currentPeriodNetAsset: record.current_period_net_asset,
      previousPeriodNetAsset: record.previous_period_net_asset,
      netAssetTaxValue: record.net_asset_tax_value,
      currentPeriodProfit: record.current_period_profit,
      previousPeriodProfit: record.previous_period_profit,
      previousPreviousPeriodProfit: record.previous_previous_period_profit,
      investors: typeof record.investors === 'string' ? JSON.parse(record.investors) : record.investors,
    };

    // localStorageに保存
    localStorage.setItem('formData', JSON.stringify(formData));

    // トップページへ遷移
    router.push('/');
  };

  const deleteRecord = async (id: string) => {
    if (!confirm('このデータを削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/valuations?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      alert('データを削除しました');
      loadData(); // リロード
    } catch (err) {
      console.error('削除エラー:', err);
      alert('データの削除に失敗しました');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 同じフィールドをクリックした場合は順序を反転
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるフィールドをクリックした場合は昇順から開始
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 年度の一覧を取得（重複なし、ソート済み）
  const availableYears = Array.from(new Set(data.map(record => record.fiscal_year))).sort((a, b) => b.localeCompare(a));

  // 絞り込み処理
  const filteredData = data.filter((record) => {
    const yearMatch = !filterYear || record.fiscal_year === filterYear;
    const companyMatch = !filterCompanyName || record.company_name.toLowerCase().includes(filterCompanyName.toLowerCase());
    const personMatch = !filterPersonInCharge || record.person_in_charge.toLowerCase().includes(filterPersonInCharge.toLowerCase());

    return yearMatch && companyMatch && personMatch;
  });

  // ソート処理
  const sortedData = [...filteredData].sort((a, b) => {
    let compareA: string | number = '';
    let compareB: string | number = '';

    if (sortField === 'fiscal_year') {
      compareA = a.fiscal_year;
      compareB = b.fiscal_year;
    } else if (sortField === 'person_in_charge') {
      compareA = a.person_in_charge;
      compareB = b.person_in_charge;
    } else if (sortField === 'updated_at') {
      compareA = new Date(a.updated_at).getTime();
      compareB = new Date(b.updated_at).getTime();
    }

    if (compareA < compareB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ' ⇅';
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) {
    return (
      <div>
        <Header />
        <h1 className="text-3xl font-bold mb-8">保存データ一覧</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <h1 className="text-3xl font-bold mb-8">保存データ一覧</h1>
        <p className="text-red-600">{error}</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/')}>
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold mb-8">保存データ一覧</h1>

      {data.length === 0 ? (
        <div>
          <p className="mb-4">保存されたデータはありません。</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            入力画面へ
          </Button>
        </div>
      ) : (
        <>
          {/* 絞り込みフィルター */}
          <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
            <h2 className="text-lg font-bold mb-3">絞り込み</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">年度</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="">-- すべて --</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}年度
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">会社名</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="会社名で検索"
                  value={filterCompanyName}
                  onChange={(e) => setFilterCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">担当者</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="担当者名で検索"
                  value={filterPersonInCharge}
                  onChange={(e) => setFilterPersonInCharge(e.target.value)}
                />
              </div>
            </div>
            {(filterYear || filterCompanyName || filterPersonInCharge) && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredData.length}件 / {data.length}件中
                </span>
                <Button
                  onClick={() => {
                    setFilterYear('');
                    setFilterCompanyName('');
                    setFilterPersonInCharge('');
                  }}
                  className="text-sm px-3 py-1"
                >
                  絞り込みをクリア
                </Button>
              </div>
            )}
          </div>

          <table className="border-collapse w-full mt-3">
            <thead>
              <tr>
                <th className="border border-gray-400 bg-gray-100 p-2 text-center">ID</th>
                <th
                  className="border border-gray-400 bg-gray-100 p-2 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('fiscal_year')}
                >
                  年度{getSortIndicator('fiscal_year')}
                </th>
                <th className="border border-gray-400 bg-gray-100 p-2 text-left">会社名</th>
                <th
                  className="border border-gray-400 bg-gray-100 p-2 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('person_in_charge')}
                >
                  担当者{getSortIndicator('person_in_charge')}
                </th>
                <th
                  className="border border-gray-400 bg-gray-100 p-2 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('updated_at')}
                >
                  更新日時{getSortIndicator('updated_at')}
                </th>
                <th className="border border-gray-400 bg-gray-100 p-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record) => (
                <tr key={record.id}>
                  <td className="border border-gray-400 p-2 text-center">{record.id}</td>
                  <td className="border border-gray-400 p-2 text-center">{record.fiscal_year}年度</td>
                  <td className="border border-gray-400 p-2 text-left">{record.company_name}</td>
                  <td className="border border-gray-400 p-2 text-left">{record.person_in_charge}</td>
                  <td className="border border-gray-400 p-2 text-center">
                    {new Date(record.updated_at).toLocaleString('ja-JP')}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="primary"
                        className="text-sm px-4 py-1"
                        onClick={() => loadRecord(record)}
                      >
                        読込
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-sm px-4 py-1"
                        onClick={() => deleteRecord(record.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <Button variant="primary" onClick={() => router.push('/')}>
              入力画面へ戻る
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
