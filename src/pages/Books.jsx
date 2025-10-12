/* eslint-disable no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Edit3,
  Trash2,
  Filter,
  MoreVertical,
  Calendar,
  Hash,
  User,
  Copy,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import API_BASE_URL from '@/api';

function Books() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: '',
    isbn: '',
    copies_available: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [books, searchTerm]);

  const fetchBooks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await fetch(`${API_BASE_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
      setBooks(data);
    } catch (error) {
      toast.error('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!formData.author.trim()) {
      toast.error('Author is required.');
      return;
    }
    if (!String(formData.published_year).trim()) {
      toast.error('Published Year is required.');
      return;
    }
    if (!formData.isbn.trim()) {
      toast.error('ISBN is required.');
      return;
    }
    if (formData.copies_available < 0) {
      toast.error('Copies Available must be 0 or more.');
      return;
    }
    setAdding(true);
    const token = localStorage.getItem('token');
    try {
      if (isEditing) {
        await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('Book updated successfully!');
      } else {
        await fetch(`${API_BASE_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('Book added successfully!');
      }
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentBookId(null);
      setFormData({
        title: '',
        author: '',
        published_year: '',
        isbn: '',
        copies_available: 1,
      });
      fetchBooks();
    } catch (error) {
      toast.error('Failed to save book.');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      published_year: String(book.published_year),
      isbn: book.isbn,
      copies_available: book.copies_available,
    });
    setCurrentBookId(book.book_id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  const handleDelete = async (id) => {
    setDeleting(true);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Book deleted successfully!');
      fetchBooks();
      setDeleteDialogOpen(false);
      setDeleteBookId(null);
    } catch (error) {
      toast.error('Failed to delete book.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <div className='flex items-center space-x-3 mb-2'>
            <div className='flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl'>
              <BookOpen className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>
                Book Management
              </h1>
              <p className='text-muted-foreground'>
                Manage your library's book collection
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Books
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {books.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Available Copies
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {books.reduce((sum, book) => sum + book.copies_available, 0)}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Copy className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Authors
                </p>
                <p className='text-2xl font-bold text-purple-600'>
                  {new Set(books.map((book) => book.author)).size}
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <User className='w-6 h-6 text-purple-600' />
              </div>
            </div>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Published Years
                </p>
                <p className='text-2xl font-bold text-orange-600'>
                  {new Set(books.map((book) => book.published_year)).size}
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm mb-6'>
          <div className='p-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search by title or author...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                />
              </div>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    title: '',
                    author: '',
                    published_year: '',
                    isbn: '',
                    copies_available: 1,
                  });
                  setIsDialogOpen(true);
                }}
                className='inline-flex items-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add New Book
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredBooks.map((book) => (
              <div
                key={book.book_id}
                className='bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg text-foreground mb-1 line-clamp-2'>
                        {book.title}
                      </h3>
                      <p className='text-muted-foreground text-sm mb-2'>
                        by {book.author}
                      </p>
                    </div>
                    {/* <div className='relative'>
                    <button className='p-2 hover:bg-muted rounded-lg transition-colors'>
                      <MoreVertical className='w-4 h-4 text-muted-foreground' />
                    </button>
                  </div> */}
                  </div>

                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Calendar className='w-4 h-4 mr-2' />
                      Published: {book.published_year}
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Hash className='w-4 h-4 mr-2' />
                      ISBN: {book.isbn}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Available Copies
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          book.copies_available > 5
                            ? 'bg-green-100 text-green-700'
                            : book.copies_available > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {book.copies_available}
                      </span>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(book)}
                      className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium'
                    >
                      <Edit3 className='w-4 h-4 mr-2' />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteBookId(book.book_id);
                        setDeleteDialogOpen(true);
                      }}
                      className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className='text-center py-12'>
            <BookOpen className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-medium text-foreground mb-2'>
              No books found
            </h3>
            <p className='text-muted-foreground mb-4'>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first book'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    title: '',
                    author: '',
                    published_year: '',
                    isbn: '',
                    copies_available: 1,
                  });
                  setIsDialogOpen(true);
                }}
                className='inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Your First Book
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-border'>
              <h2 className='text-xl font-semibold text-foreground'>
                {isEditing ? 'Edit Book' : 'Add New Book'}
              </h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {isEditing
                  ? 'Update book information'
                  : 'Enter the details for the new book'}
              </p>
            </div>

            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Title
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                  placeholder='Enter book title'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Author
                </label>
                <input
                  type='text'
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                  placeholder='Enter author name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Published Year
                </label>
                <input
                  type='text'
                  value={formData.published_year}
                  onChange={(e) =>
                    setFormData({ ...formData, published_year: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                  placeholder='e.g., 2023'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  ISBN
                </label>
                <input
                  type='text'
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                  placeholder='Enter ISBN number'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Copies Available
                </label>
                <input
                  type='number'
                  min='0'
                  value={formData.copies_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      copies_available: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                  placeholder='Number of copies'
                />
              </div>
            </div>

            <div className='p-6 border-t border-border flex gap-3'>
              <button
                onClick={() => setIsDialogOpen(false)}
                className='flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium'
                disabled={adding}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                disabled={
                  adding ||
                  !formData.title.trim() ||
                  !formData.author.trim() ||
                  !String(formData.published_year).trim() ||
                  !formData.isbn.trim() ||
                  formData.copies_available < 0
                }
                className='flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {adding ? (
                  <>
                    {/* <Loader2 className='w-4 h-4 animate-spin mr-2' /> */}
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : isEditing ? (
                  'Update Book'
                ) : (
                  'Add Book'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteDialogOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-border'>
              <h2 className='text-xl font-semibold text-foreground'>
                Delete Book
              </h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Are you sure you want to delete this book? This action cannot be
                undone.
              </p>
            </div>
            <div className='p-6'>
              <p className='text-foreground'>
                Book: {books.find((b) => b.book_id === deleteBookId)?.title}
              </p>
            </div>
            <div className='p-6 border-t border-border flex gap-3'>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className='flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium'
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteBookId)}
                disabled={deleting}
                className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {deleting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
