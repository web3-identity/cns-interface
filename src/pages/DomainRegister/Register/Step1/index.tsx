import React, { useTransition, memo, type ComponentProps } from 'react';
import cx from 'clsx';
import { atomFamily, useRecoilState } from 'recoil';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import { setRecoil } from 'recoil-nexus';
import Button from '@components/Button';
import AuthConnectButton from '@modules/AuthConnectButton';
import { useMinCommitLockTime, commitRegistration as _commitRegistration } from '@service/domainRegister';
import useIsLtMd from '@hooks/useIsLtMd';
import useInTranscation from '@hooks/useInTranscation';
import { RegisterBox } from '@pages/DomainRegister';
import isMobile from '@utils/isMobie';
import PayPrice from '../PayPrice';

export const registerDurationYearsState = atomFamily<number, string>({
  key: 'registerDurationYears',
  effects: [persistAtomWithDefault(1)],
});

export const resetRegisterDurationYears = (domain: string) => setRecoil(registerDurationYearsState(domain), 1);

const Step1: React.FC<{ domain: string }> = ({ domain }) => {
  const isLtMd = useIsLtMd();

  const [durationYears, setRegisterDurationYears] = useRecoilState(registerDurationYearsState(domain));
  const increase = () => setRegisterDurationYears(durationYears + 1);
  const decrease = () => setRegisterDurationYears(durationYears - 1 >= 1 ? durationYears - 1 : 1);
  const [isPending, startTransition] = useTransition();

  const { inTranscation, execTranscation: commitRegistration } = useInTranscation(_commitRegistration);

  return (
    <RegisterBox title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50 lt-md:text-12px">
      <div className="mt-40px grid grid-cols-3 items-center lt-md:mt-16px lt-md:grid-cols-1">
        <div>
          <p>总计花费</p>

          <PayPrice
            className="mt-4px h-54px leading-54px text-45px lt-md:mt-8px lt-md:bg-#26233e lt-md:w-full lt-md:h-56px lt-md:rounded-10px lt-md:text-32px lt-md:leading-56px lt-md:flex lt-md:justify-center"
            domain={domain}
            isPending={isPending}
          />
        </div>

        <div className="flex justify-center lt-md:w-full lt-md:mt-16px">
          <div className="lt-md:w-full">
            <p>注册时长</p>

            <div className="mt-4px flex items-center lt-md:mt-8px lt-md:justify-between lt-md:px-0 lt-md:w-full lt-md:h-56px lt-md:rounded-10px lt-md:text-32px lt-md:leading-38px lt-md:bg-#26233e overflow-hidden">
              <button
                onClick={() => startTransition(decrease)}
                className={cx(
                  'mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover md:text-opacity-50 md:bg-purple-dark-hover md:hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none lt-md:mt-0px lt-md:bg-transparent lt-md:w-56px lt-md:h-56px lt-md:text-#8A8A9D lt-md:justify-center lt-md:items-center',
                  !isMobile() && 'lt-md:hover-bg-#8A8A9D22'
                )}
                disabled={inTranscation}
              >
                <span className="i-fluent:subtract-12-filled text-16px font-bold" />
              </button>

              <p className={cx('mx-24px lt-md:mx-0px lt-md:h-38px', import.meta.env.VITE_RegisterUnit === '小时' ? 'md:min-w-92px' : 'md:min-w-76px')}>
                <span className="inline-block text-center leading-54px text-44px text-grey-normal font-bold lt-md:text-32px lt-md:leading-38px">
                  {durationYears < 10 ? `0${durationYears}` : durationYears}
                </span>
                <span className="ml-2px text-16px text-grey-normal-hover text-opacity-50">{import.meta.env.VITE_RegisterUnit || '年'}</span>
              </p>

              <button
                onClick={() => startTransition(increase)}
                className={cx(
                  'mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover md:text-opacity-50 md:bg-purple-dark-hover md:hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none lt-md:mt-0px lt-md:bg-transparent lt-md:w-56px lt-md:h-56px lt-md:text-#8A8A9D lt-md:justify-center lt-md:items-center',
                  !isMobile() && 'lt-md:hover-bg-#8A8A9D22'
                )}
                disabled={inTranscation}
              >
                <span className="i-fluent:add-12-filled text-15px font-bold" />
              </button>
            </div>
          </div>
        </div>

        {!isLtMd && (
          <ActionButton
            className="w-152px self-end justify-self-end"
            inTranscation={inTranscation}
            domain={domain}
            durationYears={durationYears}
            commitRegistration={commitRegistration}
          />
        )}
        {isLtMd && <Tip className="mt-16px leading-16px text-grey-normal-hover text-opacity-50" />}
      </div>

      {isLtMd && <ActionButton className="w-full mt-auto" inTranscation={inTranscation} domain={domain} durationYears={durationYears} commitRegistration={commitRegistration} />}
      {!isLtMd && <Tip className="mt-auto px-24px py-16px rounded-12px leading-24px bg-#26233E" />}
    </RegisterBox>
  );
};

const ActionButton: React.FC<{ className: string; inTranscation: boolean; domain: string; durationYears: number; commitRegistration: typeof _commitRegistration }> = memo(
  ({ inTranscation, domain, durationYears, className, commitRegistration }) => (
    <AuthConnectButton className={className}>
      <Button className={className} loading={inTranscation} onClick={() => commitRegistration({ domain, durationYears })}>
        申请
      </Button>
    </AuthConnectButton>
  )
);

const Tip: React.FC<ComponentProps<'p'>> = memo(({ className, ...props }) => (
  <p className={cx('whitespace-normal', className)} {...props}>
    在此步骤中，您需要先发送一笔交易，用于提交该用户名的申请。在申请通过后，您需要完成支付并等待程序执行完成，即可获得此用户名。最多需要等待
    <MinCommitmentLockTime />
  </p>
));

const MinCommitmentLockTime: React.FC = () => {
  const minCommitLockTime = useMinCommitLockTime();
  return <>{` ${minCommitLockTime} 秒。`}</>;
};

export default Step1;
