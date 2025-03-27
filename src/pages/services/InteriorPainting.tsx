import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCTA from '../../components/ServiceCTA';

const benefits = [
  'Expert color consultation and design advice',
  'Meticulous surface preparation',
  'Low-VOC paint options available',
  'Clean and organized work process',
  'Detailed trim and accent work',
];

export default function InteriorPainting() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Services
      </Link>

      <h1 className="text-3xl font-bold mb-8">Interior Painting</h1>

      <div className="bg-white rounded p-6 mb-8">
        <p className="text-gray-700">
          Revitalize your indoor spaces with our professional interior painting services. We combine premium paints, expert techniques, and meticulous attention to detail to create beautiful, lasting results in every room.
        </p>
      </div>

      <div className="bg-white rounded p-6">
        <h2 className="text-xl font-bold mb-6">Key Benefits</h2>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-blue-600 mr-4" />
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <ServiceCTA />
    </div>
  );
}