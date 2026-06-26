import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    // Tell the CLI to use the Direct URL for pushing schema changes!
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});