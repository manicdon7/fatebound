import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // For MVP, save to a public directory. In production, use a secure storage solution.
    const tempDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(tempDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(tempDir, filename);

    await writeFile(filepath, buffer);

    const publicPath = `/uploads/${filename}`;

    return NextResponse.json({ success: true, path: publicPath, filepath: filepath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
  }
}
