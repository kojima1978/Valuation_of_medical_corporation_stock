import Link from 'next/link';
import Button from '@/components/Button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
            <p className="text-gray-600 mb-8">お探しのページは見つかりませんでした。</p>
            <Link href="/">
                <Button variant="primary" className="px-6 py-2">
                    トップページへ戻る
                </Button>
            </Link>
        </div>
    );
}
