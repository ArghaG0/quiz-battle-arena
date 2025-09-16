import { APP_BASE_PATH } from '@/constants';
import { StackHandler } from '@stackframe/react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { stackClientApp } from './stack';
import { joinPaths } from './utils';

export const StackHandlerRoutes = () => {
  const location = useLocation();

  return (
    <StackHandler
      app={stackClientApp}
      location={joinPaths(APP_BASE_PATH, location.pathname)}
      fullPage={true}
    />
  );
}