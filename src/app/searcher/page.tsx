'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import Searcher from '@/component/Searcher';

export default function SearcherPage() {
  return (
    <ProtectedRoute>
      <Searcher />
    </ProtectedRoute>
  );
}