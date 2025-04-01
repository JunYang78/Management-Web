'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import AddActivity from '@/component/AddActivity';

export default function AddActivityPage() {
  return (
    <ProtectedRoute>
      <AddActivity />
    </ProtectedRoute>
  );
}