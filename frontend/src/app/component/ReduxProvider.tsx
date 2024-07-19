// providers/ReduxProvider.tsx
'use client'; // This is required for Client Component

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '@/app/redux/store';
import { fetchUserData } from '@/app/redux/feature/user';
import { AppDispatch } from '@/app/redux/store';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
