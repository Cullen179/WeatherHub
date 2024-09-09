import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Weather from './weather';
import Location from './location';
import Date from './date';
import { ReactNode } from 'react';

export default function Sheet() {
    const tripParams = [
        { param: 'weather', component: <Weather /> },
        { param: 'location', component: <Location /> },
        { param: 'date', component: <Date/> },
    ] as { param: string; component: ReactNode }[];
  return (
    <Tabs
      defaultValue={tripParams[0].param}
      className="w-full"
    >
      <TabsList className='w-full flex space-x-2'>

        {tripParams.map((param) => (
          <TabsTrigger className='w-full' key={param.param} value={param.param}>
            {param.param.toUpperCase()}
            </TabsTrigger>
        ))}
          </TabsList>

          {tripParams.map((param) => (
              <TabsContent key={param.param} value={param.param} >
                  {param.component}
              </TabsContent>
            ))}
    </Tabs>
  );
}
