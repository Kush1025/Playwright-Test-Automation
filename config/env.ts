  import type { Credentials } from '../data/types';

  // Fallbacks are the public demo credentials from the assignment.
  export const credentials: Credentials = {
    email: process.env.ASANA_EMAIL || 'admin',
    password: process.env.ASANA_PASSWORD || 'password123',
  };