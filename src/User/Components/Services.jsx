import React from 'react';
import { Search, Home, Shield, MessageSquare, ClipboardCheck, Phone } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Services = () => {
  // Updated features to remove the concept of a property host
  const keyFeatures = [
    {
      icon: <Search size={32} />,
      title: "Easy Search & Filters",
      description: "Quickly find the perfect home with intuitive search and powerful filters for location, price, and amenities."
    },
    {
      icon: <Home size={32} />,
      title: "Detailed Property Listings",
      description: "View comprehensive listings with high-quality photos, detailed descriptions, and clear information."
    },
    {
      icon: <Shield size={32} />,
      title: "Secure Booking & Payments",
      description: "Book with confidence using our secure payment system that protects your financial information."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Booking & Inquiry Support",
      description: "Easily connect with our support team to ask questions about properties or coordinate your stay."
    },
    {
      icon: <ClipboardCheck size={32} />,
      title: "Professionally Vetted Listings",
      description: "Every property is professionally vetted and listed by our team to ensure quality and accuracy."
    },
    {
      icon: <Phone size={32} />,
      title: "Dedicated Customer Support",
      description: "Our support team is available to assist you with any questions or issues during your rental journey."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 right-10 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              Simple, Powerful Features
              <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                for Easy Renting
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              We provide the essential tools you need to find a home, without the unnecessary complexity.
            </p>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Our Key Features
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need for a smooth and successful rental experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="text-center group p-6">
                  <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
