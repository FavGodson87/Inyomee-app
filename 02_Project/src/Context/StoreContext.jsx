import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [rewardProgress, setRewardProgress] = useState(0);
  const [userData, setUserData] = useState(null);

  // const url = "http://localhost:4000";

  const url = window.location.hostname === 'localhost' ? "http://localhost:4000" : "";

  // --- Logout ---
  const handleLogout = () => {
    setCartItems({});
    setToken("");
    setUserId("");
    setEmail("");
    setUsername("");
    setRewardProgress(0);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("favorites");
    localStorage.removeItem("rewardProgress");
    localStorage.removeItem("userData");
    console.log("User logged out and storage cleared");
  };

  // --- Toggle Favorite ---
  const toggleFavorite = async (_id) => {
    if (!token) return alert("Login required");

    console.log("=== TOGGLE FAVORITE ===");
    console.log("Item ID:", _id);
    console.log("Current favorites:", favorites);

    const previousFavorites = favorites;
    const isCurrentlyFavorited = favorites.includes(_id);

    const newFavorites = isCurrentlyFavorited
      ? favorites.filter((favId) => favId !== _id)
      : [...favorites, _id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    try {
      let response;
      if (isCurrentlyFavorited) {
        response = await axios.delete(`${url}/api/favorites/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(
          `${url}/api/favorites/${_id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data && response.data.favorites) {
        const updatedFavorites = response.data.favorites.map((item) =>
          item._id ? item._id : item
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        console.log("Updated favorites from API response:", updatedFavorites);
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
      setFavorites(previousFavorites);
      localStorage.setItem("favorites", JSON.stringify(previousFavorites));

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Authentication failed. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to update favorites. Please try again.");
      }
    }
  };

  // --- Fetch food list ---
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/items`);
      setFoodList(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // --- Load cart data ---
  const loadCartData = async (authToken) => {
    if (!authToken) {
      setCartItems({});
      return;
    }
    try {
      const response = await axios.get(`${url}/api/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const newCartItems = {};
      if (Array.isArray(response.data)) {
        response.data.forEach((cartItem) => {
          if (cartItem.item && cartItem.item._id) {
            newCartItems[cartItem.item._id] = cartItem.quantity;
          }
        });
      }

      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } catch (error) {
      console.error("Error in loadCartData:", error);
      if (error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  // --- Add to cart ---
  const addToCart = async (_id) => {
    if (!token) return;
    const newCartItems = {
      ...cartItems,
      [_id]: (cartItems[_id] || 0) + 1,
    };
    setCartItems(newCartItems);

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart`,
          { itemId: _id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response?.status === 403) {
          handleLogout();
        }
      }
    }
  };

  // --- Remove from cart ---
  const removeFromCart = async (_id) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[_id] > 1) {
      updatedCart[_id] -= 1;
    } else {
      delete updatedCart[_id];
    }
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.delete(`${url}/api/cart/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error removing from cart:", error);
        if (error.response?.status === 403) {
          handleLogout();
        } else {
          loadCartData(token);
        }
      }
    }
  };

  // --- Delete item completely ---
  const deleteItemCompletely = async (_id) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[_id];
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.delete(`${url}/api/cart/${_id}?force=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error deleting item completely:", error);
        if (error.response?.status === 403) {
          handleLogout();
        } else {
          loadCartData(token);
        }
      }
    }
  };

  // --- Clear cart ---
  const clearCart = async () => {
    try {
      setCartItems({});
      const response = await fetch(`${url}/api/cart/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to clear cart on server");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // --- Total cart amount ---
  const getTotalCartAmount = () => {
    let total = 0;
    for (const _id in cartItems) {
      if (cartItems[_id] > 0) {
        const itemInfo = foodList.find((f) => f._id === _id);
        if (itemInfo) total += itemInfo.price * cartItems[_id];
      }
    }
    return total;
  };

  // --- Fetch User Rewards ---
  const fetchUserRewards = async (authToken) => {
    if (!authToken) {
      setRewardProgress(0);
      return;
    }

    try {
      console.log("Fetching rewards data...");
      const response = await axios.get(`${url}/api/user/rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("Rewards API response:", response.data);

      if (response.data && typeof response.data.rewardProgress === "number") {
        setRewardProgress(response.data.rewardProgress);
        localStorage.setItem(
          "rewardProgress",
          response.data.rewardProgress.toString()
        );

        // Update user data with latest rewards
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          userData.rewardProgress = response.data.rewardProgress;
          localStorage.setItem("userData", JSON.stringify(userData));
          setUserData(userData);
        }
      }
    } catch (rewardError) {
      console.error("Error fetching rewards:", rewardError);
      const storedRewards = localStorage.getItem("rewardProgress");
      if (storedRewards) {
        setRewardProgress(Number(storedRewards));
      }
    }
  };

  // --- Update Rewards After Successful Order ---
  const updateRewardsAfterOrder = () => {
    fetchUserRewards(token);

    localStorage.setItem("rewardProgress", newProgress.toString());

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      userData.rewardProgress = newProgress;
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserData(userData);
    }

    console.log("Rewards updated after order. New progress:", newProgress);
  };

  // --- Get Reward Tier Information ---
  const getRewardTierInfo = () => {
    if (rewardProgress >= 10)
      return { level: "Gold", discount: 5, nextLevel: "Max", progress: 100 };
    if (rewardProgress >= 5)
      return {
        level: "Silver",
        discount: 3,
        nextLevel: "Gold",
        progress: (rewardProgress / 10) * 100,
      };
    if (rewardProgress >= 3)
      return {
        level: "Bronze",
        discount: 1,
        nextLevel: "Silver",
        progress: (rewardProgress / 5) * 100,
      };
    return {
      level: "Starter",
      discount: 0,
      nextLevel: "Bronze",
      progress: (rewardProgress / 3) * 100,
    };
  };

  const fetchUserSettings = async (authToken = token) => {
    if (userData?.settings?.success) {
      console.log("Settings already loaded, skipping fetch");
      return userData.settings;
    }

    const currentToken = authToken || token;

    if (!currentToken) {
      console.log("No token available for fetching settings");
      return null;
    }

    try {
      console.log("Fetching user settings...");

      const response = await axios.get(`${url}/api/settings`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      console.log("User settings API response:", response.data);

      if (response.data) {
        setUserData((prev) => ({
          ...prev,
          settings: response.data,
        }));

        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user settings:", error);
      return null;
    }
  };

  // --- Update Profile ---
  const updateProfile = async (profileData) => {
    if (!token) throw new Error("Login required");

    try {
      const response = await axios.put(
        `${url}/api/settings/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local user data
      if (profileData.name) {
        setUsername(profileData.name);
        localStorage.setItem("name", profileData.name);

        // Update userData
        const updatedUserData = { ...userData, name: profileData.name };
        setUserData(updatedUserData);
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // --- Change Password ---
  const changePassword = async (passwordData) => {
    if (!token) throw new Error("Login required");

    try {
      const response = await axios.put(
        `${url}/api/settings/password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  // --- Update Notifications ---
  const updateNotifications = async (notificationData) => {
    if (!token) throw new Error("Login required");

    try {
      const response = await axios.put(
        `${url}/api/settings/notifications`,
        notificationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notifications:", error);
      throw error;
    }
  };

  // --- Update Payment Preferences ---
  const updatePaymentPreferences = async (paymentData) => {
    if (!token) throw new Error("Login required");

    try {
      const response = await axios.put(
        `${url}/api/settings/payment`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment preferences:", error);
      throw error;
    }
  };

  // --- Get Rewards Info ---
  const getRewardsInfo = async () => {
    if (!token) return null;

    try {
      const response = await axios.get(`${url}/api/settings/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state if needed
      if (response.data.rewardProgress !== undefined) {
        setRewardProgress(response.data.rewardProgress);
        localStorage.setItem(
          "rewardProgress",
          response.data.rewardProgress.toString()
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching rewards info:", error);
      throw error;
    }
  };

  // --- Handle Login Success ---
  const handleLoginSuccess = (loginData) => {
    console.log("Login response data:", loginData);
    const { token, userId, email, name, username, rewardProgress } = loginData;

    const displayName = name || username || email?.split("@")[0] || "User";
    const displayUsername = username || name || email?.split("@")[0] || "user";

    setToken(token);
    setUserId(userId);
    setEmail(email);
    setUsername(username || name || "");
    setRewardProgress(rewardProgress || 0);

    const userData = {
      userId,
      email,
      username: displayUsername,
      name: displayName,
      rewardProgress: rewardProgress || 0,
    };
    setUserData(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    localStorage.setItem("username", displayUsername);
    localStorage.setItem("name", displayName);
    localStorage.setItem("username", username || name || "");
    localStorage.setItem("rewardProgress", (rewardProgress || 0).toString());
    localStorage.setItem("userData", JSON.stringify(userData));

    loadCartData(token);
    fetchUserRewards(token);

    console.log("Login successful - User data:", userData);
  };

  // --- Save cart to localStorage whenever it changes ---
  useEffect(() => {
    if (token && Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // --- Reload cart when token changes ---
  useEffect(() => {
    if (token) {
      loadCartData(token);
    } else {
      setCartItems({});
    }
  }, [token]);

  // --- Initialize ---
  useEffect(() => {
    async function init() {
      console.log("1. Starting initialization...");
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      const storedEmail = localStorage.getItem("email");
      const storedName = localStorage.getItem("name");
      const storedUsername = localStorage.getItem("username");
      const storedFavorites = localStorage.getItem("favorites");
      const storedUserData = localStorage.getItem("userData");
      const storedRewardProgress = localStorage.getItem("rewardProgress");
      setUsername(storedUsername || storedName || "");

      console.log("2. Retrieved from localStorage:", {
        storedToken,
        storedUserId,
        storedEmail,
        storedUsername,
        storedUserData,
      });

      // Only require token - other fields can be rebuilt
      if (!storedToken) {
        console.log("3. No token found. Clearing storage.");
        handleLogout();
        setAuthLoading(false);
        return;
      }

      // If we have token but missing other details, try to recover
      if (!storedUserId || !storedEmail) {
        console.log(
          "3. Missing user details but token exists. Attempting recovery..."
        );
        // Don't logout - just set what we have and let the token validate
        setToken(storedToken);
        // We'll try to get missing data from API calls later
      }

      console.log("4. Auth details found. Setting up user session.");
      setToken(storedToken);
      setUserId(storedUserId);
      setEmail(storedEmail);
      setUsername(storedUsername || "");

      if (storedName) {
        // Use the stored name
        setUsername(storedUsername || storedName);
      } else if (storedUserData) {
        // Fallback to userData
        const userData = JSON.parse(storedUserData);
        setUsername(userData.username || userData.name || "");
      }

      // Set initial reward progress from localStorage
      if (storedRewardProgress) {
        setRewardProgress(Number(storedRewardProgress));
      }

      // Load user data if available
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUserData(userData);
      }

      // Load cart data
      try {
        const response = await axios.get(`${url}/api/cart`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const newCartItems = {};
        if (Array.isArray(response.data)) {
          response.data.forEach((cartItem) => {
            if (cartItem.item && cartItem.item._id) {
              newCartItems[cartItem.item._id] = cartItem.quantity;
            }
          });
        }
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      } catch (cartError) {
        console.error("Error fetching cart:", cartError);
        const localCart = localStorage.getItem("cartItems");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }

      // Load favorites
      try {
        const responseFavs = await axios.get(`${url}/api/favorites`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const favoriteItems = responseFavs.data.favorites || [];
        const favoritesData = favoriteItems.map((item) =>
          item._id ? item._id : item
        );
        setFavorites(favoritesData);
        localStorage.setItem("favorites", JSON.stringify(favoritesData));
      } catch (favError) {
        console.error("Error fetching favorites:", favError);
        if (storedFavorites) {
          const parsedFavs = JSON.parse(storedFavorites);
          const fallbackFavs = Array.isArray(parsedFavs)
            ? parsedFavs.map((fav) => fav._id || fav)
            : [];
          setFavorites(fallbackFavs);
        }
      }

      try {
        console.log("Fetching user settings...");
        // Use storedToken directly, don't rely on the token state
        const response = await axios.get(`${url}/api/settings`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log("User settings API response:", response.data);

        if (response.data) {
          // Update userData with the settings
          setUserData((prev) => ({
            ...prev,
            settings: response.data,
          }));

          console.log("Settings loaded and state updated");
        }
      } catch (settingsError) {
        console.error("Error fetching user settings:", settingsError);
      }
      // Fetch latest rewards from backend
      await fetchUserRewards(storedToken);

      console.log("5. Initialization complete.");
      setAuthLoading(false);
    }

    init();
  }, []);

  const contextValue = {
    foodList,
    favorites,
    toggleFavorite,
    cartItems,
    addToCart,
    removeFromCart,
    deleteItemCompletely,
    clearCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userId,
    setUserId,
    email,
    setEmail,
    username,
    setUsername,
    handleLogout,
    loadCartData,
    authLoading,
    rewardProgress,
    setRewardProgress,
    userData,
    handleLoginSuccess,
    updateRewardsAfterOrder,
    getRewardTierInfo,
    fetchUserRewards,
    fetchUserSettings,
    updateProfile,
    changePassword,
    updateNotifications,
    updatePaymentPreferences,
    getRewardsInfo,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
