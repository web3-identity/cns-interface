import { useEffect, type ComponentProps } from 'react';
import { a, useTransition } from '@react-spring/web';
import classNames from 'clsx';
import { lock, clearBodyLocks } from '@utils/body-scroll-lock';

type OverWrite<T, U> = Omit<T, keyof U> & U;

export type Props = OverWrite<
  ComponentProps<'div'>,
  {
    open: boolean;
  }
>;

const Mask = ({ open, className, style, ...props }: Props) => {
  const transitions = useTransition(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: open,
    config: { clamp: true },
  });

  useEffect(() => {
    if (open) lock();
    else clearBodyLocks();
  }, [open]);

  return transitions(
    (styles, item) =>
      item && (
        <a.div className={classNames('fixed left-0 top-0 w-full h-full bg-#110f1b bg-opacity-80 z-[200] contain-strict', className)} style={{ ...style, ...styles }} {...props} />
      )
  );
};

export default Mask;
