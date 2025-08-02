import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="pt-24 flex-grow">
        {/* Page Header */}
        <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              We're here to help and answer any question you might have. We look forward to hearing from you.
            </p>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
              <div className="space-y-10">
                {/* Email */}
                <div className="flex items-start gap-6">
                  <div className="bg-amber-100 text-amber-600 rounded-full p-4 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Email Us</h3>
                    <p className="text-slate-600 text-lg mb-2">Our team is ready to assist with any inquiries.</p>
                    <a href="mailto:contact@renteasy.com" className="text-amber-600 font-semibold hover:underline text-lg">
                      contact@renteasy.com
                    </a>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-6">
                  <div className="bg-amber-100 text-amber-600 rounded-full p-4 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Call Us</h3>
                    <p className="text-slate-600 text-lg mb-2">Speak with our support team directly for immediate help.</p>
                    <a href="tel:+1-234-567-890" className="text-amber-600 font-semibold hover:underline text-lg">
                      +977 9822123678
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-6">
                  <div className="bg-amber-100 text-amber-600 rounded-full p-4 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Visit Us</h3>
                    <p className="text-slate-600 text-lg">
                      Softwarica College of IT <br /> Dillibazar, Kathmandu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
