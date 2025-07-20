import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import GiftingOptions from "./components/GiftingOptions";
import Dashboard from "./components/Dashbords/Dashboard";
import PrivateRoute from "./components/Dashbords/PrivateRoute";
import ServiceList from "./components/Services/ServiceList";
import SelectMembership from "./components/SelectMembership";
import AddService from "./components/Services/AddServiceForm";
import ProviderDashboard from "./components/Services/Provider/ProviderDashboard";
import CartPage from "./components/Services/CartPage";
import SendGiftForm from "./components/Services/SendGiftForm";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import GiftDetails from "./components/GiftDetails";
import SupportPage from "./components/SupportPage";
import CompanyInfo from "./components/CompanyInfo";
import Programs from "./components/pages/Programs";
import ManageMemberships from "./components/Dashbords/Admin/ManageMemberships";
import ManageServices from "./components/Dashbords/Admin/ManageServices";

import AdminAddGift from "./components/Dashbords/Admin/AdminAddGift";
import AdminAddProgram from "./components/Dashbords/Admin/AdminAddProgram";
import BlogCreate from "./components/Dashbords/Admin/BlogCreate";
import BlogList from "./components/Dashbords/Admin/BlogList";
import BlogDetail from "./components/pages/BlogDetail";
import AdminSupportRequests from "./components/Dashbords/Admin/AdminSupportRequests";
import AdminUserList from "./components/Dashbords/Admin/AdminUserList";

// Wrapper to conditionally render Navbar
const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register","/dashboard"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/gifting-options" element={<GiftingOptions />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/membership" element={<SelectMembership />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/admin/add-service" element={<AddService />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/send-gift" element={<SendGiftForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/terms" element={<TermsAndConditions />} />
       <Route path="/gifts/:slug" element={<GiftDetails />} />
       <Route path="/support" element={<SupportPage />} />
       <Route path="/company" element={<CompanyInfo />} />
       <Route path="/programs" element={<Programs />} />
       <Route path="admin/manage-membership" element={<ManageMemberships />} />
       <Route path="/admin/manage-services" element={<ManageServices/>} />
       <Route path="admin/add-program" element={<AdminAddProgram/>} />
       <Route path="admin/add-gift" element={<AdminAddGift />} />
       <Route path="/admin/blog-create" element={<BlogCreate />} />
       <Route path="/admin/blog-list" element={<BlogList />} />
       <Route path="/admin/user-lists" element={<AdminUserList />} />

      
       <Route path="/blogs/:slug" element={<BlogDetail />} />
<Route path="/admin/support-requests" element={<AdminSupportRequests />} />




      







        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
