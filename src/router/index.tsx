import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import CustomScrollbar from 'custom-react-scrollbar';
import ErrorBoundary from '@modules/ErrorBoundary';
import Navbar from '@modules/Navbar';
import HomePage from '@pages/Home';
import DomainRegister from '@pages/DomainRegister';
import DomainSetting from '@pages/DomainSetting';
import MyDomains from '@pages/MyDomains';
import useMainScroller from '@hooks/useMainScroller';
import { useWatchPathChange } from '@hooks/useLasPath';

const AppRouter: React.FC = () => {
  useMainScroller();

  return (
    <Router>
      <ErrorBoundary>
        <CustomScrollbar className="main-scroller" contentClassName="min-h-full !flex flex-col pb-40px">
          <Routes>
            <Route path="/" element={<RouteWrapper />}>
              <Route index element={<HomePage />} />
              <Route path="setting/:domain" element={<DomainSetting />} />
              <Route path="register/:domain" element={<DomainRegister />} />
              <Route path="my-domains" element={<MyDomains />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </CustomScrollbar>
        <LastPageWatcher />
      </ErrorBoundary>
    </Router>
  );
};

const RouteWrapper: React.FC = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const LastPageWatcher = () => {
  useWatchPathChange();
  return null;
};

export default AppRouter;
