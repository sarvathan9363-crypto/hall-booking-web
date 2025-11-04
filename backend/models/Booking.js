import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  block: { type: String, required: true },
  floor: { type: String, required: true },
  room: { type: String, required: true },
  date: { type: String, required: true }, // dd-mm-yyyy
  time: { type: String, required: true },
  purpose: { type: String, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
