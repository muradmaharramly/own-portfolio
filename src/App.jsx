// ============================================
// App.jsx
// ============================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './redux/store';
import { checkAuth } from './redux/slices/authSlice';
import { setTheme } from './redux/slices/themeSlice';

// Pages
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import BackToTop from './components/Common/BackToTop';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(setTheme(mode));
  }, [dispatch, mode]);

  return (
    <BrowserRouter>
      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-blob ambient-blob--a"></span>
        <span className="ambient-blob ambient-blob--b"></span>
        <span className="ambient-blob ambient-blob--c"></span>
        <span className="ambient-blob ambient-blob--d"></span>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin/login" 
          element={isAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />} 
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
