import styled from '@emotion/styled';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import type { ThemeProps } from 'react-app-env';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb';
import BusList from 'components/BusList';
import Search from 'components/Search';
import RoutesOffcanvas from 'components/RoutesOffcanvas';
import { useLazyGetRoutesByCityQuery } from 'services/bus';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setBusRoutes } from 'slices/busRoutesSlice';
import translateCity from 'utils/translateCity';

const MainContainer = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
`;

const RoutesContainer = styled.div`
  position: relative;
  max-width: 464px;
  width: 100%;
`;

const BusSearchPanel = styled.div<ThemeProps & { show: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(-100%)')};
`;

const BusListPanel = styled.div<ThemeProps>`
  padding: 20px;
`;

const NumberBoard = styled.div<ThemeProps>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: ${({ theme: { colors: { gray_100 } } }) => gray_100};
  border-top: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  padding: 33px;
`;

const NumberBtnsGroup = styled.div`
  max-width: 292px;
  width: 100%;
  margin: 0 -2% -2% 0;
`;

const NumberBtn = styled.button<ThemeProps>`
  width: 28.333%;
  height: 40px;
  background-color: ${({ theme: { colors: { gray_500 } } }) => gray_500};
  border: none;
  border-radius: 10px;
  margin: 0 5% 12px 0;
  transition: transform 0.1s linear, color 0.1s linear;
  &:hover {
    color: ${({ theme: { colors: { gray_700 } } }) => gray_700};
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const DedicatedBtn = styled(NumberBtn)<ThemeProps>`
  color: ${({ theme: { colors: { white } } }) => white};
  background-color: ${({ theme: { colors: { darkBlue } } }) => darkBlue};
  &:hover {
    color: ${({ theme: { colors: { white } } }) => white};
  }
`;

const Bus: React.FC = () => {
  const { city: cityParams } = useParams();
  const dispatch = useAppDispatch();
  const [getRoutesTrigger] = useLazyGetRoutesByCityQuery();
  const busRoutes = useAppSelector((state) => state.busRoutes.busRoutes);
  const [searchValue, setSearctValue] = useState('');

  useEffect(() => {
    const getRoutes = async () => {
      if (!cityParams) return;
      if (cityParams === 'Other_City') return;
      if (cityParams === 'Taipei&NewTaipei') {
        const [{ data: taipeiRoutes }, { data: newTaipeiRoutes }] = await Promise.all([getRoutesTrigger('Taipei'), getRoutesTrigger('NewTaipei')]);
        if (taipeiRoutes?.length && newTaipeiRoutes?.length) {
          dispatch(setBusRoutes([...taipeiRoutes, ...newTaipeiRoutes]));
        }
      } else {
        getRoutesTrigger(cityParams).then(({ data }) => {
          if (data?.length) dispatch(setBusRoutes(data));
        }).catch(() => {});
      }
    };
    getRoutes().catch(() => {});

    return () => {
      dispatch(setBusRoutes([]));
    };
  }, []);

  const busRoutesFilter = useMemo(
    () => (searchValue ? busRoutes.filter(
      (route) => route.RouteName.Zh_tw.match(searchValue),
    ) : busRoutes),
    [searchValue, busRoutes],
  );

  const chineseCity = translateCity(cityParams || '');

  const resetSearch = () => setSearctValue('');

  const handleNumberBoard = (e: React.MouseEvent) => {
    const clickNum = (e.target as HTMLButtonElement).textContent as string;
    setSearctValue((prev) => `${prev}${clickNum}`);
  };

  const [isRouteOffcanvasOpen, setIsRouteOffcanvasShow] = useState(false);
  const [isSearchOffcanvasOpen, setSearchOffcanvasShow] = useState(true);

  return (
    <>
      <Breadcrumb title={chineseCity} copy timeTable />
      <MainContainer>
        <RoutesContainer>
          <BusSearchPanel show={isSearchOffcanvasOpen}>
            <BusListPanel>
              <Search value={searchValue} setValue={setSearctValue} placeholder="輸入公車路線 / 起迄方向名或關鍵字" />
              <BusList
                routes={busRoutesFilter}
                setIsRouteOffcanvasShow={setIsRouteOffcanvasShow}
                setSearchOffcanvasShow={setSearchOffcanvasShow}
                height="400"
              />
            </BusListPanel>
            <NumberBoard>
              <NumberBtnsGroup>
                { Array.from(Array(9).keys()).map((item) => <NumberBtn key={item} onClick={handleNumberBoard} type="button">{item + 1}</NumberBtn>)}
                <DedicatedBtn type="button">專用道</DedicatedBtn>
                <NumberBtn onClick={handleNumberBoard} type="button">0</NumberBtn>
                <NumberBtn onClick={resetSearch} type="button">清除</NumberBtn>
              </NumberBtnsGroup>
            </NumberBoard>
          </BusSearchPanel>
          <RoutesOffcanvas
            show={isRouteOffcanvasOpen}
            setIsRouteOffcanvasShow={setIsRouteOffcanvasShow}
            setSearchOffcanvasShow={setSearchOffcanvasShow}
          />
        </RoutesContainer>
      </MainContainer>
    </>
  );
};

export default Bus;
