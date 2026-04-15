import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Vänligen ange en e-postadress'],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Lösenord krävs'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
