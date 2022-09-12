import type { IBusRoute, IFavoRoutes } from 'react-app-env';

export default (favoRoutesData: IFavoRoutes, busRoutesData: Array<IBusRoute>) => busRoutesData.map(
  (routeData) => {
    const result = { ...routeData };
    result.isFavorite = !!favoRoutesData[routeData.RouteUID];
    return result;
  },
);
