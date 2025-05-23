import { headers } from "next/headers";

export async function POST(request) {
    console.log('API_URL:', process.env.API_URL);
    console.log('TEST_TABLE_ID:', process.env.TEST_TABLE_ID);
    console.log('API_TOKEN:', process.env.API_TOKEN);
    const body = await request.json();
    const taskDescription = body.taskDescription; 
    
    const res = await fetch(`${process.env.API_URL}${process.env.TEST_TABLE_ID}/records`,  {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'xc-token': process.env.API_TOKEN,
        },
        body: JSON.stringify({
            fields: {
                task_description: taskDescription
            }
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log('NocoDB API Error', error)
        return new Response(JSON.stringify({error}), {status:500});
    }

    const data = await res.json();
    return new Response(JSON.stringify({success: true, data}), {
        status: 200,
        headers: {'Content-Type' : 'application/json'},
    });
}
