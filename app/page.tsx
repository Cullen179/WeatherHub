import ConditionLevel from '@/components/ConditionLevel';
import Forecast from './Forecast';
import AIChatButton from '@/components/AI/AIChatBoxButton';

export default function Home() {
  return (
    <div>
      <Forecast />
      <AIChatButton />
    </div>
  );
}
