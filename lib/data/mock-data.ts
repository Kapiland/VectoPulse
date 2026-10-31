import { Student, Opportunity } from "@/types";

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    display_name: "Aarav Sharma",
    college: "Delhi Technological University (DTU)",
    course: "B.Tech Computer Science & Engineering, 3rd Year",
    skills: ["Python", "FastAPI", "PyTorch", "LangChain", "PostgreSQL", "Docker"],
    interests: ["Generative AI", "Agentic Systems", "Autonomous Campus Bots", "Hackathons"],
    preferred_roles: ["AI/ML Engineer", "Backend Developer"],
    experience_level: "Advanced",
    project_interests: "Building multi-agent autonomous campus bots, LLM benchmarking, and multimodal rag applications.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    display_name: "Ananya Iyer",
    college: "IIT Bombay",
    course: "B.Tech Electrical & Computer Science, 2nd Year",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Figma", "UI/UX Design"],
    interests: ["Design Systems", "Interactive Visualizations", "Frontend Architecture", "Web3 UI"],
    preferred_roles: ["Frontend Developer", "UI/UX Designer"],
    experience_level: "Intermediate",
    project_interests: "Sleek dark-mode dashboards, interactive data visualizations, and high-conversion hackathon frontends.",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    display_name: "Rohan Verma",
    college: "BITS Pilani, Goa Campus",
    course: "B.Tech Computer Science, 4th Year",
    skills: ["Docker", "Kubernetes", "Go", "AWS", "Redis", "Kafka", "Python"],
    interests: ["Distributed Systems", "Cloud Infrastructure", "DevOps", "High-Throughput APIs"],
    preferred_roles: ["DevOps Engineer", "Cloud Architect", "Backend Developer"],
    experience_level: "Advanced",
    project_interests: "High-throughput microservices, edge computing, resilient real-time streaming architectures.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    display_name: "Pooja Nair",
    college: "RV College of Engineering, Bengaluru",
    course: "B.E. Information Science, 3rd Year",
    skills: ["Flutter", "Dart", "Firebase", "Kotlin", "REST APIs", "Node.js"],
    interests: ["Mobile App Development", "HealthTech", "Campus Utilities", "FinTech"],
    preferred_roles: ["Mobile App Developer", "Full Stack Developer"],
    experience_level: "Intermediate",
    project_interests: "Offline-first mobile applications, peer-to-peer campus notes sharing, and cross-platform tools.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    display_name: "Priya Sundaram",
    college: "Anna University, Chennai",
    course: "B.Tech Artificial Intelligence & Data Science, 2nd Year",
    skills: ["Python", "TensorFlow", "Scikit-Learn", "Data Analytics", "Pandas", "SQL"],
    interests: ["Data Science", "Computer Vision", "Predictive Analytics", "Hackathons"],
    preferred_roles: ["Data Scientist", "AI/ML Engineer"],
    experience_level: "Beginner",
    project_interests: "Exploratory data analysis on Indian agricultural sensor datasets and automated medical image screening.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-sih-2026",
    title: "Smart India Hackathon (SIH) 2026 — Internal College Round",
    organization: "Ministry of Education & AICTE / DTU Innovation Cell",
    category: "Hackathons",
    description: "National premier nationwide hackathon tackling 150+ problem statements from government ministries and public sector undertakings. Top internal college teams will be nominated for the National Finale with INR 1 Lakh grand prize per theme.",
    eligibility: "Enrolled undergraduate (B.Tech/BE/BCA) and postgraduate (MCA/M.Tech) students. Mandatory 6 members per team with at least 1 female teammate.",
    required_skills: ["Next.js", "Python", "IoT", "Machine Learning", "Mobile Development"],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "DTU Campus Hub / Hybrid Online",
    registration_url: "https://sih.gov.in",
    source_type: "Official notice",
    verification_status: "Officially sourced",
    required_documents: ["College Identity Card", "HOD Endorsement Letter", "3-Slide Presentation Synopsis"],
    important_instructions: "Team roster freeze is strictly enforced at 11:59 PM. Mentors will be allocated by the university innovation center upon internal shortlisting.",
    ai_relevance_summary: "High-prestige government competition. Recommended for full-stack developers and AI enthusiasts looking for national recognition and seed grants.",
  },
  {
    id: "opp-gsoc-2026",
    title: "Google Summer of Code (GSoC) 2026 Masterclass & Mentorship",
    organization: "Google Open Source Community / Campus Developers Club",
    category: "Workshops",
    description: "Comprehensive 2-day live interactive masterclass breaking down the GSoC application process, writing standout open-source proposals, engaging with mentors from Linux Foundation, Apache, and CNCF, and getting your first PR merged.",
    eligibility: "Open to all students from all college branches and batches. Prior open-source contribution is not mandatory.",
    required_skills: ["Git", "GitHub", "Python", "Go", "JavaScript"],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Auditorium 2 & Live Stream",
    registration_url: "https://summerofcode.withgoogle.com",
    source_type: "WhatsApp forward",
    verification_status: "Officially sourced",
    required_documents: ["Laptop with Git pre-installed", "GitHub account username"],
    important_instructions: "Bring fully charged laptops. 5 selected attendees will receive dedicated 1-on-1 proposal reviews by past GSoC scholars.",
    ai_relevance_summary: "Crucial roadmap session if you aim to earn international developer credentials and competitive USD stipends in summer 2026.",
  },
  {
    id: "opp-msr-intern-2026",
    title: "AI Research Internship — Summer 2026",
    organization: "Microsoft Research India (MSR Bengaluru)",
    category: "Internships",
    description: "Hands-on undergraduate research internship embedded within the Foundation Models and Applied AI groups. Interns conduct groundbreaking research on small language models, low-resource Indian languages, and agentic workflows alongside senior principal researchers.",
    eligibility: "Pre-final year (3rd year B.Tech/Dual Degree) students in CSE, Data Science, or Mathematics with CGPA >= 8.5.",
    required_skills: ["PyTorch", "Transformers", "Python", "Linear Algebra", "NLP"],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Bengaluru, Karnataka (Stipend: ₹1,20,000/month + Housing)",
    registration_url: "https://careers.microsoft.com/students",
    source_type: "Department portal",
    verification_status: "Officially sourced",
    required_documents: ["Single Page Academic Resume", "Grade Transcript PDF", "Link to GitHub / Research Code"],
    important_instructions: "Shortlisted candidates will complete an automated algorithmic coding assessment followed by two 45-minute technical interviews.",
    ai_relevance_summary: "Top-tier research internship for students with strong mathematical rigor and ambition for graduate school or elite AI R&D roles.",
  },
  {
    id: "opp-reliance-scholarship-2026",
    title: "Reliance Foundation Undergraduate Scholarship 2026",
    organization: "Reliance Foundation",
    category: "Scholarships",
    description: "India's premier merit-cum-means scholarship supporting 5,000 undergraduate scholars with financial grants up to INR 2 Lakhs over their degree course, coupled with leadership masterclasses and alumni networks.",
    eligibility: "First-year full-time undergraduate students enrolled in recognized Indian colleges. Minimum 60% in Class 12. Annual household income < INR 15 Lakhs.",
    required_skills: ["Academic Excellence", "Leadership Aptitude", "Community Service"],
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Online Portal Submission",
    registration_url: "https://reliancefoundation.org/scholarships",
    source_type: "Poster scan",
    verification_status: "Officially sourced",
    required_documents: ["Class 10 & 12 Marksheets", "Government Income Certificate", "Bonafide College Enrollment Letter"],
    important_instructions: "Application includes a mandatory 60-question online aptitude test covering critical reasoning and verbal comprehension.",
    ai_relevance_summary: "High-value financial support designed to alleviate degree tuition burden for high-achieving engineering and science scholars.",
  },
  {
    id: "opp-hacknitr-2026",
    title: "HackNITR 6.0 — Eastern India's Largest Student Hackathon",
    organization: "NIT Rourkela Open Source Community",
    category: "Hackathons",
    description: "36-hour in-person hackathon bringing together 1,000+ developers, designers, and innovators. Tracks include AI for Bharat, Decentralized Finance, Climate Tech, and Open Innovation with prize pool exceeding INR 5,00,000.",
    eligibility: "Open to all enrolled university students across India. Teams of 2 to 4 members.",
    required_skills: ["Next.js", "Solidity", "FastAPI", "React Native", "UI/UX Design"],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: "NIT Rourkela Campus, Odisha (Travel reimbursements for top teams)",
    registration_url: "https://hacknitr.com",
    source_type: "User submitted",
    verification_status: "User submitted",
    required_documents: ["College Photo ID Card", "Government Aadhar or Voter ID"],
    important_instructions: "Free food, high-speed WiFi, sleeping pods, and swag bags provided for all 36 hours. Inter-college teams are fully permitted.",
    ai_relevance_summary: "Exceptional weekend hackathon for building real product prototypes with high energy, industry sponsors, and developer networking.",
  },
  {
    id: "opp-cyber-ctf-2026",
    title: "National Cyber Defense Capture The Flag (CTF) Challenge",
    organization: "Data Security Council of India (DSCI)",
    category: "Competitions",
    description: "National jeopardy-style cybersecurity tournament challenging students on real-world vulnerability exploitation, web application testing, digital forensics, and binary reverse engineering.",
    eligibility: "Teams of 2 to 3 college students. Open to all years.",
    required_skills: ["Linux", "Cryptography", "Reverse Engineering", "Burp Suite", "Python"],
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    event_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Online Virtual Arena",
    registration_url: "https://dsci.in/ctf-2026",
    source_type: "WhatsApp forward",
    verification_status: "Unverified",
    required_documents: ["Student College ID"],
    important_instructions: "Automated anti-cheat log analysis will flag simultaneous team logins from divergent IP addresses.",
    ai_relevance_summary: "Ideal for security researchers and ethical hackers aiming to build an indisputable offensive security portfolio.",
  },
];

export const DEMO_NOTICES = {
  hackathon: {
    title: "DevSprint 2026 — Pan-India College Hackathon",
    text: `*DEVEVENTS ANNOUNCEMENT // URGENT FORWARD*
🚀 DevSprint 2026 - National 24-Hour AI Hackathon
Organized by: IEEE Student Branch & Tech Council, IIT Delhi
Date of Event: November 28-29, 2026
Registration Deadline: November 15, 2026 at 11:59 PM IST
Format: Hybrid (IIT Delhi Campus / Online Discord Stream)
Prize Pool: ₹3,50,000 + Cloud Credits & Direct Internship Interviews

Eligibility:
- All undergraduate & postgraduate engineering students (1st to 4th year)
- Team size: 2 to 4 members (inter-college teams warmly welcomed!)
- Valid college ID card required during check-in

Key Tracks:
1. Agentic AI & Multimodal Intelligence (Next.js, Python, LangChain, PyTorch)
2. FinTech for Bharat (UPI, Offline Micro-payments)
3. Open Innovation & Green Tech

Registration Link: https://devsprint2026.devfolio.co
Documents: Student ID, GitHub handles of all team members.
Note: Free meals and hacker kits for offline participants!`,
    sourceType: "WhatsApp forward" as const,
  },
  internship: {
    title: "Summer 2026 Software Engineering Intern Circular",
    text: `DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
CIRCULAR NO: CSE/PL/2026/088
Dated: October 2026

Subject: On-Campus Internship Drive — Zomato Technologies (Gurugram)

Applications are invited from 3rd-year B.Tech (CSE/IT/ECE) and 1st-year MCA students for 2-month summer internship positions (May-July 2026).

Eligibility Criteria:
- Minimum CGPA of 7.5 throughout without active backlogs.
- Strong proficiency in Data Structures, Algorithms, TypeScript, Node.js or Go, and SQL databases.
- Prior project experience in backend engineering or distributed systems will be an added advantage.

Stipend: ₹75,000 per month + free meal benefits at office.
Work Location: Zomato HQ, Gurugram (In-office).

Timeline:
- Portal Open Date: Immediate
- Application Last Date: November 10, 2026 (5:00 PM Sharp)
- Online Coding Test: November 14, 2026 (HackerRank)

Registration Link: https://careers.zomato.com/internships/university-2026
Required Documents: Resume (PDF max 2MB), College Transcript.
Instructions: Submit before the deadline. Late applications will not be processed by the training and placement cell.`,
    sourceType: "Official notice" as const,
  },
  workshop: {
    title: "Mastering Cloud Native & Kubernetes Workshop",
    text: `📢 CAMPUS GDG & LINUX USER GROUP NOTICE
Title: Hands-On Docker & Kubernetes Workshop
Organized by: Google Developer Groups On Campus
Venue: Central Computer Lab 3 & Google Meet
Date: Saturday, November 8, 2026 (10 AM to 4 PM)
Registration Deadline: November 6, 2026

Eligibility: Open to all semesters. Basic familiarity with terminal/command line recommended.
Requirements: Bring personal laptop with Docker Desktop installed.
Registration Form: https://gdg.community.dev/events/details/campus-k8s-2026
Cost: 100% Free for college students. E-Certificates will be issued to active participants.`,
    sourceType: "Poster scan" as const,
  },
};
