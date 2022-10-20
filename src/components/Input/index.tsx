import { useRef, forwardRef, useCallback, type ReactElement } from 'react';
import composeRef from '@utils/composeRef';
import cx from 'clsx';
import './index.css';

const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!?.set!;

export type Props = OverWrite<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    error?: string;
    wrapperClassName?: string;
    outerPlaceholder?: ReactElement;
    prefixIcon?: string;
    size?: 'normal' | 'small' | 'medium';
  }
>;

const Input = forwardRef<HTMLInputElement, Props>(({ wrapperClassName, className, error, prefixIcon, id, size = 'normal', defaultValue, ...props }, ref) => {
  const domRef = useRef<HTMLInputElement>(null!);
  const handleClickClear = useCallback(() => {
    if (!domRef.current) return;
    setValue.call(domRef.current, String(defaultValue ?? ''));
    domRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    domRef.current.focus();
  }, []);

  return (
    <div className={cx('input-wrapper', `input--${size}`, wrapperClassName)}>
      {prefixIcon && <span className={cx(prefixIcon, 'prefix-icon absolute left-0 top-[50%] -translate-y-[calc(50%-2px)] w-1.5em h-1.5em text-inner')} />}
      <input id={id} ref={composeRef(ref, domRef)} className={cx('input', className)} autoComplete="off" {...props} />
      {!!error && (
        <span id={id ? `${id}-error` : undefined} className="input-error">
          {error}
        </span>
      )}
      <span
        className="i-carbon:close-filled clear-icon absolute right-.5em top-[50%] -translate-y-[calc(50%+1px)] text-1em text-grey-normal-hover opacity-0 pointer-events-none cursor-pointer"
        onClick={handleClickClear}
      />
    </div>
  );
});

export default Input;
