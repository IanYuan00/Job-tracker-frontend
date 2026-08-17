import { STATUS_LIST } from "../constants/status";

function StatsCard({ jobs }) {
    const statusCount = STATUS_LIST.map((s) => ({
        label: s.value,
        count: jobs.filter((job) => job.status === s.value).length
    }))
    return (
        <div className="stats">
            <div className="stats-card">
                <p className="stats-card__label">Total</p>
                <p className="stats-card__count">{jobs.length}</p>
            </div>
            {statusCount.map((s) => (
                <div className="stats-card" key={s.label}>
                    <p className="stats-card__label">{s.label}</p>
                    <p className="stats-card__count">{s.count}</p>
                </div>
            ))}
        </div>
    )
}

export default StatsCard;