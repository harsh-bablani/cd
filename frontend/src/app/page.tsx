'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main component to prevent SSR hydration issues
const HomeContent = dynamic(() => import('../components/HomeContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <HomeContent />;
}
