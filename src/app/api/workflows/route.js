import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

// Get all workflows
export async function GET() {
  try {
    const db = await getDb();
    const workflows = await db.collection('workflows').find({}).project({ name: 1 }).toArray();
    return NextResponse.json(workflows);
  } catch (e) {
    console.error('Failed to fetch workflows:', e);
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

// Create a new workflow
export async function POST(req) {
  try {
    const { name, nodes, edges } = await req.json();

    if (!name || !nodes || !edges) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('workflows').insertOne({ 
      name,
      nodes,
      edges,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error('Failed to create workflow:', e);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}
