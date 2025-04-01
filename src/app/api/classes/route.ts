import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/firebaseAdmin'; // or use relative path if alias isn't working

// GET: Fetch all classes
export async function GET(_req: NextRequest) {
  try {
    const classesSnapshot = await db.collection('classes').get();
    const classes = classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

// POST: Add a new class
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('classes').add(data);
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }
}
