// providers/ReduxProvider.tsx
'use client'; // This is required for Client Component

import store from '@/app/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {




    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
