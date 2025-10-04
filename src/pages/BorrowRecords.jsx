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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import API_BASE_URL from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

function BorrowRecords() {
  const [records, setRecords] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [returningId, setReturningId] = useState(null);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [formData, setFormData] = useState({
    user_name: '',
    book_id: '',
    due_date: '',
  });
  const [books, setBooks] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchBooks();
  }, []);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    const token = localStorage.getItem('token');
    try {
      const data = await fetch(`${API_BASE_URL}/borrow_records`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
      setRecords(data);
    } catch (error) {
      toast.error('Failed to load records.');
    } finally {
      setLoadingRecords(false);
    }
  };

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    const data = await fetch(`${API_BASE_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
    setBooks(data);
  };

  const handleReturn = async (id) => {
    setReturningId(id);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/borrow_records/${id}/return`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Book returned successfully!');
      fetchRecords();
    } catch (_error) {
      toast.error('Failed to return book.');
    } finally {
      setReturningId(null);
    }
  };

  const handleBorrow = async () => {
    setBorrowing(true);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/borrow_records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          book_id: formData.book_id,
          due_date: formData.due_date,
        }),
      });
      toast.success('Book borrowed successfully!');
      setIsDialogOpen(false);
      setFormData({ user_name: '', book_id: '', due_date: '' });
      fetchRecords();
    } catch (error) {
      toast.error('Failed to borrow book.');
    } finally {
      setBorrowing(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingRecordId(id);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/borrow_records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Record deleted successfully!');
      fetchRecords();
    } catch (error) {
      toast.error('Failed to delete record.');
    } finally {
      setDeletingRecordId(null);
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Borrow Records</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className='mb-4'>Borrow Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow a Book</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label className='mb-1'>User Name</Label>
              <Input
                value={formData.user_name}
                onChange={(e) =>
                  setFormData({ ...formData, user_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label className='mb-1'>Book</Label>
              <Select
                value={formData.book_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, book_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a book' />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem
                      key={book.book_id}
                      value={book.book_id.toString()}
                    >
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='mb-1'>Due Date</Label>
              <Input
                type='date'
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>
            <Button onClick={handleBorrow} disabled={borrowing}>
              {borrowing ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  Loading...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {loadingRecords ? (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
        </div>
      ) : records.length === 0 ? (
        <p className='text-center text-gray-500 py-8'>
          No borrow records found
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower Name</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Returned Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.record_id}>
                <TableCell>{record.user_name}</TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>
                  {new Date(record.borrow_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {record.return_date
                    ? new Date(record.return_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(record.due_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  {record.status !== 'returned' && (
                    <AlertDialog>
                      {' '}
                      {/* Add AlertDialog */}
                      <AlertDialogTrigger asChild>
                        <Button>Return</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Return</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to mark this book as returned?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReturn(record.record_id)}
                            disabled={returningId === record.record_id}
                          >
                            {returningId === record.record_id ? (
                              <>
                                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                Returning...
                              </>
                            ) : (
                              'Return'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive' className='ml-2'>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(record.record_id)}
                          disabled={deletingRecordId === record.record_id}
                        >
                          {deletingRecordId === record.record_id
                            ? 'Deleting...'
                            : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default BorrowRecords;
