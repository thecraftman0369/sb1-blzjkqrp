import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const advantages = [
  'Superior Craftsmanship & Meticulous Detail',
  'Professional Communication & Service',
  'Dependable Scheduling & Timely Completion',
  'Immaculate & Respectful Work Environment',
  'Efficient Yet Thorough Process',
  'Complete Satisfaction Guaranteed',
  'Established Local Excellence',
  'Comprehensive Insurance Coverage',
  'Qualified and experienced painters',
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section className="mb-12 sm:mb-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-black mb-6 sm:mb-8 leading-[1.2] max-w-4xl mx-auto tracking-tight bg-gradient-to-b from-brand-black to-brand-gray-dark bg-clip-text text-transparent">
          From residential touch-ups to complete commercial renovations, we deliver exceptional results that exceed expectations.
        </h1>
        <Link
          to="/contact"
          className="inline-flex items-center bg-brand-black text-brand-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-gray-dark transition-colors touch-manipulation"
        >
          Get Free Estimate
          <ArrowRight className="ml-2" />
        </Link>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-brand-black">Why Choose KT PAINTING?</h2>
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          <div className="w-full">
            <div className="space-y-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center bg-brand-white p-4 sm:p-5 rounded-lg border border-brand-gray-light hover:border-brand-gray transition-colors">
                  <Check className="h-6 w-6 text-brand-black mr-4 sm:mr-5 flex-shrink-0" />
                  <p className="text-base sm:text-lg text-brand-gray-dark font-medium text-center w-full">
                    {advantage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}