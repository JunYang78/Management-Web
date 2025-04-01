// app/api/classes/[id]/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/firebaseAdmin';
import admin from 'firebase-admin';

// Helper to extract the class ID from the request URL
const getClassIdFromUrl = (req: NextRequest): string | null => {
  const parts = req.nextUrl.pathname.split('/');
  const idIndex = parts.findIndex((p) => p === 'classes') + 1;
  return parts[idIndex] || null;
};

export async function GET(req: NextRequest) {
  try {
    const id = getClassIdFromUrl(req);
    if (!id) return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });

    const classDoc = await db.collection('classes').doc(id).get();
    if (!classDoc.exists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const data = classDoc.data();
    const students = data?.students || [];
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = getClassIdFromUrl(req);
    if (!id) return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });

    const newStudent = await req.json();
    const classRef = db.collection('classes').doc(id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    await classRef.update({
      students: admin.firestore.FieldValue.arrayUnion(newStudent),
    });

    return NextResponse.json({ message: 'Student added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}
