'use client'

export default function DateInput({date, setDate}) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div>
            <fieldset className="form-fieldset">
                <legend className="form-text">Date</legend>
                <input 
                    type="date" max={today}
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Enter Date here')}
                    onInput={e => e.target.setCustomValidity('')}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                />
            </fieldset>    
        </div>
    );
}
