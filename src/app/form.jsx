'use client'
import React, { useEffect, useState } from "react";

function MyForm() {
    const [task_description, settask_description] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('form submitted with:', task_description);
        
        if (!task_description.trim()) {
            alert('Error: task_description is empty.');
            return;
        }
        await fetch('/api/test_table', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({task_description}),
        });
        // Reset form 
        settask_description('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Task Description: </label>
                <input 
                    type="text" 
                    value={task_description}
                    onChange={(e) => settask_description(e.target.value)}
                />
            <br />
            <button type='submit'>Submit Form</button>
        </form>
    );
}

export default MyForm;