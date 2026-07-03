import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    rent: { type: Number, required: true },
    city: { type: String, required: true, index: true },
    area: { type: String },
    address: { type: String },
    roomType: { type: String, enum: ['PG', 'Hostel', 'Room'], required: true },
    genderPreference: { type: String, enum: ['Boys', 'Girls', 'Any'], default: 'Any' },
    amenities: [{ type: String }],
    images: [{ url: String, public_id: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approved: { type: Boolean, default: false, index: true },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
