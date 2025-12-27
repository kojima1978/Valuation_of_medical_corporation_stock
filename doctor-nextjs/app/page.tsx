'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { Investor } from '@/lib/types';

export default function Home() {
  const router = useRouter();

  // STEP1: 会社規模判定
  const [employees, setEmployees] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [sales, setSales] = useState('');

  // STEP2: 財務データ
  const [currentPeriodNetAsset, setCurrentPeriodNetAsset] = useState('');
  const [previousPeriodNetAsset, setPreviousPeriodNetAsset] = useState('');
  const [netAssetTaxValue, setNetAssetTaxValue] = useState('');
  const [currentPeriodProfit, setCurrentPeriodProfit] = useState('');
  const [previousPeriodProfit, setPreviousPeriodProfit] = useState('');
  const [previousPreviousPeriodProfit, setPreviousPreviousPeriodProfit] = useState('');

  // STEP3: 出資者情報
  const [investors, setInvestors] = useState<Investor[]>([
    { name: '', amount: 0 },
    { name: '', amount: 0 },
    { name: '', amount: 0 },
  ]);

  // ページ読み込み時にlocalStorageからデータを復元
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setEmployees(data.employees || '');
        setTotalAssets(data.totalAssets || '');
        setSales(data.sales || '');
        setCurrentPeriodNetAsset(data.currentPeriodNetAsset?.toString() || '');
        setPreviousPeriodNetAsset(data.previousPeriodNetAsset?.toString() || '');
        setNetAssetTaxValue(data.netAssetTaxValue?.toString() || '');
        setCurrentPeriodProfit(data.currentPeriodProfit?.toString() || '');
        setPreviousPeriodProfit(data.previousPeriodProfit?.toString() || '');
        setPreviousPreviousPeriodProfit(data.previousPreviousPeriodProfit?.toString() || '');
        if (data.investors && data.investors.length > 0) {
          setInvestors(data.investors);
        }
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }
  }, []);

  // ポップアップ表示状態
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  // 出資者を追加
  const addInvestorRow = () => {
    setInvestors([...investors, { name: '', amount: 0 }]);
  };

  // 出資者情報を更新
  const updateInvestor = (index: number, field: keyof Investor, value: string | number) => {
    const newInvestors = [...investors];
    newInvestors[index] = { ...newInvestors[index], [field]: value };
    setInvestors(newInvestors);
  };

  // 出資金額の合計を計算
  const totalInvestment = investors.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  // 複写機能
  const copyToTaxValue = () => {
    if (currentPeriodNetAsset) {
      setNetAssetTaxValue(currentPeriodNetAsset);
    }
  };

  // 計算結果ページへ遷移
  const goToResults = () => {
    const formData = {
      employees,
      totalAssets,
      sales,
      currentPeriodNetAsset: parseFloat(currentPeriodNetAsset) || 0,
      previousPeriodNetAsset: parseFloat(previousPeriodNetAsset) || 0,
      netAssetTaxValue: parseFloat(netAssetTaxValue) || 0,
      currentPeriodProfit: parseFloat(currentPeriodProfit) || 0,
      previousPeriodProfit: parseFloat(previousPeriodProfit) || 0,
      previousPreviousPeriodProfit: parseFloat(previousPreviousPeriodProfit) || 0,
      investors: investors.filter((inv) => inv.name || inv.amount),
    };

    // localStorageに保存
    localStorage.setItem('formData', JSON.stringify(formData));

    // 結果ページへ遷移
    router.push('/results');
  };

  return (
    <div>
      <Header />

      <p>医療法人の出資持分の評価額の概算を知りたい方向けのツールです。</p>

      <div className="mt-10 mb-5">
        <h2 className="text-2xl font-bold mt-8">本ツールの目的</h2>
        <ul className="list-disc ml-6">
          <li>持分あり医療法人を経営しており、相続発生時の概算を知りたい</li>
          <li>正確でなくてもよいので、まずは目安を把握したい</li>
          <li>決算書・出資者名簿が手元にある</li>
        </ul>
      </div>

      <div className="mt-10 mb-5">
        <h2 className="text-2xl font-bold mt-8">ご用意いただくもの</h2>
        <ul className="list-disc ml-6">
          <li>直近3期分の決算書</li>
          <li>出資者名簿</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3 mb-5">
          ※ 正確な評価額を算出するには、税理士等の専門家へご相談ください。
        </p>
      </div>

      {/* STEP1 */}
      <div className="mt-10 mb-5">
        <h2 className="text-2xl font-bold mt-8">
          STEP１．医療法人の規模を判定するためのデータを選択する
        </h2>
        <table className="border-collapse w-full mt-3">
          <tbody>
            <tr>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">
                項目
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                入力
              </th>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-left">正職員数</td>
              <td className="border border-gray-400 p-2 text-right">
                <select
                  className="w-full p-1 box-border"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                >
                  <option value="">-- 選択してください --</option>
                  <option value="1">5人以下</option>
                  <option value="2">5人超20人以下</option>
                  <option value="3">20人超35人以下</option>
                  <option value="4">35人超70人未満</option>
                  <option value="5">70人以上</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-left">
                貸借対照表の「総資産」の金額
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <select
                  className="w-full p-1 box-border"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(e.target.value)}
                >
                  <option value="">-- 選択してください --</option>
                  <option value="1">4,000万円未満</option>
                  <option value="2">4,000万円以上2億5,000万円未満</option>
                  <option value="3">2億5,000万円以上5億円未満</option>
                  <option value="4">5億円以上15億円未満</option>
                  <option value="5">15億円以上</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-left">
                損益計算書の「事業収益（又は医業収益、売上高）」の合計額
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <select
                  className="w-full p-1 box-border"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                >
                  <option value="">-- 選択してください --</option>
                  <option value="1">6,000万円未満</option>
                  <option value="2">6,000万円以上2億5,000万円未満</option>
                  <option value="3">2億5,000万円以上5億円未満</option>
                  <option value="4">5億円以上20億円未満</option>
                  <option value="5">20億円以上</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* STEP2 */}
      <div className="mt-10 mb-5">
        <h2 className="text-2xl font-bold mt-8">
          STEP2．決算書より医療法人の財務データを入力【単位:円】
        </h2>
        <table className="border-collapse w-full mt-3">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">
                項目
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                直前期
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                直前々期
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                直前々々期
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 text-left">
                「貸借対照表」の「純資産の部（又は資本の部）合計」の金額（注１）
                <button
                  type="button"
                  className="bg-blue-500 text-white px-2 py-1 ml-2 rounded text-xs"
                  onClick={() => setShowPopup1(!showPopup1)}
                >
                  正確な評価
                </button>
                {showPopup1 && (
                  <div className="absolute bg-gray-50 border border-gray-400 p-3 rounded mt-2 text-xs max-w-md z-10">
                    もしくは
                    <br />
                    法人税申告書の別表五(一)上、「Ⅰ利益積立金額」及び
                    <br />
                    「Ⅱ資本金等の額」の各「差引翌期首現在」列 「差引合計額」行の合計額
                  </div>
                )}
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={currentPeriodNetAsset}
                  onChange={(e) => setCurrentPeriodNetAsset(e.target.value)}
                />
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={previousPeriodNetAsset}
                  onChange={(e) => setPreviousPeriodNetAsset(e.target.value)}
                />
              </td>
              <td className="border border-gray-400 p-2 text-right bg-gray-100">
                <input
                  type="number"
                  className="w-full p-1 box-border bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-left">
                貸借対照表の各勘定科目の金額について、相続税評価額とした金額を基に計算した
                <br />
                「純資産」の金額を上書き入力してください。
                <Button
                  variant="success"
                  className="ml-2 text-xs px-3 py-1.5"
                  onClick={copyToTaxValue}
                >
                  複写
                </Button>
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={netAssetTaxValue}
                  onChange={(e) => setNetAssetTaxValue(e.target.value)}
                />
              </td>
              <td className="border border-gray-400 p-2 text-right bg-gray-100">
                <input
                  type="number"
                  className="w-full p-1 box-border bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                />
              </td>
              <td className="border border-gray-400 p-2 text-right bg-gray-100">
                <input
                  type="number"
                  className="w-full p-1 box-border bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-left">
                「損益計算書」の「税引前当期純利益」の金額
                <button
                  type="button"
                  className="bg-blue-500 text-white px-2 py-1 ml-2 rounded text-xs"
                  onClick={() => setShowPopup2(!showPopup2)}
                >
                  正確な評価
                </button>
                {showPopup2 && (
                  <div className="absolute bg-gray-50 border border-gray-400 p-3 rounded mt-2 text-xs max-w-md z-10">
                    もしくは
                    <br />
                    法人税申告書上の「所得金額」に下記の金額を加減算した金額を入力してください。
                    <br />
                    ・受取配当等の益金不算入の金額は加算
                    <br />
                    ・繰越欠損金のうち損金算入した金額は加算
                    <br />
                    ・非経常的な利益の金額は減算
                  </div>
                )}
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={currentPeriodProfit}
                  onChange={(e) => setCurrentPeriodProfit(e.target.value)}
                />
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={previousPeriodProfit}
                  onChange={(e) => setPreviousPeriodProfit(e.target.value)}
                />
              </td>
              <td className="border border-gray-400 p-2 text-right">
                <input
                  type="number"
                  className="w-full p-1 box-border"
                  value={previousPreviousPeriodProfit}
                  onChange={(e) => setPreviousPreviousPeriodProfit(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-sm text-gray-600 mt-3 mb-5">
          （注１）
          <br />
          「貸借対照表」の「純資産の部（又は資本の部）合計」の金額に、
          <br />
          ・賞与引当金、退職給付引当金等の税務上損金にならない金額を加算
          <br />
          ・圧縮積立金、圧縮引当金等の金額を減算
          <br />
          した金額を使用するとより正確な試算が可能となります。
        </p>
      </div>

      {/* STEP3 */}
      <div className="mt-10 mb-5">
        <h2 className="text-2xl font-bold mt-8">
          STEP3．出資者名簿より出資者情報を入力【単位:円】
        </h2>
        <table className="border-collapse w-full mt-3">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                №
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">
                出資者名
              </th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-center">
                出資金額
              </th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-400 p-2 text-left">
                  <input
                    type="text"
                    className="w-full p-1 box-border"
                    value={investor.name}
                    onChange={(e) =>
                      updateInvestor(index, 'name', e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  <input
                    type="number"
                    className="w-full p-1 box-border"
                    value={investor.amount || ''}
                    onChange={(e) =>
                      updateInvestor(index, 'amount', parseFloat(e.target.value) || 0)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-400 p-2 text-center">合計</td>
              <td className="border border-gray-400 p-2"></td>
              <td className="border border-gray-400 p-2 text-right">
                {totalInvestment.toLocaleString('ja-JP')}
              </td>
            </tr>
          </tfoot>
        </table>

        <Button
          variant="success"
          className="mt-3 mb-5 text-sm px-4 py-2"
          onClick={addInvestorRow}
        >
          ＋ 出資者を追加
        </Button>

        <p className="text-sm text-gray-600 mt-3 mb-5">
          ※ 出資金額の合計は、貸借対照表の出資金（資本金）と一致させてください。
        </p>
      </div>

      <div className="mt-10 mb-5">
        <Button
          variant="primary"
          className="text-base px-6 py-3"
          onClick={goToResults}
        >
          計算結果を確認する
        </Button>
      </div>
    </div>
  );
}
