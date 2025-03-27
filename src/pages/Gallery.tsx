import React, { useState } from 'react';

type ServiceType = 'exterior' | 'interior' | 'deck' | 'power-washing';

interface Project {
  id: number;
  image: string;
  category: ServiceType[];
  alt: string;
  isPlaceholder?: boolean;
}

const filters: { value: ServiceType; label: string }[] = [
  { value: 'exterior', label: 'Exterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'deck', label: 'Decks' },
  { value: 'power-washing', label: 'Power Washing' },
];

const projects: Project[] = [
  {
    id: 1,
    image: 'https://i.postimg.cc/Wpkn9hZz/Screenshot-2025-03-25-150241.png',
    category: ['exterior'],
    alt: 'Exterior Project 1',
  },
  {
    id: 2,
    image: 'https://i.postimg.cc/pL5MR9Mt/IMG-3882.jpg',
    category: ['exterior'],
    alt: 'Exterior Project 2',
  },
  {
    id: 3,
    image: 'https://i.postimg.cc/PJBCBX8k/Screenshot-2025-03-25-151915.png',
    category: ['exterior'],
    alt: 'Exterior Project 3',
  },
  {
    id: 4,
    image: 'https://i.postimg.cc/9M44Qw27/Screenshot-2025-03-25-151935.png',
    category: ['exterior'],
    alt: 'Exterior Project 4',
  },
  {
    id: 5,
    image: 'https://i.postimg.cc/XY3rFjFr/exterior-23.jpg',
    category: ['exterior'],
    alt: 'Exterior Project 5',
  },
  {
    id: 6,
    image: 'https://i.postimg.cc/BngXBrcM/Exterior-22.jpg',
    category: ['exterior'],
    alt: 'Exterior Project 6',
  },
  {
    id: 7,
    image: 'https://i.postimg.cc/QMW844d1/IMG-0130-2.jpg',
    category: ['deck'],
    alt: 'Deck Staining Project 1',
  },
  {
    id: 8,
    image: 'https://i.postimg.cc/sfmRMyPg/64564549113-BC664-FB3-6918-4652-B10-E-86-CD921-F49-F0.jpg',
    category: ['deck'],
    alt: 'Deck Staining Project 2',
  },
  {
    id: 9,
    image: 'https://i.postimg.cc/R02Jbjqf/Deck-painting-1.jpg',
    category: ['deck'],
    alt: 'Deck Staining Project 3',
  },
  {
    id: 10,
    image: 'https://i.postimg.cc/KzL3XJgW/Deck-painting-2.jpg',
    category: ['deck'],
    alt: 'Deck Staining Project 4',
  },
  {
    id: 11,
    image: 'https://i.postimg.cc/Bnxx975K/Interior-1.jpg',
    category: ['interior'],
    alt: 'Interior Project 1',
  },
  {
    id: 12,
    image: 'https://i.postimg.cc/Dz6LmWMf/Interior-2.jpg',
    category: ['interior'],
    alt: 'Interior Project 2',
  },
  {
    id: 13,
    image: 'https://i.postimg.cc/Sst97B4w/Interior-3.jpg',
    category: ['interior'],
    alt: 'Interior Project 3',
  },
  {
    id: 14,
    image: 'https://i.postimg.cc/5yYCPsNj/Intereior-4.jpg',
    category: ['interior'],
    alt: 'Interior Project 4',
  },
  {
    id: 15,
    image: 'https://i.postimg.cc/wxZJtY0N/Interior-5.jpg',
    category: ['interior'],
    alt: 'Interior Project 5',
  },
  {
    id: 16,
    image: 'https://i.postimg.cc/prL99x6w/power-wash-1.jpg',
    category: ['power-washing'],
    alt: 'Power Washing Project 1',
  },
  {
    id: 17,
    image: 'https://i.postimg.cc/vT24fkRc/Power-wash-22222.jpg',
    category: ['power-washing'],
    alt: 'Power Washing Project 2',
  },
  {
    id: 18,
    image: 'https://i.postimg.cc/d143cpV4/power-wash-3.jpg',
    category: ['power-washing'],
    alt: 'Power Washing Project 3',
  }
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<ServiceType>('exterior');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredProjects = projects.filter(project => 
    project.category.includes(activeFilter)
  );

  return (
    <div className="main-container">
      <h1 className="text-3xl font-bold section-spacing">Project Gallery</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
              activeFilter === filter.value
                ? 'bg-brand-black text-brand-white shadow-md scale-105'
                : 'bg-brand-white text-brand-gray hover:bg-brand-gray-light hover:scale-102'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="aspect-square bg-brand-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {project.isPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center bg-brand-gray-light">
                <p className="text-brand-gray text-lg font-medium text-center px-4">
                  {project.alt}
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.alt}
                  className={`gallery-image ${
                    hoveredId === project.id ? 'scale-105' : 'scale-100'
                  }`}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}