-- ==============================================================================
-- CampusSignal AI — Supabase PostgreSQL Database Schema
-- Multi-college ready architecture with RLS policies and realistic seed data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL DEFAULT 'Delhi Technological University',
    course VARCHAR(255) NOT NULL DEFAULT 'B.Tech Computer Science & Engineering',
    skills TEXT[] NOT NULL DEFAULT '{}',
    interests TEXT[] NOT NULL DEFAULT '{}',
    preferred_roles TEXT[] NOT NULL DEFAULT '{}',
    experience_level VARCHAR(50) NOT NULL DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
    project_interests TEXT DEFAULT 'AI/ML products, Full-Stack applications, Hackathons',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Hackathons', 'Internships', 'Workshops', 'Scholarships', 'Competitions', 'Campus events', 'Tech conferences'
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    deadline TIMESTAMPTZ NOT NULL,
    event_date TIMESTAMPTZ,
    location VARCHAR(255) NOT NULL DEFAULT 'Online',
    registration_url TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL DEFAULT 'WhatsApp forward', -- 'Official notice', 'WhatsApp forward', 'Poster scan', 'Department portal'
    verification_status VARCHAR(100) NOT NULL DEFAULT 'User submitted', -- 'Officially sourced', 'User submitted', 'Unverified'
    required_documents TEXT[] DEFAULT '{}',
    important_instructions TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Saved Opportunities (Student application status tracker)
CREATE TABLE IF NOT EXISTS saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    application_status VARCHAR(50) NOT NULL DEFAULT 'Interested', -- 'Interested', 'Applied', 'Completed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, opportunity_id)
);

-- 4. Team Matches Table
CREATE TABLE IF NOT EXISTS team_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    matched_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    match_reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(verification_status);
CREATE INDEX IF NOT EXISTS idx_students_college ON students(college);
CREATE INDEX IF NOT EXISTS idx_saved_opps_student ON saved_opportunities(student_id);

-- Row Level Security (RLS) setup
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_matches ENABLE ROW LEVEL SECURITY;

-- Public read access policies for demo/hackathon exploration
CREATE POLICY "Public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Public insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update students" ON students FOR UPDATE USING (true);

CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Public insert opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update opportunities" ON opportunities FOR UPDATE USING (true);

CREATE POLICY "Public read saved_opportunities" ON saved_opportunities FOR SELECT USING (true);
CREATE POLICY "Public insert saved_opportunities" ON saved_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update saved_opportunities" ON saved_opportunities FOR UPDATE USING (true);
CREATE POLICY "Public delete saved_opportunities" ON saved_opportunities FOR DELETE USING (true);

CREATE POLICY "Public read team_matches" ON team_matches FOR SELECT USING (true);
CREATE POLICY "Public insert team_matches" ON team_matches FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- SEED DATA (Realistic Indian Campus Opportunities & Demo Profiles)
-- ==============================================================================

-- Demo Students
INSERT INTO students (id, display_name, college, course, skills, interests, preferred_roles, experience_level, project_interests)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'Delhi Technological University', 'B.Tech CSE, 3rd Year', ARRAY['Python', 'FastAPI', 'PyTorch', 'LangChain', 'PostgreSQL'], ARRAY['Generative AI', 'Agentic Workflows', 'Computer Vision'], ARRAY['AI/ML Engineer', 'Backend Developer'], 'Advanced', 'AI agents for education, autonomous campus bots, LLM benchmarking'),
    ('22222222-2222-2222-2222-222222222222', 'Ananya Iyer', 'IIT Bombay', 'B.Tech Electrical & CS, 2nd Year', ARRAY['React', 'Next.js', 'Tailwind CSS', 'Figma', 'TypeScript'], ARRAY['UI/UX Design', 'Design Systems', 'Web3 Frontend'], ARRAY['Frontend Developer', 'UI/UX Designer'], 'Intermediate', 'Sleek dark-mode dashboards, interactive data visualizations, hackathon frontends'),
    ('33333333-3333-3333-3333-333333333333', 'Rohan Verma', 'BITS Pilani, Goa Campus', 'B.Tech Computer Science, 4th Year', ARRAY['Docker', 'Kubernetes', 'Go', 'AWS', 'Redis', 'Python'], ARRAY['Distributed Systems', 'Cloud Architecture', 'DevOps'], ARRAY['DevOps Engineer', 'Cloud Architect', 'Backend Developer'], 'Advanced', 'High-throughput microservices, real-time message brokers, resilient APIs'),
    ('44444444-4444-4444-4444-444444444444', 'Pooja Nair', 'RV College of Engineering, Bengaluru', 'B.E. Information Science, 3rd Year', ARRAY['Flutter', 'Dart', 'Firebase', 'Kotlin', 'REST APIs'], ARRAY['Mobile Development', 'HealthTech', 'FinTech'], ARRAY['Mobile App Developer', 'Full Stack Developer'], 'Intermediate', 'Offline-first campus utilities, student companion mobile apps')
ON CONFLICT (id) DO NOTHING;

-- Demo Opportunities
INSERT INTO opportunities (id, title, organization, category, description, eligibility, required_skills, deadline, event_date, location, registration_url, source_type, verification_status, required_documents, important_instructions)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
     'Smart India Hackathon 2026 (Internal College Round)', 
     'Ministry of Education & AICTE / DTU Innovation Cell', 
     'Hackathons', 
     'National premier hackathon tackling government problem statements across smart automation, clean energy, and healthcare. Teams of 6 with mandatory female representation.', 
     'B.Tech / MCA students of all years. Maximum 6 members per team with at least 1 female teammate.', 
     ARRAY['Next.js', 'Python', 'IoT', 'Machine Learning', 'Flutter'], 
     NOW() + INTERVAL '5 days', 
     NOW() + INTERVAL '14 days', 
     'DTU Campus Hub / Hybrid', 
     'https://sih.gov.in', 
     'Official notice', 
     'Officially sourced', 
     ARRAY['College ID Card', 'NOC from HOD', 'Team Synopsis PDF'], 
     'Strict team lock deadline at 11:59 PM. Teams must present a 3-minute pitch to the college jury.'),

    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
     'Google Summer of Code (GSoC) 2026 Orientation & Mentorship', 
     'Google Open Source / Campus Open Source Club', 
     'Workshops', 
     'Hands-on workshop on navigating open-source organizations, writing winning proposals, and contributing to CNCF, Linux Foundation, and Apache software projects.', 
     'Open to all enrolled university students in India. Beginner friendly.', 
     ARRAY['Git', 'GitHub', 'Python', 'Go', 'JavaScript'], 
     NOW() + INTERVAL '2 days', 
     NOW() + INTERVAL '3 days', 
     'Auditorium 2 & YouTube Live', 
     'https://summerofcode.withgoogle.com', 
     'WhatsApp forward', 
     'Officially sourced', 
     ARRAY['Laptop', 'GitHub account created prior to session'], 
     'Bring fully charged laptops. Installation of Git is prerequisite.'),

    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 
     'AI Research Internship — Summer 2026', 
     'Microsoft Research India (MSR Bengaluru)', 
     'Internships', 
     'Undergraduate research internship working on multimodal foundation models, low-resource Indian languages, and agentic reasoning systems with leading scientists.', 
     'Pre-final year (3rd year B.Tech/Dual Degree) students in CSE, Data Science, or Mathematics with CGPA >= 8.5.', 
     ARRAY['PyTorch', 'Transformers', 'Linear Algebra', 'Python', 'NLP'], 
     NOW() + INTERVAL '12 days', 
     NOW() + INTERVAL '60 days', 
     'Bengaluru (Hybrid stipend provided)', 
     'https://careers.microsoft.com/students', 
     'Department portal', 
     'Officially sourced', 
     ARRAY['Updated Resume (PDF)', 'Latest Grade Transcript', 'GitHub Profile'], 
     'Shortlisted applicants will undergo an algorithmic coding round followed by 2 technical interviews.'),

    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 
     'Reliance Foundation Undergraduate Scholarship 2026', 
     'Reliance Foundation', 
     'Scholarships', 
     'Merit-cum-means scholarship providing up to INR 2 Lakhs over the duration of degree study for outstanding undergraduate scholars across technical disciplines.', 
     'First-year undergraduate students enrolled in full-time degree programs. Minimum 60% in Class 12. Household income < INR 15 LPA.', 
     ARRAY['Academic Excellence', 'Leadership', 'Extracurriculars'], 
     NOW() + INTERVAL '9 days', 
     NOW() + INTERVAL '30 days', 
     'Online Application', 
     'https://reliancefoundation.org/scholarships', 
     'Poster scan', 
     'Officially sourced', 
     ARRAY['Class 12 Marksheet', 'Income Certificate', 'Bonafide Student Certificate'], 
     'Includes a mandatory 30-minute online cognitive test upon application receipt.'),

    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 
     'HackNITR 6.0 — Eastern India''s Largest Student Hackathon', 
     'NIT Rourkela Open Source Community', 
     'Hackathons', 
     '36-hour in-person hackathon bringing together 1,000+ developers to build innovative solutions across FinTech, Web3, HealthTech, and AI for Social Good.', 
     'All undergraduate & postgraduate college students with valid student ID.', 
     ARRAY['Full Stack', 'Web3', 'AI/ML', 'Mobile Dev', 'UI/UX'], 
     NOW() + INTERVAL '7 days', 
     NOW() + INTERVAL '21 days', 
     'NIT Rourkela Campus & Online Track', 
     'https://hacknitr.com', 
     'User submitted', 
     'User submitted', 
     ARRAY['College ID', 'Government ID Proof'], 
     'Free travel reimbursement for top 20 shortlisted teams. Free food and stay during the 36 hours.'),

    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 
     'National Cyber Defense CTF Competition', 
     'Data Security Council of India (DSCI)', 
     'Competitions', 
     'Jeopardy style capture the flag competition focusing on reverse engineering, web exploitation, digital forensics, and binary cryptography.', 
     'Teams of up to 3 college students.', 
     ARRAY['Cryptography', 'Linux', 'Reverse Engineering', 'Burp Suite', 'Python'], 
     NOW() + INTERVAL '18 days', 
     NOW() + INTERVAL '25 days', 
     'Online Virtual Arena', 
     'https://dsci.in/ctf-2026', 
     'WhatsApp forward', 
     'Unverified', 
     ARRAY['Student ID Cards'], 
     'Strict anti-collusion monitoring with automated log telemetry.')
ON CONFLICT (id) DO NOTHING;
