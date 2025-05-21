import { useState } from "react";

'use client'

export default function Home() {
    const [hours, setHours] = useState('');
    const [project, setProject] = useState('');

    const API_URL = 'http://localhost:8080/api/v2/tables';
    const API_TOKEN = 'UskgwD2xuVC8AyxLN8wLyt2REkDcI7H88wfyteJ5';

    const USERS_TABLE_ID = 'mg82bki0x2boh7z';
    const TIMESHEET_TABLE_ID = 'mribzom4ybcwl4e';
    const PROJECTS_TABLE_ID = 'mbtns7shi79b4uq';

    
    
}

