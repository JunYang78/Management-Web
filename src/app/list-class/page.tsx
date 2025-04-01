'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import ListClass from '@/component/ListClass';

export default function ListClassPage() {
  return (
    <ProtectedRoute>
      <ListClass />
    </ProtectedRoute>
  );
}