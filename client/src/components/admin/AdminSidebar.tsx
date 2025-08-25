"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Activity,
  Settings,
  LogOut,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Students", icon: Users, href: "/admin/students" },
  { name: "Teachers", icon: GraduationCap, href: "/admin/teachers" },
  { name: "Classes", icon: BookOpen, href: "/admin/classes" },
  { name: "Attendance", icon: CalendarCheck, href: "/admin/attendance" },
  { name: "Grades", icon: ClipboardList, href: "/admin/grades" },
  { name: "Events", icon: CalendarCheck, href: "/admin/events" },
  { name: "Activities", icon: Activity, href: "/admin/activities" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b">
        <School className="w-6 h-6" />
        <div>
          <h1 className="text-lg font-semibold">SchoolMS</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.name} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-base",
                item.name === "Dashboard" &&
                  "bg-black text-white hover:bg-black/90"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-base text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
