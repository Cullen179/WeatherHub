import { SignedIn, UserButton } from '@clerk/nextjs';
import { Typography } from './Typography';
import { buttonVariants } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationBar() {
  return (
    <div className="w-screen -mx-10 p-10 flex justify-between items-center py-2 border-border border-b-[1px] mb-4">
      <div className=" flex justify-between items-center">
        <Image
          alt="icon"
          src="/rainbow.png"
          width={30}
          height={30}
        />
        <Typography variant="h2">WeatherHub</Typography>
      </div>
      <div className="space-x-2 flex justify-between items-center">
        {[{
          name: 'Dashboard',
          href: '/',
        }, {
          name: 'Map',
          href: '/map',
        }, {
          name: 'Alert',
          href: '/alert',
        }, {
          name: 'Trip Planning',
          href: '/trip-planning',
        }].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={buttonVariants({ variant: 'ghost' })}
          >
            {item.name}
          </Link>
        ))}

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
