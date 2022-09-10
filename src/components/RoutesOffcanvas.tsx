import React, { useState } from 'react';
import styled from '@emotion/styled';
import type { ThemeProps, StationStatus, IEstimate } from 'react-app-env';
import TimeBadge from 'components/TimeBadge';
import { useAppSelector } from 'hooks';
import { useSearchParams } from 'react-router-dom';

const RoutePanel = styled.div<ThemeProps & { show: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(-100%)')};
`;

const RouteDescContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const RouteDescContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .material-icons-outlined.favorite {
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.1s linear;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

const RouteDescContainerFooter = styled.div<ThemeProps>`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme: { colors: { white } } }) => white};
`;

const UpdateProgress = styled.div<ThemeProps>`
  background-color: ${({ theme: { colors: { gray_400 } } }) => gray_400};
  height: 3px;
`;

const UpdateProgressBar = styled.div<ThemeProps>`
  background-color: ${({ theme: { colors: { primary } } }) => primary};
  width: 0;
  height: 3px;
  animation: progress 30s;
  @keyframes progress {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
`;

const RouteDescContainerFooterContent = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  p {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const UpdateBtn = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background-color: transparent;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
  .refresh-icon {
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
  }
`;

const BackToSearchBtn = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background-color: transparent;
  transition: 0.1s transform linear;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    margin-right: 5px;
  }
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const RouteNum = styled.p`
  font-size: 35px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const BusDirectionBtnGroup = styled.div`
  display: flex;
`;

const BusDirectionBtn = styled.button<ThemeProps & { current: boolean }>`
  flex: 1 0;
  padding: 10px;
  height: 42px;
  color: ${({ current, theme: { colors: { white, black } } }) => (current ? white : black)};
  border: none;
  border-radius: 5px 5px 0 0;
  background-color: ${({ current, theme: { colors: { primary, gray_200 } } }) => (current ? primary : gray_200)};
  transition: filter 0.1s linear;
  &:hover {
    filter: brightness(0.9);
  }
`;

const BusStationList = styled.ul`
  height: calc(100% - 209px);
  padding: 0 30px;
  overflow-y: auto;
`;

const BusStationItem = styled.li<ThemeProps & { status?: StationStatus }>`
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  border-right: 1px solid ${({ theme: { colors: { gray_600 } } }) => gray_600};
  padding: 13px 14px 13px 0;
  &:first-of-type, &:last-of-type {
    &::before {
      content: '';
      position: absolute;
      right: -1px;
      width: 2px;
      height: 50%;
      background-color: ${({ theme: { colors: { white } } }) => white};
    }
  }
  &:first-of-type {
    &::before {
      top: 0;
    }
  }
  &:last-of-type {
    &::before {
      bottom: 0;
    }
  }
  &::after {
    content: '';
    position: absolute;
    right: 0;
    transform: translateX(50%);
    border-radius: 100%;
    border: 2px solid ${({ theme: { colors: { white } } }) => white};
  ${
  ({ status, theme: { colors: { secondary, gray_800, primary } } }) => {
    if (status === '進站中') {
      return `
        background-color: ${secondary};
        width: 15px;
        height: 15px;
      `;
    }
    if (status === '稍後進站') {
      return `
        background-color: ${primary};
        width: 12px;
        height: 12px;
      `;
    }
    return `
        background-color: ${gray_800};
        width: 12px;
        height: 12px;
      `;
  }
}
  }
`;

const BusStationItemTitle = styled.p<ThemeProps & { status?: StationStatus }>`
  margin-right: auto;
  font-weight: 400;
  ${
  ({ status, theme: { colors: { gray_600 } } }) => {
    if (status === '過站') {
      return `color: ${gray_600};`;
    }
    if (status === '進站中') {
      return 'font-weight: 700;';
    }
    return '';
  }
}
`;

const BusPlate = styled.p<ThemeProps>`
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  font-weight: 700;
  color: ${({ theme: { colors: { secondary } } }) => secondary};
`;

interface IRoutesOffcanvasProps {
  show: boolean;
  busDirection: 0 | 1;
  setBusDirection: React.Dispatch<React.SetStateAction<0 | 1>>
}

const RoutesOffcanvas: React.FC<IRoutesOffcanvasProps> = ({
  show,
  busDirection,
  setBusDirection,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const busRoute = useAppSelector((state) => state.busRoutes.currentRouteInOffcanvas);

  const handleBusStationStatus = (estimates: Array<IEstimate>) => {
    const { EstimateTime } = estimates[0];
    const threeMinutes = 180;
    if (EstimateTime === undefined) return '過站';
    if (EstimateTime <= threeMinutes) return '進站中';
    return '稍後進站';
  };

  const handleTimeBadgeContent = (
    busStatusInEachStation: StationStatus,
    estimates = [] as Array<IEstimate>,
  ) => {
    const { EstimateTime } = estimates[0];
    if (EstimateTime === undefined) return '尚未發車';
    if (busStatusInEachStation === '進站中') return '即將進站';
    return `${Math.round(EstimateTime / 60)} 分`;
  };

  return (
    <RoutePanel show={show}>
      <RouteDescContainer>
        <RouteDescContainerHeader>
          <BackToSearchBtn type="button" onClick={() => { setSearchParams({}); }}>
            <span className="material-icons-outlined">chevron_left</span>
            <p>返回搜尋</p>
          </BackToSearchBtn>
          <span className="material-icons-outlined favorite">favorite_border</span>
          {/* <span className="material-icons-outlined favorite">favorite</span> */}
        </RouteDescContainerHeader>
        <RouteNum>{busRoute[busDirection]?.RouteName.Zh_tw}</RouteNum>
      </RouteDescContainer>
      <BusDirectionBtnGroup>
        <BusDirectionBtn onClick={() => setBusDirection(0)} type="button" current={busDirection === 0}>
          往 { busRoute[0]?.Stops[busRoute[0].Stops.length - 1].StopName.Zh_tw }
        </BusDirectionBtn>
        {busRoute[1] && (
        <BusDirectionBtn onClick={() => setBusDirection(1)} type="button" current={busDirection === 1}>
          往{busRoute[0]?.Stops[0].StopName.Zh_tw}
        </BusDirectionBtn>
        )}
      </BusDirectionBtnGroup>
      <BusStationList>
        {busRoute[busDirection]?.Stops.map(({ StopUID, StopName, Estimates }) => (
          <BusStationItem
            key={StopUID}
            status={handleBusStationStatus(Estimates)}
          >
            {/* {!Estimates && <TimeBadge status="過站">尚未發車</TimeBadge>} */}
            <TimeBadge
              status={handleBusStationStatus(Estimates)}
            >{handleTimeBadgeContent(handleBusStationStatus(Estimates), Estimates)}
            </TimeBadge>
            <BusStationItemTitle
              status={Estimates ? handleBusStationStatus(Estimates) : '過站'}
            >{StopName.Zh_tw}
            </BusStationItemTitle>
            {Estimates && Estimates && handleBusStationStatus(Estimates) === '進站中'
              && <BusPlate>{Estimates[0].PlateNumb}</BusPlate>}
          </BusStationItem>
        ))}
      </BusStationList>
      <RouteDescContainerFooter>
        <UpdateProgress>
          <UpdateProgressBar />
        </UpdateProgress>
        <RouteDescContainerFooterContent>
          <p>20 秒後更新</p>
          <UpdateBtn type="button">
            <span className="material-icons-outlined refresh-icon">sync</span>
            <span>立即更新</span>
          </UpdateBtn>
        </RouteDescContainerFooterContent>
      </RouteDescContainerFooter>
    </RoutePanel>
  );
};

export default RoutesOffcanvas;
