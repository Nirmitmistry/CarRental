import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//  Set the base URL for all axios requests using your .env config
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // Important if backend uses cookies (for auth/session)

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setisOwner] = useState(false);
  const [showLogin, setshowLogin] = useState(false);
  const [pickupDate, setpickupDate] = useState('');
  const [returnDate, setreturnDate] = useState('');
  const [cars, setCars] = useState([]);

  // Function to check if user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setisOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //  Function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //  Function to log out user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setisOwner(false);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('You have been logged out');
  };

  // useEffect to retrieve token from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    fetchCars(); // Also fetch cars on initial load
  }, []);

  // useEffect to fetch user data when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
      fetchUser();
    }
  }, [token]);

  // Values shared across the app through context
  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setisOwner,
    fetchUser,
    fetchCars,
    showLogin,
    setshowLogin,
    logout,
    cars,
    setCars,
    pickupDate,
    setpickupDate,
    returnDate,
    setreturnDate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

//  Custom hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};
