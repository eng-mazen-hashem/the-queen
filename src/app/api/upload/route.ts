import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    
    // Premium placeholder images tailored for spices / attara
    let imageUrl = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80'; // Default spices

    if (filename.includes('banner')) {
      // Return a random beautiful banner photo
      const banners = [
        'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1540324155974-7295d7af6a1b?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1515536067531-29bc1ed888c5?auto=format&fit=crop&w=1600&q=80'
      ];
      imageUrl = banners[Math.floor(Math.random() * banners.length)];
    } else if (filename.includes('herb') || filename.includes('mint') || filename.includes('tea') || filename.includes('أعشاب')) {
      imageUrl = 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80'; // Herbs
    } else if (filename.includes('oil') || filename.includes('زيت') || filename.includes('زيوت')) {
      imageUrl = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'; // Oils
    } else if (filename.includes('spice') || filename.includes('pepper') || filename.includes('curry') || filename.includes('بهار') || filename.includes('توابل')) {
      imageUrl = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'; // Spices
    }

    // Wait 500ms to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
