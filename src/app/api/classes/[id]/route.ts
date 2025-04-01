import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/firebaseAdmin'; // use relative import if alias doesn't work

// Helper to extract ID from URL
const getIdFromUrl = (req: NextRequest): string | null => {
  const parts = req.nextUrl.pathname.split('/');
  const idIndex = parts.findIndex((p) => p === 'classes') + 1;
  return parts[idIndex] || null;
};

// GET: Fetch a single class by ID
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });

    const classDoc = await db.collection('classes').doc(id).get();
    if (!classDoc.exists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ id: classDoc.id, ...classDoc.data() }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
  }
}

// PUT: Update a class by ID
export async function PUT(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });

    const body = await req.json();
    await db.collection('classes').doc(id).update({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Class updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

// DELETE: Remove a class by ID
export async function DELETE(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });

    await db.collection('classes').doc(id).delete();
    return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
