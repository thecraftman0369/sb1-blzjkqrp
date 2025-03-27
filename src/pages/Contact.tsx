import React, { useState } from 'react';
import { Send, Phone, Mail, Facebook, Instagram, GitBranch as BrandTiktok } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

// Initialize EmailJS with the public key
emailjs.init("M89RrBEMB8ztqiq8t");

const serviceTypes = [
  'Exterior Painting',
  'Interior Painting',
  'Commercial Painting',
  'Deck Staining',
  'Power Washing'
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        service_type: formData.serviceType || 'Not specified',
        message: formData.description || 'No description provided',
      };

      await emailjs.send(
        'service_9m5skv3',
        'template_zso29en',
        templateParams
      );

      toast.success('Estimate request sent successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        description: ''
      });
    } catch (error) {
      console.error('Email error:', error);
      toast.error('Failed to send estimate request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Toaster position="top-center" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-brand-black">Contact KT PAINTING</h1>
      
      <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
        <div className="bg-brand-white rounded-lg p-6 sm:p-8 border border-brand-gray-light shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-brand-black">Request a Free Estimate</h2>
          <p className="text-lg text-brand-gray-dark mb-6 sm:mb-8">
            Fill out the form below and we'll get back to you as soon as possible with a free, no-obligation estimate for your project.
          </p>
          
          <form onSubmit={handleSubmit} id="estimate-form" className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-base font-medium text-brand-gray-dark mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-black/20"
                placeholder="Your full name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-medium text-brand-gray-dark mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-black/20"
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-base font-medium text-brand-gray-dark mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-black/20"
                placeholder="(123) 456-7890"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-base font-medium text-brand-gray-dark mb-2">
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-black/20 bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select a service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-base font-medium text-brand-gray-dark mb-2">
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-black/20 resize-none"
                placeholder="Tell us about your project..."
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-black text-brand-white py-4 px-6 rounded-lg font-semibold hover:bg-brand-gray-dark transition-colors flex items-center justify-center gap-2 text-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Request Free Estimate'}
              <Send size={20} />
            </button>
          </form>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-brand-white rounded-lg p-6 sm:p-8 border border-brand-gray-light shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-brand-black">Our Location</h2>
            <p className="text-lg text-brand-gray-dark">
              👉 Serving Metro West and Greater Boston area
            </p>
          </div>

          <div className="bg-brand-white rounded-lg p-6 sm:p-8 border border-brand-gray-light shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-brand-black">Business Hours</h2>
            <div className="space-y-2 text-lg text-brand-gray-dark">
              <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
              <p>Saturday: 8:00 AM - 3:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-brand-white rounded-lg p-6 sm:p-8 border border-brand-gray-light shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-brand-black">Contact & Social Media</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brand-gray-dark">
                <Phone size={22} className="flex-shrink-0" />
                <a href="tel:508-361-3449" className="hover:text-brand-black transition-colors text-lg">
                  508-361-3449
                </a>
              </div>
              <div className="flex items-center gap-3 text-brand-gray-dark">
                <Mail size={22} className="flex-shrink-0" />
                <a href="mailto:ktpainting10@gmail.com" className="hover:text-brand-black transition-colors text-lg break-all">
                  ktpainting10@gmail.com
                </a>
              </div>
              <div className="pt-4 border-t border-brand-gray-light">
                <h3 className="text-lg font-medium mb-4 text-brand-black">Follow Us</h3>
                <div className="flex flex-col gap-4">
                  <a 
                    href="https://www.facebook.com/profile.php?id=61574474212672" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-gray-dark hover:text-brand-black transition-colors text-lg touch-manipulation"
                  >
                    <Facebook size={22} className="flex-shrink-0" />
                    <span>KT PAINTING</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/ktpainting_inc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-gray-dark hover:text-brand-black transition-colors text-lg touch-manipulation"
                  >
                    <Instagram size={22} className="flex-shrink-0" />
                    <span>@ktpainting_inc</span>
                  </a>
                  <a 
                    href="https://www.tiktok.com/@ktpainting_inc10" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-gray-dark hover:text-brand-black transition-colors text-lg touch-manipulation"
                  >
                    <BrandTiktok size={22} className="flex-shrink-0" />
                    <span>@ktpainting_inc10</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}