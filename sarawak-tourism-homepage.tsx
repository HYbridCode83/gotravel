import React from 'react';
import { MapPin, Mountain, Home, Camera } from 'lucide-react';

const destinations = [
  {
    name: "Bako National Park",
    description: "A stunning coastal park known for its diverse wildlife and unique landscapes.",
    highlights: ["Proboscis monkeys", "Diverse hiking trails", "Pristine beaches"],
    imageUrl: "/api/placeholder/400/300"
  },
  {
    name: "Semenggoh Wildlife Centre",
    description: "A renowned orangutan rehabilitation center near Kuching.",
    highlights: ["Orangutan feeding sessions", "Conservation efforts", "Lush rainforest setting"],
    imageUrl: "/api/placeholder/400/300"
  },
  {
    name: "Mulu National Park",
    description: "A UNESCO World Heritage site famous for its extensive cave systems.",
    highlights: ["Massive cave chambers", "Unique limestone formations", "Aerial walkways"],
    imageUrl: "/api/placeholder/400/300"
  },
  {
    name: "Kuching City",
    description: "The charming capital of Sarawak with rich cultural heritage.",
    highlights: ["Waterfront walk", "Traditional markets", "Colonial architecture"],
    imageUrl: "/api/placeholder/400/300"
  }
];

const DestinationCard = ({ destination }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
    <img 
      src={destination.imageUrl} 
      alt={destination.name} 
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2 text-blue-800">{destination.name}</h3>
      <p className="text-gray-600 mb-3">{destination.description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <MapPin className="mr-2 text-blue-500" size={20} />
        Highlights:
      </div>
      <ul className="list-disc list-inside text-gray-700">
        {destination.highlights.map((highlight, index) => (
          <li key={index} className="mb-1">{highlight}</li>
        ))}
      </ul>
    </div>
  </div>
);

const SarawakTourismHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="mr-3" size={36} />
            <h1 className="text-3xl font-bold">Discover Sarawak</h1>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="hover:text-blue-200">Home</a>
            <a href="#" className="hover:text-blue-200">Destinations</a>
            <a href="#" className="hover:text-blue-200">About</a>
            <a href="#" className="hover:text-blue-200">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Explore the Wonders of Sarawak</h2>
          <p className="text-xl mb-8">Discover breathtaking landscapes, rich culture, and unique wildlife</p>
          <button className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-blue-100 transition">
            Plan Your Adventure
          </button>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
          <Mountain className="inline-block mr-3" size={36} />
          Top Destinations
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard key={index} destination={destination} />
          ))}
        </div>
      </section>

      {/* Featured Experience Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Camera className="mx-auto mb-6 text-blue-700" size={64} />
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Capture Your Sarawak Moments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            From wildlife encounters to cultural experiences, Sarawak offers unique memories that will last a lifetime.
          </p>
          <button className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition">
            View Photo Gallery
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Discover Sarawak. All Rights Reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-blue-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300">Terms of Service</a>
            <a href="#" className="hover:text-blue-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SarawakTourismHomepage;
