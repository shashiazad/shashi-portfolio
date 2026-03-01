export const profile = {
  name: 'Shashi Shekhar Azad',
  title: 'Software Engineer II',
  company: 'Dell Technologies',
  company_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Dell_Technologies_logo.svg',
  photo: '/profile.jpg',

  summary: `Software Development Engineer with experience building backend microservices using Java, Spring Boot, and Go. Skilled in designing RESTful APIs, deploying containerized applications with Docker and Kubernetes, and working within Agile teams. Exposure to Generative AI, Agentic AI, and prompt engineering. Strong foundation in Data Structures and Algorithms and Operating Systems.`,

  education: [
    {
      degree: 'Master of Technology in Computer Science and Engineering',
      school: 'Dr. B R Ambedkar National Institute of Technology Jalandhar',
      period: 'Aug 2023 – Jun 2025',
      grade: 'CGPA: 8.18/10.0',
      location: 'Jalandhar, Punjab',
      link: 'https://www.nitj.ac.in/'
    },
    {
      degree: 'Bachelor of Technology in Computer Science and Engineering',
      school: 'Kashi Institute of Technology Varanasi',
      period: 'Nov 2020 – Jun 2023',
      grade: 'CGPA: 7.78/10.0',
      location: 'Varanasi, Uttar Pradesh',
      link: 'https://www.aktu.ac.in/'
    }
  ],

  bio: `Software engineer with expertise in cloud-native architectures, microservices development, and automation. Skilled in building scalable backend systems using Java, Spring Boot, and Go, with a strong focus on secure communication, API design, and workflow optimization through scripting.

Proficient in developing REST APIs, implementing system validation checks, and creating solutions that enhance reliability and reduce deployment risks. Experienced in designing reusable processes and documentation to improve efficiency and streamline complex operations.

Combining advanced academic training in Computer Science & Engineering with hands-on experience, the focus is on delivering secure, scalable, and future-ready solutions that simplify infrastructure and drive operational excellence.`,

  skills: {
    languages: ['Java', 'Go', 'Python', 'C/C++'],
    backend: ['Spring Boot', 'RESTful APIs', 'Microservices Architecture'],
    frontend: ['React.js', 'Streamlit', 'HTML/CSS'],
    databases: ['MySQL', 'SQL Server', 'Oracle', 'H2'],
    devops: ['Docker', 'Kubernetes', 'Linux', 'Shell Scripting', 'Git', 'GitHub', 'NGINX', 'Postman', 'Agile'],
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
        'Engineered end-to-end Nutanix cluster deployment workflows for Dell Private Cloud (DPC) using Java and Spring Boot microservices, achieving stable production rollouts across multiple release cycles.',
        'Built multiple RESTful APIs for infrastructure validation, configuration retrieval, and cluster provisioning, reducing manual checks and strengthening backend automation.',
        'Developed automated deployment prechecks and validation modules to verify cluster readiness, reducing deployment failures and rollback incidents.',
      ]
    },
    {
      role: 'Software Engineer Intern',
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
        'Optimized SQL queries and stored procedures in SQL Server, improving database response time by 20%.',
      ]
    }
  ],

  projects: [
    {
      name: 'AI PR Reviewer',
      summary: 'Built an agentic AI code review system using a LangGraph StateGraph-orchestrated multi-agent pipeline (Planner, Reviewer, Critic, Commenter) with typed state, conditional routing, and per-node retry to parse diffs, run static checks, and post inline feedback via Gemini and LangChain. Implemented anti-hallucination prompt contracts, issue deduplication, severity-based budgeting, and REQUEST_CHANGES merge gating with resilient fallback paths for LLM failures; automated via GitHub Actions.',
      stack: ['Python', 'LangGraph', 'LangChain', 'Google Gemini API', 'GitHub Actions'],
      link: 'https://github.com/shashiazad/ai-pr-reviewer',
      year: '2025',
    },
    {
      name: 'TeleMock – Secure Telemetry Pipeline Simulator',
      summary: 'Architected a telemetry data pipeline using Python clients and Spring Boot RESTful microservices for real-time data streaming and validation across distributed services. Configured NGINX reverse proxy with mTLS and built a React.js dashboard with H2 in-memory database for real-time telemetry visualization.',
      stack: ['Spring Boot', 'Python', 'React', 'NGINX', 'mTLS', 'Docker'],
      link: 'https://github.com/shashiazad/idrac',
      year: 'Aug – Nov 2024',
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
    codolio: "https://codolio.com/profile/shashisa",
    location: 'Dell EMC, Bangalore, Karnataka, India'
  }
};
