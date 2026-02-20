const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");



router.post(
  "/listings/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { checkIn, checkOut } = req.body;
    const listing = await Listing.findById(req.params.id);

    const overlap = await Booking.findOne({
      listing: listing._id,
      status: "confirmed",
      $or: [
        { checkIn: { $lt: checkOut, $gte: checkIn } },
        { checkOut: { $gt: checkIn, $lte: checkOut } }
      ]
    });

    if (overlap) {
      req.flash("error", "Selected dates are not available");
      return res.redirect(`/listings/${listing._id}`);
    }

    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn,
      checkOut,
      totalPrice: days * listing.price
    });

    await booking.save();
    listing.bookings.push(booking);
    await listing.save();

    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings");
  })
);



router.get("/bookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
    status: "confirmed"
  }).populate("listing");

  res.render("bookings/index", { bookings });
});



router.delete(
  "/bookings/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "Not allowed");
      return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled");
    res.redirect("/bookings");
  })
);

module.exports = router;
