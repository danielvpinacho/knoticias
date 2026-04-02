curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "models": [
        "qwen/qwen3.6-plus",
        "anthropic/claude-opus-4.6",
        "anthropic/claude-sonnet-4.6",
        "z-ai/glm-5v-turbo"
    ],
    "messages": [
        {
            "role": "user",
            "content": "If you built the world'\''s tallest skyscraper, what would you name it?"
        }
    ]
}'