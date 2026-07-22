export const profile = {
  name: 'Shashi Shekhar Azad',
  title: 'Software Engineer II',
  company: 'Dell Technologies',
  company_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Dell_Technologies_logo.svg',
  photo: '/profile.jpg',

  summary: `Backend Software Engineer with 1.5+ years of experience designing, building, and testing scalable REST APIs, microservices, and Python automation frameworks using Go, Java, and Python for distributed private-cloud infrastructure. Experienced in secure service-to-service communication (mTLS, IAM), containerization (Docker, Kubernetes), NGINX routing, and AI-assisted workflows (Claude Code, Devin, Windsurf). Strong foundation in object-oriented design, SDLC, and hands-on exposure to GenAI and Agentic AI systems.`,

  education: [
    {
      degree: 'Master of Technology in Computer Science and Engineering',
      school: 'Dr. B R Ambedkar National Institute of Technology Jalandhar',
      period: 'Aug 2023 – Jun 2025',
      grade: 'CGPA: 8.18/10.0',
      location: 'Jalandhar, Punjab',
      link: 'https://nitj.ac.in/'
    },
    {
      degree: 'Bachelor of Technology in Computer Science and Engineering',
      school: 'Dr. A. P. J. Abdul Kalam Technical University, Lucknow',
      period: 'Nov 2020 – Jun 2023',
      grade: 'CGPA: 7.78/10.0',
      location: 'Varanasi, Uttar Pradesh',
      link: 'https://aktu.ac.in/'
    }
  ],

  bio: `Software Engineer with 1.5+ years of experience building scalable backend services, Python automation frameworks, REST APIs, and distributed cloud-native systems in Go, Java, and Python. Experienced in designing production-grade microservices, infrastructure automation, and AI-powered applications using LangGraph, LangChain, and Gemini APIs.

Strong foundation in Linux, networking, API integrations, secure inter-service communication (mTLS), and debugging complex distributed systems. Proficient with AI-assisted coding environments (Claude Code, Devin, Windsurf, VS Code) to accelerate feature development, code reviews, and quality workflows. Passionate about building intelligent software and next-generation AI products.`,

  skills: {
    languages: ['Go', 'Java', 'Python', 'C#', 'C++', 'TypeScript'],
    aiTools: ['Claude Code', 'Devin', 'Windsurf', 'VS Code', 'LangGraph', 'LangChain', 'RAG Pipelines', 'Hugging Face Transformers', 'ChromaDB', 'Google Gemini API', 'Google Gen AI SDK'],
    testing: ['Debugging', 'Unit Testing', 'Code Reviews', 'Test Automation', 'Performance Optimization'],
    tools: ['Git', 'GitHub Actions', 'CI/CD', 'Maven', 'Shell Scripting'],
    backend: ['RESTful APIs', 'Microservices', 'Distributed Systems', 'Spring Boot', 'API Integration'],
    databases: ['PostgreSQL', 'MySQL', 'Microsoft SQL Server'],
    cloud: ['Linux', 'Docker', 'Kubernetes', 'NGINX', 'AWS', 'mTLS', 'Security Best Practices'],
    engineering: ['Agile/Scrum', 'Requirements Analysis', 'Object-Oriented Design', 'System Design', 'User Story Ownership', 'SDLC', 'Cross-Functional Collaboration'],
  },

  experience: [
    {
      role: 'Software Engineer II',
      company: 'Dell Technologies',
      period: 'Jul 2025 – Present',
      location: 'Bangalore, India',
      bullets: [
        'Analyzed business and platform requirements to develop 10+ production-grade REST APIs across Go and Python microservices for distributed private-cloud infrastructure, owning user stories throughout design, implementation, testing, and deployment.',
        'Developed automated pre-upgrade validation checks within a Python validation framework to identify configuration and compatibility issues, improving cluster readiness, and reducing upgrade failures.',
        'Designed and implemented workflow automation for cluster node lifecycle management by integrating backend microservices with Nutanix Prism APIs and infrastructure blueprints to automate provisioning, configuration, onboarding, and decommissioning at scale.',
        'Configured NGINX routing rules to support HTTP communication for internal microservices and HTTPS with certificate-based mutual TLS (mTLS) for external callers, enforcing certificate-based authentication and strengthening platform security.',
        'Adopted AI-assisted coding tools (Claude Code, Devin, Windsurf, VS Code) to accelerate feature development, debugging, and code review cycles, improving development velocity on distributed microservices.',
        'Collaborated with architects and platform stakeholders during design reviews to translate business and operational requirements into technical designs, documentation, and production-ready software solutions.'
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: 'Dell Technologies',
      period: 'Jul 2024 – May 2025',
      location: 'Bangalore, India',
      bullets: [
        'Designed Spring Boot microservices with secure inter-service communication (mTLS, IAM) deployed behind an NGINX reverse proxy in distributed environments.',
        'Containerized and deployed microservices using Docker and Kubernetes, verifying application deployment, connectivity, and operational reliability.',
        'Contributed to CI/CD pipelines using Docker and Git-based version control, improving deployment consistency and release efficiency.'
      ]
    },
    {
      role: 'Software Developer – Trainee',
      company: 'Acxiom Consulting Pvt. Ltd.',
      period: 'Feb 2023 – Aug 2023',
      location: 'Noida, India',
      bullets: [
        'Developed backend business logic in C#/.NET for a jewelry retail ERP in Microsoft Dynamics 365, including payment validation, cross-store cash-limit enforcement per customer, and category-wise offer/discount calculation, with supporting TypeScript-based UI handlers.',
        'Wrote and optimized SQL queries and stored procedures in SQL Server, reducing execution time of a large customer-detail lookup query and improving database response time by 20% - 30%.'
      ]
    }
  ],

  projects: [
    {
      name: 'Agentic AI Framework for DISA STIG Hardening',
      summary: 'Built an agentic AI framework using LangGraph to automate DISA STIG compliance workflows by orchestrating specialized agents for requirement analysis, compliance validation, AI-assisted remediation generation, and execution failure recovery across operating systems, virtual machines, and enterprise software. Implemented verify-by-rescan validation, automated retries, compliance drift detection, and evidence generation to improve audit readiness and reduce manual effort in security compliance and hardening.',
      stack: ['Python', 'LangGraph', 'Streamlit', 'Pandas', 'Matplotlib'],
      link: '#',
      year: '2026',
    },
    {
      name: 'RAG-based Document Q&A',
      summary: 'Built a retrieval-augmented generation pipeline using Hugging Face Transformers for embedding generation and ChromaDB as the vector store, orchestrated with LangChain for context retrieval and prompting. Explored chunking strategies and retrieval-augmented prompting to ground LLM responses in source documents, as a hands-on deep dive into RAG system design.',
      stack: ['Python', 'LangChain', 'Hugging Face Transformers', 'ChromaDB'],
      link: '#',
      year: '2026',
    },
    {
      name: 'SpendClan -- AI-Powered Expense Manager',
      summary: 'Integrated the Google Gen AI SDK (Gemini) to build an LLM-powered chat assistant that analyzes user spending records via context retrieval, delivering personalized savings recommendations and financial reports. Built a full-stack platform with RBAC authentication, session-level data isolation, and a group expense-splitting engine using a greedy debt-simplification algorithm.',
      stack: ['Next.js', 'PostgreSQL', 'pgvector', 'Prisma', 'Google Gen AI SDK'],
      link: 'https://spendclan.vercel.app/',
      year: '2026',
    },
    {
      name: 'TeleMock – Distributed Telemetry Processing Platform',
      summary: 'Designed and developed a distributed telemetry processing platform using Spring Boot microservices and Python telemetry agents to securely collect, aggregate, process, and visualize infrastructure metrics from multiple machines. Configured NGINX with certificate-based mutual TLS (mTLS) to secure service communication, built a React monitoring dashboard, and containerized backend services using Docker for reproducible deployments.',
      stack: ['Java', 'Spring Boot', 'Python', 'React', 'NGINX', 'Docker', 'mTLS'],
      link: 'https://github.com/shashiazad/idrac',
      year: '2025',
    }
  ],

  achievements: [
    'Qualified GATE in Computer Science in 2022 and 2023.',
    'Runner-up in Smart India Hackathon 2022 Grand Finale.',
    'Teaching Assistant for 80+ students across two semesters at NIT Jalandhar.',
  ],

  contact: {
    email: 'shashisa.cse@gmail.com',
    github: 'https://github.com/shashiazad',
    linkedin: 'https://www.linkedin.com/in/shashisa',
    medium: 'https://shashisa.medium.com/',
    codolio: 'https://codolio.com/profile/shashisa',
    location: 'Bangalore, Karnataka, India'
  }
};
