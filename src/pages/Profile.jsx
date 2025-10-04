/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; 
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ArrowLeft, User, Lock, Mail, Shield, Edit, Key } from 'lucide-react';
import API_BASE_URL from '@/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); 
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    setFormData({
      full_name: storedUser.full_name || '',
      email: storedUser.email || '',
      newPassword: '',
      confirmPassword: '',
    });
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
       const res = await fetch(`${API_BASE_URL}/users/me`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
        }),
      });
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: formData.newPassword,
        }),
      });
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData({ ...formData, newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'LA';

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 md:pt-0'>
      <div className='max-w-4xl'>
        {/* Header */}
        <div className='mb-6'>
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
            className='mb-4 flex items-center space-x-2'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Profile Settings
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage your account information and security.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Profile Overview */}
          <Card className='lg:col-span-1'>
            <CardHeader className='text-center'>
              <Avatar className='w-24 h-24 mx-auto mb-4'>
                <AvatarFallback className='text-2xl font-bold bg-black text-white'>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <CardTitle className='text-xl'>
                {user.full_name || 'User'}
              </CardTitle>
              <p className='text-sm text-muted-foreground capitalize flex items-center justify-center space-x-1'>
                <Shield className='w-4 h-4' />
                <span>{user.role || 'Role'}</span>
              </p>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground text-center'>
                Member since {new Date().getFullYear()} {/* Placeholder */}
              </p>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Personal Information */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='flex items-center space-x-2'>
                  <User className='w-5 h-5' />
                  <span>Personal Information</span>
                </CardTitle>
                {!isEditing && (
                  <Button variant='outline' onClick={() => setIsEditing(true)}>
                    <Edit className='w-4 h-4 mr-2' />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className='space-y-4'>
                {isEditing ? (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='full_name'>Full Name</Label>
                        <Input
                          id='full_name'
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              full_name: e.target.value,
                            })
                          }
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label htmlFor='email'>Email Address</Label>
                        <Input
                          id='email'
                          type='email'
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className='mt-1'
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor='role'>Role</Label>
                      <Input
                        id='role'
                        value={user.role || ''}
                        disabled
                        className='mt-1 bg-gray-100'
                      />
                    </div>
                    <div className='flex justify-end space-x-2'>
                      <Button
                        variant='outline'
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-2'>
                      <User className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm'>
                        Full Name: {user.full_name || 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Mail className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm'>
                        Email: {user.email || 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Shield className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm capitalize'>
                        Role: {user.role || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password Button */}
            <Card>
              <CardContent className='pt-6'>
                <Dialog
                  open={isPasswordModalOpen}
                  onOpenChange={setIsPasswordModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant='outline' className='w-full'>
                      <Key className='w-4 h-4 mr-2' />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='newPassword' className='pb-1'>New Password</Label>
                        <Input
                          id='newPassword'
                          type='password'
                          placeholder='Enter new password'
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor='confirmPassword' className='pb-1'>
                          Confirm Password
                        </Label>
                        <Input
                          id='confirmPassword'
                          type='password'
                          placeholder='Confirm new password'
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          variant='outline'
                          onClick={() => setIsPasswordModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleChangePassword}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Changing...' : 'Change Password'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
