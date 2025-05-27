'use client'
import React, { useEffect, useState } from "react";

function MyForm() {
    const [taskDescription, setTaskDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('form submitted with:', taskDescription);
        
        if (!taskDescription.trim()) {
            alert('Error: taskDescription is empty.');
            return;
        }
        await fetch('api/test_table', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({taskDescription}),
        });
        // Reset form 
        setTaskDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Task Description: </label>
                <input 
                    type="text" 
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                />
            <br />
            <button type='submit'>Submit Form</button>
        </form>
    );
}

export default MyForm;