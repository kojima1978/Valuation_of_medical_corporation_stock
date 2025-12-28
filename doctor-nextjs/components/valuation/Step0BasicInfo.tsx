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
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear + 5; i >= currentYear - 5; i--) {
        yearOptions.push(i);
    }

    return (
        <div className="card">
            <h2 className="mt-0">STEP０．基本情報を入力する</h2>
            <table>
                <tbody>
                    <tr>
                        <th className="text-left w-1/4">項目</th>
                        <th className="text-left">入力</th>
                    </tr>
                    <tr>
                        <td>ID</td>
                        <td>
                            <input
                                type="text"
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
                        <td>年度</td>
                        <td>
                            <select
                                value={fiscalYear}
                                onChange={(e) => setFiscalYear(e.target.value)}
                            >
                                <option value="">選択してください</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}年度
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>会社名</td>
                        <td>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="会社名を入力してください"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>担当者</td>
                        <td>
                            <input
                                type="text"
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
