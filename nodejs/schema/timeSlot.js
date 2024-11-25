const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null,
    },
    am: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
