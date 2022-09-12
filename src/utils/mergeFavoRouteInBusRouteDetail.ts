import { IBusRouteDetail, IFavoRoutes } from 'react-app-env';

export default (
  favoRoutesData: IFavoRoutes,
  busRouteData: Array<IBusRouteDetail>,
) => busRouteData.map((busRoute) => {
  busRoute.isFavorite = !!favoRoutesData[busRoute.RouteUID];
  return busRoute;
});
