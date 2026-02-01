import { NextResponse } from 'next/server';
import { describeImage } from '@/lib/services/openai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'Please provide an image' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString('base64');

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        description: 'Image uploaded successfully. Add OPENAI_API_KEY for AI image descriptions.',
        altText: 'Image description unavailable - AI service not configured',
        note: 'Demo mode',
      });
    }

    const description = await describeImage(base64);

    return NextResponse.json({
      success: true,
      description,
      altText: description.split('.')[0], // First sentence as alt text
    });
  } catch (error) {
    console.error('Describe image error:', error);
    return NextResponse.json(
      { error: 'Failed to describe image', details: error.message },
      { status: 500 }
    );
  }
}
