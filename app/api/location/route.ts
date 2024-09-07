import { ipAddress } from '@vercel/functions';
 
export function GET(request: Request) {
  const ip = ipAddress(request)
  return new Response('Your ip is ' + ip);
}