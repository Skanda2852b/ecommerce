'use client';
import { useState } from 'react';

export default function PopulateDatabase() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const populateDatabase = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('/api/admin/populate');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Failed to populate database');
      }
    } catch (error) {
      setError('An error occurred while populating the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Populate Database</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-gray-600 mb-4">
          This will populate your database with sample products. This action cannot be undone.
        </p>
        
        <button
          onClick={populateDatabase}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Populating...' : 'Populate Database'}
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}