import { NextResponse } from 'next/server';
import { simplifyText, generateStructuredContent } from '@/lib/services/openai';
import { calculateReadingLevel, addAriaAnnotations, checkAccessibility, convertToPlainText } from '@/lib/services/accessibility';
import { saveConversion } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { content, type = 'text', options = {} } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Please provide content to convert' },
        { status: 400 }
      );
    }

    const readingLevel = calculateReadingLevel(content);
    let converted;
    let metadata = {
      type,
      originalReadingLevel: readingLevel,
      options,
    };

    switch (type) {
      case 'simplify':
        if (process.env.OPENAI_API_KEY) {
          converted = await simplifyText(content, options.level || 'simple');
        } else {
          // Basic simplification without AI
          converted = content
            .replace(/\b\w{12,}\b/g, word => `[${word}]`) // Mark long words
            .replace(/([.!?])\s+/g, '$1\n\n'); // Add paragraph breaks
          converted += '\n\n[Note: Add OPENAI_API_KEY for AI-powered simplification]';
        }
        metadata.newReadingLevel = calculateReadingLevel(converted);
        break;

      case 'structure':
        if (process.env.OPENAI_API_KEY) {
          converted = await generateStructuredContent(content);
        } else {
          converted = {
            title: 'Document',
            sections: [{ heading: 'Content', content, summary: content.substring(0, 100) }],
            keyPoints: content.split('.').slice(0, 3).map(s => s.trim()),
          };
        }
        break;

      case 'plaintext':
        converted = convertToPlainText(content);
        break;

      case 'aria':
        converted = addAriaAnnotations(content);
        const issues = checkAccessibility(content);
        metadata.accessibilityIssues = issues;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid conversion type' },
          { status: 400 }
        );
    }

    const saved = await saveConversion(content, converted, metadata);

    return NextResponse.json({
      success: true,
      converted,
      metadata,
      id: saved.id,
    });
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json(
      { error: 'Failed to convert content', details: error.message },
      { status: 500 }
    );
  }
}
