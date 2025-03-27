import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCTA from '../../components/ServiceCTA';

const benefits = [
  'Minimal disruption to business operations',
  'Flexible scheduling options',
  'Large-scale project expertise',
  'Industrial-grade materials',
  'Compliance with commercial regulations',
];

export default function CommercialPainting() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/services" className="inline-flex items-center text-brand-black hover:text-brand-gray-dark mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Services
      </Link>

      <h1 className="text-3xl font-bold mb-8">Commercial Painting</h1>

      <div className="bg-brand-white rounded-lg p-6 mb-8 border border-brand-gray-light">
        <p className="text-brand-gray-dark">
          Keep your business looking professional with our commercial painting services. We understand the unique challenges of commercial projects and deliver efficient, high-quality results while minimizing disruption to your operations.
        </p>
      </div>

      <div className="bg-brand-white rounded-lg p-6 border border-brand-gray-light">
        <h2 className="text-xl font-bold mb-6">Key Benefits</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <Check className="h-5 w-5 text-brand-black flex-shrink-0 mt-0.5" />
              <p className="text-brand-gray-dark">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <ServiceCTA />
    </div>
  );
}