'use client';

import { useEffect, useState } from 'react';
import {
  Book,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '@/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBooks: 0,
  });
  const [previousStats, setPreviousStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBooks: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch(`${API_BASE_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/borrow_records`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/reports/overdue`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/stats/previous`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([books, users, borrows, overdue, previous]) => {
        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          activeBorrows: borrows.filter((b) => !b.return_date).length,
          overdueBooks: overdue.length,
        });
        setPreviousStats(previous);
        const activities = [
          ...books.slice(-5).map((book) => ({
            type: 'book',
            message: `Book "${book.title}" added`,
            date: new Date(book.created_at),
            icon: Book,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
          })),
          ...users.slice(-5).map((user) => ({
            type: 'user',
            message: `User "${user.full_name}" registered`,
            date: new Date(user.created_at),
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          })),
          ...borrows.slice(-5).map((borrow) => ({
            type: 'borrow',
            message: `"${borrow.title}" borrowed by ${borrow.full_name}`,
            date: new Date(borrow.borrow_date),
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          })),
        ]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);
        setRecentActivity(activities);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to load dashboard data.');
      });
  }, []);

  const calculateChange = (current, previous) => {
    if (previous === 0) return { change: '0', type: 'neutral' };
    const percent = (((current - previous) / previous) * 100).toFixed(0);
    return {
      change: `${percent > 0 ? '+' : ''}${percent}%`,
      type: percent > 0 ? 'positive' : percent < 0 ? 'negative' : 'neutral',
    };
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: Book,
      color: 'from-gray-700 to-gray-800',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      ...calculateChange(stats.totalBooks, previousStats.totalBooks),
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      ...calculateChange(stats.totalUsers, previousStats.totalUsers),
    },
    {
      title: 'Active Borrows',
      value: stats.activeBorrows,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      ...calculateChange(stats.activeBorrows, previousStats.activeBorrows),
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      ...calculateChange(stats.overdueBooks, previousStats.overdueBooks),
    },
  ];

  const handleInsertStats = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/stats/insert-daily`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Daily stats inserted successfully!');
      // window.location.reload();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to insert daily stats.');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 sm:p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-[22px] sm:text-3xl font-bold mb-2'>
              Welcome to LibraryMS Dashboard
            </h1>
            <p className='text-gray-300 text-[14px] sm:text-lg'>
              Monitor and manage your library operations efficiently
            </p>
          </div>
          <div className='hidden md:block'>
            <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
              <TrendingUp className='w-8 h-8 text-white' />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile responsive */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200'
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.textColor}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-xs sm:text-sm ${
                    card.type === 'positive'
                      ? 'text-green-600'
                      : card.type === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  <TrendingUp className='w-3 h-3 sm:w-4 sm:h-4' />
                  <span>{card.change}</span>
                </div>
              </div>
              <div>
                <h3 className='text-xs sm:text-sm font-medium text-gray-600 mb-1'>
                  {card.title}
                </h3>
                <p className='text-2xl sm:text-3xl font-bold text-gray-900'>
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions - Stack on mobile */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Activity */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
              Recent Activity
            </h2>
            <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400' />
          </div>
          <div className='space-y-4'>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'
                  >
                    <div
                      className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {activity.message}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {activity.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-gray-500 text-center py-4'>
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6'>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-2 gap-3 sm:gap-4'>
            <button
              onClick={() => navigate('/books')}
              className='flex flex-col items-center p-3 sm:p-4 bg-gray-50 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors duration-200'
            >
              <Book className='w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mb-2' />
              <span className='text-xs sm:text-sm font-medium text-gray-700 text-center'>
                Add Book
              </span>
            </button>
            <button
              onClick={() => navigate('/users')}
              className='flex flex-col items-center p-3 sm:p-4 bg-green-50 cursor-pointer rounded-lg hover:bg-green-100 transition-colors duration-200'
            >
              <Users className='w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2' />
              <span className='text-xs sm:text-sm font-medium text-green-700 text-center'>
                Add User
              </span>
            </button>
            <button
              onClick={() => navigate('/borrow-records')}
              className='flex flex-col items-center p-3 sm:p-4 bg-purple-50 cursor-pointer rounded-lg hover:bg-purple-100 transition-colors duration-200'
            >
              <FileText className='w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2' />
              <span className='text-xs sm:text-sm font-medium text-purple-700 text-center'>
                New Borrow
              </span>
            </button>
            <button
              onClick={() => navigate('/reports')}
              className='flex flex-col items-center p-3 sm:p-4 bg-orange-50 cursor-pointer rounded-lg hover:bg-orange-100 transition-colors duration-200'
            >
              <Calendar className='w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2' />
              <span className='text-xs sm:text-sm font-medium text-orange-700 text-center'>
                View Reports
              </span>
            </button>
          </div>
          <div className='mt-4'>
            <button
              onClick={handleInsertStats}
              className='w-full flex items-center justify-center p-3 sm:p-4 bg-blue-50 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors duration-200'
            >
              <TrendingUp className='w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2' />
              <span className='text-xs sm:text-sm font-medium text-blue-700 text-center'>
                Update Daily Stats
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
