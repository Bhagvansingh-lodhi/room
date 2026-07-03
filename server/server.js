import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
