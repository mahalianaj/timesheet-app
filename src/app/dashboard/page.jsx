'use client'

import Button from "../components/Button"
import '../styles/dashboard.css'

export default function Dashboard() {

    return(
        <>
        <h1 className="title">Welcome User!</h1>
        <div className="container">
                <Button route={'/form'} text={'Log new hours'}/>
        
                <Button route={'/table'} text={'View entries'}/>
        </div>
        </>
    )
}