import React from 'react';
import type { RouteObject } from 'react-router-dom';
import Home from 'pages/home';
import NotFound from 'pages/notFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
