import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import StatusSearch from '@modules/StatusSearch';
import homeBg from '@assets/images/home-bg.png';
import homeBgWebp from '@assets/images/home-bg.webp';

const Home: React.FC = () => {
  return (
    <PageWrapper className="pt-230px">
      <p className="mb-48px text-center text-32px leading-38px text-grey-normal font-bold">SHUTU NAME Service</p>
      <StatusSearch where='home'/>

      <picture className="absolute top-0px left-1/2 -translate-x-1/2 w-1512px -z-1 pointer-events-none">
        <source srcSet={homeBgWebp} type="image/webp" />
        <img className="w-full" src={homeBg} alt="background image" />
      </picture>
    </PageWrapper>
  );
};

export default Home;
