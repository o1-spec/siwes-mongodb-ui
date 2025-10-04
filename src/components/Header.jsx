import { BookOpen, GraduationCap } from 'lucide-react';

export default function Header({ showNavigation = false }) {
  return (
    <header className='bg-white border-b border-border shadow-sm py-2'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-12 md:h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center space-x-2 md:space-x-3'>
            <div className='flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg'>
              <BookOpen className='w-5 h-5 md:w-6 md:h-6 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-lg md:text-xl font-bold text-foreground'>
                LibraryMS
              </h1>
              <p className='text-xs text-muted-foreground hidden sm:block'>
                Academic Library System
              </p>
            </div>
          </div>

          {showNavigation && (
            <nav className='hidden md:flex items-center space-x-6 md:space-x-8'>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base'
              >
                Dashboard
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base'
              >
                Books
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base'
              >
                Users
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base'
              >
                Reports
              </a>
            </nav>
          )}

          {/* Academic Badge */}
          <div className='flex items-center space-x-1 md:space-x-2 text-muted-foreground'>
            <GraduationCap className='w-3 h-3 md:w-4 md:h-4' />
            <span className='text-xs md:text-sm font-medium'>CSC 394</span>
          </div>
        </div>
      </div>
    </header>
  );
}
