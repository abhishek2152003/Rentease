import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import CartSyncer from './components/CartSyncer';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccess from './pages/OrderSuccess';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import Sessions from './pages/Sessions';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import ProductAdd from './pages/admin/ProductAdd';
import OrderList from './pages/admin/OrderList';
import AdminContacts from './pages/admin/AdminContacts';
import AdminSessions from './pages/admin/AdminSessions';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Facing Storefront */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="userlist" element={<UserList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/new" element={<ProductAdd />} />
            <Route path="product/:id/edit" element={<ProductEdit />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="sessions" element={<AdminSessions />} />
          </Route>
        </Route>
      </Routes>
      <CartSyncer />
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;
