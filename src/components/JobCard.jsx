import StatusBadge from "./StatusBadge";
import { useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from "../config";

function JobCard({ job, onEdit, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const displayHistory = historyData.length > 0 ? historyData : [{ id: 'default', toStatus: 'Applied', changedAt: job.date }]

    const handleExpandClick = async () => {
        if (isExpanded) {
            setIsExpanded(false);
            return;
        }
        setIsExpanded(true);
        const res = await fetch(`${API_BASE_URL}/applications/${job.id}/history`);
        const data = await res.json();
        setHistoryData(data);
    }
    return (
        <div className="job-card" onClick={() => handleExpandClick()}>
            <div className="job-card__header">
                <div>
                    <p className="job-card__company">{job.company}</p>
                    <p className="job-card__position">{job.position}</p>
                </div>
                <StatusBadge status={job.status} />
            </div>
            <div className="job-card__footer">
                <span className="job-card__date">Applied on {job.date}</span>
                <div className="job-card__actions">
                    <button className="icon-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(job.id);
                        }}>
                        <Pencil size={16} />
                    </button>
                    <button className="icon-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(job.id);
                        }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className={`job-card__details ${isExpanded ? 'job-card__details--open' : ''}`}>
                <p className="detail-label">NOTES</p>
                <p>{job.notes || 'No notes yet.'}</p>
                <p className="detail-label">HISTORY</p>
                <div className="timeline">
                    {displayHistory.map((data, index) => {
                        const isCurrent = index === displayHistory.length - 1;
                        return (
                            <div key={data.id} className="timeline-item">
                                <div className="timeline-marker">
                                    <div className={`timeline-dot ${isCurrent ? 'timeline-dot--current' : ''}`} />
                                    {!isCurrent && <div className="timeline-line" />}
                                </div>
                                <div className="timeline-content">
                                    <p className={`timeline-status ${isCurrent ? 'timeline-status--current' : ''}`}>{data.toStatus}</p>
                                    <p className="timeline-date">
                                        {new Date(data.changedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default JobCard;