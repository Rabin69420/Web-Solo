import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RentalHomepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/browse" element={<BrowseProperties />} />
          <Route path="/viewdetails" element={<ViewDetails />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          <Route path="/overview" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute>
              <SavedProperties />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/signout" element={
            <ProtectedRoute>
              <SignOut />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/properties" element={
            <ProtectedRoute adminOnly={true}>
              <PropertiesDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/viewdetails" element={
            <ProtectedRoute adminOnly={true}>
              <AdminViewDetails />
            </ProtectedRoute>
          } />
          <Route path="/admin/viewuserdetails" element={
            <ProtectedRoute adminOnly={true}>
              <UserViewDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;