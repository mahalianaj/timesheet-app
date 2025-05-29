'use client'
import { useEffect, useState } from "react"

export default function TimesheetTable(){
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function fetchEntries() {
            try{
                const res = await fetch('/api/entries')

                if(!res.ok) {
                    throw new Error('Failed to fetch entries');
                }

                const data = await res.json()
                console.log('Fetched entries: ', data);
                setEntries(data.list);
            } catch (error) {
                console.error('Error fetching entries: ', error);
            }
        }
        fetchEntries();
    }, []);

    const totalHours = entries.reduce((sum, row) => sum + Number(row.hours), 0);
    return(
        <table>
            <thead>
                <tr>
                    <th>Task Description</th>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Hours</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((row, index) => (
                    <tr key={index}>
                        <td>{row.taskDescription}</td>
                        <td>{row.date}</td>
                        <td>{row.project}</td>
                        <td>{row.hours}</td>

                    </tr>
                ))} 
            </tbody>
                <tfoot>
                    <tr>
                        <td className="table-buffer" colSpan={2}></td>
                        <td >Total hours</td>
                        <td>{totalHours}</td>
                    </tr>
                </tfoot>
        </table>
    )
}