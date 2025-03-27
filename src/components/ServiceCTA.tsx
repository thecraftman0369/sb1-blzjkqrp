import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ServiceCTA() {
  return (
    <div className="mt-12 text-center">
      <Link
        to="/contact"
        className="inline-flex items-center gap-3 bg-brand-black text-brand-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-gray-dark transition-colors touch-manipulation group"
      >
        👉 Book Your Appointment
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}