import {
  LayoutGrid, PenLine, FileText, BookOpen, Mic, TrendingUp, ClipboardList, Trophy, User,
  Users, FolderKanban, FileCheck2, BarChart3, MessageSquare, CalendarCheck,
  CreditCard, FileBarChart, GraduationCap, PieChart,
  Shield, KeyRound, Cpu, Database, ScrollText, Cable,
} from "lucide-react";

export const NAV_CONFIG = {
  student: {
    title: "Student",
    base: "/app",
    items: [
      { to: "/app/overview", label: "Overview", icon: LayoutGrid },
      { to: "/app/ai-checker", label: "AI Writing Checker", icon: PenLine, badge: "AI" },
      { to: "/app/tests", label: "IELTS Tests", icon: FileText },
      { to: "/app/vocabulary", label: "Vocabulary", icon: BookOpen },
      { to: "/app/speaking", label: "Speaking", icon: Mic },
      { to: "/app/progress", label: "Progress", icon: TrendingUp },
      { to: "/app/homework", label: "Homework", icon: ClipboardList },
      { to: "/app/leaderboard", label: "Leaderboard", icon: Trophy },
      { to: "/app/profile", label: "Profile", icon: User },
    ],
  },
  teacher: {
    title: "Teacher",
    base: "/teacher",
    items: [
      { to: "/teacher/students", label: "Students", icon: Users },
      { to: "/teacher/groups", label: "Groups", icon: FolderKanban },
      { to: "/teacher/essays", label: "Essays", icon: FileCheck2, badge: "2" },
      { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
      { to: "/teacher/statistics", label: "Statistics", icon: BarChart3 },
      { to: "/teacher/messages", label: "Messages", icon: MessageSquare },
      { to: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
    ],
  },
  manager: {
    title: "Manager",
    base: "/manager",
    items: [
      { to: "/manager/analytics", label: "Analytics", icon: PieChart },
      { to: "/manager/teachers", label: "Teachers", icon: GraduationCap },
      { to: "/manager/groups", label: "Groups", icon: FolderKanban },
      { to: "/manager/payments", label: "Payments", icon: CreditCard },
      { to: "/manager/courses", label: "Courses", icon: BookOpen },
      { to: "/manager/reports", label: "Reports", icon: FileBarChart },
    ],
  },
  admin: {
    title: "Admin",
    base: "/admin",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/roles", label: "Roles", icon: Shield },
      { to: "/admin/permissions", label: "Permissions", icon: KeyRound },
      { to: "/admin/ai-settings", label: "AI Settings", icon: Cpu, badge: "AI" },
      { to: "/admin/subscription", label: "Subscription", icon: CreditCard },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/admin/database", label: "Database", icon: Database },
      { to: "/admin/logs", label: "Logs", icon: ScrollText },
      { to: "/admin/api", label: "API Management", icon: Cable },
    ],
  },
};
