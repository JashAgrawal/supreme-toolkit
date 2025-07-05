/**
 * Supreme Toolkit - Better Auth API Route
 * 
 * This API route handles all authentication requests for the Supreme Toolkit auth module.
 * It uses betterAuth to provide a complete authentication system.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export the GET and POST handlers for Next.js App Router
export const { GET, POST } = toNextJsHandler(auth);
