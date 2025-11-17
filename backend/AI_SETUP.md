# AI Content Generation Setup

This guide will help you set up real AI content generation using OpenAI or Anthropic Claude.

## Prerequisites

1. **OpenAI API Key** (for ChatGPT):
   - Sign up at https://platform.openai.com/
   - Get your API key from https://platform.openai.com/api-keys

2. **Anthropic API Key** (for Claude) - Optional:
   - Sign up at https://console.anthropic.com/
   - Get your API key from https://console.anthropic.com/settings/keys

## Installation Steps

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create a `.env` file in the `backend` directory:**
   ```bash
   # In backend/.env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
   ```

3. **Restart the Django server** for changes to take effect.

## Usage

- The system will use OpenAI by default
- To use Claude instead, change `provider: 'anthropic'` in the frontend code
- Enter keywords like "mental health awareness" and click "GENERATE AI CONTENT"
- The AI will search and generate comprehensive training content

## Cost Notes

- OpenAI GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Anthropic Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Each generation uses approximately 500-2000 tokens


