---
name: openrouter-agent
model: inherit
version: 1.0
description: "Simple OpenRouter agent for text completion via OpenRouter API"
argument-hint: "Ask questions, generate text, or summarize content."
target: vscode
tools: Read, Grep, Glob, Bash
---

# Behavior / Capabilities
- Accepts user prompt text
- Calls OpenRouter text completion endpoint
- Returns completion text with confidence / token usage metadata
- Handles error status and retries once
- Exposes `openrouter_build` command-style action
