'use client';

import ProtectedRoute from '@/component/ProtectedRoute';
import AddStudent from '@/component/AddStudent';

export default function AddStudentPage() {
  return (
    <ProtectedRoute>
      <AddStudent />
    </ProtectedRoute>
  );
}