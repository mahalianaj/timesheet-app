'use client'
import { isToday } from "date-fns";
import React, { use, useEffect, useState } from "react";
import './form.css'
import { connection } from "next/server";

function MyForm() {
    const [taskDescription, setTaskDescription] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState('');

    const [projects, setProjects] = useState([]);
    let [newProject, setNewProject] = useState('');
    const [team, setTeam] = useState('');

    let [selectedProject, setSelectedProject] = useState('');
    const [customProject, setCustomProject] = useState('');
    
    useEffect(() => {
        async function fetchProjects() {
            try{
                const res = await fetch('/api/projects')

                if (!res.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await res.json()
                console.log('Fetched projects:', data);
                setProjects(data.list);

            } catch (error) {
                console.error('Error fetching projects: ', error);
            }
        }
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (selectedProject === 'custom' && team && newProject) { 
                const projectRes = await fetch('api/projects', {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({team, project: newProject})
                });
                selectedProject = `${team} - ${newProject}`;
            }
            const entry = {
                taskDescription,
                hours,
                date,
                project: selectedProject
            };

            const res = await fetch('api/entries', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(entry)
            });


            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to submit form');
            }

            // Reset form fields
            setTaskDescription('');
            setHours('');
            setDate('');
            setSelectedProject('');
            setNewProject('');
            setTeam('');
            

        } catch (error) {
            console.error('Error submitting form: ', error);
            alert('There was an error submitting the form. Please try again.')
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Date: </label><br />
                    <input 
                        type="date" max={today}
                        required
                        onInvalid={(e) => e.target.setCustomValidity('Enter Date here')}
                        onInput={e => e.target.setCustomValidity('')}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
            </div>
            <br />
            <div>
                <label>Task Description: </label><br />
                    <input 
                        type="text" 
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
            </div>
            <br />
            <div>
                <label>Project: </label><br />
                    <select 
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        required>
                            <option value="" disabled>--Choose a project--</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.formatted_name}> 
                                    {p.formatted_name}
                                </option>
                            ))}
                            <option value="custom">Add new project...</option>
                    </select>
                    {selectedProject === 'custom' && (
                        <div className="doubleInputContainer">
                            <input
                                className="doubleSelection"
                                type="text"
                                required
                                placeholder="Enter new project name"
                                onInvalid={(e) => e.target.setCustomValidity('Enter Project here')}
                                onInput={(e) => e.target.setCustomValidity('')}
                                value={newProject}
                                onChange={(e) => setNewProject(e.target.value)}
                            />
                            <input
                                className="doubleSelection"
                                type="text"
                                required
                                placeholder="Enter project's associated team"
                                onInvalid={(e) => e.target.setCustomValidity('Enter Team here')}
                                onInput={(e) => e.target.setCustomValidity('')}
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                            />
                        </div>
                )}
            </div>
            <br />
            <div>
                <label>Hours: </label><br />
                    <input 
                        type="number" 
                        step={"0.5"} 
                        min={"0.5"}
                        required
                        onInvalid={(e) => e.target.setCustomValidity('Record Hours here')}
                        onInput={e => e.target.setCustomValidity('')}
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}>
                    </input>
            </div>
            <br />
            <button type='submit'>Submit Form</button>
        </form>
    );
}

export default MyForm;