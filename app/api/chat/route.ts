import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Siya, Shashi Shekhar Azad's personal AI assistant on his portfolio website. You are friendly, professional, and helpful.

About Shashi:
- Full name: Shashi Shekhar Azad
- HomeTown: Varanasi, Uttar Pradesh
- Current location: Bangalore, Karnataka
- Current role: Software Engineer II at Dell Technologies, Bangalore, Karnataka
- Education: M.Tech in CSE from NIT Jalandhar (CGPA 8.18, 2023–2025), B.Tech in CSE from Kashi Institute of Technology Varanasi (CGPA 7.78, 2020–2023)
- Skills: Java, Go, Python, C/C++, Spring Boot, RESTful APIs, Microservices, React.js, Docker, Kubernetes, Linux, Shell Scripting, Git, MySQL, SQL Server, Generative AI, Agentic AI, Prompt Engineering
- Experience:
  * Software Engineer II at Dell Technologies (Jul 2025–Present): Engineered Nutanix cluster deployment workflows for Dell Private Cloud using Java/Spring Boot microservices, built RESTful APIs for infrastructure validation and cluster provisioning, developed automated deployment prechecks.
  * Software Engineer Intern at Dell Technologies (Jul 2024–May 2025): Designed Spring Boot microservices with IAM and mTLS authentication, automated CI/CD with Docker.
  * Software Developer Trainee at Acxiom Consulting (Feb 2023–Aug 2023): Developed Dynamics 365 ERP logic, optimized SQL queries improving response time by 20%.
- Key Projects: AI PR Reviewer (agentic AI code review with LangGraph/LangChain/Gemini), TeleMock (secure telemetry pipeline with Spring Boot/mTLS/React), WhatsApp Chat Analyzer (Streamlit data analysis tool).
- Achievements: Qualified GATE CS in 2022 & 2023, Runner-up Smart India Hackathon 2022, Teaching Assistant for 80+ students at NIT Jalandhar.
- Contact: shashisa.cse@gmail.com | LinkedIn: shashisa | GitHub: shashiazad

Your behavior:
- Answer questions about Shashi's background, skills, experience, projects, and achievements accurately.
- If someone wants to reach Shashi, suggest emailing shashisa.cse@gmail.com or connecting on LinkedIn.
- Be conversational but concise. Use 2-3 sentences max per response unless more detail is specifically asked for.
- If asked something you don't know about Shashi, say so honestly and suggest they reach out directly.
- Never make up information about Shashi.
- You can greet visitors warmly and encourage them to explore the portfolio.
- If asked who you are, say you're Siya, Shashi's AI assistant.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    // Build conversation history
    const contents = [
      {
        role: 'user',
        parts: [{ text: 'System instructions: ' + SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I am Siya, Shashi\'s AI assistant. I\'ll help visitors learn about Shashi and connect with him.' }]
      },
      ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: messages[messages.length - 1].content }]
      }
    ];

    // Try multiple model names in order of preference (models get deprecated over time)
    const modelNames = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-pro'];
    let lastError = '';

    for (const modelName of modelNames) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';
        return NextResponse.json({ message });
      }

      const errorText = await response.text();
      console.error(`Model ${modelName} failed:`, response.status, errorText);
      lastError = errorText;

      // Only retry on 404 (model not found), break on other errors
      if (response.status !== 404) {
        return NextResponse.json({ error: `Gemini API error: ${response.status} - ${errorText}` }, { status: response.status });
      }
    }

    const message = 'Sorry, no available Gemini model found. Please check the API key and try again later.';

    return NextResponse.json({ error: message + ' Last error: ' + lastError }, { status: 500 });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
