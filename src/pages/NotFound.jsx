import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-gray-300'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Page Not Found</h2>
        <p className='text-gray-600 mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className='space-x-4'>
          <Button onClick={() => navigate('/')} className='inline-flex items-center'>
            <Home className='w-4 h-4 mr-2' />
            Go Home
          </Button>
          <Button variant='outline' onClick={() => navigate(-1)} className='inline-flex items-center'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;