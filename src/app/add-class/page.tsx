'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import AddClass from '@/component/AddClass';

export default function AddClassPage() {
  return (
    <ProtectedRoute>
      <AddClass />
    </ProtectedRoute>
  );
}