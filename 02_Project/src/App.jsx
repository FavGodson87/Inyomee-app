import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from "./Context/StoreContext";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./components/VerifyPage/Verify";
import MyOrders from "./Pages/MyOrder/MyOrders";
import Favorites from "./Pages/Favorites/Favorites";
import ScrollRestoration from "./components/ScrollRestoration";
import ModalProvider from "./components/Modal/ModalProvider";
import SearchResults from "./Pages/SearchResults";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ResetPassword from "./components/LoginPopup/ResetPassword";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";

const ProtectedRoute = ({ userLoggedIn, children }) => {
  if (!userLoggedIn) {
    alert("You must be logged in to place an order!");
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { token, authLoading} = useContext(StoreContext);

  if (authLoading) {
    return <LoadingSkeleton />;
  }

  const userLoggedIn = !!token;

  return (
    // ModalProvider should wrap EVERYTHING
    <ModalProvider>
      <div>
        {showLogin && (
          <LoginPopup
            setShowLogin={setShowLogin}
          />
        )}

        <div className="app">
          <Navbar setShowLogin={setShowLogin} userLoggedIn={userLoggedIn} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/order"
              element={
                <ProtectedRoute userLoggedIn={userLoggedIn}>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorder/verify" element={<Verify />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/search" element={<SearchResults/>} />
            <Route path="/reset-password" element={<ResetPassword setShowLogin={setShowLogin} />} />
          </Routes>
        </div>

        <Footer />
        <ScrollRestoration />
      </div>
    </ModalProvider>
  );
};

export default App;