import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomScrollbar from 'custom-react-scrollbar';
import ErrorBoundary from '@modules/ErrorBoundary';
import Navbar from '@modules/Navbar';
import HomePage from '@pages/Home';
import DomainRegister from '@pages/DomainRegister';
import DomainSetting from '@pages/DomainSetting';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <CustomScrollbar className="main-scroller" contentClassName="pb-100px">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="setting/:domain" element={<DomainSetting />} />
            <Route path="register/:domain" element={<DomainRegister />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CustomScrollbar>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
