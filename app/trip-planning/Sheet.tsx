import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sheet() {
    const tripParams = [
        'weather',
        'location',
        'date'
    ]
  return (
    <Tabs
      defaultValue="account"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        
        {tripParams.map((param) => (
          <TabsTrigger key={param} value={param} className="px-4 py-2">
            {param.toUpperCase()}
            </TabsTrigger>
        ))}
          </TabsList>
          
    </Tabs>
  );
}
