import React from 'react';
import styled from '@emotion/styled';
import CityList from 'pages/home/components/CityList';

const Wrap = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  height: 484px;
  background: url(${process.env.PUBLIC_URL}/images/banner.png) no-repeat center;
  background-size: cover;
`;

const Home: React.FC = () => {
  return (
    <Wrap>
      <Banner />
      <CityList />
    </Wrap>
  );
};

export default Home;
