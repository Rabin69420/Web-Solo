import React from 'react';
import { Heart, MapPin, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const RentalHomepage = () => {
  // Featured rental properties data - simplified
  const featuredRentals = [
    {
      id: 1,
      title: "Luxury Penthouse Suite",
      location: "Manhattan, New York",
      price: 450,
      image: "https://picsum.photos/seed/penthouse/400/280",
      type: "Penthouse",
    },
    {
      id: 2,
      title: "Oceanfront Villa",
      location: "Malibu, California",
      price: 680,
      image: "https://picsum.photos/seed/villa/400/280",
      type: "Villa",
    },
    {
      id: 3,
      title: "Historic Mansion",
      location: "Charleston, South Carolina",
      price: 320,
      image: "https://picsum.photos/seed/mansion/400/280",
      type: "Mansion",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <main>
        {/* Premium Hero Section */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Discover
                <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Extraordinary
                </span>
                Rentals
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                Indulge in the world's most exceptional properties. From historic mansions to oceanfront villas,
                find the perfect home for your next getaway.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Award className="text-amber-600 mr-3" size={24} />
                <span className="text-slate-700 font-medium">Exceptional Properties</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Shield className="text-amber-600 mr-3" size={24} />
                <span className="text-slate-700 font-medium">Verified & Secure</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Rentals - Premium Design */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 opacity-90"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600 opacity-10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                Signature Properties
              </h2>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                Immerse yourself in luxury with our most coveted properties,
                each offering unparalleled elegance and an extraordinary stay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredRentals.map((rental) => (
                <div key={rental.id} className="group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3">
                    <div className="relative overflow-hidden">
                      <img
                        src={rental.image}
                        alt={rental.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300 group-hover:scale-110">
                        <Heart size={20} className="text-slate-700 hover:text-red-500" />
                      </button>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-2">
                        {rental.title}
                      </h3>

                      <p className="text-slate-600 mb-6 flex items-center gap-2">
                        <MapPin size={16} className="text-amber-600" />
                        {rental.location}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-3xl font-bold text-slate-900">${rental.price}</span>
                          <span className="text-slate-600 font-light"> / night</span>
                        </div>
                        <Link
                          to="/login"
                          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Reserve Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Premium */}
        <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                The RentEasy Difference
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Experience renting redefined through our commitment to excellence,
                authenticity, and creating memories that last a lifetime.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Award size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Curated Excellence</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Every property undergoes a rigorous selection process, ensuring only the finest homes make it to our collection.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Trusted Security</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Your peace of mind is paramount. All bookings are protected by our comprehensive insurance and verification systems.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RentalHomepage;
