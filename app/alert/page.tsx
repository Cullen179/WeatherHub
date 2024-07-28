import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AlertForm from './AlertForm';

export default function AlertSettings() {
  return (
    <div
      className={cn('min-h-screen bg-background font-sans antialiased px-10')}
    >
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-5xl mt-8">
        Alert Settings
      </h1>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mt-7">
        Parameter Setting
      </h2>
      <p className="pb-5 pt-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, rerum
        delectus sint saepe cumque quidem provident laudantium. Velit maiores
        modi dolor voluptatibus autemnis!
      </p>
      <AlertForm />
    </div>
  );
}
