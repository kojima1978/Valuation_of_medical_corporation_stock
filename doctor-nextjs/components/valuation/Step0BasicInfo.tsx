import React from 'react';

type Props = {
    id: string;
    setId: (value: string) => void;
    fiscalYear: string;
    setFiscalYear: (value: string) => void;
    companyName: string;
    setCompanyName: (value: string) => void;
    personInCharge: string;
    setPersonInCharge: (value: string) => void;
};

export default function Step0BasicInfo({
    id,
    setId,
    fiscalYear,
    setFiscalYear,
    companyName,
    setCompanyName,
    personInCharge,
    setPersonInCharge,
}: Props) {
    // 現在の年度を取得
    const currentYear = new Date().getFullYear();
    // 前後5年の年度リストを生成
    const yearOptions = [];
    for (let i = currentYear + 5; i >= currentYear - 5; i--) {
        yearOptions.push(i);
    }

    return (
        <div className="mt-10 mb-5">
            <h2 className="text-2xl font-bold mt-8">
                STEP０．基本情報を入力する
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
                        <td className="border border-gray-400 p-2 text-left">ID</td>
                        <td className="border border-gray-400 p-2">
                            <input
                                type="text"
                                className="w-full p-1 box-border border border-gray-300 rounded"
                                value={id}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 5) {
                                        setId(value);
                                    }
                                }}
                                placeholder="5桁の数字を入力してください"
                                maxLength={5}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 p-2 text-left">年度</td>
                        <td className="border border-gray-400 p-2">
                            <select
                                className="w-full p-1 box-border"
                                value={fiscalYear}
                                onChange={(e) => setFiscalYear(e.target.value)}
                            >
                                <option value="">-- 選択してください --</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}年度
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 p-2 text-left">会社名</td>
                        <td className="border border-gray-400 p-2">
                            <input
                                type="text"
                                className="w-full p-1 box-border border border-gray-300 rounded"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="会社名を入力してください"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 p-2 text-left">担当者</td>
                        <td className="border border-gray-400 p-2">
                            <input
                                type="text"
                                className="w-full p-1 box-border border border-gray-300 rounded"
                                value={personInCharge}
                                onChange={(e) => setPersonInCharge(e.target.value)}
                                placeholder="担当者名を入力してください"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
