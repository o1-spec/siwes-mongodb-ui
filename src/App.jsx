import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Books from './pages/Books';
import BorrowRecords from './pages/BorrowRecords';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { ToastProvider } from './components/ui/toast';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import API_BASE_URL from './api';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token by fetching user data
      fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black'></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route
              path='/'
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path='/users'
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path='/books'
              element={
                <Layout>
                  <Books />
                </Layout>
              }
            />
            <Route
              path='/borrow-records'
              element={
                <Layout>
                  <BorrowRecords />
                </Layout>
              }
            />
            <Route
              path='/reports'
              element={
                <Layout>
                  <Reports />
                </Layout>
              }
            />
            <Route
              path='/profile'
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route path='*' element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
          </>
        )}
      </Routes>
      <ToastProvider />
    </Router>
  );
}

export default App;