'use client'
import Header from "../components/Header";
import TimesheetTable from "../components/TimesheetTable"

export default function TimesheetPage() {
    return (
        <>
        <Header 
            b1Text={'Back to dashboard'} 
            b1Route={'/dashboard'}
            b2Text={'Log in new hours'}
            b2Route={'/form'}
            />
        <TimesheetTable/>
        </>
);
}