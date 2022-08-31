import styled from '@emotion/styled';
import React, { useState } from 'react';
import { ThemeProps } from 'react-app-env';
import { Link as OriginLink, useParams } from 'react-router-dom';

const Breadcrumb = styled.div`
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding: 0 66px;
`;

const Link = styled(OriginLink)`
display: inline-block;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const TimeTableGroup = styled.div<ThemeProps>`
  display: flex;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    margin-right: 5px;
  }
`;

const CopyLink = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background: none;
  transition: transform 0.1s linear;
  margin-right: 15px;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const TimeTable = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background: none;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

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

const BusSearchPanel = styled.div<ThemeProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  /* transform: translateX(-100%); */
`;

const BusListPanel = styled.div<ThemeProps>`
  padding: 20px;
  background-color: ${({ theme: { colors: { white } } }) => white};
`;

const SearchRouteInputGroup = styled.div<ThemeProps>`
  position: relative;
  margin-bottom: 36px;
  input {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 10px;
    padding: 0 45px 0 15px;
  }
`;

const SearchBtn = styled.button<ThemeProps>`
  position: absolute;
  top: 7px;
  right: 7px;
  border: none;
  background: none;
  transition: transform 0.1s linear, color 0.1s linear;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
  }
  &:hover {
    color: ${({ theme: { colors: { gray_700 } } }) => gray_700};
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const BusList = styled.ul`
  padding: 0 15px;
  height: 420px;
  overflow-y: scroll;
`;

const BusItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  text-align: center;
  transition: filter 0.1s linear;
  &:hover {
    filter: brightness(0.7);
  }
  .routeNum {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    font-weight: 700;
    margin-bottom: 5px;
    text-align: left;
  }
  .routeName {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    text-align: left;
  }
  .material-icons-outlined.favorite {
    font-size: 20px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: transform 0.1s linear;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
  }
  .cityName {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const NumberBoard = styled.div<ThemeProps>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  background-color: ${({ theme: { colors: { gray_100 } } }) => gray_100};
  padding: 33px;
  text-align: center;
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

const RoutePanel = styled.div<ThemeProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  /* transform: translateX(-100%); */
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
  cursor: pointer;
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

const RouteName = styled.h2<ThemeProps>`
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  font-weight: 300;
`;

const BusDirectionBtn = styled.button<ThemeProps & { current: boolean }>`
  width: 50%;
  padding: 10px;
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
  padding: 30px;
`;

const BusStationItem = styled.li<ThemeProps & { status?: StationStatus }>`
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  border-right: 1px solid ${({ theme: { colors: { gray_600 } } }) => gray_600};
  padding: 13px 14px 13px 0;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    transform: translateX(50%);
    border-radius: 100%;
    border: 1px solid ${({ theme: { colors: { white } } }) => white};
  ${
  ({ status, theme: { colors: { secondary, gray_800 } } }) => {
    if (status === '進站中' || status === '即將進站') {
      return `
        background-color: ${secondary};
        width: 15px;
        height: 15px;
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

type StationStatus = '過站' | '進站中' | '即將進站' | '10分';

const TimeBadge = styled.span<ThemeProps & { status?: StationStatus }>`
  display: inline-block;
  width: 77px;
  color: ${({ theme: { colors: { white } } }) => white};
  text-align: center;
  margin-right: 18px;
  border-radius: 10px;
  padding: 6px;
  background-color: ${
  ({ status, theme: { colors: { gray_800, secondary, primary } } }) => {
    if (status === '過站') return gray_800;
    if (status === '進站中' || status === '即將進站') return secondary;
    return primary;
  }
};
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

const Bus: React.FC = () => {
  const { city: cityParams } = useParams();

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

  // TODO: test data
  const routes = [
    {
      routeNum: 303,
      route: '台中國際機場 - 台中公園',
    },
    {
      routeNum: 301,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 304,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 30851,
      route: '靜宜大學 - 新民高中',
    },

    {
      routeNum: 35,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 321,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 3241,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 32152,
      route: '靜宜大學 - 新民高中',
    },
    {
      routeNum: 3271,
      route: '靜宜大學 - 新民高中',
    },
  ];

  const [busDirection, setBusDirection] = useState<0 | 1>(0);

  return (
    <>
      <Breadcrumb>
        <div>
          <Link to="/">首頁</Link>
          <span> / </span>
          <span>{chineseCity}</span>
        </div>
        <TimeTableGroup>
          <CopyLink>
            <span className="material-icons-outlined">insert_link</span>
            <p>複製連結</p>
          </CopyLink>
          <TimeTable>
            <span className="material-icons-outlined">schedule</span>
            <p>時刻表</p>
          </TimeTable>
        </TimeTableGroup>
      </Breadcrumb>
      <MainContainer>
        <RoutesContainer>
          <BusSearchPanel>
            <BusListPanel>
              <SearchRouteInputGroup>
                <input type="text" placeholder="輸入公車路線 / 起迄方向名或關鍵字" />
                <SearchBtn type="button">
                  <span className="material-icons-outlined">search</span>
                </SearchBtn>
              </SearchRouteInputGroup>
              <BusList>
                {routes.map((route) => (
                  <BusItem key={route.routeNum}>
                    <div>
                      <p className="routeNum">{route.routeNum}</p>
                      <p className="routeName">{route.route}</p>
                    </div>
                    <div>
                      <span className="material-icons-outlined favorite">favorite_border</span>
                      {/* <span className="material-icons-outlined favorite">favorite</span> */}
                      <p className="cityName">{chineseCity}</p>
                    </div>
                  </BusItem>
                ))}
              </BusList>
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
          <RoutePanel>
            <RouteDescContainer>
              <RouteDescContainerHeader>
                <BackToSearchBtn type="button">
                  <span className="material-icons-outlined">chevron_left</span>
                  <p>返回搜尋</p>
                </BackToSearchBtn>
                <span className="material-icons-outlined favorite">favorite_border</span>
                {/* <span className="material-icons-outlined favorite">favorite</span> */}
              </RouteDescContainerHeader>
              <RouteNum>300</RouteNum>
              <RouteName>台灣大道公車專用道</RouteName>
            </RouteDescContainer>
            <BusDirectionBtn type="button" current={busDirection === 0}>往 台中車站</BusDirectionBtn>
            <BusDirectionBtn type="button" current={busDirection === 1}>往 靜宜大學</BusDirectionBtn>
            <BusStationList>
              <BusStationItem status="過站">
                <TimeBadge status="過站">10: 10</TimeBadge>
                <BusStationItemTitle status="過站">靜宜大學（專用道）</BusStationItemTitle>
                <BusPlate />
              </BusStationItem>
              <BusStationItem status="進站中">
                <TimeBadge status="進站中">進站中</TimeBadge>
                <BusStationItemTitle status="進站中">晉江寮（專用道）</BusStationItemTitle>
                <BusPlate>F2E-888 無障礙</BusPlate>
              </BusStationItem>
              <BusStationItem status="10分">
                <TimeBadge status="10分">10分</TimeBadge>
                <BusStationItemTitle status="10分">弘光科技大學（專用道）</BusStationItemTitle>
                <BusPlate />
              </BusStationItem>
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
        </RoutesContainer>
      </MainContainer>
    </>
  );
};

export default Bus;
