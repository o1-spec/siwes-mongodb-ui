'use client';

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import API_BASE_URL from '@/api';
import { Loader2 } from 'lucide-react';

function Reports() {
  const [reports, setReports] = useState({
    mostBorrowed: [],
    activeUsers: [],
    overdue: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const [mostBorrowedRes, activeUsersRes, overdueRes] = await Promise.all(
          [
            fetch(`${API_BASE_URL}/reports/most-borrowed`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/reports/active-users`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/reports/overdue`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]
        );

        const mostBorrowed = await mostBorrowedRes.json();
        const activeUsers = await activeUsersRes.json();
        const overdue = await overdueRes.json();

        setReports({ mostBorrowed, activeUsers, overdue });
      } catch (error) {
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Reports</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex justify-center items-center py-8'>
                <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
              </div>
            ) : reports.mostBorrowed.length === 0 ? (
              <p className='text-center text-gray-500 py-8'>
                No most borrowed books found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Borrow Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.mostBorrowed.map((book) => (
                    <TableRow key={book.book_id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.borrow_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Borrowers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex justify-center items-center py-8'>
                <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
              </div>
            ) : reports.activeUsers.length === 0 ? (
              <p className='text-center text-gray-500 py-8'>
                No active users found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Borrows</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.activeUsers.map((user) => (
                    <TableRow key={user.user_name}>
                      <TableCell>{user.user_name}</TableCell>
                      <TableCell>{user.borrow_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overdue Books</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center py-8'>
              <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
            </div>
          ) : reports.overdue.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>
              No overdue books found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Overdue Days</TableHead>
                  <TableHead>Fine (₦)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.overdue.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.user_name}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {new Date(item.due_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{item.overdue_days}</TableCell>
                    <TableCell>{item.fine}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
