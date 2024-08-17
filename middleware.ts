import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
]);

export default clerkMiddleware((auth, request) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Skip authentication checks in development mode
  if (isDevelopment || isPublicRoute(request)) {
    return;
  }

  // Protect routes if not in development mode
  auth().protect();
});

export const config = {
  matcher: [
    // Skip all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for api routes
    '/(api|trpc)(.*)',
  ],
};
