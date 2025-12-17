import imagekit from "../configuration/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// API to Change Role of User
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to list a car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;

        // Parse car data from string to object
        const car = JSON.parse(req.body.carData);

        // Get uploaded image
        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "No image file uploaded." });
        }

        // Read image buffer
        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars",
        });

        // Cleanup temp file
        fs.unlinkSync(imageFile.path);

        // Create car with image URL
        const image = uploadResponse.url;
        await Car.create({ ...car, owner: _id, image });

        return res.json({ success: true, message: "Car added successfully." });

    } catch (error) {
        console.error("Upload error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to upload car. " + error.message });
    }
};

//API to list owner cars
export const getOwnerCar = async (req, res) => {
  try {
    const { _id } = req.user;

    // ✅ This fetches all cars where owner === current user
    const cars = await Car.find({ owner: _id });

    res.json({ success: true, cars }); // ✅ fixed typo: 'succes' → 'success'
  } catch (error) {
    console.error("Fetch cars error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cars. " + error.message
    });
  }
};

//Toggle car availbi
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) return res.json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Upload to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/users'
    });

    // Generate optimized image URL
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: '400' },
        { quality: 'auto' },
        { format: 'webp' }
      ]
    });

    // Save to DB
    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    res.json({ success: true, message: "Image Updated", image: optimizedImageUrl });

  } catch (error) {
    console.log("Image Update Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
