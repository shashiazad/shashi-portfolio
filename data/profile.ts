export const profile = {
  name: 'Shashi Shekhar Azad',
  title: 'Software Engineer',
  company: 'Optum',
  company_logo: 'https://www.optum.com/content/dam/optum/about/optum-logo-1.png',
  photo: '/profile.jpg',

  summary: `Backend Software Engineer with 2+ years of experience building scalable REST APIs, microservices, and AI-powered solutions using Python and FastAPI. Specialized in designing multi-agent AI systems with LangGraph, developing production backend services with secure communication patterns, and implementing distributed systems. Delivered production services for Dell APEX Cloud Platform and contributed to AI-assisted engineering workflows. Strong foundation in API architecture, agentic AI development, and modern backend engineering.`,

  education: [
    {
      degree: 'M.Tech in Computer Science and Engineering',
      school: 'Dr. B R Ambedkar National Institute of Technology Jalandhar',
      period: 'Aug 2023 – Jun 2025',
      grade: 'CGPA: 8.18/10.0',
      location: 'Jalandhar, Punjab',
      link: 'https://nitj.ac.in/'
    },
    {
      degree: 'B.Tech in Computer Science and Engineering',
      school: 'Dr. A. P. J. Abdul Kalam Technical University, Lucknow',
      period: 'Nov 2020 – Jun 2023',
      grade: 'CGPA: 7.78/10.0',
      location: 'Lucknow, Uttar Pradesh',
      link: 'https://aktu.ac.in/'
    }
  ],

  bio: `Software Engineer with 2+ years of experience building scalable backend services, REST APIs, microservices, and AI-powered solutions using Python, FastAPI, Go, and Java. Specialized in multi-agent AI systems with LangGraph, designing distributed systems, and implementing production-ready backend infrastructure. At Dell, delivered cluster provisioning, validation, and lifecycle automation for private-cloud infrastructure, and contributed to AI agent-driven Spec-Driven Development workflows.

Experienced in secure service-to-service communication with mTLS, NGINX routing, containerization with Docker and Kubernetes, GitHub Actions CI/CD, and distributed systems troubleshooting. Passionate about building intelligent software systems, agentic AI solutions, and high-quality engineering.`,

  skills: {
    languages: ['Python', 'Go', 'Java', 'C/C++', 'TypeScript'],
    aiTools: ['LangGraph', 'LangChain', 'Google Gemini API', 'Groq API', 'FAISS', 'Prompt Engineering', 'RAG', 'Agentic AI', 'Embedding Models', 'ChromaDB'],
    testing: ['Unit Testing', 'Integration Testing', 'TDD', 'GoMock', 'Debugging', 'Code Reviews', 'CI/CD Validation'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'Kubernetes', 'NGINX', 'Shell Scripting', 'Linux'],
    backend: ['FastAPI', 'RESTful APIs', 'Microservices', 'Distributed Systems', 'Spring Boot', 'Prism API Integration', 'API Design', 'Service Automation'],
    databases: ['PostgreSQL', 'Microsoft SQL Server', 'Prisma', 'pgvector'],
    cloud: ['Containerization', 'Kubernetes', 'NGINX', 'mTLS', 'CI/CD', 'Secure Service Communication'],
    engineering: ['Agile/Scrum', 'System Design', 'Object-Oriented Design', 'Requirements Analysis', 'SDLC', 'Cross-Functional Collaboration', 'Spec-Driven Development'],
  },

  experience: [
    {
      role: 'Software Engineer',
      company: 'Optum',
      period: 'Sep 2026 – Present',
      location: 'Bangalore, India (Remote)',
      bullets: [
        'Developing scalable backend services and REST APIs using Python and FastAPI for healthcare and AI solutions.',
        'Building multi-agent AI systems using LangGraph for intelligent automation and decision-making workflows.',
        'Designing and implementing distributed backend architectures with emphasis on performance, reliability, and maintainability.'
      ]
    },
    {
      role: 'Software Engineer II',
      company: 'Dell Technologies',
      period: 'Jul 2025 – Aug 2026',
      location: 'Bangalore, India',
      bullets: [
        'Developed and delivered 6+ production-grade REST APIs and backend services in Go for cluster provisioning, validation, and network configuration within Dell APEX Cloud Platform for Nutanix, with unit tests using Go testing and GoMock integrated into GitHub Actions CI/CD workflows.',
        'Implemented 10+ validators for a Python-based post-deployment cluster lifecycle validation framework covering node scaling, upgrades, and configuration changes, reducing upgrade failures and improving operational reliability.',
        'Configured NGINX routing for internal and external service communication and integrated microservices with Nutanix Prism APIs to automate cluster node provisioning, configuration, onboarding, and decommissioning.',
        'Contributed to an AI agent-driven Spec-Driven Development workflow using LLM agents to generate engineering requirements, implementation stories, test plans, and code, contributing to 20+ engineering requirements and 60+ implementation stories while following TDD practices with 80%+ code coverage.',
        'Reviewed, debugged, and refined AI-generated code by resolving logic issues and edge cases, improving production readiness and quality across 7+ microservices.'
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: 'Dell Technologies',
      period: 'Jul 2024 – May 2025',
      location: 'Bangalore, India',
      bullets: [
        'Developed Spring Boot microservices with secure inter-service communication (mTLS, IAM) deployed behind an NGINX reverse proxy.',
        'Containerized and deployed microservices using Docker and Kubernetes, validating deployment, connectivity, and operational reliability.',
        'Contributed to CI/CD pipelines using Docker and Git-based version control, improving deployment consistency and release efficiency.'
      ]
    },
    {
      role: 'Software Developer – Trainee',
      company: 'Acxiom Consulting Pvt. Ltd.',
      period: 'Feb 2023 – Aug 2023',
      location: 'Noida, India',
      bullets: [
        'Developed business logic for a jewelry retail ERP in Microsoft Dynamics 365, including payment validation, cross-store cash-limit enforcement per customer, and category-wise offer/discount calculation with supporting UI handlers.',
        'Wrote and optimized SQL queries and stored procedures in SQL Server, reducing execution time of a large customer-detail lookup query.'
      ]
    }
  ],

  projects: [
    {
      name: 'InfraPilot - Multi-Agent Infrastructure Incident Investigator',
      summary: 'Agentic Kubernetes incident investigation platform that correlates live cluster evidence, Prometheus telemetry, operational runbooks, and incident history to generate evidence-backed diagnoses and human-approved remediation actions.',
      stack: ['Python','FastAPI','LangGraph','MCP','Kubernetes','Prometheus','PostgreSQL','pgvector','SQLAlchemy','RAG','Next.js'],
      link: 'https://github.com/shashiazad/infra-pilot',
      year: '2026',
    },
    {
      name: 'MonitorMixer - External Monitor Volume Controller',
      summary: 'Built a lightweight native macOS tool for MacBook users to control external monitor volume. Implemented the DDC/CI protocol with zero dependencies, featuring adaptive mute emulation, EDID-based display persistence, and fallback overlays for reliable feedback across monitor types. MIT-licensed.',
      stack: ['Swift', 'macOS', 'AppKit', 'SwiftUI', 'DDC/CI', 'IOAV APIs', 'EDID', 'I²C'],
      link: 'https://github.com/shashiazad/MonitorMixer',
      year: '2026',
    },
    {
      name: 'SpendClan – AI-Powered Personal & Group Expense Manager',
      summary: 'Built a full-stack finance platform with role-based auth, session-scoped data isolation, and group expense splitting using a greedy debt-simplification algorithm to settle balances with the minimum number of transactions.',
      stack: ['Next.js', 'PostgreSQL', 'Prisma', 'FAISS', 'Groq API', 'Google Gemini API'],
      link: 'https://spendclan.vercel.app/',
      year: '2026',
    },
    {
      name: 'Link2PDF',
      summary: 'A Next.js + TypeScript app that converts URLs and image links into clean downloadable PDFs, with image extraction, preview, and customizable export settings.',
      stack: ['Next.js', 'TypeScript', 'PDF generation', 'image extraction', 'server-side API routes'],
      link: 'https://link2pdfs.vercel.app/',
      year: '2026',
    },
    {
      name: 'Agentic AI Framework for DISA STIG Hardening',
      summary: 'Built a multi-agent AI framework using LangGraph to automate DISA STIG hardening with specialized agents for security analysis, remediation generation, compliance validation, and recovery from execution failures. Implemented verify-by-rescan validation, automated retries, compliance drift detection, and human-in-the-loop approval to improve audit readiness.',
      stack: ['Python', 'LangGraph', 'LangChain', 'Agentic AI', 'Security Automation'],
      link: '#',
      year: '2026',
    },
    {
      name: 'TeleMock – Distributed Telemetry Processing Platform',
      summary: 'Designed and developed a distributed telemetry platform using Spring Boot microservices and Python telemetry agents to securely collect, aggregate, process, and visualize infrastructure metrics from multiple machines. Secured service communication with NGINX and certificate-based mTLS, and containerized backend services using Docker.',
      stack: ['Java', 'Spring Boot', 'Python', 'React', 'NGINX', 'Docker', 'mTLS'],
      link: 'https://github.com/shashiazad/idrac',
      year: '2025',
    }
  ],

  achievements: [
    'Smart India Hackathon (SIH) 2022 – Qualified for the national-level round.',
    'Solved 500+ DSA problems across LeetCode, GeeksforGeeks, and HackerRank.',
  ],

  // Technical writing is now sourced from real, published articles in the
  // Supabase `articles` table (see components/Publications.tsx). Placeholder
  // Medium entries were removed to avoid linking to articles that don't exist.
  writing: [] as Array<{
    title: string;
    venue: string;
    summary: string;
    link: string;
    year: string;
  }>,

  publications: [
    {
      title: 'Optimizing EEG-based Harmful Brain Activity Classification via Ensemble Deep Learning and Two-Stage Training',
      venue: 'Artificial Intelligence and Sustainable Innovation, CRC Press',
      year: '2026',
      link: 'https://doi.org/10.1201/9781003731689-74'
    }
  ],

  // Hiring availability. Set `noticePeriod` (e.g. '60 days') once confirmed; while it is
  // null the chat agent will not state any notice period or joining date.
  availability: {
    openToOpportunities: true,
    noticePeriod: null as string | null,
    relocation: 'Open to Bangalore, Hyderabad, and Pune',
  },

  contact: {
    email: 'shashisa.cse@gmail.com',
    github: 'https://github.com/shashiazad',
    linkedin: 'https://www.linkedin.com/in/shashisa',
    medium: 'https://shashisa.medium.com/',
    codolio: 'https://codolio.com/profile/shashisa',
    location: 'Bangalore, Karnataka, India'
  }
};
