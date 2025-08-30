import AdminDashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import StudentDashboard from "@/pages/student/Dashboard";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/layouts/AdminLayout";
import TeacherLayout from "@/layouts/teacherLayout";
import StudentLayout from "@/layouts/studentLayout";
import Student from "@/pages/admin/Student";
import AddStudentForm from "@/components/admin/AddStudentForm";
import Teacher from "@/pages/admin/Teacher";
import Classes from "@/pages/admin/Classes";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // Protected Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRole={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "students",
        element: <Student />,
      },
      {
        path: "students/add",
        element: <AddStudentForm />,
      },
       {
        path: "teacher",
        element: <Teacher />,
      },
       {
        path: "classes",
        element: <Classes />,
      },
    ],
  },

  {
    path: "/teacher",
    element: (
      <ProtectedRoutes allowedRole={["teacher"]}>
        <TeacherLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <TeacherDashboard />,
      },
      {
        path: "dashboard",
        element: <h2>Teacher Dashboard</h2>,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoutes allowedRole={["student"]}>
        <StudentLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
      {
        path: "dashboard",
        element: <h2>Student Dashboard</h2>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const AppRoutes = () => <RouterProvider router={routes} />;

export default AppRoutes;
