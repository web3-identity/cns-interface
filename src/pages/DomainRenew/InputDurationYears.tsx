import React, { useTransition } from 'react';
import cx from 'clsx';
import { useRecoilState } from 'recoil';
import PayPrice from '@pages/DomainRegister/Register/PayPrice';
import Button from '@components/Button';
import useInTranscation from '@hooks/useInTranscation';
import { domainTransfer as _domainTransfer } from '@service/domainTransfer';
import { web3Renew as _web3Renew, setRenewStep, RenewStep } from '@service/domainRenew';
import payMethod from '@service/payMethod';
import { registerDurationYearsState } from '@pages/DomainRegister/Register/Step1';
import isMobile from '@utils/isMobie';

const InputDurationYears: React.FC<{ domain: string; refreshDomainExpire: VoidFunction }> = ({ domain, refreshDomainExpire }) => {
  const [durationYears, setRegisterDurationYears] = useRecoilState(registerDurationYearsState(domain));
  const increase = () => setRegisterDurationYears(durationYears + 1);
  const decrease = () => setRegisterDurationYears(durationYears - 1 >= 1 ? durationYears - 1 : 1);
  const [isPending, startTransition] = useTransition();

  const { inTranscation: inWeb3Renew, execTranscation: web3Renew } = useInTranscation(_web3Renew);

  return (
    <>
      <div className="flex md:pl-136px md:items-baseline lt-md:flex-col">
        <p className="w-64px mr-26px -translate-y-1px">总计花费</p>

        <PayPrice
          className="mt-4px h-54px leading-54px text-45px lt-md:mt-8px lt-md:bg-#26233e lt-md:w-full lt-md:h-56px lt-md:rounded-10px lt-md:text-32px lt-md:leading-56px lt-md:flex lt-md:justify-center"
          domain={domain}
          isPending={isPending}
        />
      </div>

      <div className="flex md:pl-136px md:items-end lt-md:w-full lt-md:mt-16px lt-md:flex-col">
        <p className="w-64px mr-26px md:-translate-y-10px">注册时长</p>

        <div className="mt-4px flex items-center lt-md:mt-8px lt-md:justify-between lt-md:px-0 lt-md:w-full lt-md:h-56px lt-md:rounded-10px lt-md:text-32px lt-md:leading-38px lt-md:bg-#26233e overflow-hidden">
          <button
            onClick={() => startTransition(decrease)}
            className={cx(
              'mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover md:text-opacity-50 md:bg-purple-dark-hover md:hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none lt-md:mt-0px lt-md:bg-transparent lt-md:w-56px lt-md:h-56px lt-md:text-#8A8A9D lt-md:justify-center lt-md:items-center',
              !isMobile() && 'lt-md:hover-bg-#8A8A9D22',
              inWeb3Renew && 'opacity-50'
            )}
            disabled={inWeb3Renew}
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
              !isMobile() && 'lt-md:hover-bg-#8A8A9D22',
              inWeb3Renew && 'opacity-50'
            )}
            disabled={inWeb3Renew}
          >
            <span className="i-fluent:add-12-filled text-15px font-bold" />
          </button>
        </div>
      </div>

      <Button
        loading={inWeb3Renew}
        className={cx("mt-40px mx-auto flex! w-152px lt-md:w-full", isMobile() ? 'lt-md:mt-48px' : 'lt-md:mt-40px')}
        onClick={() => {
          if (payMethod === 'web3') {
            web3Renew({ domain, durationYears, refreshDomainExpire });
          } else {
            setRenewStep(domain, RenewStep.WaitRenewPay);
          }
        }}
      >
        续费
      </Button>
    </>
  );
};

export default InputDurationYears;
