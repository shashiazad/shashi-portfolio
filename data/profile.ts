import { link } from "fs";

export const profile = {
  name: 'Shashi Shekhar Azad',
  title: 'Software Engineer II',
  company: 'Dell Technologies',
  company_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Dell_Technologies_logo.svg',
  photo: '/profile.jpg',
  education: [
    {
      degree: 'Master of Technology (M.Tech), Computer Science and Engineering',
      school: 'Dr. B.R. Ambedkar National Institute of Technology, Jalandhar',
      link: 'https://www.nitj.ac.in/'
    },
    {
      degree: 'Bachelor of Technology (B.Tech), Computer Science and Engineering',
      school: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow',
      link: 'https://www.aktu.ac.in/'
    },
    {
      degree: 'Dimploma in Engineering, Computer Science and Engineering',
      school: 'Government Polytechnic, Mau',
      link: 'https://www.gpmau.com/'
    }
  ],
  bio: `Software engineer with expertise in cloud-native architectures, microservices development, and automation. Skilled in building scalable backend systems using Java, Spring Boot, and Go, with a strong focus on secure communication, API design, and workflow optimization through scripting.
  
  Proficient in developing REST APIs, implementing system validation checks, and creating solutions that enhance reliability and reduce deployment risks. Experienced in designing reusable processes and documentation to improve efficiency and streamline complex operations.
  
  Combining advanced academic training in Computer Science & Engineering with hands-on experience, the focus is on delivering secure, scalable, and future-ready solutions that simplify infrastructure and drive operational excellence.`,
  skills: {
    languages: ['Java', 'Go', 'JavaScript', 'Shell'],
    backend: ['Spring Boot', 'REST APIs', 'OpenAPI'],
    frontend: ['React.js', 'HTML', 'CSS'],
    tools: ['Git', 'Docker', 'Shell scripting'],
    databases: ['MS SQL Server', 'PostgreSQL']
  },
  
experience: [
    {
      role: "Software Engineer II",
      company: "Dell Technologies",
      period: "Jul 2025 – Present",
      location: "Bengaluru, Karnataka, India",
      bullets: [
        "Develop and maintain microservices for the Dell Automation Platform (DAP) using Java, Spring Boot, and Go",
        "Automate DAP/microservice tasks with shell scripting to improve operational efficiency and reduce repetitive workloads",
        "Focus on backend service orchestration, integration, and secure service communication within a microservices architecture"
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "Dell Technologies",
      period: "Jul 2024 – May 2025",
      location: "Bengaluru, Karnataka, India",
      bullets: [
        "Developed Spring Boot microservices with secure inter‑service communication using IAM and mutual TLS (mTLS)",
        "Collaborated with teams to integrate services into existing architecture; streamlined deployment with DevOps tooling"
      ]
    },
    {
      role: "Trainee Technical (Technical Consultant)",
      company: "Acxiom Consulting Pvt. Ltd.",
      period: "Feb 2023 – Aug 2023",
      location: "Noida, Uttar Pradesh, India",
      bullets: [
        "Engineered user‑friendly UI and business logic for Dynamics 365 ERP; reduced data entry errors by ~40%",
        "Implemented queries and stored procedures to reduce response time by ~20%",
        "Guided and mentored 10+ coworkers in skills and knowledge development"
      ]
    },
    {
      role: "Teaching Assistant",
      company: "Dr B R Ambedkar National Institute of Technology, Jalandhar",
      period: "Jan 2024 – Jun 2024",
      location: "Jalandhar, Punjab, India",
      bullets: [
        "Assisted Dr. Somesula Manoj Kumar in Data Mining & Data Warehousing instruction for ~30 students, including labs"
      ]
    },
    {
      role: "Teaching Assistant",
      company: "Dr B R Ambedkar National Institute of Technology, Jalandhar",
      period: "Aug 2023 – Dec 2023",
      location: "Jalandhar, Punjab, India",
      bullets: [
        "Assisted Dr. Renu Dhir and Dr. Jagdeep Kaur for Software Engineering and Information Security courses; 50+ students"
      ]
    }
  ],

  
projects: [
    {
      name: "TeleMock – Secure Telemetry Pipeline Simulator",
      summary:
        "Built a secure telemetry pipeline that enabled reliable data streaming, validation, and real-time visualization for distributed systems.",
      stack: ["Spring Boot", "Python", "React", "NGINX", "mTLS", "Docker"],
      link: "#"
    },
    {
      name: "Ceditor – Text Editor",
      summary:
        "Basic text editor in C with essential editing features, search functionality, and syntax highlighting",
      stack: ["C Programming"],
      link: "#"
    },
    {
      name: "WhatsApp Chat Analyzer",
      summary:
        "Streamlit app to preprocess chats to Pandas DataFrame, visualize trends and counts (messages, words, notifications, media, word frequency) with Matplotlib",
      stack: ["Python", "Streamlit", "Pandas", "Matplotlib", "Machine Learning"],
      link: "#"
    }
  ],

  contact: {
    email: 'shashisa.cse@gmail.com',
    github: 'https://github.com/shashiazad',
    linkedin: 'https://www.linkedin.com/in/shashisa',
    instagram: 'https://www.instagram.com/shashii_s_a',
    codolio: "https://codolio.com/shashisa",
    location: 'Dell EMC, Bangalore, Karnataka, India'
  }
};
