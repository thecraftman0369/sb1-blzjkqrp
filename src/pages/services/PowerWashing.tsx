import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCTA from '../../components/ServiceCTA';

const benefits = [
  'Removes dirt, grime, and mildew',
  'Improves property appearance',
  'Prepares surfaces for painting',
  'Safe and effective cleaning',
  'Extends material longevity',
];

export default function PowerWashing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/services" className="inline-flex items-center text-brand-black hover:text-brand-gray-dark mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Services
      </Link>

      <h1 className="text-3xl font-bold mb-8">Power Washing</h1>

      <div className="bg-brand-white rounded p-6 mb-8 border border-brand-gray-light">
        <p className="text-brand-gray-dark">
          Restore your property's appearance with our professional power washing services. We safely and effectively remove dirt, grime, mildew, and other contaminants from various surfaces, improving curb appeal and maintaining your property's value.
        </p>
      </div>

      <div className="bg-brand-white rounded p-6 border border-brand-gray-light">
        <h2 className="text-xl font-bold mb-6">Key Benefits</h2>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-brand-black mr-4" />
              <p className="text-brand-gray-dark">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <ServiceCTA />
    </div>
  );
}