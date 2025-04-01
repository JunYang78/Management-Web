'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import ClassDetails from '@/component/ClassDetails';

export default function ClassDetailsPage() {
  return (
    <ProtectedRoute>
      <ClassDetails />
    </ProtectedRoute>
  );
}