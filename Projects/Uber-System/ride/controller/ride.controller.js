const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../service/rabbit");

module.exports.createRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });

    await newRide.save();

    await publishToQueue("new-ride", JSON.stringify(newRide));
    
    res.send({ message: "Ride created successfully", ride: newRide });

  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ride", error: err.message });
    console.error("Error creating ride:", err);
  }
};
