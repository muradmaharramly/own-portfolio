import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.scss';
import { signIn } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { CiLock } from 'react-icons/ci';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }
    dispatch(signIn({ email, password }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Girişi</h2>
          <p>Portfel idarəetmə panelinə xoş gəlmisiniz</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon-wrapper">
              <FiUser className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifrə</label>
            <div className="input-icon-wrapper">
              <CiLock className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Giriş edilir...' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
