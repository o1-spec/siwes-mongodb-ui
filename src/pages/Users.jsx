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
import { Loader2 } from 'lucide-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: '',
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    try {
      if (isEditing) {
        await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('User updated successfully!');
      } else {
        await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('User added successfully!');
      }
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentUserId(null);
      setFormData({ full_name: '', email: '', role: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
    setCurrentUserId(user.user_id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* <DialogTrigger asChild>
          <Button
            className='mb-4'
            onClick={() => {
              setIsEditing(false);
              setFormData({ full_name: '', email: '', role: '' });
            }}
          >
            Add User
          </Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAddUser}>
              {isEditing ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
        </div>
      ) : users.length === 0 ? (
        <p className='text-center text-gray-500 py-8'>No users found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant='outline' onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
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
                          onClick={() => handleDelete(user.user_id)}
                          disabled={deleting} 
                        >
                          {deleting ? 'Deleting...' : 'Delete'} 
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

export default Users;
