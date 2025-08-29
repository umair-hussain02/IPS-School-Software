import { useState } from "react";
import { Eye, Edit } from "lucide-react";

export default function StudentDashboard() {
  const [students] = useState([
    {
      id: "STU001",
      name: "Emma Johnson",
      grade: "Grade 10 - A",
      email: "emmaj@email.com",
      phone: "(555) 123-4567",
      enrollment: "2024-01-15",
      status: "active",
    },
    {
      id: "STU002",
      name: "Michael Chen",
      grade: "Grade 11 - B",
      email: "michael.c@email.com",
      phone: "(555) 234-5678",
      enrollment: "2024-01-20",
      status: "active",
    },
    {
      id: "STU003",
      name: "Sarah Williams",
      grade: "Grade 9 - A",
      email: "sarah.w@email.com",
      phone: "(555) 345-6789",
      enrollment: "2024-02-01",
      status: "active",
    },
    {
      id: "STU004",
      name: "David Rodriguez",
      grade: "Grade 12 - C",
      email: "david.r@email.com",
      phone: "(555) 456-7890",
      enrollment: "2023-08-15",
      status: "inactive",
    },
    {
      id: "STU005",
      name: "Lisa Anderson",
      grade: "Grade 10 - B",
      email: "lisa.a@email.com",
      phone: "(555) 567-8901",
      enrollment: "2024-01-10",
      status: "active",
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Student Management</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2">
          + Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search students by name, email, or ID..."
          className="w-full p-2 border rounded-md mr-4"
        />
        <select className="border rounded-md p-2">
          <option>All Grades</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-base font-medium mb-3">Students ({students.length})</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Student ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Grade & Section</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Enrollment Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-2 font-semibold">{student.id}</td>
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.grade}</td>
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1">
                      📧 {student.email}
                    </span>
                    <span className="flex items-center gap-1">
                      📞 {student.phone}
                    </span>
                  </div>
                </td>
                <td className="p-2">{student.enrollment}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      student.status === "active"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  <button className="p-1 border rounded-md hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                  <button className="p-1 border rounded-md hover:bg-gray-100">
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
