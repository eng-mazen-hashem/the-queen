import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Dynamically import sharp to support fail-safe fallback
let sharp: any = null;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('Sharp is not available. Falling back to raw file saving.', e);
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'banners'; // banners, categories, products
    
    // Validate type to prevent path traversal
    const allowedTypes = ['banners', 'categories', 'products'];
    const validatedType = allowedTypes.includes(type) ? type : 'banners';

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', validatedType);
    await fs.mkdir(uploadsDir, { recursive: true });

    const originalName = file.name;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const timestamp = Date.now();
    const baseName = sanitizedName.substring(0, sanitizedName.lastIndexOf('.')) || sanitizedName;
    const ext = sanitizedName.substring(sanitizedName.lastIndexOf('.')) || '.jpg';

    let finalFilename = `${timestamp}_${baseName}${ext}`;
    let relativePath = `/uploads/${validatedType}/${finalFilename}`;

    // Try WebP compression using sharp
    if (sharp) {
      try {
        const webpFilename = `${timestamp}_${baseName}.webp`;
        const webpBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
        
        const destination = path.join(uploadsDir, webpFilename);
        await fs.writeFile(destination, webpBuffer);
        
        finalFilename = webpFilename;
        relativePath = `/uploads/${validatedType}/${webpFilename}`;
      } catch (sharpError) {
        console.error('Sharp compression failed, saving raw file:', sharpError);
        const destination = path.join(uploadsDir, finalFilename);
        await fs.writeFile(destination, buffer);
      }
    } else {
      // Fallback: Save raw buffer
      const destination = path.join(uploadsDir, finalFilename);
      await fs.writeFile(destination, buffer);
    }

    return NextResponse.json({ success: true, url: relativePath });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
