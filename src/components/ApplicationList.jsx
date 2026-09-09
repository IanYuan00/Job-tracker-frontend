import StatusBadge from './StatusBadge.jsx';
import JobCard from './JobCard.jsx';
import React, { useState } from 'react';

function ApplicationList({ jobs, onDelete, onEdit, onSortClick, sortDirection }) {

    return (
        <div className='job-list'>
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default ApplicationList;