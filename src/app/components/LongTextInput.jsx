'use client'

export default function LongTextInput({text, setText}) {
    return (
        <div>
            <fieldset className="form-fieldset">
                <legend className="form-text">Task Description</legend>
                <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={250}
                    className="form-input"
                />
            </fieldset>
        </div>
    );
}
