import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-brand-black">404 - Page Not Found</h1>
      <p className="text-lg text-brand-gray-dark mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-brand-black text-brand-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-brand-gray-dark transition-colors"
      >
        <Home size={20} />
        Return Home
      </Link>
    </div>
  );
}