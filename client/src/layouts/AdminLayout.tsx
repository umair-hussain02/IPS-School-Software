import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { NavItem } from "@/types/navItem.type";
import {
  Calendar,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const items: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Student",
      url: "/admin/students",
      icon: Inbox,
    },
    {
      title: "Teacher",
      url: "/admin/teacher",
      icon: Calendar,
    },
    {
      title: "Classes",
      url: "/admin/classes",
      icon: Search,
    },
    {
      title: "Attendance",
      url: "#",
      icon: Settings,
    },
    {
      title: "Grades",
      url: "#",
      icon: Settings,
    },
    {
      title: "Timetable",
      url: "#",
      icon: Settings,
    },
    {
      title: "Accounts",
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <>
      <SidebarProvider>
        <AppSidebar items={items} />
        <main className="w-full p-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default AdminLayout;
