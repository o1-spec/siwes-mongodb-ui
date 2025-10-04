/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  EyeOff,
  Eye,
} from 'lucide-react';
import Header from '../components/Header';
import API_BASE_URL from '@/api';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) navigate('/');
  // }, [navigate]);

  // ... existing code ...

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const url = isRegister
        ? `${API_BASE_URL}/register`
        : `${API_BASE_URL}/login`;
      const payload = isRegister
        ? { ...formData, role: 'librarian' }
        : formData;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        toast.error(responseText); // Shows the exact text error, e.g., "User not found"
        setIsLoading(false);
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (userRes.ok) {
          const userText = await userRes.text();
          let user;
          try {
            user = JSON.parse(userText);
          } catch (e) {
            toast.error(userText);
            localStorage.removeItem('token');
            setIsLoading(false);
            return;
          }
          localStorage.setItem('user', JSON.stringify(user));
          setFormData({ full_name: '', email: '', password: '', role: '' });
          setIsRegister(true);
          toast.success('Login successful!');
          
          window.location.href = '/';
        } else {
          const errorText = await userRes.text();
          toast.error(errorText);
          localStorage.removeItem('token');
        }
      } else if (data.message) {
        setFormData({ full_name: '', email: '', password: '', role: '' });
        setIsRegister(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful!');
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <Header />

      <div className='flex items-center justify-center px-4 py-8 md:py-12'>
        <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Left Side - Hero Content */}
          <div className='space-y-6 md:space-y-8 order-2 lg:order-1'>
            <div className='space-y-3 md:space-y-4'>
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium'>
                <Shield className='w-3 h-3 md:w-4 md:h-4 mr-2' />
                Secure Academic Platform
              </div>

              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight'>
                Modern Library
                <span className='text-primary'> Management</span>
                <br className='hidden md:block' />
                for Academic Excellence
              </h1>

              <p className='text-base md:text-lg text-muted-foreground text-pretty leading-relaxed'>
                Streamline your library operations with our comprehensive
                management system. Track books, manage users, and generate
                insightful reports with ease.
              </p>
            </div>

            {/* Feature Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6'>
              <div className='flex items-center space-x-3 p-3 md:p-4 rounded-lg bg-white/50 border border-border/50'>
                <div className='flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg'>
                  <BookOpen className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold text-xs md:text-sm'>
                    Book Management
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Catalog & Track
                  </p>
                </div>
              </div>

              {/* <div className='flex items-center space-x-3 p-3 md:p-4 rounded-lg bg-white/50 border border-border/50'>
                <div className='flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent/10 rounded-lg'>
                  <Users className='w-4 h-4 md:w-5 md:h-5 text-accent' />
                </div>
                <div>
                  <h3 className='font-semibold text-xs md:text-sm'>
                    User Records
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Students & Staff
                  </p>
                </div>
              </div> */}

              <div className='flex items-center space-x-3 p-3 md:p-4 rounded-lg bg-white/50 border border-border/50'>
                <div className='flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-destructive/10 rounded-lg'>
                  <BarChart3 className='w-4 h-4 md:w-5 md:h-5 text-destructive' />
                </div>
                <div>
                  <h3 className='font-semibold text-xs md:text-sm'>
                    Analytics
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Reports & Insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='flex justify-center lg:justify-end order-1 lg:order-2'>
            <Card className='w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
              <CardHeader className='space-y-2 text-center'>
                <CardTitle className='text-xl md:text-2xl font-bold'>
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription className='text-sm md:text-base text-muted-foreground'>
                  {isRegister
                    ? 'Join the academic library management system'
                    : 'Sign in to access your library dashboard'}
                </CardDescription>
              </CardHeader>

              <CardContent className='space-y-4 md:space-y-6'>
                <div className='space-y-3 md:space-y-4'>
                  {isRegister && (
                    <div className='space-y-2'>
                      <Label htmlFor='fullName' className='text-sm font-medium'>
                        Full Name
                      </Label>
                      <Input
                        id='fullName'
                        placeholder='Enter your full name'
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        className='h-10 md:h-11'
                      />
                    </div>
                  )}

                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email Address
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='h-10 md:h-11'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password' className='text-sm font-medium'>
                      Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className='h-10 md:h-11 pr-10'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-muted-foreground' />
                        ) : (
                          <Eye className='h-4 w-4 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isRegister && (
                    <div className='space-y-2'>
                      <Label htmlFor='role' className='text-sm font-medium'>
                        Role
                      </Label>
                      <Select value='librarian' disabled>
                        <SelectTrigger className='h-10 md:h-11'>
                          <SelectValue placeholder='Librarian' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='librarian'>Librarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className='space-y-3 md:space-y-4'>
                  <Button
                    onClick={handleSubmit}
                    className='w-full h-10 md:h-11 font-medium'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className='w-4 h-4' />
                      </div>
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={() => setIsRegister(!isRegister)}
                    className='w-full h-10 md:h-11 font-medium'
                    disabled={isLoading}
                  >
                    {isRegister ? (
                      <>
                        Already have an account?{' '}
                        <span className='underline cursor-pointer'>
                          Sign In
                        </span>
                      </>
                    ) : (
                      <>
                        Need an account?{' '}
                        <span className='underline cursor-pointer'>
                          Register
                        </span>
                      </>
                    )}
                  </Button>
                  {localStorage.getItem('token') && (
                    <Button
                      variant='outline'
                      onClick={handleLogout}
                      className='w-full h-10 md:h-11 font-medium bg-transparent'
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
