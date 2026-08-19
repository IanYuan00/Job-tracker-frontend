import { useState } from 'react';
import { STATUS_LIST } from "../constants/status";

function ApplicationForm({ onSubmitJob, editJob, onCancelClick }) {
    const [company, setCompany] = useState(editJob ? editJob.company : '');
    const [position, setPosition] = useState(editJob ? editJob.position : '');
    const [status, setStatus] = useState(editJob ? editJob.status : STATUS_LIST[0].value);
    const [date, setDate] = useState(editJob ? editJob.date : '');
    const [notes, setNotes] = useState(editJob ? editJob.notes : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitJob({ company, position, status, date, notes })
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='form-input'>
                    <label>
                        Company:
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </label>
                    <label>
                        Position:
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </label>
                </div>
                <div className='form-input'>
                    <label>
                        Status:
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {STATUS_LIST.map((s) => (
                                <option key={s.value} value={s.value}>{s.value}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Applied On:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Notes:
                        <textarea
                            type='text'
                            value={notes}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </label>
                </div>
                <div className='form-button'>
                    <button type='button' onClick={onCancelClick}>Cancel</button>
                    <button type="submit" className='primary'>Save</button>
                </div>
            </form>
        </>

    )
}

export default ApplicationForm;