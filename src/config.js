export const API_BASE_URL = import.meta.env.VITE_API_URL

export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}