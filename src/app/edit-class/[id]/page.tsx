'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import EditClass from '@/component/EditClass';

export default function EditClassPage() {
  return (
    <ProtectedRoute>
      <EditClass />
    </ProtectedRoute>
  );
}