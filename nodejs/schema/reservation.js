const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    person: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      default: null,
    },
    state: {
      // 대기:await, 승인:confirm, 거절:decline, 삭제:delete
      type: String,
      default: "await",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Reservation", reservationSchema);
