import { currentUser } from '@clerk/nextjs/server';
import { fetchAccountData } from './fetch';

export default async function Data() {
  const user = await currentUser();

  const userData = user ? await fetchAccountData(user.id) : null;

  console.log(userData);
  return (
    <div>
      <h1>Welcome, {user?.id}</h1>
    </div>
  );
}
