function AdminDashboard() {
  return (
 
    <div className="p-4">
      {/* Attendance Filters */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Attendance Filters</h2>
        <div className="flex items-center">
          <input type="date" className="border rounded p-2" />
          <select className="border rounded p-2 ml-2">
            <option>All Grades</option>
          </select>
          <select className="border rounded p-2 ml-2">
            <option>All Classes</option>
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Students Present</h3>
          <p className="text-2xl">0</p>
          <p className="text-sm text-gray-500">0.0% attendance rate</p>
          <p className="text-red-600">0 absent</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Teachers Present</h3>
          <p className="text-2xl">0</p>
          <p className="text-sm text-gray-500">0.0% attendance rate</p>
          <p className="text-red-600">0 absent</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Active Classes</h3>
          <p className="text-2xl">24</p>
          <p className="text-sm text-gray-500">Across 4 grades</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Overall Attendance</h3>
          <p className="text-2xl">0.0%</p>
          <p className="text-green-500">Students + Teachers</p>
        </div>
      </div>

      {/* Student Attendance */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-semibold">Student Attendance</h3>
        <p>No attendance data found for selected filters</p>
      </div>

      {/* Teacher Attendance */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-semibold">Teacher Attendance by Department</h3>
        <p>No teacher attendance data found for selected date</p>
      </div>

      {/* Weekly Attendance Trends */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-semibold">Weekly Attendance Trends</h3>
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-300 flex items-center justify-center">
          <p>Chart Placeholder</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <ul className="list-disc pl-5">
          <li>Parent-Teacher Conference - 2024-08-20 at 14:00</li>
          <li>Science Fair - 2024-08-25 at 10:00</li>
          <li>Mid-term Examinations - 2024-08-30 at 09:00</li>
        </ul>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        <p>Sarah Peterson (teacher) - 2h ago</p>
      </div>
    </div>
  );
};


export default AdminDashboard;
