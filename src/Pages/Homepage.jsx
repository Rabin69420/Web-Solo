import React from "react";

export default function Homepage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold text-blue-600">RentEasy</div>
        <div className="flex space-x-4">
          <button className="text-sm font-medium px-4 py-2 rounded hover:bg-blue-100">Home</button>
          <button className="text-sm font-medium px-4 py-2 rounded hover:bg-blue-100">Browse Listings</button>
          <button className="text-sm font-medium px-4 py-2 rounded hover:bg-blue-100">About Us</button>
          <button className="text-sm font-medium px-4 py-2 rounded hover:bg-blue-100">Contact</button>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-50 text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Home</h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Browse rooms, apartments, and homes for rent in your area. Simple,
          Fast, Reliable.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Browse Listings
        </button>
      </section>

      {/* Featured Listings */}
      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Listing 1 */}
          <div className="rounded shadow hover:shadow-lg transition p-4">
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Modern Apartment"
              className="rounded mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold">Modern 2BR Apartment</h3>
            <p className="text-gray-600">Buddhanagar, New Baneshwor</p>
            <p className="text-blue-600 font-medium mt-2">Rs.35000/month</p>
          </div>

          {/* Listing 2 */}
          <div className="rounded shadow hover:shadow-lg transition p-4">
            <img
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
              alt="Cozy Studio"
              className="rounded mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold">Cozy Studio Apartment</h3>
            <p className="text-gray-600">Mahadevsthan, koteshowr</p>
            <p className="text-blue-600 font-medium mt-2">Rs.31000/month</p>
          </div>

          {/* Listing 3 */}
          <div className="rounded shadow hover:shadow-lg transition p-4">
            <img
              src="https://images.unsplash.com/photo-1560185127-6ecfeda4f7c5"
              alt="Spacious House"
              className="rounded mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold">Spacious 4BR House</h3>
            <p className="text-gray-600">Lubhu, Lalitpur</p>
            <p className="text-blue-600 font-medium mt-2">Rs. 30000/month</p>
          </div>
        </div>
      </section>
    </div>
  );
}
