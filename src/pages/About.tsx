import React from 'react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-brand-black">About KT PAINTING</h1>
      
      <div className="bg-white rounded-lg p-6 sm:p-8 mb-12 shadow-sm">
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-lg text-brand-gray-dark leading-relaxed">
            Since our founding, we've been dedicated to delivering excellence in every project.
          </p>
          
          <p className="text-lg text-brand-gray-dark leading-relaxed">
            At KT PAINTING, our mission is to transform spaces and exceed expectations through professional painting services that combine:
          </p>
          
          <ul className="list-none space-y-2 max-w-lg mx-auto">
            <li className="text-lg text-brand-gray-dark leading-relaxed">• Premium materials</li>
            <li className="text-lg text-brand-gray-dark leading-relaxed">• Expert craftsmanship</li>
            <li className="text-lg text-brand-gray-dark leading-relaxed">• Unwavering attention to detail</li>
          </ul>
          
          <p className="text-lg text-brand-gray-dark leading-relaxed font-medium">
            We're committed to delivering lasting quality while providing an exceptional customer experience.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 max-w-4xl mx-auto">
          <div className="w-full md:w-1/3">
            <img
              src="https://i.postimg.cc/BbhSHPyJ/FB544141-1-BED-4-BD2-BC5-F-0-B18-BD575-EA3.jpg"
              alt="Kosta Tsiantoulas, Founder of KT PAINTING"
              className="w-full h-auto rounded-lg shadow-md object-cover aspect-square"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-brand-black">Our Founder</h2>
            <p className="text-lg text-brand-gray-dark leading-relaxed">
              Founded by Kosta Tsiantoulas, KT PAINTING emerged from a passion for transforming spaces and delivering exceptional quality. With years of experience in the painting industry, Kosta built KT PAINTING on the foundations of craftsmanship, integrity, and customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}