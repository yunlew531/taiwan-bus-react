import React from 'react';
import type { RouteObject } from 'react-router-dom';
import Home from 'pages/home';
import NotFound from 'pages/notFound';
import Bus from 'pages/bus';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/bus/:city',
    element: <Bus />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
