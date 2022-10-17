import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import StatusSearch from '@modules/StatusSearch';
import HomeBg from '@assets/imgs/HomeBg.png';
import HomeBgWebp from '@assets/imgs/HomeBg.webp';

const Home: React.FC = () => {
  return (
    <PageWrapper className='pt-230px'>
      <p className='mb-48px text-center text-32px leading-38px text-grey-normal font-bold'>SHUTU NAME Service</p>
      <StatusSearch />

      <picture className="absolute top-0px left-1/2 -translate-x-1/2 w-1512px -z-1 pointer-events-none">
        <source srcSet={HomeBgWebp} type="image/webp" />
        <img className="w-full" src={HomeBg} alt="background image" />
      </picture>
    </PageWrapper>
  );
};

export default Home;
