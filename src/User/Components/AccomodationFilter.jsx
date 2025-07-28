import React from 'react';
import { Home, Building, Bed, Users } from 'lucide-react';

const AccommodationFilter = ({ selectedTypes, onTypeChange }) => {
  const accommodationTypes = [
    { 
      key: 'whole_house', 
      label: 'Entire House', 
      icon: Home,
      description: 'Full privacy, your own space'
    },
    { 
      key: 'whole_apartment', 
      label: 'Entire Apartment', 
      icon: Building,
      description: 'Complete apartment unit'
    },
    { 
      key: 'whole_flat', 
      label: 'Entire Flat', 
      icon: Building,
      description: 'Full flat accommodation'
    },
    { 
      key: 'single_room', 
      label: 'Single Room', 
      icon: Bed,
      description: 'Private room, shared facilities'
    },
    { 
      key: 'multiple_rooms', 
      label: 'Multiple Rooms', 
      icon: Users,
      description: 'Rent multiple rooms together'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">Accommodation Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {accommodationTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedTypes.includes(type.key);
          
          return (
            <button
              key={type.key}
              onClick={() => onTypeChange(type.key)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-amber-600' : 'text-gray-600'}`} />
              <div className="font-semibold text-sm mb-1">{type.label}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccommodationFilter;
