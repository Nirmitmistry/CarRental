import Booking from "../models/Booking.js"
import Car from "../models/Car.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // 🔍 Fetch only cars that are available and match the location (exact match)
    const cars = await Car.find({
      location: location,
      isAvailable: true,
    });

    // 🔁 Check if each car is available in the requested date range
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter(car => car.isAvailable === true);

    res.json({ success: true, availableCars });

  } catch (error) {
    console.log("Availability Check Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};



// API to Create Booking
export const createBooking = async (req, res) => {
  try {
    const { car: carId, pickupDate, returnDate } = req.body;

    // Fetch the car to get its owner and pricePerDay
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Calculate number of days
    const days =
      (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
      (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    const price = car.pricePerDay * days;

    const booking = await Booking.create({
      car: car._id,
      user: req.user._id,
      owner: car.owner, // ✅ Set owner from car
      pickupDate,
      returnDate,
      price,
    });

    return res.json({ success: true, message: "Booking created", booking });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}