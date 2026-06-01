import {
  LayoutGrid, PenLine, FileText, BookOpen, Mic, TrendingUp, ClipboardList, Trophy, User,
  Users, FolderKanban, FileCheck2, BarChart3, MessageSquare, CalendarCheck,
  CreditCard, FileBarChart, GraduationCap, PieChart,
  Shield, KeyRound, Cpu, Database, ScrollText, Cable,
} from "lucide-react";

// Each item carries a `tKey` (i18n translation key). The `label` is kept
// as an English fallback in case a translation is missing.
export const NAV_CONFIG = {
  student: {
    title: "Student",
    titleKey: "roles.student",
    base: "/app",
    items: [
      { to: "/app/overview", label: "Overview", tKey: "sidebar.student.overview", icon: LayoutGrid },
      { to: "/app/ai-checker", label: "AI Writing Checker", tKey: "sidebar.student.aiChecker", icon: PenLine, badge: "AI" },
      // { to: "/app/tests", label: "IELTS Tests", tKey: "sidebar.student.tests", icon: FileText },
      // { to: "/app/vocabulary", label: "Vocabulary", tKey: "sidebar.student.vocabulary", icon: BookOpen },
      // { to: "/app/speaking", label: "Speaking", tKey: "sidebar.student.speaking", icon: Mic },
      // { to: "/app/progress", label: "Progress", tKey: "sidebar.student.progress", icon: TrendingUp },
      // { to: "/app/homework", label: "Homework", tKey: "sidebar.student.homework", icon: ClipboardList },
      // { to: "/app/leaderboard", label: "Leaderboard", tKey: "sidebar.student.leaderboard", icon: Trophy },
      { to: "/app/profile", label: "Profile", tKey: "sidebar.student.profile", icon: User },
    ],
  },
  teacher: {
    title: "Teacher",
    titleKey: "roles.teacher",
    base: "/teacher",
    items: [
      { to: "/teacher/students", label: "Students", tKey: "sidebar.teacher.students", icon: Users },
      { to: "/teacher/groups", label: "Groups", tKey: "sidebar.teacher.groups", icon: FolderKanban },
      { to: "/teacher/essays", label: "Essays", tKey: "sidebar.teacher.essays", icon: FileCheck2, badge: "2" },
      // { to: "/teacher/assignments", label: "Assignments", tKey: "sidebar.teacher.assignments", icon: ClipboardList },
      // { to: "/teacher/statistics", label: "Statistics", tKey: "sidebar.teacher.statistics", icon: BarChart3 },
      // { to: "/teacher/messages", label: "Messages", tKey: "sidebar.teacher.messages", icon: MessageSquare },
      // { to: "/teacher/attendance", label: "Attendance", tKey: "sidebar.teacher.attendance", icon: CalendarCheck },
    ],
  },
  manager: {
    title: "Manager",
    titleKey: "roles.manager",
    base: "/manager",
    items: [
      { to: "/manager/analytics", label: "Analytics", tKey: "sidebar.manager.analytics", icon: PieChart },
      { to: "/manager/teachers", label: "Teachers", tKey: "sidebar.manager.teachers", icon: GraduationCap },
      { to: "/manager/groups", label: "Groups", tKey: "sidebar.manager.groups", icon: FolderKanban },
      { to: "/manager/payments", label: "Payments", tKey: "sidebar.manager.payments", icon: CreditCard },
      { to: "/manager/courses", label: "Courses", tKey: "sidebar.manager.courses", icon: BookOpen },
      { to: "/manager/reports", label: "Reports", tKey: "sidebar.manager.reports", icon: FileBarChart },
    ],
  },
  admin: {
    title: "Admin",
    titleKey: "roles.admin",
    base: "/admin",
    items: [
      { to: "/admin/users", label: "Users", tKey: "sidebar.admin.users", icon: Users },
      { to: "/admin/roles", label: "Roles", tKey: "sidebar.admin.roles", icon: Shield },
      { to: "/admin/permissions", label: "Permissions", tKey: "sidebar.admin.permissions", icon: KeyRound },
      { to: "/admin/ai-settings", label: "AI Settings", tKey: "sidebar.admin.aiSettings", icon: Cpu, badge: "AI" },
      { to: "/admin/subscription", label: "Subscription", tKey: "sidebar.admin.subscription", icon: CreditCard },
      { to: "/admin/analytics", label: "Analytics", tKey: "sidebar.admin.analytics", icon: BarChart3 },
      { to: "/admin/database", label: "Database", tKey: "sidebar.admin.database", icon: Database },
      { to: "/admin/logs", label: "Logs", tKey: "sidebar.admin.logs", icon: ScrollText },
      { to: "/admin/api", label: "API Management", tKey: "sidebar.admin.api", icon: Cable },
    ],
  },
};
