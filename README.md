# Accessible Document Converter

Make documents accessible for people with disabilities.

## Features

- ♿ WCAG compliance analysis
- 🔤 Text simplification for cognitive accessibility
- 🖼️ Auto-generate image alt text
- 🎨 Color contrast checking
- 📄 Multiple format support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4 Vision + GPT-4o
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze accessibility |
| POST | `/api/convert` | Convert to accessible format |
| POST | `/api/describe-image` | Generate alt text |

## Demo Mode

Works without API key with basic accessibility checks.

## License

MIT
