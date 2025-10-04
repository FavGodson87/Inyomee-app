import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../Modal/useModal";
import { CiSettings } from "react-icons/ci";
import {
  CiSearch,
  CiShoppingCart,
  CiUser,
  CiHeart,
  CiHome,
  CiBowlNoodles,
  CiPassport1,
  CiViewBoard,
  CiLogout,
} from "react-icons/ci";
import { assets } from "../../assets/assets";
import InitialsAvatar from "../InitialsAvatar/InitialsAvatar";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menu, setMenu] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(-1);

  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const { getTotalCartAmount, token, setToken, foodList, userData, username } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const location = useLocation();
  const navigateTo = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleDesktopSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    setShowDesktopSuggestions(false);
    setActiveIndex(-1);
  };

  const handleMobileSearch = () => {
    if (!mobileSearchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(mobileSearchQuery.trim())}`);
    setShowMobileSuggestions(false);
    setMobileActiveIndex(-1);
    setIsSearchOpen(false);
  };

  const { openModal } = useModal();

  const logout = () => {
    openModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Log Out",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("username");

        setToken("");
        navigate("/");
      },
    });
  };

  const liStyle = "cursor-pointer hover:text-green-500 transition-colors";

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const goToSection = (id) => {
    // Always update the menu state first
    setMenu(id === "top" ? "home" : id);

    if (window.location.pathname !== "/") {
      // If not on home page, navigate to home first
      navigate("/", {
        state: { scrollTo: id }, // Pass the section to scroll to
      });
    } else {
      // If already on home page, scroll to section
      scrollToSection(id);
    }
  };

  // Separate function for scrolling to handle both cases
  const scrollToSection = (id) => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        // Fallback: scroll to top if section not found
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  // Filter suggestions helper
  const filterSuggestions = (query) => {
    if (!query.trim()) return foodList.slice(0, 5);
    return foodList
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  // Handle desktop search input changes
  const handleDesktopSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSuggestions(filterSuggestions(value));
    setActiveIndex(-1);
  };

  // Handle mobile search input changes
  const handleMobileSearchChange = (e) => {
    const value = e.target.value;
    setMobileSearchQuery(value);
    setMobileSuggestions(filterSuggestions(value));
    setMobileActiveIndex(-1);
  };

  // Handle desktop search focus
  const handleDesktopSearchFocus = () => {
    setShowDesktopSuggestions(true);
    setSuggestions(filterSuggestions(searchQuery));
  };

  // Handle mobile search focus
  const handleMobileSearchFocus = () => {
    setShowMobileSuggestions(true);
    setMobileSuggestions(filterSuggestions(mobileSearchQuery));
  };

  // Desktop keyboard navigation
  const handleDesktopKeyDown = (e) => {
    if (!showDesktopSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") handleDesktopSearch();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          const selectedItem = suggestions[activeIndex];
          setSearchQuery(selectedItem.name);
          navigate(`/search?query=${encodeURIComponent(selectedItem.name)}`);
          setShowDesktopSuggestions(false);
          setActiveIndex(-1);
        } else {
          handleDesktopSearch();
        }
        break;
      case "Escape":
        setShowDesktopSuggestions(false);
        setActiveIndex(-1);
        desktopInputRef.current?.blur();
        break;
    }
  };

  // Mobile keyboard navigation
  const handleMobileKeyDown = (e) => {
    if (!showMobileSuggestions || mobileSuggestions.length === 0) {
      if (e.key === "Enter") handleMobileSearch();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setMobileActiveIndex((prev) =>
          prev < mobileSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setMobileActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (mobileActiveIndex >= 0 && mobileSuggestions[mobileActiveIndex]) {
          const selectedItem = mobileSuggestions[mobileActiveIndex];
          setMobileSearchQuery(selectedItem.name);
          navigate(`/search?query=${encodeURIComponent(selectedItem.name)}`);
          setShowMobileSuggestions(false);
          setMobileActiveIndex(-1);
          setIsSearchOpen(false);
        } else {
          handleMobileSearch();
        }
        break;
      case "Escape":
        setShowMobileSuggestions(false);
        setMobileActiveIndex(-1);
        mobileInputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion selection
  const selectDesktopSuggestion = (item) => {
    setSearchQuery(item.name);
    navigate(`/search?query=${encodeURIComponent(item.name)}`);
    setShowDesktopSuggestions(false);
    setActiveIndex(-1);
  };

  const selectMobileSuggestion = (item) => {
    setMobileSearchQuery(item.name);
    navigate(`/search?query=${encodeURIComponent(item.name)}`);
    setShowMobileSuggestions(false);
    setMobileActiveIndex(-1);
    setIsSearchOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Profile dropdown
      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(e.target) &&
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      // Desktop search dropdown
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target)
      ) {
        setShowDesktopSuggestions(false);
        setActiveIndex(-1);
      }

      // Mobile search dropdown
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setShowMobileSuggestions(false);
        setMobileActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const name = localStorage.getItem("name");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (username || email) {
      const displayName = localStorage.getItem("name") || username || email;
      setUser({ name: displayName, email });
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    // Check if we have a scroll target from navigation state
    if (window.location.pathname === "/" && location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location]);

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50">
      {/* NAVBAR */}
      <div className="px-7 md:px-8 lg:px-[100px] py-4 md:py-6 lg:py-5 flex justify-between items-center bg-white">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              setMenu("home");
            }}
          >
            <img
              src={assets.inyo}
              alt="Logo"
              className="w-30 lg:w-50 h-auto sm:w-30"
            />
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <ul className="hidden lg:flex items-center gap-4 font-medium text-sm text-[#2e2e2e]">
          <li>
            <button
              onClick={() => {
                goToSection("top");
                setMenu("home");
              }}
              className={`${liStyle} ${
                menu === "home" ? "text-green-500" : ""
              }`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                goToSection("explore-menu");
                setMenu("menu");
              }}
              className={`${liStyle} ${
                menu === "menu" ? "text-green-500" : ""
              }`}
            >
              Menu
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                goToSection("app-download");
                setMenu("mobile-app");
              }}
              className={`${liStyle} ${
                menu === "mobile-app" ? "text-green-500" : ""
              }`}
            >
              Mobile-App
            </button>
          </li>
          <li>
            <Link
              to="/favorites"
              onClick={() => setMenu("favorites")}
              className={`${liStyle} ${
                menu === "favorites" ? "text-green-500" : ""
              }`}
            >
              Favorites
            </Link>
          </li>
        </ul>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {/* Desktop search input */}
          <div className="hidden xl:flex relative" ref={desktopSearchRef}>
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2e2e2e] text-2xl cursor-pointer" />
            <input
              ref={desktopInputRef}
              type="text"
              placeholder="Craving something? Find it here…"
              value={searchQuery}
              onChange={handleDesktopSearchChange}
              onFocus={handleDesktopSearchFocus}
              onKeyDown={handleDesktopKeyDown}
              className="bg-green-500/5 text-black text-[16px] pl-12 pr-3 
              py-1 rounded-full text-sm focus:outline-none w-[400px] h-[40px] 
              transition-all duration-200 hover:bg-green-200/40 focus:ring-2 focus:ring-green-500"
            />

            {/* Desktop suggestions dropdown */}
            {showDesktopSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <li
                    key={item._id}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      index === activeIndex
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50"
                    }`}
                    onClick={() => selectDesktopSuggestion(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search icon for medium screens (1024px-1279px) */}
          <div className="hidden lg:block xl:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CiSearch className="w-5 h-5 text-[#2e2e2e]" />
            </button>
          </div>

          {/* Icons and profile for authenticated users */}
          {token ? (
            <div
              className="hidden lg:flex items-center gap-2 relative"
              ref={desktopProfileRef}
            >
              <Link
                to="/cart"
                onClick={() => setMenu("cart")}
                className="relative"
              >
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <CiShoppingCart
                    className={`w-5 h-5 ${
                      menu === "cart" ? "text-green-500" : "text-[#2e2e2e]"
                    }`}
                  />
                </button>
                {getTotalCartAmount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </Link>

              <button
                onClick={toggleProfile}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <InitialsAvatar
                  name={userData?.name || username || ""}
                  size={32}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-7 mt-2 w-36 bg-white shadow-md rounded-lg border border-gray-200 flex flex-col transition-all">
                  <button
                    onClick={() => navigateTo("/myorders")}
                    className="px-4 flex gap-1.5 items-center py-2 hover:bg-green-50 text-sm text-neutral-700 w-full text-left"
                  >
                    <CiViewBoard className="mb-1" /> Orders
                  </button>

                  <button
                    onClick={() => navigateTo("/settings")}
                    className="px-4 flex gap-1.5 items-center py-2 hover:bg-green-50 text-sm text-neutral-700 w-full text-left"
                  >
                    <CiSettings className="mb-1" /> Settings
                  </button>

                  <button
                    onClick={logout}
                    className="px-4 py-2 flex gap-1.5 items-center hover:bg-red-50 text-sm text-red-500 text-left w-full"
                  >
                    <CiLogout className="mb-1" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Sign In button for unauthenticated users - desktop only */
            <button
              className="hidden lg:block bg-green-500 text-amber-100 text-sm font-bold w-[100px] h-[40px] rounded-full cursor-pointer hover:scale-105 transition-all duration-100 ease-in-out"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          )}
        </div>

        {/* MOBILE TOP BAR */}
        <div
          className="flex lg:hidden items-center gap-2 relative"
          ref={mobileProfileRef}
        >
          {/* Search icon */}
          <button
            onClick={toggleSearch}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CiSearch className="w-5 h-5 text-[#2e2e2e]" />
          </button>

          {/* Profile icon or Sign In button */}
          {token ? (
            <>
              <button
                onClick={() => {
                  toggleProfile();
                  setMenu("profile");
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <InitialsAvatar
                  name={userData?.name || username || ""}
                  size={32}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-7 mt-2 w-36 bg-white shadow-md rounded-lg border border-gray-200 flex flex-col transition-all">
                  <Link
                    to="/myorders"
                    className="px-4 flex gap-1.5 items-center py-2 hover:bg-green-50 text-sm text-neutral-700"
                    onClick={() => setProfileOpen(false)}
                  >
                    <CiViewBoard className="mb-1" /> Orders
                  </Link>

                  <button
                    onClick={() => navigateTo("/settings")}
                    className="px-4 flex gap-1.5 items-center py-2 hover:bg-green-50 text-sm text-neutral-700 w-full text-left"
                  >
                    <CiSettings className="mb-1" /> Settings
                  </button>

                  <button
                    onClick={logout}
                    className="px-4 py-2 flex gap-1.5 items-center hover:bg-red-50 text-sm text-red-500 text-left w-full"
                  >
                    <CiLogout className="mb-1" /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              className="bg-green-500 text-amber-100 text-xs font-bold px-3 py-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-100 ease-in-out"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Medium screen search input */}
      {isSearchOpen && (
        <div className="py-6 px-7 md:px-8 lg:px-[100px] xl:hidden bg-white border-t border-gray-100">
          <div className="relative" ref={mobileSearchRef}>
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2e2e2e] w-4 h-4" />
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Craving something? Find it here…"
              value={mobileSearchQuery}
              onChange={handleMobileSearchChange}
              onFocus={handleMobileSearchFocus}
              onKeyDown={handleMobileKeyDown}
              className="bg-green-500/5 text-black text-sm pl-10 pr-4 py-2 rounded-full focus:outline-none w-full transition-all duration-200 hover:bg-green-200/40 focus:ring-2 focus:ring-green-500"
              autoFocus
            />

            {/* Mobile suggestions dropdown */}
            {showMobileSuggestions && mobileSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {mobileSuggestions.map((item, index) => (
                  <li
                    key={item._id}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      index === mobileActiveIndex
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50"
                    }`}
                    onClick={() => selectMobileSuggestion(item)}
                    onMouseEnter={() => setMobileActiveIndex(index)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-inner flex justify-around items-center h-16 z-50 lg:hidden">
        <button
          onClick={() => {
            goToSection("top");
            setMenu("home");
          }}
          className={`flex items-center justify-center transition-colors ${
            menu === "home" ? "text-green-500" : "text-[#2e2e2e]"
          }`}
        >
          <CiHome className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            goToSection("explore-menu");
            setMenu("menu");
          }}
          className={`flex items-center justify-center transition-colors ${
            menu === "menu" ? "text-green-500" : "text-[#2e2e2e]"
          }`}
        >
          <CiBowlNoodles className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            goToSection("app-download");
            setMenu("mobile-app");
          }}
          className={`flex items-center justify-center transition-colors ${
            menu === "mobile-app" ? "text-green-500" : "text-[#2e2e2e]"
          }`}
        >
          <CiPassport1 className="w-6 h-6" />
        </button>
        <Link
          to="/cart"
          onClick={() => setMenu("cart")}
          className={`flex items-center justify-center relative transition-colors ${
            menu === "cart" ? "text-green-500" : "text-[#2e2e2e]"
          }`}
        >
          <CiShoppingCart className="w-6 h-6" />
          {getTotalCartAmount() > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
          )}
        </Link>
        <Link
          to="/favorites"
          onClick={() => setMenu("favorites")}
          className={`flex items-center justify-center transition-colors ${
            menu === "favorites" ? "text-green-500" : "text-[#2e2e2e]"
          }`}
        >
          <CiHeart className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
