import React from 'react';
import styled from '@emotion/styled';
import CityList from 'pages/home/components/CityList';

const Banner = styled.div`
  height: 484px;
  background: url(${process.env.PUBLIC_URL}/images/banner.png) no-repeat center;
  background-size: cover;
`;

// eslint-disable-next-line arrow-body-style
const Home: React.FC = () => {
  return (
    <>
      <Banner />
      <CityList />
    </>
  );
};

export default Home;
