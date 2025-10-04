'use client';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Book,
  Users,
  FileText,
  BarChart,
  Home,
  Menu,
  X,
  LogOut,
  GraduationCap,
  User,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); 
      } else {
        setSidebarOpen(false); 
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTimeout(() => {
      navigate('/login');
      setIsLoggingOut(false);
    }, 500);
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'LA';

  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/books', icon: Book, label: 'Books' },
    { path: '/borrow-records', icon: FileText, label: 'Borrow Records' },
    { path: '/reports', icon: BarChart, label: 'Reports' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? sidebarOpen
              ? 'w-64 fixed left-0 top-0 h-full z-50'
              : 'w-0 overflow-hidden'
            : sidebarOpen
            ? 'w-64 relative'
            : 'w-16 relative'
        } transition-all duration-300 bg-white shadow-lg border-r border-gray-200`}
      >
        {!(isMobile && !sidebarOpen) && (
          <>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
              {sidebarOpen && (
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
                    <GraduationCap className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h1 className='text-lg font-bold text-black'>LibraryMS</h1>
                    <p className='text-xs text-gray-500'>CSC 394 Project</p>
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto'>
                  <GraduationCap className='w-5 h-5 text-white' />
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  !sidebarOpen ? 'absolute top-4 right-2' : ''
                }`}
              >
                {sidebarOpen ? (
                  <X className='w-4 h-4 text-gray-600' />
                ) : (
                  <Menu className='w-4 h-4 text-gray-600' />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className={`${sidebarOpen ? 'p-4' : 'p-2'} space-y-2`}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center ${
                      sidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'
                    } py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      className={`${sidebarOpen ? 'w-5 h-5' : 'w-4 h-6'} ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                    {sidebarOpen && (
                      <span className='font-medium'>{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div
              className={`absolute bottom-4 ${
                sidebarOpen ? 'left-4 right-4' : 'left-2 right-2'
              }`}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className={`w-full flex items-center ${
                      sidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'
                    } py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200`}
                    title={!sidebarOpen ? 'Logout' : undefined}
                  >
                    <LogOut
                      className={`${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'}`}
                    />
                    {sidebarOpen && <span className='font-medium'>Logout</span>}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will need to sign in
                      again to access the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4'>
          <div className='flex items-center justify-between'>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className='p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden'
              >
                <Menu className='w-5 h-5 text-gray-600' />
              </button>
            )}

            <div className={isMobile ? 'flex-1 ml-4' : ''}>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
                {navigationItems.find((item) => item.path === location.pathname)
                  ?.label || 'Dashboard'}
              </h2>
              {!isMobile && (
                <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                  Manage your library resources efficiently
                </p>
              )}
            </div>

            <div className='flex items-center space-x-2 sm:space-x-4'>
              <button
                onClick={() => navigate('/profile')}
                className='flex items-center space-x-2 cursor-pointer sm:space-x-4 hover:bg-gray-100 p-2 rounded-lg transition-colors'
              >
                <div className='text-right hidden sm:block'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.full_name || 'Library Admin'}
                  </p>
                  <p className='text-xs text-gray-500 capitalize'>
                    {user.role || 'Administrator'}
                  </p>
                </div>
                <div className='w-8 h-8 bg-black rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-medium'>
                    {userInitials}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-auto bg-gray-50 p-4 sm:p-6'>
          <div className='max-w-7xl'>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
