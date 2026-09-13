import { useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register({ onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [confirmPwError, setConfirmPwError] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setConfirmPwError('Password does not match.')
            return;
        }
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })

        if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.error);
            return;
        }

        const data = await res.json();
        onRegisterSuccess(data.username, data.email);
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email!')
        } else {
            setEmailError('');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Job tracker</h2>
                <p className="auth-card__subtitle">Create an account</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type='text'
                            autoComplete="username"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateEmail}
                        />
                        {emailError && <p className="field-error">{emailError}</p>}
                    </label>
                    <label>
                        Password
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="showpassword"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>
                    <label>
                        Confirm Password
                        <div style={{ position: 'relative' }}>
                            <input
                                className={confirmPwError ? 'input-error' : ''}
                                type={showConfirmPw ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setConfirmPassword(newValue);
                                    if (newValue === '') {
                                        setConfirmPwError('');
                                        setConfirmMessage('');
                                    } else if (password !== newValue) {
                                        setConfirmPwError('Password does not match.');
                                        setConfirmMessage('');
                                    } else {
                                        setConfirmPwError('');
                                        setConfirmMessage('Password Confirmed.');
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="showpassword"
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                            >
                                {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {confirmPwError && <p className="field-error">{confirmPwError}</p>}
                        {confirmMessage && <p className="field-success">{confirmMessage}</p>}
                    </label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Register</button>

                    <p className="auth-card__footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>

    )
}

export default Register;