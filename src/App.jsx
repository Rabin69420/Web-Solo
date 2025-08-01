import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RentalHomepage from './User/Pages/Homepage';
import AboutUs from './User/Components/About';
import Services from './User/Components/Services';
import Login from './User/Pages/Login';
import Signup from './User/Pages/Signup';
import ContactPage from './User/Components/Contact';
import Overview from './User/Pages/Overview';
import BrowseProperties from './User/Pages/BrowseProperties';
import SavedProperties from './User/Pages/SavedProperties';
import ProfilePage from './User/Pages/Profile';
import SignOut from './User/Pages/Signout';
import AdminUsers from './Admin/Pages/UserManagement';
import AdminDashboard from './Admin/Pages/AdminOverview';
import PropertiesDashboard from './Admin/Pages/PropertyManagement';
import ViewDetails from './User/Components/viewdetails';
import AdminViewDetails from './Admin/Components/AdminViewDetails';
import UserViewDetails from './Admin/Components/UserViewDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RentalHomepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/viewdetails" element={<ViewDetails />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/browse" element={<BrowseProperties />} />
        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/properties" element={<PropertiesDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/viewdetails" element={<AdminViewDetails />} />
        <Route path="/admin/viewuserdetails" element={<UserViewDetails />} />
      </Routes>
    </Router>
  );
}

export default App;