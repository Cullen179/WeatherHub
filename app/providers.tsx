'use client';

import { UIContextProvider } from '@/context/UIContext';
import { FC, PropsWithChildren } from 'react';

const Providers: FC<PropsWithChildren> = ({ children }) => (
  <UIContextProvider>{children}</UIContextProvider>
);

export default Providers;
