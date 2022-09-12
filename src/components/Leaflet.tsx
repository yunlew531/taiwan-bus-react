import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import L from 'leaflet';
import type {
  IBusNearStop, IBusRouteDetail, ShapeOfBusRoute,
} from 'react-app-env';
import { useAppDispatch } from 'hooks';
import { setRouteInOffcanvas, setShapeOfBusRoute } from 'slices/busRoutesSlice';
import { useSearchParams, useLocation } from 'react-router-dom';

const Wrap = styled.div`
  position: relative;
  width: 100%;
`;

const Map = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const PopupOpenBtnContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: 26px;
  right: 23px;
  padding: 12px 14px;
  font-size: 12px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1;
`;

const PopupOpenBtnDecor = styled.div<{ isStopPopupShow: boolean }>`
  position: relative;
  width: 24px;
  height: 14px;
  background: ${({ isStopPopupShow }) => (isStopPopupShow ? 'rgb(53, 95, 139, 0.6)' : 'rgb(53, 95, 139, 0.24)')};
  border-radius: 34px;
  margin-left: 17px;
  transition: transform 0.1s;
  &:hover {
    transform: scale(1.03);
  }
`;

const PopupOpenBtn = styled.button<{ isStopPopupShow: boolean }>`
  position: absolute;
  top: 50%;
  left: ${({ isStopPopupShow }) => (isStopPopupShow ? '100%' : '0%')};
  transform: translateX(-50%) translateY(-50%);
  width: 20px;
  height: 20px;
  border: none;
  background: #355F8B;
  box-shadow: 0px 1px 2px rgba(48, 79, 254, 0.54);
  border-radius: 20px;
  transition: left 0.2s linear;
`;

interface LeafletProps {
  busRoute: IBusRouteDetail;
  shapeOfBusRoute: ShapeOfBusRoute[0];
  busNearStop: Array<IBusNearStop>;
}

const Leaflet: React.FC<LeafletProps> = ({ busRoute, shapeOfBusRoute, busNearStop }) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<L.Map>();
  const [isStopPopupShow, setIsStopPopupShow] = useState(true);

  const pinkIcon = new L.DivIcon({
    className: 'marker pink-marker',
    popupAnchor: [0, 5],
  });

  const blueIcon = new L.DivIcon({
    className: 'marker blue-marker',
    popupAnchor: [0, 5],
  });

  const grayIcon = new L.DivIcon({
    className: 'marker gray-marker',
    popupAnchor: [0, 5],
  });

  const busIcon = new L.DivIcon({
    className: 'bus-icon-container',
    html: '<div class="bus-icon-bg"><span class="material-icons-outlined bus-icon">directions_bus</span><div>',
  });

  const toggleStopPopupShow = () => { setIsStopPopupShow(!isStopPopupShow); };

  useEffect(() => {
    const createMap = () => {
      mapInstanceRef.current = L.map(mapRef.current as unknown as HTMLDivElement)
        .setView([23.931034, 120.959473], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    };

    createMap();

    return () => {
      dispatch(setRouteInOffcanvas([]));
      dispatch(setShapeOfBusRoute([]));
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); }
    };
  }, []);

  const routeShapeLine = useRef<L.Polyline>();

  useEffect(() => {
    const removeRouteShapeLine = () => {
      if (routeShapeLine.current === undefined) return;
      mapInstanceRef.current?.removeLayer(routeShapeLine.current);
    };

    const renderRouteShapeLine = () => {
      if (shapeOfBusRoute?.length && mapInstanceRef.current) {
        routeShapeLine.current = L.polyline(shapeOfBusRoute).addTo(mapInstanceRef.current);
        mapInstanceRef.current.fitBounds(shapeOfBusRoute);
      }
    };

    removeRouteShapeLine();
    renderRouteShapeLine();
  }, [shapeOfBusRoute]);

  const markersRef = useRef<Array<L.Marker>>([]);

  useEffect(() => {
    const removeMarkers = () => {
      markersRef.current.forEach((markerInstance) => {
        mapInstanceRef.current?.removeLayer(markerInstance);
      });
      markersRef.current = [];
    };

    const oneMinute = 60;
    const threeMinutes = 180;
    const handleStopEstimate = (estimate: number) => {
      if (estimate === undefined) return '尚未發車';
      if (estimate <= oneMinute) return '進站中';
      if (estimate <= threeMinutes) return '即將進站';
      return `${Math.round(estimate / 60)} 分`;
    };

    const handleStopPopupStyle = (estimate: number) => {
      if (estimate === undefined) return 'bg-gray';
      if (estimate <= threeMinutes) return 'bg-pink';
      return 'bg-blue';
    };

    const handleStopMarkerStyle = (estimate: number) => {
      if (estimate === undefined) return grayIcon;
      if (estimate <= threeMinutes) return pinkIcon;
      return blueIcon;
    };

    const renderMarkers = () => {
      const { Stops: stops } = busRoute;

      stops?.forEach((stop) => {
        const { EstimateTime } = stop.Estimates[0];
        const { PositionLat, PositionLon } = stop.StopPosition;
        const { Zh_tw: stopName } = stop.StopName;

        if (mapInstanceRef.current) {
          const marker = L.marker([PositionLat, PositionLon], {
            draggable: false,
            icon: handleStopMarkerStyle(EstimateTime),
          })
            .bindPopup(`
              <div class="stop-popup-container ${handleStopPopupStyle(EstimateTime)}">
                ${EstimateTime <= threeMinutes ? '<span class="material-icons-outlined bus-icon">directions_bus</span>' : ''}
                <p class="stop-popup-name">${stopName}</p>
                <p class="stop-popup-status">${handleStopEstimate(EstimateTime)}</p>
              </div>
            `, { closeOnClick: false, autoClose: false })
            .addTo(mapInstanceRef.current);
          markersRef.current.push(marker);

          if (isStopPopupShow) {
            marker.openPopup();
          }
        }
      });
    };

    removeMarkers();
    renderMarkers();
  }, [busRoute]);

  const busMarkers = useRef<Array<L.Marker>>([]);

  useEffect(() => {
    const renderBusMarkers = () => {
      if (!busRoute.Stops) return;

      busNearStop.forEach((bus) => {
        const { StopPosition } = busRoute.Stops
          .filter((stop) => stop.StopUID === bus.StopUID)[0] || {};
        if (!StopPosition) return;
        const { PositionLat, PositionLon } = StopPosition;

        const marker = new L.Marker([PositionLat, PositionLon], {
          icon: busIcon,
          draggable: false,
        }).addTo(mapInstanceRef.current as L.Map);
        markersRef.current.push(marker);
      });
    };

    const removeBusMarkers = () => {
      busMarkers.current.forEach((marker) => {
        mapInstanceRef.current?.removeLayer(marker);
      });
      busMarkers.current = [];
    };

    removeBusMarkers();
    renderBusMarkers();
  }, [busNearStop]);

  useEffect(() => {
    const handleView = () => {
      const routeUid = searchParams.get('route_uid');
      const routeName = searchParams.get('route_name');
      const city = searchParams.get('city');
      const isSearching = routeName && routeUid && city;

      if (!isSearching) {
        mapInstanceRef.current?.setView([23.931034, 120.959473], 7);
      }
    };

    handleView();
  }, [location]);

  useEffect(() => {
    const closePopup = () => {
      markersRef.current.forEach((marker) => {
        marker.closePopup();
      });
    };
    const openPopup = () => {
      markersRef.current.forEach((marker) => {
        marker.openPopup();
      });
    };

    if (isStopPopupShow) openPopup();
    else closePopup();
  }, [isStopPopupShow]);

  return (
    <Wrap>
      <PopupOpenBtnContainer>
        <span>顯示站牌資訊</span>
        <PopupOpenBtnDecor onClick={toggleStopPopupShow} isStopPopupShow={isStopPopupShow}>
          <PopupOpenBtn type="button" isStopPopupShow={isStopPopupShow} />
        </PopupOpenBtnDecor>
      </PopupOpenBtnContainer>
      <Map ref={mapRef} />
    </Wrap>
  );
};

export default Leaflet;
