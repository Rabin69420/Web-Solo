import React from 'react';
import { Award, Heart, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Rabin Joshi",
      role: "Founder & CEO",
      image: "https://picsum.photos/seed/rabin/300/300",
      bio: "The visionary behind RentEasy's diverse collection of homes."
    }
  ];

  const values = [
    {
      icon: <Award size={32} />,
      title: "Quality",
      description: "We curate a wide range of properties, ensuring every home meets our high standards for comfort and safety."
    },
    {
      icon: <Heart size={32} />,
      title: "Authenticity",
      description: "Every property offers a genuine sense of place, helping to create lasting and memorable experiences."
    },
    {
      icon: <Shield size={32} />,
      title: "Trust",
      description: "Your security is paramount. We ensure every booking is protected and every host is verified."
    },
    {
      icon: <Globe size={32} />,
      title: "Variety",
      description: "From cozy apartments to sprawling villas, we connect you with the perfect home for any budget."
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
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              A Perfect Home
              <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                for Every Budget
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Founded on the belief that everyone deserves a great place to stay, 
              RentEasy connects you with the perfect rental, no matter your budget.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-gradient-to-r from-slate-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">
                  Making Great Stays Accessible
                </h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    What began as a passion project to share unique homes has evolved into a global platform 
                    that serves travelers of all kinds. We believe a memorable stay shouldn't be limited by price.
                  </p>
                  <p>
                    Our founder saw an opportunity to bridge the gap between impersonal bookings and finding a place that truly feels like home.
                    Thus, RentEasy was born to offer a curated selection for every taste and budget.
                  </p>
                  <p>
                    Today, we pride ourselves on a diverse selection process, ensuring every 
                    property in our collection offers great value, comfort, and quality.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl p-8 shadow-2xl">
                  <img 
                    src="https://picsum.photos/seed/story-variety/500/400"
                    alt="Comfortable home interior" 
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                These principles guide every decision we make and every home we list.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Meet Our Founder
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The visionary behind RentEasy.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-48 h-48 object-cover rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300 mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-full group-hover:opacity-0 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {member.bio}
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

export default AboutUs;
