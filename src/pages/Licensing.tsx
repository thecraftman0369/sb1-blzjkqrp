import React from 'react';
import { Shield, Award } from 'lucide-react';

export default function Licensing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Licensing & Insurance</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-brand-gray-light">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-brand-black mr-3" />
            <h2 className="text-xl font-bold">Insurance Coverage</h2>
          </div>
          <ul className="space-y-2 text-brand-gray-dark">
            <li>• $2 million general liability insurance</li>
            <li>• Full Workers' Compensation coverage</li>
            <li>• Comprehensive business insurance</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-brand-gray-light">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-brand-black mr-3" />
            <h2 className="text-xl font-bold">Certifications</h2>
          </div>
          <ul className="space-y-2 text-brand-gray-dark">
            <li>• EPA Lead-Safe Certified</li>
            <li>• Licensed Home Improvement Contractor</li>
            <li>• OSHA Safety Certified</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-brand-gray-light">
        <p className="text-brand-gray-dark leading-relaxed">
          At KT PAINTING, we prioritize safety, professionalism, and compliance with all industry standards. Our comprehensive insurance coverage includes $2 million in general liability insurance, ensuring your property is fully protected throughout every project. Our team is covered by complete Workers' Compensation insurance, providing peace of mind for both our clients and our workforce.
        </p>
        <p className="text-brand-gray-dark leading-relaxed mt-4">
          As an EPA Lead-Safe Certified contractor, KT PAINTING strictly adheres to all federal and state guidelines when working with properties built before 1978 or any project involving potential lead-based paint. Our status as a licensed Home Improvement Contractor and OSHA Safety Certification demonstrates our commitment to maintaining the highest standards of professional excellence and safety in the industry.
        </p>
      </div>
    </div>
  );
}