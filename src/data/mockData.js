// ============================================================
// ZUKKO AI — Mock data layer
// In production this would come from the API (React Query + Axios)
// ============================================================

export const DEMO_USERS = [
  { id: "u1", fullname: "Aziza Karimova", email: "student@zukko.ai", password: "1234", role: "student", avatar: "AK", band: 6.5, group: "IELTS-Intensive-A" },
  { id: "u2", fullname: "Bekzod Tursunov", email: "teacher@zukko.ai", password: "1234", role: "teacher", avatar: "BT" },
  { id: "u3", fullname: "Dilnoza Yusupova", email: "manager@zukko.ai", password: "1234", role: "manager", avatar: "DY" },
  { id: "u4", fullname: "System Admin", email: "admin@zukko.ai", password: "1234", role: "admin", avatar: "SA" },
];

export const ROLE_HOME = {
  student: "/app/overview",
  teacher: "/teacher/students",
  manager: "/manager/analytics",
  admin: "/admin/users",
};

// ---------- Student data ----------
export const progressData = [
  { month: "Jan", band: 5.0, target: 7 },
  { month: "Feb", band: 5.5, target: 7 },
  { month: "Mar", band: 5.5, target: 7 },
  { month: "Apr", band: 6.0, target: 7 },
  { month: "May", band: 6.5, target: 7 },
  { month: "Jun", band: 6.5, target: 7 },
];

export const skillRadar = [
  { skill: "Grammar", score: 78 },
  { skill: "Vocabulary", score: 65 },
  { skill: "Coherence", score: 72 },
  { skill: "Task", score: 80 },
  { skill: "Speaking", score: 60 },
  { skill: "Listening", score: 85 },
];

export const weeklyActivity = [
  { day: "Mon", essays: 2, tests: 1, minutes: 45 },
  { day: "Tue", essays: 1, tests: 2, minutes: 60 },
  { day: "Wed", essays: 3, tests: 0, minutes: 30 },
  { day: "Thu", essays: 0, tests: 1, minutes: 25 },
  { day: "Fri", essays: 2, tests: 2, minutes: 70 },
  { day: "Sat", essays: 1, tests: 1, minutes: 40 },
  { day: "Sun", essays: 0, tests: 0, minutes: 0 },
];

export const recentEssays = [
  { id: "e1", title: "Some people think technology makes life complex", band: 6.5, date: "2 days ago", status: "checked", words: 287 },
  { id: "e2", title: "Advantages and disadvantages of remote work", band: 6.0, date: "5 days ago", status: "checked", words: 264 },
  { id: "e3", title: "Government should fund arts over sports", band: 7.0, date: "1 week ago", status: "checked", words: 301 },
  { id: "e4", title: "The impact of social media on society", band: null, date: "Just now", status: "pending", words: 245 },
];

export const homeworkList = [
  { id: "h1", title: "Writing Task 2 — Opinion Essay", due: "Tomorrow", status: "pending", teacher: "Bekzod T.", type: "writing" },
  { id: "h2", title: "Cambridge Test 12 — Reading", due: "in 3 days", status: "pending", teacher: "Bekzod T.", type: "reading" },
  { id: "h3", title: "Vocabulary Set: Environment", due: "Yesterday", status: "overdue", teacher: "Bekzod T.", type: "vocabulary" },
  { id: "h4", title: "Speaking Part 2 — Describe a person", due: "Completed", status: "done", teacher: "Bekzod T.", type: "speaking" },
];

export const leaderboard = [
  { rank: 1, name: "Sardor M.", points: 4820, band: 7.5, avatar: "SM", trend: "up" },
  { rank: 2, name: "Nilufar A.", points: 4610, band: 7.5, avatar: "NA", trend: "up" },
  { rank: 3, name: "Jasur K.", points: 4390, band: 7.0, avatar: "JK", trend: "down" },
  { rank: 4, name: "Aziza Karimova", points: 4120, band: 6.5, avatar: "AK", trend: "up", me: true },
  { rank: 5, name: "Otabek R.", points: 3980, band: 6.5, avatar: "OR", trend: "same" },
  { rank: 6, name: "Malika S.", points: 3750, band: 6.0, avatar: "MS", trend: "down" },
  { rank: 7, name: "Davron T.", points: 3540, band: 6.0, avatar: "DT", trend: "up" },
];

export const vocabularyWords = [
  { word: "ubiquitous", meaning: "present everywhere", level: "C1", learned: true, example: "Smartphones are ubiquitous in modern society." },
  { word: "mitigate", meaning: "make less severe", level: "C1", learned: true, example: "Measures to mitigate climate change." },
  { word: "proliferate", meaning: "increase rapidly", level: "C1", learned: false, example: "Online courses have proliferated recently." },
  { word: "discern", meaning: "perceive or recognize", level: "B2", learned: true, example: "It is hard to discern the difference." },
  { word: "alleviate", meaning: "make suffering less", level: "C1", learned: false, example: "The medicine alleviates the pain." },
  { word: "tangible", meaning: "perceptible by touch", level: "B2", learned: false, example: "Tangible benefits for the economy." },
];

export const tests = [
  { id: "t1", title: "IELTS Academic Full Test", type: "Full", questions: 40, duration: 60, difficulty: "Hard", taken: 234, color: "primary" },
  { id: "t2", title: "Reading Practice — Set 8", type: "Reading", questions: 13, duration: 20, difficulty: "Medium", taken: 512, color: "secondary" },
  { id: "t3", title: "Listening Section 1-4", type: "Listening", questions: 40, duration: 30, difficulty: "Medium", taken: 389, color: "primary" },
  { id: "t4", title: "Grammar Diagnostic", type: "Grammar", questions: 25, duration: 15, difficulty: "Easy", taken: 678, color: "secondary" },
  { id: "t5", title: "Writing Task 1 — Charts", type: "Writing", questions: 1, duration: 20, difficulty: "Hard", taken: 156, color: "primary" },
  { id: "t6", title: "Vocabulary Challenge", type: "Vocabulary", questions: 30, duration: 12, difficulty: "Easy", taken: 723, color: "secondary" },
];

// Sample quiz used in the interactive test runner
export const sampleQuiz = {
  title: "Grammar Diagnostic",
  questions: [
    {
      q: "Choose the correct form: 'By next year, she ___ in London for a decade.'",
      options: ["will live", "will have lived", "lives", "is living"],
      answer: 1,
    },
    {
      q: "Select the most academic synonym for 'big': ",
      options: ["huge", "substantial", "massive", "great"],
      answer: 1,
    },
    {
      q: "Identify the error: 'Neither of the students were present.'",
      options: ["Neither", "were", "students", "no error"],
      answer: 1,
    },
    {
      q: "Which is a complex sentence?",
      options: [
        "I went home.",
        "I went home and slept.",
        "Although it rained, we went out.",
        "Rain. Then sun.",
      ],
      answer: 2,
    },
    {
      q: "Pick the correct collocation: '___ a decision'",
      options: ["do", "make", "take", "have"],
      answer: 1,
    },
  ],
};

export const speakingTasks = [
  { id: "s1", part: "Part 1", title: "Introduction & Interview", duration: "4-5 min", topics: ["Home", "Work", "Hobbies"], status: "available" },
  { id: "s2", part: "Part 2", title: "Cue Card — Long Turn", duration: "3-4 min", topics: ["Describe a place"], status: "available" },
  { id: "s3", part: "Part 3", title: "Discussion", duration: "4-5 min", topics: ["Society", "Technology"], status: "locked" },
];

// ---------- Teacher data ----------
export const teacherStudents = [
  { id: "ts1", name: "Aziza Karimova", group: "IELTS-A", band: 6.5, attendance: 94, essays: 12, lastActive: "2h ago", avatar: "AK", status: "active" },
  { id: "ts2", name: "Sardor Mahmudov", group: "IELTS-A", band: 7.5, attendance: 98, essays: 18, lastActive: "1h ago", avatar: "SM", status: "active" },
  { id: "ts3", name: "Nilufar Abdullaeva", group: "IELTS-B", band: 7.5, attendance: 91, essays: 15, lastActive: "30m ago", avatar: "NA", status: "active" },
  { id: "ts4", name: "Jasur Komilov", group: "IELTS-A", band: 7.0, attendance: 85, essays: 9, lastActive: "1d ago", avatar: "JK", status: "idle" },
  { id: "ts5", name: "Malika Saidova", group: "IELTS-B", band: 6.0, attendance: 78, essays: 6, lastActive: "3d ago", avatar: "MS", status: "risk" },
  { id: "ts6", name: "Otabek Rasulov", group: "IELTS-A", band: 6.5, attendance: 88, essays: 11, lastActive: "5h ago", avatar: "OR", status: "active" },
];

export const teacherEssays = [
  { id: "te1", student: "Aziza Karimova", title: "Technology and society", submitted: "2h ago", aiBand: 6.5, status: "needs-review", words: 287 },
  { id: "te2", student: "Sardor Mahmudov", title: "Remote work pros & cons", submitted: "5h ago", aiBand: 7.5, status: "needs-review", words: 312 },
  { id: "te3", student: "Nilufar Abdullaeva", title: "Funding the arts", submitted: "1d ago", aiBand: 7.0, status: "reviewed", words: 298 },
  { id: "te4", student: "Jasur Komilov", title: "Tourism impact", submitted: "1d ago", aiBand: 6.5, status: "reviewed", words: 271 },
];

export const teacherGroups = [
  { id: "g1", name: "IELTS Intensive A", students: 14, level: "Upper-Int", avgBand: 6.8, schedule: "Mon/Wed/Fri", color: "primary" },
  { id: "g2", name: "IELTS Intensive B", students: 11, level: "Intermediate", avgBand: 6.2, schedule: "Tue/Thu/Sat", color: "secondary" },
  { id: "g3", name: "General English", students: 18, level: "Pre-Int", avgBand: null, schedule: "Mon/Wed", color: "primary" },
];

// ---------- Manager data ----------
export const revenueData = [
  { month: "Jan", revenue: 12400, students: 142 },
  { month: "Feb", revenue: 14200, students: 168 },
  { month: "Mar", revenue: 15800, students: 184 },
  { month: "Apr", revenue: 17100, students: 201 },
  { month: "May", revenue: 19600, students: 228 },
  { month: "Jun", revenue: 22300, students: 256 },
];

export const teacherPerformance = [
  { id: "tp1", name: "Bekzod Tursunov", students: 43, avgBand: 6.8, rating: 4.9, groups: 3, avatar: "BT" },
  { id: "tp2", name: "Gulnora Aliyeva", students: 38, avgBand: 6.5, rating: 4.7, groups: 3, avatar: "GA" },
  { id: "tp3", name: "Rustam Nazarov", students: 31, avgBand: 7.1, rating: 4.8, groups: 2, avatar: "RN" },
  { id: "tp4", name: "Feruza Yuldosheva", students: 29, avgBand: 6.3, rating: 4.5, groups: 2, avatar: "FY" },
];

export const courseDistribution = [
  { name: "IELTS Prep", value: 45, color: "#7C3AED" },
  { name: "General English", value: 28, color: "#06B6D4" },
  { name: "Business English", value: 17, color: "#8B5CF6" },
  { name: "Kids English", value: 10, color: "#22d3ee" },
];

export const payments = [
  { id: "p1", student: "Aziza Karimova", amount: 120, course: "IELTS Prep", status: "paid", date: "May 12" },
  { id: "p2", student: "Sardor Mahmudov", amount: 120, course: "IELTS Prep", status: "paid", date: "May 11" },
  { id: "p3", student: "Malika Saidova", amount: 90, course: "General English", status: "pending", date: "May 10" },
  { id: "p4", student: "Jasur Komilov", amount: 120, course: "IELTS Prep", status: "overdue", date: "May 1" },
  { id: "p5", student: "Otabek Rasulov", amount: 150, course: "Business English", status: "paid", date: "May 9" },
];

// ---------- Admin data ----------
export const adminUsers = [
  { id: "au1", name: "Aziza Karimova", email: "student@zukko.ai", role: "student", status: "active", joined: "Jan 2025" },
  { id: "au2", name: "Bekzod Tursunov", email: "teacher@zukko.ai", role: "teacher", status: "active", joined: "Dec 2024" },
  { id: "au3", name: "Dilnoza Yusupova", email: "manager@zukko.ai", role: "manager", status: "active", joined: "Nov 2024" },
  { id: "au4", name: "System Admin", email: "admin@zukko.ai", role: "admin", status: "active", joined: "Oct 2024" },
  { id: "au5", name: "Sardor Mahmudov", email: "sardor@zukko.ai", role: "student", status: "active", joined: "Feb 2025" },
  { id: "au6", name: "Gulnora Aliyeva", email: "gulnora@zukko.ai", role: "teacher", status: "suspended", joined: "Jan 2025" },
];

export const rolesData = [
  { id: "r1", name: "Student", users: 228, permissions: ["take_tests", "submit_essays", "view_progress"], color: "secondary" },
  { id: "r2", name: "Teacher", users: 14, permissions: ["review_essays", "create_tests", "manage_groups", "grade"], color: "primary" },
  { id: "r3", name: "Manager", users: 3, permissions: ["view_reports", "manage_teachers", "view_payments"], color: "primary" },
  { id: "r4", name: "Admin", users: 1, permissions: ["full_access", "manage_roles", "system_settings", "ai_config"], color: "secondary" },
];

export const apiKeys = [
  { id: "k1", name: "OpenAI GPT-4o", key: "sk-•••••••••••4f2a", usage: 68420, limit: 100000, status: "active" },
  { id: "k2", name: "Whisper API", key: "sk-•••••••••••9c1d", usage: 12300, limit: 50000, status: "active" },
  { id: "k3", name: "GPT-4o-mini (fallback)", key: "sk-•••••••••••7b3e", usage: 4200, limit: 200000, status: "active" },
];

export const systemLogs = [
  { id: "l1", level: "info", message: "Essay batch processed (24 essays)", time: "2 min ago", source: "ai-engine" },
  { id: "l2", level: "warning", message: "OpenAI rate limit at 68%", time: "12 min ago", source: "api-gateway" },
  { id: "l3", level: "success", message: "Daily backup completed", time: "1h ago", source: "database" },
  { id: "l4", level: "error", message: "Failed login attempt blocked", time: "2h ago", source: "auth" },
  { id: "l5", level: "info", message: "New teacher onboarded", time: "3h ago", source: "users" },
];

export const aiUsageData = [
  { name: "Essay Check", value: 4820 },
  { name: "Grammar", value: 6230 },
  { name: "Speaking", value: 2140 },
  { name: "Tutor Chat", value: 8910 },
  { name: "Vocab", value: 3450 },
];

// Pricing plans
export const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    tagline: "Try the AI essay checker",
    features: ["3 AI essay checks / month", "Basic grammar correction", "Level placement test", "Community leaderboard"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro Learner",
    price: 19,
    period: "month",
    tagline: "Serious IELTS preparation",
    features: ["Unlimited AI essay checks", "Full IELTS mock tests", "AI Speaking evaluation", "AI Tutor chat 24/7", "Detailed band breakdown", "Progress analytics"],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Academy",
    price: 49,
    period: "month",
    tagline: "For schools & teachers",
    features: ["Everything in Pro", "Teacher dashboard", "Group management", "Custom test builder", "Student analytics", "Priority support"],
    cta: "Contact Sales",
    featured: false,
  },
];

export const faqs = [
  { q: "How accurate is the AI band scoring?", a: "ZUKKO AI is calibrated against thousands of examiner-graded IELTS essays and aligns within ±0.5 of human examiners on the official band descriptors for Task Achievement, Coherence, Lexical Resource and Grammar." },
  { q: "Does the AI just give a score, or does it explain?", a: "Both. Every essay returns a band breakdown, highlighted grammar and vocabulary issues, a rewritten model answer, and actionable feedback so you understand exactly how to improve." },
  { q: "Can my school use ZUKKO AI for a whole class?", a: "Yes. The Academy plan gives teachers a full dashboard to assign homework, review essays, build custom tests and track every student's progress in one place." },
  { q: "Is my writing data private?", a: "Your essays are encrypted and never used to train third-party models. Admins control data retention and AI provider configuration at the system level." },
  { q: "Which exams are supported?", a: "We focus on IELTS Academic and General, with grammar, vocabulary and speaking modules that also help with TOEFL and general English fluency." },
];

export const testimonials = [
  { name: "Sardor M.", role: "Band 6.0 → 7.5", text: "The AI feedback caught grammar patterns my teacher missed. I improved a full band in two months.", avatar: "SM" },
  { name: "Nilufar A.", role: "University applicant", text: "Getting an instant rewritten model answer for every essay completely changed how I study writing.", avatar: "NA" },
  { name: "Mr. Bekzod", role: "IELTS Teacher", text: "I assign homework and ZUKKO pre-grades everything. I now spend my time on real feedback, not marking.", avatar: "BT" },
];
