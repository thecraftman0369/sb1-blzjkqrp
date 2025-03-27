import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCTA from '../../components/ServiceCTA';

const benefits = [
  'Protection against harsh weather conditions',
  'Enhanced curb appeal and property value',
  'Professional surface preparation and repairs',
  'Long-lasting, durable finish',
  'Expert color consultation available',
];

export default function ExteriorPainting() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Services
      </Link>

      <h1 className="text-3xl font-bold mb-8">Exterior Painting</h1>

      <div className="bg-white rounded p-6 mb-8">
        <p className="text-gray-700">
          Transform and protect your home's exterior with our professional painting services. We use premium materials and proven techniques to ensure a beautiful, long-lasting finish that stands up to the elements.
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