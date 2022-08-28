import React from 'react';
import Header from 'components/Header';
import styled from '@emotion/styled';
import Footer from 'components/Footer';
import CityList from 'pages/home/components/CityList';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  height: 484px;
  background: url(${process.env.PUBLIC_URL}/images/banner.png) no-repeat center;
  background-size: cover;
`;

const Home: React.FC = () => {
  const content = 'component';
  return (
    <Wrap>
      <Header />
      <MainContainer>
        <Banner />
        <CityList />
      </MainContainer>
      <Footer />
    </Wrap>
  );
};

export default Home;
