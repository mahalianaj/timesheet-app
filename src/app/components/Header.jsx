'use client'

import Button from "./Button"
import '../styles/dashboard.css'

export default function Header({b1Text, b1Route, b2Text, b2Route}) {

    return(
        <>
        <div className="container">
                <Button route={b1Route} text={b1Text}/>
        
                <Button route={b2Route} text={b2Text}/>
        </div>
        </>
    )
}