import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // ✅ FIXED: correct import

const Cardetails = () => {
  const { id } = useParams();
  const {
    cars,
    axios,
    pickupDate,
    setpickupDate,
    returnDate,
    setreturnDate,
  } = useAppContext();

  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const foundCar = cars.find((car) => car._id === id);
    setCar(foundCar);
  }, [cars, id]);

  if (!car) return <Loader />;

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt="Back" className='rotate-180 opacity-65' />
        Back to all cars
      </button>

      {/* Car Details Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='lg:col-span-2'
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto object-cover rounded-xl mb-6 shadow-md'
          />

          <motion.div
            className='space-y-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className='text-3xl font-bold'>
              {car.brand} {car.model}
            </h1>
            <p className='text-gray-500 text-lg'>
              {car.category} • {car.year}
            </p>
          </motion.div>

          <hr className='border-borderColor my-6' />

          {/* Car Feature Icons */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map((item, index) => (
              <div key={index} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                <img src={item.icon} alt='' className='h-5 mb-2' />
                <p className='text-sm text-gray-700'>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className='mt-8'>
            <h1 className='text-xl font-medium mb-3'>Description</h1>
            <p className='text-gray-500'>{car.description}</p>
          </div>

          {/* Features */}
          <div className='mt-8'>
            <h1 className='text-xl font-medium mb-3'>Features</h1>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                <li key={item} className='flex items-center text-gray-500'>
                  <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
        >
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}
            <span className='text-base text-gray-400 font-normal'> per day</span>
          </p>

          <hr className='border-borderColor my-6' />

          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date'>Pick-up Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setpickupDate(e.target.value)}
              type='date'
              id='pickup-date'
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setreturnDate(e.target.value)}
              type='date'
              id='return-date'
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'
          >
            Book Now
          </button>

          <p className='text-center text-sm'>No credit card details required to reserve</p>
        </motion.form>
      </div>
    </div>
  );
};

export default Cardetails;
