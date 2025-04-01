import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/firebaseAdmin'; // or use relative path if alias isn't working

const allowedOrigin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://ck-management.vercel.app';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
};


// GET: Fetch all classes
export async function GET(_req: NextRequest) {
  try {
    const classesSnapshot = await db.collection('classes').get();
    const classes = classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(classes, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, {
      status: 500,
      headers: corsHeaders,
    });
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
    return NextResponse.json({ id: docRef.id }, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add class' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
