import AlertForm from './AlertForm';
import { Typography } from '@/components/Typography';

export default function AlertSettings() {
  return (
    <div className="space-y-4">
      <Typography variant="h2">Trigger Settings</Typography>
      <AlertForm />
    </div>
  );
}
