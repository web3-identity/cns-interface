import React, { memo } from 'react';
import cx from 'clsx';
import { useSpring, a } from '@react-spring/web';
import { PopupClass, PopupProps } from '@components/Popup';
import isMobile from '@utils/isMobie';
import renderReactNode from '@utils/renderReactNode';
import './index.css';

export const Toast = new PopupClass(true);
Toast.initPromise.then(() => {
  Toast.setListClassName('toast-wrapper');
  Toast.setItemWrapperClassName('toast-item-wrapper');
  Toast.setAnimatedSize(true);
});

type Type = 'success' | 'warning';

const ToastComponent: React.FC<{ content: string | React.ReactNode | Function; duration: number; hide: () => void; type: Type; showClose?: boolean }> = memo(
  ({ content, duration, type = 'info', showClose = true, hide }) => {
    const props = useSpring({
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0%)' },
      config: { duration },
    });

    return (
      <div className="relative bg-purple-dark-hover rounded-10px overflow-hidden group lt-mobile:w-[calc(100vw-24px)] lt-tiny:w-[calc(100vw-12px)]">
        <div className={cx('flex items-center px-24px py-16px', { 'text-#FF9900': type === 'warning', 'text-green-normal': type === 'success' })}>
          {showClose && (
            <span
              className={cx('i-ep:close-bold absolute right-6px top-6px text-14px cursor-pointer lt-mobile:opacity-100', !isMobile && 'opacity-0 group-hover:opacity-100 transition-opacity')}
              onClick={hide}
            />
          )}
          <span className={cx('text-26px mr-16px flex-shrink-0', { 'i-fa-solid:check-circle': type === 'success', 'i-material-symbols:warning-rounded': type === 'warning' })} />
          {(typeof content === 'string') && <p className="leading-24px text-14px mobile:max-w-282px">{content}</p>}
          {typeof content !== 'string' && <div className='leading-24px text-14px mobile:max-w-282px'>{renderReactNode(content)}</div>}
        </div>

        {duration ? <a.div className="absolute bottom-0 w-full h-4px bg-gradient-to-l from-#15C184 to-green-normal opacity-80" style={props} /> : null}
      </div>
    );
  }
);

export const showToast = (content: string | React.ReactNode | Function, config?: Partial<PopupProps> & { type?: Type } & { special?: boolean }) => {
  let toastKey: number | string | null;
  const hide = () => toastKey && Toast.hide(toastKey);

  toastKey = Toast.show({
    Content: (
      <ToastComponent
        content={content}
        duration={config?.duration ?? 5000}
        hide={hide}
        type={config?.type ?? 'success'}
        showClose={config?.showClose}
      />
    ),
    duration: config?.duration ?? 5000,
    animationType: 'slideRight',
    ...config,
  });
  return toastKey;
};

export const hideToast = (toastKey: string | number) => Toast.hide(toastKey);;
export const hideAllToast = () => Toast.hideAll();
