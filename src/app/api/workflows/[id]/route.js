import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function GET(req, { params }) {
  try {
    // FIX: Await params before accessing .id
    const { id } = await params; 
    
    const db = await getDb();
    const workflow = await db.collection('workflows').findOne({ _id: new ObjectId(id) });
    
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    return NextResponse.json(workflow);
  } catch (e) {
    console.error("GET Error:", e);
    return NextResponse.json({ error: 'Failed to fetch workflow' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // FIX: Await params
    const { name, nodes, edges } = await req.json();
    
    const db = await getDb();
    const result = await db.collection('workflows').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, nodes, edges, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT Error:", e);
    return NextResponse.json({ error: 'Failed to update workflow', details: e.message }, { status: 500 });
  }
}