import React from 'react';
import { Paintbrush, Home, Building2, Trees, Droplets, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Exterior Painting',
    icon: Home,
    href: '/services/exterior',
  },
  {
    title: 'Interior Painting',
    icon: Paintbrush,
    href: '/services/interior',
  },
  {
    title: 'Commercial Painting',
    icon: Building2,
    href: '/services/commercial',
  },
  {
    title: 'Deck Staining',
    icon: Trees,
    href: '/services/deck',
  },
  {
    title: 'Power Washing',
    icon: Droplets,
    href: '/services/power-washing',
  },
];

const serviceAreas = [
  'Framingham', 'Natick', 'Sudbury', 'Ashland', 'Southborough', 
  'Marlborough', 'Hopkinton', 'Holliston', 'Hudson', 'Maynard',
  'Stow', 'Wayland', 'Weston', 'Waltham', 'Newton',
  'Wellesley', 'Needham', 'Dover', 'Medfield', 'Millis',
  'Medway', 'Milford', 'Lincoln', 'Concord'
];

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-brand-black">Our Services</h1>

      <div className="bg-white rounded-lg p-6 sm:p-8 mb-12 shadow-sm">
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-lg text-brand-gray-dark leading-relaxed">
            At KT PAINTING, we provide a complete range of residential and commercial painting and exterior maintenance services to enhance and protect your property.
          </p>
          <p className="text-lg text-brand-gray-dark leading-relaxed">
            From flawless interior painting to durable exterior finishes, we bring precision and professionalism to every job. We also specialize in deck staining, power washing, and commercial painting, helping businesses maintain a clean, polished image.
          </p>
          <p className="text-lg text-brand-gray-dark leading-relaxed">
            Whether it's your home or your commercial space, we deliver quality results you can count on.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service) => (
          <Link
            key={service.title}
            to={service.href}
            className="bg-white p-6 sm:p-8 rounded-lg flex items-center justify-center space-x-4 hover:bg-gray-50 transition-colors group shadow-sm"
          >
            <service.icon className="h-7 w-7 text-brand-black group-hover:text-blue-600 transition-colors" />
            <span className="text-lg font-medium text-brand-gray-dark group-hover:text-brand-black transition-colors">
              {service.title}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-6">
          <MapPin className="h-7 w-7 text-brand-black" />
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black">Areas We Serve</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {serviceAreas.map((area) => (
            <div
              key={area}
              className="bg-brand-gray-light bg-opacity-50 px-4 py-3 rounded-lg text-brand-gray-dark hover:text-brand-black transition-colors text-center"
            >
              <p className="text-base sm:text-lg font-medium">{area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}