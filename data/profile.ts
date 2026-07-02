export const profile = {
  name: 'Shashi Shekhar Azad',
  title: 'Software Engineer II',
  company: 'Dell Technologies',
  company_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Dell_Technologies_logo.svg',
  photo: '/profile.jpg',

  summary: `Backend and Infrastructure Engineer with hands on experience building cloud-native microservices and REST APIs in private cloud environments. Skilled in Go, Python, Kubernetes, and system design for a scalable and reliable backend system.`,

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
      school: 'Kashi Institute of Technology Varanasi',
      period: 'Nov 2020 – Jun 2023',
      grade: 'CGPA: 7.78/10.0',
      location: 'Varanasi, Uttar Pradesh',
      link: 'https://aktu.ac.in/'
    }
  ],

  bio: `Software engineer with expertise in cloud-native architectures, microservices development, and automation. Skilled in building scalable backend systems using Go, python, Java and Spring Boot, with a strong focus on secure communication, API design, and workflow optimization through scripting.

Proficient in developing REST APIs, implementing system validation checks, and creating solutions that enhance reliability and reduce deployment risks. Experienced in designing reusable processes and documentation to improve efficiency and streamline complex operations.

Combining advanced academic training in Computer Science & Engineering with hands-on experience, the focus is on delivering secure, scalable, and future-ready solutions that simplify infrastructure and drive operational excellence.`,

  skills: {
    languages: ['Go', 'Python', 'Java', 'C/C++'],
    backend: ['Spring Boot', 'RESTful APIs', 'Microservices Architecture'],
    frontend: ['React.js', 'Streamlit', 'HTML/CSS'],
    databases: ['MySQL', 'SQL Server', 'Oracle', 'PostgreSQL'],
    devops: ['Docker', 'Kubernetes', 'Linux', 'Shell Scripting', 'Git', 'GitHub', 'NGINX', 'Postman'],
    ai: ['Generative AI', 'Agentic AI', 'Prompt Engineering', 'Machine Learning'],
    core: ['Data Structures & Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks'],
  },

  experience: [
    {
      role: 'Software Engineer II',
      company: 'Dell Technologies',
      period: 'Jul 2025 – Present',
      location: 'Bangalore, Karnataka',
      bullets: [
        'Engineered 8+ backend microservices using Go, handling configuration, discovery, and validation for Nutanix cluster deployments in a private cloud environment.',
        'Developed a Python validation framework with 10+ modules, ensuring safe Day-2 lifecycle operations and preventing cluster-level failures.',
        'Improved deployment reliability by implementing automated prechecks and contributing ~12.5% test coverage for upgrade workflows.',
      ]
    },
    {
      role: 'Software Engineer',
      company: 'Dell Technologies',
      period: 'Jul 2024 – May 2025',
      location: 'Bangalore, Karnataka',
      bullets: [
        'Designed and integrated Spring Boot microservices with identity access management and mTLS-based mutual authentication, enabling secure inter-service communication.',
        'Automated CI/CD workflows using Docker and DevOps tooling, accelerating release velocity within an Agile process.',
      ]
    },
    {
      role: 'Software Developer – Trainee',
      company: 'Acxiom Consulting Pvt. Ltd.',
      period: 'Feb 2023 – Aug 2023',
      location: 'Noida, Uttar Pradesh',
      bullets: [
        'Developed business logic and UI components for Dynamics 365 ERP using OOP principles, reducing data entry errors by 40%.',
        'Contributed to CI/CD pipelines using Docker, improving deployment consistency and release efficiency.',
      ]
    }
  ],

  projects: [
    {
      name: "Portal for Balmiki Inter College",
      summary:
        "Designed and developed the official web portal for Balmiki Inter College as a full-stack application. Built a secure server-side architecture with Node.js and Express.js, implemented PostgreSQL-based student record management, integrated AWS S3 for file storage and document handling, and developed a responsive user interface using EJS and Vite. The platform streamlines academic administration through secure data management, efficient file workflows, and scalable backend services.",
      stack: [
        "Node.js",
        "Express.js",
        "EJS",
        "PostgreSQL",
        "Vite",
        "AWS S3",
      ],
      link: "https://bicbalua.vercel.app",
      year: "2026",
    },
    {
      name: 'SpendClan',
      summary: 'Secure, full-stack finance web application designed to bridge the gap between individual budget tracking and group expense management. Implemented a greedy transaction matching algorithm that automatically computes the minimum number of transfers required to settle all debts in a group. Developed double-gated password recovery paths (email token + Q&A fallback), session-level data isolation, and composite database indexing on PostgreSQL via Prisma to guarantee high-performance scaling.',
      stack: ['Next.js', 'React', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'Nodemailer'],
      link: 'https://github.com/shashiazad/spendclan',
      year: 'Jun 2026',
    },
    {
      name: 'AEGIS AI (Automated Enforcement & Guarding of Infrastructure Security)',
      summary: 'Built an agentic AI-driven compliance platform to enforce DISA STIG hardening with continuous verification instead of one-time script execution. Designed a generative compliance engine that combines vendor artifacts with AI-generated, platform-specific remediation logic to close coverage gaps across hypervisor, OS, middleware, and application layers. Implemented verify-by-rescan validation, drift detection workflows, and automated evidence generation to improve audit readiness and reduce manual compliance effort.',
      stack: ['Python', 'Streamlit', 'LangChain/LangGraph-style Agentic Workflow', 'Paramiko', 'pyVmomi', 'LLM (Gemini/GPT via connector)', 'GitHub Actions'],
      link: '#',
      year: 'Feb 2026',
    },
    {
      name: 'AI PR Reviewer',
      summary: 'Built an agentic AI code review system using a LangGraph StateGraph-orchestrated multi-agent pipeline (Planner, Reviewer, Critic, Commenter) with typed state, conditional routing, and per-node retry to parse diffs, run static checks, and post inline feedback via Gemini and LangChain. Implemented anti-hallucination prompt contracts, issue deduplication, severity-based budgeting, and REQUEST_CHANGES merge gating with resilient fallback paths for LLM failures; automated via GitHub Actions.',
      stack: ['Python', 'LangGraph', 'LangChain', 'Google Gemini API', 'GitHub Actions'],
      link: 'https://github.com/shashiazad/ai-pr-reviewer',
      year: 'Jan 2026',
    },
    {
      name: 'TeleMock – Secure Telemetry Pipeline Simulator',
      summary: 'Architected a telemetry data pipeline using Python clients and Spring Boot RESTful microservices for real-time data streaming and validation across distributed services. Configured NGINX reverse proxy with mTLS and built a React.js dashboard with H2 in-memory database for real-time telemetry visualization.',
      stack: ['Spring Boot', 'Python', 'React', 'NGINX', 'mTLS', 'Docker'],
      link: 'https://github.com/shashiazad/idrac',
      year: 'March 2025',
    },
    {
      name: 'WhatsApp Chat Analyzer',
      summary: 'Built a data analysis tool with Streamlit and Matplotlib that preprocesses chat exports into Pandas DataFrames for message frequency, word count, and trend analysis.',
      stack: ['Python', 'Streamlit', 'Pandas', 'Matplotlib'],
      link: '#',
      year: 'Aug 2023',
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
    instagram: 'https://www.instagram.com/shashii_s_a',
    medium: 'https://shashisa.medium.com/',
    codolio: "https://codolio.com/profile/shashisa",
    location: 'Dell EMC, Bangalore, Karnataka, India'
  }
};
