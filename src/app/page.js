'use client'
import { useState, useEffect } from 'react';

export default function Home() {

    // State for form inputs
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [project, setProject] = useState('');
  
  // State for timesheet entries and users
  const [timesheets, setTimesheets] = useState([]);
  const [users, setUsers] = useState([]);
  // State for selected user to filter timesheets
  const [selectedUser, setSelectedUser] = useState('');

    // NocoDB API configuration
  const API_URL = 'http://localhost:8080/api/v1/db/data/v1/TimesheetApp';
  const API_TOKEN = 'UskgwD2xuVC8AyxLN8wLyt2REkDcI7H88wfyteJ5'; 

   useEffect(() => {
    // Fetch users
    fetch(`${API_URL}/Users`, {
      headers: { 'xc-token': API_TOKEN },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
      })
      .then((data) => {
        setUsers(data.list);
        if (data.list.length > 0) {
          setSelectedUser(data.list[0].Id); // Default to first user
        }
      })
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch timesheets
    fetchTimesheets();
  }, [selectedUser]);

   // Function to fetch timesheets for the selected user
  const fetchTimesheets = () => {
    if (!selectedUser) return; // Skip if no user is selected
    fetch(`${API_URL}/Timesheets?where=(UserId,eq,${selectedUser})`, {
      headers: { 'xc-token': API_TOKEN },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch timesheets');
        return response.json();
      })
      .then((data) => {
        setTimesheets(data.list);
      })
      .catch((error) => console.error('Error fetching timesheets:', error));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/Timesheets`, {
        method: 'POST',
        headers: {
          'xc-token': API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: parseInt(userId),
          Date: date,
          Hours: parseFloat(hours),
          Task: task,
        }),
      });
      if (!response.ok) throw new Error('Failed to add timesheet');
      // Clear form
      setDate('');
      setHours('');
      setTask('');
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
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.Id} value={user.Id}>
              {user.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Timesheet Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">User ID:</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
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
          <div>
            <label className="block text-sm font-medium">Task:</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
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
            <th className="border p-2">Hours</th>
            <th className="border p-2">Task</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((entry) => (
            <tr key={entry.Id}>
              <td className="border p-2">{entry.Date}</td>
              <td className="border p-2">{entry.Hours}</td>
              <td className="border p-2">{entry.Task}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}