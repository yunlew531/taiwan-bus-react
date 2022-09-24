import { isPointInPolygon } from 'geolib';
import { useEffect, useState } from 'react';
import { IPositionLatLonObj, ITwTownsLatLon, PositionLatLon } from 'react-app-env';
import translateCity from 'utils/translateCity';

interface ICoordinates {
  latitude?: number;
  longitude?: number;
}

const useGeoLocation = () => {
  const [position, setPosition] = useState<ICoordinates>({});
  const [county, setCounty] = useState({ zh: '', en: '' });

  const getGeoLocation = () => {
    if (!navigator?.geolocation) return;
    const { geolocation } = navigator;

    geolocation.getCurrentPosition((currentPosition) => {
      const { latitude, longitude } = currentPosition.coords;

      setPosition({
        latitude,
        longitude,
      });
    });
  };

  useEffect(() => {
    const findYourCounty = () => {
      const { latitude, longitude } = position;
      if (!latitude || !longitude) return;

      fetch(`${process.env.PUBLIC_URL}/json/twtown.json`)
        .then((res) => res.json() as Promise<ITwTownsLatLon>)
        .then((res) => {
          const yourCounty = res.features.filter((town) => {
            let coordinates:
            Array<PositionLatLon> | Array<IPositionLatLonObj> = town.geometry.coordinates[0][0];
            coordinates = coordinates.map((coordinate) => (
              { latitude: coordinate[1], longitude: coordinate[0] }));
            return isPointInPolygon({ latitude, longitude }, coordinates);
          });

          if (!yourCounty.length) return;

          const { county: zh } = yourCounty[0].properties;
          const en = translateCity(zh, 'en');
          setCounty({ zh, en });
        }).catch((err) => { console.error(err); });
    };

    findYourCounty();
  }, [position]);

  return {
    position,
    county,
    getGeoLocation,
  };
};

export default useGeoLocation;
