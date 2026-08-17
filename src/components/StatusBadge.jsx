import { STATUS_LIST } from "../constants/status";
import '../App.css'

function StatusBadge({ status }) {
    const statusInfo = STATUS_LIST.find((s) => s.value === status);
    const color = statusInfo ? statusInfo.color : 'gray';

    return (
        <span className={`status-badge status-badge--${color}`}>{status}</span>
    )
}

export default StatusBadge