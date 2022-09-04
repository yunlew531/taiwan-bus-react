import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import type { ThemeProps } from 'react-app-env';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb';
import BusList from 'components/BusList';
import Search from 'components/Search';
import RoutesOffcanvas from 'components/RoutesOffcanvas';
import { useGetRoutesByCityQuery } from 'services/busRoutes';
import { useAppDispatch } from 'hooks';
import { setBusRoutes } from 'slices/busRoutesSlice';

const MainContainer = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  border: 1px red dashed;
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
  const { data: busRoutes = [] } = useGetRoutesByCityQuery(cityParams || '');

  const translateCity = (city = '') => {
    let result: string;

    switch (city) {
      case 'Taipei&NewTaipei':
        result = '台北市 ＆ 新北市';
        break;
      case 'Taoyuan':
        result = '桃園市';
        break;
      case 'Taichung':
        result = '台中市';
        break;
      case 'Tainan':
        result = '台南市';
        break;
      case 'Kaohsiung':
        result = '高雄市';
        break;
      case 'Other_City':
        result = '其他城市';
        break;
      default:
        result = city;
    }

    return result;
  };

  const chineseCity = translateCity(cityParams);

  useEffect(() => {
    dispatch(setBusRoutes(busRoutes));
  }, [busRoutes]);

  return (
    <>
      <Breadcrumb title={chineseCity} copy timeTable />
      <MainContainer>
        <RoutesContainer>
          <BusSearchPanel show>
            <BusListPanel>
              <Search placeholder="輸入公車路線 / 起迄方向名或關鍵字" />
              <BusList city={chineseCity} routes={busRoutes} height="420" />
            </BusListPanel>
            <NumberBoard>
              <NumberBtnsGroup>
                { Array.from(Array(9).keys()).map((item) => <NumberBtn key={item} type="button">{item + 1}</NumberBtn>)}
                <DedicatedBtn type="button">專用道</DedicatedBtn>
                <NumberBtn type="button">0</NumberBtn>
                <NumberBtn type="button">清除</NumberBtn>
              </NumberBtnsGroup>
            </NumberBoard>
          </BusSearchPanel>
          <RoutesOffcanvas show={false} />
        </RoutesContainer>
      </MainContainer>
    </>
  );
};

export default Bus;
