// Removed GoogleGenerativeAI import
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';


/**
 * Build the prompt for Gemini based on model info and optional focused part.
 */
function buildPrompt(model, focusedPart = null) {
  const base = `You are an expert STEM educator explaining a 3D interactive model to a student.

Model: "${model.name}"
Subject: ${model.subject}
Chapter/Topic: ${model.chapter}
${model.description ? `Description: ${model.description}` : ''}
`;

  if (focusedPart) {
    return `${base}
The student just clicked on the part: "${focusedPart.name}"
Part description: ${focusedPart.description || ''}

Explain this specific part in the context of the full ${model.name}. Cover:
1. **What it is** — a clear 1-2 sentence definition
2. **Its role** — what function it performs in the model
3. **The science** — the key physics/biology/chemistry principle at play
4. **Real-world connection** — where they'd find this in real life

Keep it engaging, concise (under 180 words), and targeted at a Class 11-12 student. Use simple analogies where helpful. Format with headers using **bold**.`;
  }

  return `${base}
Provide a complete educational explanation of this model for a Class 11-12 student. Structure your response exactly as follows:

**What is the ${model.name}?**
[2-3 sentence overview of what this is and why it matters]

**⚙️ How It Works**
[Step-by-step numbered explanation of the working principle, 3-5 steps, each 1-2 sentences]

**💡 Key Concept: [Name the core scientific principle]**
[1-2 sentences explaining the core law/principle (e.g. Faraday's Law, Cell Theory, etc.)]

**🌍 Real-World Connection**
[1-2 sentences on where this is found or used in the real world]

**🎯 Fun Fact**
[One surprising or memorable fact related to this model]

Keep each section concise. Total response should be under 250 words. Write in an engaging, clear style for students.`;
}

export async function explainWithGemini(model, focusedPart = null, onChunk, onDone, onError) {
  try {
    const prompt = buildPrompt(model, focusedPart);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location?.href || "http://localhost:5173",
        "X-Title": "VisualLearn"
      },
      body: JSON.stringify({
        "model": "google/gemma-4-31b-it:free", // Free OpenRouter model
        "messages": [
          {"role": "user", "content": prompt}
        ],
        "max_tokens": 1024,
        "stream": true
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // keep the last potentially incomplete line in buffer
        buffer = lines.pop(); 
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed === 'data: [DONE]') {
            onDone();
            return;
          }
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                 onChunk(data.choices[0].delta.content);
              }
            } catch (e) {
              // Ignore incomplete JSON chunks or parse errors silently
            }
          }
        }
      }
    }
    
    // In case the stream finishes without [DONE] but buffer is processed
    onDone();
  } catch (err) {
    console.error('API error:', err);
    let errorMsg = err.message || 'Failed to get AI explanation. Check your API key.';
    
    if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('insufficient_quota')) {
      errorMsg = 'API rate limit exceeded or insufficient quota. Please try again later.';
    }
    
    onError(errorMsg);
  }
}

/**
 * Check if the Gemini API key is configured.
 */
export function isGeminiConfigured() {
  return API_KEY && API_KEY !== 'your_gemini_api_key_here';
}
