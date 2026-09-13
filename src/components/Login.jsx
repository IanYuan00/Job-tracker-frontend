import { useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react'

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email and password are required!');
            return;
        }
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.error);
            return;
        }

        const data = await res.json();
        onLoginSuccess(data.token, data.username);
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Job tracker</h2>
                <p className="auth-card__subtitle">Log in to your account</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            autoComplete="username"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        Password
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <button
                                type="button"
                                className="showpassword"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                    </label>
                    {error && <p className="field-error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <p className="auth-card__footer">Don't have an account? <Link to="/register">Register</Link></p>

            </div>
        </div>
    )
}

export default Login;