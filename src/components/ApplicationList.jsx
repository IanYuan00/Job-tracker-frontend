import StatusBadge from './StatusBadge.jsx';
import JobCard from './JobCard.jsx';
import React, { useState } from 'react';

function ApplicationList({ jobs, onDelete, onEdit, expandAll }) {

    return (
        <div className='job-list'>
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} expandAll={expandAll} />
            ))}
        </div>
    )
}

export default ApplicationList;