import React from 'react';
import { NumericFormat } from 'react-number-format';
import { UserPlus, Trash2 } from 'lucide-react';
import { Investor } from '@/lib/types';

type Props = {
    investors: Investor[];
    updateInvestor: (index: number, field: keyof Investor, value: string | number) => void;
    addInvestorRow: () => void;
    removeInvestorRow: (index: number) => void;
    totalInvestment: number;
};

export default function Step3Investors({
    investors,
    updateInvestor,
    addInvestorRow,
    removeInvestorRow,
    totalInvestment,
}: Props) {
    // 共通ボタンスタイル
    const buttonStyle = {
        whiteSpace: 'nowrap' as const,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid #d1d5db',
        transition: 'all 0.2s ease',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500'
    };

    const buttonHoverClass = 'hover:bg-gray-200 hover:border-gray-400 cursor-pointer';

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="mt-0 mb-0">STEP3．出資者名簿より出資者情報を入力【単位:円】</h2>
                <button
                    className={buttonHoverClass}
                    style={buttonStyle}
                    onClick={addInvestorRow}
                >
                    <UserPlus size={16} />
                    出資者を追加
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="text-center w-16">№</th>
                        <th className="text-left">出資者名</th>
                        <th className="text-right">出資金額</th>
                        <th className="text-center w-24">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {investors.map((investor, index) => (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                                <input
                                    type="text"
                                    value={investor.name}
                                    onChange={(e) => updateInvestor(index, 'name', e.target.value)}
                                />
                            </td>
                            <td className="text-right">
                                <NumericFormat
                                    className="w-full px-3 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={investor.amount || ''}
                                    onValueChange={(values) =>
                                        updateInvestor(index, 'amount', values.floatValue || 0)
                                    }
                                    thousandSeparator={true}
                                />
                            </td>
                            <td className="text-center">
                                <button
                                    className={buttonHoverClass}
                                    style={{
                                        ...buttonStyle,
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                    }}
                                    onClick={() => removeInvestorRow(index)}
                                >
                                    <Trash2 size={16} />
                                    削除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-bold">
                        <td className="text-center">合計</td>
                        <td></td>
                        <td className="text-right">{totalInvestment.toLocaleString('ja-JP')}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <p className="text-sm text-gray-600 mt-4">
                ※ 出資金額の合計は、貸借対照表の出資金（資本金）と一致させてください。
            </p>
        </div>
    );
}
