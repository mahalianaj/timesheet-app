'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // State for form inputs
  const [date, setDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [project, setProject] = useState('');
  const [hours, setHours] = useState('');
  // State for timesheet entries, users, and projects
  const [timesheets, setTimesheets] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  // State for selected user to filter timesheets
  const [selectedUser, setSelectedUser] = useState('');

  // NocoDB API configuration
  const API_URL = 'http://localhost:8080/api/v2/tables';
  const API_TOKEN = 'UskgwD2xuVC8AyxLN8wLyt2REkDcI7H88wfyteJ5';
  const USERS_TABLE_ID = 'mg82bki0x2boh7z';
  const TIMESHEET_TABLE_ID = 'mribzom4ybcwl4e';
  const PROJECTS_TABLE_ID = 'mbtns7shi79b4uq';

  // Fetch users and projects on component mount
  useEffect(() => {
    // Fetch users
    fetch(`${API_URL}/${USERS_TABLE_ID}/records`, {
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
      })
      .then((data) => {
        console.log('Users:', data.list); // Debug
        setUsers(data.list || []);
        if (data.list && data.list.length > 0) {
          setSelectedUser(data.list[0].user_id);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch projects
    fetch(`${API_URL}/${PROJECTS_TABLE_ID}/records`, {
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
      })
      .then((data) => {
        console.log('Projects:', data.list); // Debug
        setProjects(data.list || []);
      })
      .catch((error) => console.error('Error fetching projects:', error));

    // Fetch timesheets
    fetchTimesheets();
  }, [selectedUser]);

  // Function to fetch timesheets for the selected user
  const fetchTimesheets = () => {
    if (!selectedUser) return; // Skip if no user is selected
    fetch(`${API_URL}/${TIMESHEET_TABLE_ID}/records?where=(user_id,eq,${selectedUser})`, {
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch timesheets');
        return response.json();
      })
      .then((data) => {
        console.log('Timesheets:', data.list); // Debug
        setTimesheets(data.list || []);
      })
      .catch((error) => console.error('Error fetching timesheets:', error));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
    if (!project) {
      alert('Please select a project');
      return;
    }
    if (!date) {
      alert('Please select a date');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${TIMESHEET_TABLE_ID}/records`, {
        method: 'POST',
        headers: {
          'xc-token': API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUser),
          date: date,
          task_description: taskDescription,
          project: project,
          hours: parseFloat(hours),
        }),
      });
      if (!response.ok) throw new Error('Failed to add timesheet');
      // Clear form
      setDate('');
      setTaskDescription('');
      setProject('');
      setHours('');
      // Refresh timesheets
      fetchTimesheets();
      alert('Timesheet entry added!');
    } catch (error) {
      console.error('Error adding timesheet:', error);
      alert('Failed to add timesheet entry.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Intern Timesheet App</h1>

      {/* User Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Select User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        >
          <option value="">Select a user</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))
          ) : (
            <option value="">No users available</option>
          )}
        </select>
      </div>

      {/* Timesheet Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="2025-01-01"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Task Description:</label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Project/Team:</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            >
              <option value="">Select a project</option>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <option key={proj.project_name} value={proj.projects_formatted}>
                    {proj.projects_formatted}
                  </option>
                ))
              ) : (
                <option value="">No projects available</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Hours:</label>
            <input
              type="number"
              step="0.1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Timesheet Entry
          </button>
        </div>
      </form>

      {/* Timesheet Table */}
      <h2 className="text-xl font-semibold mb-2">Timesheet Entries</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Task Description</th>
            <th className="border p-2">Project/Team</th>
            <th className="border p-2">Hours</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((entry) => (
            <tr key={entry.entry_id}>
              <td className="border p-2">{entry.date}</td>
              <td className="border p-2">{entry.task_description}</td>
              <td className="border p-2">{entry.project}</td>
              <td className="border p-2">{entry.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}