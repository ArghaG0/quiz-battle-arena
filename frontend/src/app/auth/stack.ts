import { APP_BASE_PATH } from '@/constants';
import { StackClientApp } from '@stackframe/react';
import { useNavigate } from 'react-router-dom';
import { config } from './config';
import { joinPaths } from './utils';

export const stackClientApp = new StackClientApp({
  projectId: config.projectId,
  publishableClientKey: config.publishableClientKey,
  tokenStore: 'cookie',
  redirectMethod: {
    useNavigate
  },
  urls: {
    handler: joinPaths(APP_BASE_PATH, config.handlerUrl),
    // Trailing slash to correctly hit the UI
    home: joinPaths(APP_BASE_PATH, '/'),
    afterSignIn: joinPaths(APP_BASE_PATH, config.handlerUrl, 'redirect'),
    afterSignUp:joinPaths(APP_BASE_PATH, config.handlerUrl, 'redirect')
  }
})

