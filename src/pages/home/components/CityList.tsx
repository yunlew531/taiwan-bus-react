import React from 'react';
import styled from '@emotion/styled';
import { ThemeProps } from 'react-app-env';
import theme from 'styleSheets/theme';

const CityListContainer = styled.ul`
  max-width: 1440px;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`;

const CityItem = styled.li<ThemeProps>`
  width: 217px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ color }) => color};
  background-color: ${({ theme: { colors: { white } } }) => white};
  box-shadow: 0px 5px 15px 2px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  transition: box-shadow 0.1s linear, filter 0.1s linear;
  padding: 37px 10px;
  .bus-icon {
    font-size: 50px;
    margin-bottom: 10px;
    cursor: default;
  }
  .chineseTitle, .engTitle {
    display: block;
    text-align: center;
    cursor: default;
  }
  .chineseTitle {
    margin-bottom: 6px;
  }
  .engTitle {
    font-size: ${({ theme: { fontSizes: { fs_5 } } }) => fs_5};
    font-weight: 300;
  }
  &:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.05);
    filter: brightness(0.99);
  }
  &:active {
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.05);
    filter: brightness(0.98);
  }
`;

const {
  darkBlue, darkGreen, teal, green, secondary, blue,
} = theme.colors;

const CityList: React.FC = () => {
  const cities = [
    {
      title: '台北市／新北市',
      engTitle: 'Taipei / New Taipei',
      color: darkBlue,
    },
    {
      title: '桃園市',
      engTitle: 'Taoyuan',
      color: blue,
    },
    {
      title: '台中市',
      engTitle: 'Taichung',
      color: secondary,
    },
    {
      title: '台南市',
      engTitle: 'Tainan',
      color: green,
    },
    {
      title: '高雄市',
      engTitle: 'Kaohsiung',
      color: teal,
    },
    {
      title: '其他地區',
      engTitle: 'Other City',
      color: darkGreen,
    },
  ];

  return (
    <CityListContainer>
      {cities.map((city) => (
        <CityItem key={city.title} color={city.color}>
          <span className="material-icons-outlined bus-icon">
            directions_bus_filled
          </span>
          <h3>
            <span className="chineseTitle">{city.title}</span>
            <span className="engTitle">{city.engTitle}</span>
          </h3>
        </CityItem>
      ))}
    </CityListContainer>
  );
};

export default CityList;
