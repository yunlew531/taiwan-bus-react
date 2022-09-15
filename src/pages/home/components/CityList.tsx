import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';
import theme from 'styleSheets/theme';
import { Link } from 'react-router-dom';

const CityListContainer = styled.ul`
  max-width: 1440px;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
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
      title: '臺北市／新北市',
      engTitle: 'Taipei / New Taipei',
      color: darkBlue,
    },
    {
      title: '桃園市',
      engTitle: 'Taoyuan',
      color: blue,
    },
    {
      title: '臺中市',
      engTitle: 'Taichung',
      color: secondary,
    },
    {
      title: '臺南市',
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

  const handleCityUrl = (city: string) => {
    let result: string;

    switch (city) {
      case 'Taipei / New Taipei':
        result = 'Taipei&NewTaipei';
        break;
      case 'Other City':
        result = 'Other_City';
        break;
      default:
        result = city;
    }

    return `/bus/${result}`;
  };

  return (
    <CityListContainer>
      {cities.map((city) => (
        <Link key={city.title} to={handleCityUrl(city.engTitle)}>
          <CityItem color={city.color}>
            <span className="material-icons-outlined bus-icon">
              directions_bus_filled
            </span>
            <h3>
              <span className="chineseTitle">{city.title}</span>
              <span className="engTitle">{city.engTitle}</span>
            </h3>
          </CityItem>
        </Link>
      ))}
    </CityListContainer>
  );
};

export default CityList;
