import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './shared/infrastructure/database/mongo.connection.js';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Qwizo server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Qwizo server:', error);

    process.exit(1);
  }
};

startServer();
