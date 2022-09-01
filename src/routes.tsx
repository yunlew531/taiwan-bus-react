import React from 'react';
import type { RouteObject } from 'react-router-dom';
import Home from 'pages/home';
import NotFound from 'pages/notFound';
import Bus from 'pages/bus';
import Station from 'pages/station';

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
    path: '/station',
    element: <Station />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
