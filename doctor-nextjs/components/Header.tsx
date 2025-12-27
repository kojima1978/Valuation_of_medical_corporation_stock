export default function Header() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="20"
          r="12"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
        />
        <path
          d="M 40 32 L 25 50 L 32 50 L 32 65 L 48 65 L 48 50 L 55 50 L 40 32 Z"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 42 38 Q 45 38 46 42 Q 46 48 40 52 Q 34 48 34 42 Q 35 38 38 38"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="56" r="2.5" fill="#16a34a" />
      </svg>
      <h1 className="text-3xl font-bold">
        簡単！！ 出資持分の評価額試算ツール
      </h1>
    </div>
  );
}
