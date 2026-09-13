import Login from './components/Login.jsx';
import MainPage from './components/MainPage.js';
import Register from './components/Register.jsx';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const handleLoginSuccess = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    navigate('/');
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}

function RegisterPage() {
  const navigate = useNavigate();
  const handleRegisterSuccess = () => {
    alert('Registration successful! Please log in.');
    navigate('/login');
  }

  return <Register onRegisterSuccess={handleRegisterSuccess} />
}

function MainPageWrapper({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/login');
  }

  return <MainPage onLogOut={handleLogOut} />
}



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register' element={isLoggedIn ? <Navigate to='/' /> : <RegisterPage />} />
        <Route path='/' element={isLoggedIn ? <MainPageWrapper setIsLoggedIn={setIsLoggedIn} /> : <Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
