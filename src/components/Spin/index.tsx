import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';
import './index.css';

const Spin: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  return (
    <span className={cx('relative block w-1em h-1em', className)}>
      <svg className="spin" width="240" height="240" viewBox="0 0 240 240" color="currentColor">
        <defs>
          <linearGradient id="linear-gradient1">
            <stop offset="0%" stop-color="currentColor" />
            <stop offset="50%" stop-color="currentColor" stop-opacity="50%" />
          </linearGradient>
          <linearGradient id="linear-gradient2">
            <stop offset="50%" stop-color="currentColor" stop-opacity="50%" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0%" />
          </linearGradient>
          <circle id="semi-circle" cx="120" cy="120" r="100" stroke-width="20" stroke-dasharray="314 1000" fill="none" />
        </defs>
        <g>
          <use href="#semi-circle" stroke="url('#linear-gradient1')" />
          <use
            href="#semi-circle"
            stroke="url('#linear-gradient2')"
            style={{
              transform: 'rotate(180deg)',
              transformOrigin: 'center',
            }}
          />
        </g>
      </svg>
    </span>
  );
};

export default Spin;
