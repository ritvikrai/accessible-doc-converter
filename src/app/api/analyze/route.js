import { NextResponse } from 'next/server';
import { checkAccessibility, calculateReadingLevel, generateTableOfContents } from '@/lib/services/accessibility';

export async function POST(request) {
  try {
    const { content, type = 'html' } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Please provide content to analyze' },
        { status: 400 }
      );
    }

    const issues = checkAccessibility(content);
    const readingLevel = calculateReadingLevel(content);
    const tableOfContents = type === 'html' ? generateTableOfContents(content) : [];

    // Calculate accessibility score
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    const score = Math.max(0, 100 - errorCount * 20 - warningCount * 10);

    return NextResponse.json({
      score,
      issues,
      readingLevel,
      tableOfContents,
      recommendations: [
        ...(errorCount > 0 ? ['Fix critical accessibility errors'] : []),
        ...(readingLevel.gradeLevel > 10 ? ['Consider simplifying language'] : []),
        ...(tableOfContents.length === 0 && content.length > 500 ? ['Add headings to structure content'] : []),
      ],
    });
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error.message },
      { status: 500 }
    );
  }
}
