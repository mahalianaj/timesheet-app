'use client'

import React, { use, useEffect, useState } from "react";

import DateInput from "../components/DateInput";
import LongTextInput from "../components/LongTextInput";
import ProjectSelector from "../components/ProjectSelector";
import HoursInput from "../components/HoursInput";
import '../styles/form.css'
import { useRouter } from 'next/navigation';
import Header from "../components/Header";

 export default function MyForm() {
    const router = useRouter();

    const [taskDescription, setTaskDescription] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState('');

    const [projects, setProjects] = useState([]);
    let [newProject, setNewProject] = useState('');
    const [team, setTeam] = useState('');

    let [selectedProject, setSelectedProject] = useState('');
    const [customProject, setCustomProject] = useState('');

    const [formSubmitted, setFormSubmitted] = useState(false);
    
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
            setFormSubmitted(true);
            setTimeout(() => setFormSubmitted(false), 2500);

        } catch (error) {
            console.error('Error submitting form: ', error);
            alert('There was an error submitting the form. Please try again.')
        }
    };

    return (
        <div className="form-container">
            <Header 
                b1Text={'Back to dashboard'} 
                b1Route={'/dashboard'}
                b2Text={'See entries'}
                b2Route={'/table'}
                />
            <form onSubmit={handleSubmit} className="form-box">
                <h2 className="form-title">Timesheet form</h2>
                {formSubmitted && (
                    <div className="text-green-700 bg-green-100 border border-green-400 p-2 rounded mb-4 text-center">
                        Form submitted successfully!
                    </div>
                )
                }
                <DateInput date={date} setDate={setDate} />
                <br />
                <LongTextInput text={taskDescription} setText={setTaskDescription}/>
                <br />
                <ProjectSelector selectedProject={selectedProject} 
                                setSelectedProject={setSelectedProject}
                                newProject={newProject}
                                setNewProject={setNewProject}
                                team={team}
                                setTeam={setTeam}
                                projects={projects} />
                <br />
                <HoursInput hours={hours} setHours={setHours}/>
                <br />
                <button type='submit' className="form-button">Submit Form</button>
            </form>
        </div>
    );
}

