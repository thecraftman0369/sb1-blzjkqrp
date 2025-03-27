import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
  service: string;
}

const reviews: Review[] = [
  {
    name: "Michael R.",
    date: "March 2024",
    rating: 5,
    text: "KT PAINTING transformed our home's exterior completely. The attention to detail was impressive - they properly prepped every surface and the finish is flawless. The team was professional, punctual, and kept everything tidy throughout the project.",
    service: "Exterior Painting"
  },
  {
    name: "Sarah B.",
    date: "February 2024",
    rating: 5,
    text: "We hired KT PAINTING for our kitchen and living room. Their color consultation was incredibly helpful, and the final result exceeded our expectations. The crew was respectful of our space and completed the work right on schedule.",
    service: "Interior Painting"
  },
  {
    name: "David M.",
    date: "January 2024",
    rating: 5,
    text: "Outstanding work on our deck restoration project. The team took extra care to protect our landscaping during the power washing and staining process. The finish is beautiful and exactly what we wanted.",
    service: "Deck Staining"
  },
  {
    name: "Jennifer L.",
    date: "December 2023",
    rating: 5,
    text: "As a business owner, I appreciate contractors who understand professionalism. KT PAINTING worked around our schedule to minimize disruption and delivered exceptional results. Our office looks fantastic!",
    service: "Commercial Painting"
  },
  {
    name: "Robert K.",
    date: "November 2023",
    rating: 5,
    text: "The power washing service was excellent. They restored our driveway and patio to like-new condition. Very thorough and careful around delicate areas. Highly recommend their services.",
    service: "Power Washing"
  },
  {
    name: "Amanda P.",
    date: "October 2023",
    rating: 5,
    text: "We had multiple rooms painted including our two-story foyer. The team was skilled, efficient, and paid great attention to detail. The lines are crisp and the coverage is perfect. Already planning to have them back for our basement.",
    service: "Interior Painting"
  }
];

export default function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Client Testimonials</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-brand-gray-light">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-medium text-brand-black">{review.name}</p>
                <p className="text-sm text-brand-gray">{review.date}</p>
              </div>
              <Quote className="h-8 w-8 text-brand-gray-light" />
            </div>
            <p className="text-brand-gray-dark mb-3">{review.text}</p>
            <p className="text-sm font-medium text-brand-black">Service: {review.service}</p>
          </div>
        ))}
      </div>
    </div>
  );
}