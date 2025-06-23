'use client';

import Loader from '@/app/components/Loader';

export default function ConfiguratorLoading() {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <Loader />
    </div>
  );
}
