import StatusBadge from './StatusBadge';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

function ApplicationTable({ jobs, onDelete, onEdit, onSortClick, sortDirection }) {
    const [expandedId, setExpandedId] = useState(null);

    const handleRowClick = (id) => {
        setExpandedId(expandedId === id ? null : id);
    }

    return (
        <div className='table-wrapper'>
            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th style={{ cursor: 'pointer' }}
                            onClick={onSortClick}>
                            Applied On {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <React.Fragment key={job.id}>
                            <tr className='table-notes' onClick={() => handleRowClick(job.id)}>
                                <td>{job.company}</td>
                                <td>{job.position}</td>
                                <td><StatusBadge status={job.status} /></td>
                                <td>{job.date}</td>
                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(job.id)
                                    }}>
                                        <Pencil size={16} />
                                    </button>
                                </td>
                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(job.id)
                                    }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                            {expandedId === job.id && (
                                <tr className='expanded-notes'>
                                    <td colSpan={6}>{job.note || 'No notes yet.'}</td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApplicationTable