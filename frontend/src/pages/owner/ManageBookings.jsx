import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status }); // ✅ corrected endpoint
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings(); // ✅ refresh list after update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests and manage booking status" />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date-range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                </td>

                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>

                <td className='p-3'>{currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                </td>

                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select
                      disabled={loading}
                      onChange={e => changeBookingStatus(booking._id, e.target.value)}
                      value={booking.status}
                      className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-500'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
