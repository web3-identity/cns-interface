import React, { type ComponentProps } from 'react';
import cx from 'clsx';
import './index.css';

const Spin: React.FC<ComponentProps<'div'> & { theme?: 'light' | 'dark' }> = ({ className, theme = 'dark' }) => {
  return (
    <span className={cx('relative block w-1em h-1em leading-1em', className)}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 200 200" xmlSpace="preserve">
        <g className="spin">
          <linearGradient id="spin-right" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180">
            <stop offset="0" style={{ stopColor: theme === 'light' ? '#F0EEE9' : '#6667ab' }} />
            <stop offset="1" style={{ stopColor: theme === 'light' ? '#B1B1B1' : '#8B8BBA' }} />
          </linearGradient>
          <path className="spin-right" d="M100,0v20c44.1,0,80,35.9,80,80c0,44.1-35.9,80-80,80v20c55.2,0,100-44.8,100-100S155.2,0,100,0z" />
          <linearGradient id="spin-left" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="180">
            <stop offset="0" style={{ stopColor: theme === 'light' ? '#8B8BBA' : '#B1B1B1' }} />
            <stop offset="1" style={{ stopColor: theme === 'light' ? '#B1B1B1' : '#8B8BBA' }} />
          </linearGradient>
          <path className="spin-left" d="M20,100c0-44.1,35.9-80,80-80V0C44.8,0,0,44.8,0,100s44.8,100,100,100v-20C55.9,180,20,144.1,20,100z" />
          <circle className={cx(theme === 'light' ? 'fill-#F0EEE9' : 'fill-purple-normal')} cx="100" cy="10" r="10" />
        </g>
      </svg>
    </span>
  );
};

export default Spin;
