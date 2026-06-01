import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Public + auth load eagerly (first paint)
import Landing from "./pages/public/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard pages are code-split — loaded on demand per role
const StudentOverview = lazy(() => import("./pages/student/Overview"));
const AIChecker = lazy(() => import("./pages/student/AIChecker"));
// const StudentTests = lazy(() => import("./pages/student/Tests"));
// const StudentVocabulary = lazy(() => import("./pages/student/Vocabulary"));
// const StudentSpeaking = lazy(() => import("./pages/student/Speaking"));  
// const StudentProgress = lazy(() => import("./pages/student/Progress"));
// const StudentHomework = lazy(() => import("./pages/student/Homework"));
// const StudentLeaderboard = lazy(() => import("./pages/student/Leaderboard"));
const StudentProfile = lazy(() => import("./pages/student/Profile"));

const TeacherStudents = lazy(() => import("./pages/teacher/Students"));
const TeacherGroups = lazy(() => import("./pages/teacher/Groups"));
const TeacherEssays = lazy(() => import("./pages/teacher/Essays"));
// const TeacherAssignments = lazy(() => import("./pages/teacher/Assignments"));
// const TeacherStatistics = lazy(() => import("./pages/teacher/Statistics"));
// const TeacherMessages = lazy(() => import("./pages/teacher/Messages"));
// const TeacherAttendance = lazy(() => import("./pages/teacher/Attendance"));

const ManagerAnalytics = lazy(() => import("./pages/manager/Analytics"));
const ManagerTeachers = lazy(() => import("./pages/manager/Teachers"));
const ManagerGroups = lazy(() => import("./pages/manager/Groups"));
const ManagerPayments = lazy(() => import("./pages/manager/Payments"));
const ManagerCourses = lazy(() => import("./pages/manager/Courses"));
const ManagerReports = lazy(() => import("./pages/manager/Reports"));

const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminRoles = lazy(() => import("./pages/admin/Roles"));
const AdminPermissions = lazy(() => import("./pages/admin/Permissions"));
const AdminAISettings = lazy(() => import("./pages/admin/AISettings"));
const AdminSubscription = lazy(() => import("./pages/admin/Subscription"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminDatabase = lazy(() => import("./pages/admin/Database"));
const AdminLogs = lazy(() => import("./pages/admin/Logs"));
const AdminApiManagement = lazy(() => import("./pages/admin/ApiManagement"));

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/30 border-t-primary-500" />
        <span className="text-sm text-white/40">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  useTheme(); // applies dark/light class to <html>

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------- Student ---------- */}
        <Route
          path="/app"
          element={
            <ProtectedRoute roles={["student"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/overview" replace />} />
          <Route path="overview" element={<StudentOverview />} />
          <Route path="ai-checker" element={<AIChecker />} />
          {/* <Route path="tests" element={<StudentTests />} /> */}
          {/* <Route path="vocabulary" element={<StudentVocabulary />} /> */}
          {/* <Route path="speaking" element={<StudentSpeaking />} /> */}
          {/* <Route path="progress" element={<StudentProgress />} /> */}
          {/* <Route path="homework" element={<StudentHomework />} /> */}
          {/* <Route path="leaderboard" element={<StudentLeaderboard />} /> */}
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* ---------- Teacher ---------- */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/teacher/students" replace />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="groups" element={<TeacherGroups />} />
          <Route path="essays" element={<TeacherEssays />} />
          {/* <Route path="assignments" element={<TeacherAssignments />} /> */}
          {/* <Route path="statistics" element={<TeacherStatistics />} /> */}
          {/* <Route path="messages" element={<TeacherMessages />} /> */}
          {/* <Route path="attendance" element={<TeacherAttendance />} /> */}
        </Route>

        {/* ---------- Manager ---------- */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["manager", "center"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/manager/analytics" replace />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
          <Route path="teachers" element={<ManagerTeachers />} />
          <Route path="groups" element={<ManagerGroups />} />
          <Route path="payments" element={<ManagerPayments />} />
          <Route path="courses" element={<ManagerCourses />} />
          <Route path="reports" element={<ManagerReports />} />
        </Route>

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="ai-settings" element={<AdminAISettings />} />
          <Route path="subscription" element={<AdminSubscription />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="database" element={<AdminDatabase />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="api" element={<AdminApiManagement />} />
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
