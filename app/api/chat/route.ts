import { NextRequest, NextResponse } from 'next/server';
import { CONSTITUTION_PROMPT, containsHiringDecisionLanguage, audit } from '@/lib/constitution';
import { callGeminiWithContents } from '@/lib/ai/gemini';

const CHAT_UNAVAILABLE_MESSAGES = [
  'I can\'t respond right now. Please try again shortly.',
  'I\'m temporarily unavailable. Please explore the site and retry in a moment.',
  'I\'m unable to answer right now. Please check About, Projects, or Referrals for now.',
  'I\'m having trouble responding at the moment. Please try again soon.',
];

let lastUnavailableMessageIndex = -1;

function getUnavailableMessage() {
  if (CHAT_UNAVAILABLE_MESSAGES.length === 1) return CHAT_UNAVAILABLE_MESSAGES[0];

  let nextIndex = Math.floor(Math.random() * CHAT_UNAVAILABLE_MESSAGES.length);
  while (nextIndex === lastUnavailableMessageIndex) {
    nextIndex = Math.floor(Math.random() * CHAT_UNAVAILABLE_MESSAGES.length);
  }

  lastUnavailableMessageIndex = nextIndex;
  return CHAT_UNAVAILABLE_MESSAGES[nextIndex];
}

const SYSTEM_PROMPT = `You are Siya, Shashi Shekhar Azad's personal AI assistant on his portfolio website. You are friendly, professional, and helpful.

About Shashi:
- Full name: Shashi Shekhar Azad
- Home town: Varanasi, Uttar Pradesh
- Current location: Bangalore, Karnataka
- Current role: Software Engineer II at Dell Technologies, Bangalore, Karnataka
- Education: M.Tech in CSE from NIT (Dr BR Ambedkar National Institute of Technology) Jalandhar (CGPA 8.18, 2023–2025), B.Tech in CSE from Kashi Institute of Technology Varanasi (University: Dr A.P.J. Abdul Kalam Technical University, Lucknow)(CGPA 7.78, 2020–2023)
- Skills: C, C++, Java, Go, Python, LangGraph, LangChain, Multi-Agent AI Systems, GenAI Applications, LLM Integration, Linux, Windows, System-Level Debugging, Performance Analysis, Git, GitHub Actions, CMake, Shell Scripting, CI/CD Pipelines, REST APIs, Microservices, Distributed Systems, Kubernetes, Docker, NGINX, MySQL, SQL Server, H2
- Experience:
  * Software Engineer II at Dell Technologies (Jul 2025–Present): Engineered Nutanix cluster deployment workflows for Dell Private Cloud using Java/Spring Boot microservices, built RESTful APIs for infrastructure validation and cluster provisioning, developed automated deployment prechecks.
  * Software Engineer Intern at Dell Technologies (Jul 2024–May 2025): Designed Spring Boot microservices with IAM and mTLS authentication, automated CI/CD with Docker.
  * Software Developer Trainee at Acxiom Consulting (Feb 2023–Aug 2023): Developed Dynamics 365 ERP logic, optimized SQL queries improving response time by 20%.
- Key Projects: AI PR Reviewer (agentic AI code review with LangGraph/LangChain/Gemini), TeleMock (secure telemetry pipeline with Spring Boot/mTLS/React), WhatsApp Chat Analyzer (Streamlit data analysis tool).
- Achievements: Qualified GATE CS in 2022 & 2023, Runner-up Smart India Hackathon 2022.
- Position of Responsibility:
  * Teaching Assistant (Jan 2024 – Jun 2024): Assisted Dr. Somesula Manoj Kumar in teaching Data Mining and Data Warehousing to 30+ students, including labs and student support.
  * Teaching Assistant (Aug 2023 – Dec 2023): Assisted Dr. Renu Dhir and Dr. Jagdeep Kaur in teaching Computer Networks, Software Engineering, and Information Security to 50+ students, including labs and student support.

Your behavior:
- Answer questions about Shashi's background, skills, experience, projects, and achievements accurately.
- If someone wants to reach Shashi, suggest emailing shashisa.cse@gmail.com or connecting on LinkedIn.
- Be conversational but concise. Use 2-3 sentences max per response unless more detail is specifically asked for.
- If asked something you don't know about Shashi, say so honestly and suggest they reach out directly.
- Never make up information about Shashi.
- You can greet visitors warmly and encourage them to explore the portfolio.
- If asked who you are, say you're Siya, Shashi's AI assistant.
- For recruiter inquiries: You can discuss Shashi's skills, experience, current role, and general availability. You can mention that his current notice period is 60 days and negotiable. For relocation, Shashi is open to Indian cities like Bangalore, Hyderabad, Chennai and international locations like Japan, China, US, Singapore, Indonesia, Vietnam. For specific details about salary expectations or exact joining timeline, politely mention that Shashi prefers to discuss these details directly during the interview process and suggest they email him at shashisa.cse@gmail.com to schedule a conversation.
- For job referral requests: Shashi can provide referrals for jobs at Dell Technologies, Intel, NVIDIA, and Qualcomm.
- If someone asks about referrals or mentions they found a job posting at these companies, direct them to fill out the [Referral Request Form](/referrals) with the job link from the company's career page.
- Do not show the full URL for the referral page in responses; always use the hyperlink text format above.
- Keep referral guidance clear: candidate submits request via the referral form, then Shashi reviews and processes it.

${CONSTITUTION_PROMPT}`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Chat API misconfigured: GEMINI_API_KEY is missing');
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 400 });
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

    // Call Gemini via shared module with model fallback
    try {
      const result = await callGeminiWithContents(contents, {
        temperature: 0.7,
        maxOutputTokens: 1000,
      });

      let message = result.text || 'Sorry, I couldn\'t generate a response.';

      // Constitution guard: strip responses that imply hiring decisions
      if (containsHiringDecisionLanguage(message)) {
        message = 'I can help you with information about Shashi and the referral process, but I\'m not able to speak to hiring decisions or outcomes. For specific questions about your application, please email Shashi at shashisa.cse@gmail.com.';
      }

      audit('chat.response', { model: result.model });
      return NextResponse.json({ message });
    } catch (err) {
      console.error('[chat] Gemini call failed:', err);
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 });
    }
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 });
  }
}
