import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function describeImage(imageBase64) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this image in detail for someone who cannot see it. Include all relevant visual information, text content, colors, and spatial relationships.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}

export async function simplifyText(text, targetLevel = 'simple') {
  const levels = {
    simple: 'Use short sentences and common words. Aim for 6th grade reading level.',
    moderate: 'Use clear language, avoid jargon. Aim for 8th grade reading level.',
    detailed: 'Keep detail but improve clarity. Aim for 10th grade reading level.',
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Simplify text for accessibility. ${levels[targetLevel]}. Maintain all important information.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content;
}

export async function generateStructuredContent(content) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Convert content to a well-structured accessible format. Return JSON:
{
  "title": "Document title",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content",
      "summary": "Brief summary for screen readers"
    }
  ],
  "keyPoints": ["Main point 1", "Main point 2"],
  "glossary": [{"term": "complex term", "definition": "simple definition"}]
}`,
      },
      {
        role: 'user',
        content,
      },
    ],
    max_tokens: 2000,
  });

  const text = response.choices[0].message.content;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { title: 'Document', sections: [{ content: text }], keyPoints: [] };
}

export async function convertToSpeech(text) {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text.substring(0, 4000),
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString('base64');
}
