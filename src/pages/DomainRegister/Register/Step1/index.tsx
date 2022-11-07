import React, { Suspense, useTransition } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import Button from '@components/Button';
import isMobile from '@utils/isMobie';
import AuthConnectButton from '@modules/AuthConnectButton';
import { useMinCommitLockTime, commitRegistration as _commitRegistration } from '@service/domainRegister';
import useInTranscation from '@hooks/useInTranscation';
import { RegisterBox } from '@pages/DomainRegister';
import PayPrice from '../PayPrice';

export const registerDurationYearsState = atomFamily<number, string>({
  key: 'registerDurationYears',
  effects: [persistAtomWithDefault(1)],
});

const Step1: React.FC<{ domain: string }> = ({ domain }) => {
  const [durationYears, setRegisterDurationYears] = useRecoilState(registerDurationYearsState(domain));
  const increase = () => setRegisterDurationYears(durationYears + 1);
  const decrease = () => setRegisterDurationYears(durationYears - 1 >= 1 ? durationYears - 1 : 1);
  const [isPending, startTransition] = useTransition();

  const { inTranscation, execTranscation: commitRegistration } = useInTranscation(_commitRegistration);

  return (
    <RegisterBox title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
      <div className="mt-40px grid grid-cols-3 items-center text-14px lt-md:mt-16px lt-md:grid-cols-1">
        <div>
          <p>总计花费</p>

          <PayPrice
            className="mt-4px h-54px leading-54px text-45px lt-md:mt-8px lt-md:bg-#26233e lt-md:w-full lt-md:rounded-10px lt-md:text-32px lt-md:leading-38px lt-md:flex lt-md:justify-center lt-md:pt-8px"
            domain={domain}
            isPending={isPending}
          />
        </div>

        <div className="flex justify-center lt-md:w-full lt-md:mt-16px">
          <div className="lt-md:w-full">
            <p className="w-fit">注册时长</p>

            <div className="mt-4px flex items-center lt-md:mt-8px lt-md:bg-#26233e lt-md:w-full lt-md:rounded-10px lt-md:text-32px lt-md:leading-38px lt-md:flex lt-md:justify-between lt-md:px-16px lt-md:h-54px">
              <button
                onClick={() => startTransition(decrease)}
                className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none lt-md:mt-0px lt-md:bg-transparent lt-md:w-16px lt-md:h-16px lt-md:text-gray-normal lt-md:text-opacity-100 lt-md:flex lt-md:items-center"
                disabled={inTranscation}
              >
                <span className="i-fluent:subtract-12-filled text-16px font-bold" />
              </button>
              <p className="mx-24px lt-md:mx-0px lt-md:h-38px min-w-76px">
                <span className="inline-block text-center leading-54px text-44px text-grey-normal font-bold lt-md:text-32px lt-md:leading-38px">
                  {durationYears < 10 ? `0${durationYears}` : durationYears}
                </span>
                <span className="ml-2px text-16px text-grey-normal-hover text-opacity-50">年</span>
              </p>
              <button
                onClick={() => startTransition(increase)}
                className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none lt-md:mt-0px lt-md:bg-transparent lt-md:w-16px lt-md:h-16px lt-md:text-gray-normal lt-md:text-opacity-100 lt-md:flex lt-md:items-center"
                disabled={inTranscation}
              >
                <span className="i-fluent:add-12-filled text-15px font-bold" />
              </button>
            </div>
          </div>
        </div>

        {isMobile() && (
          <p className="mt-16px text-12px leading-16px text-grey-normal-hover text-opacity-50 whitespace-normal">
            在此步骤中，您可以请求注册并执行两个交易中的第一个。 根据顺序，系统将执行第一个申请，以确保没有其他用户同时注册此域名。 最多需要等待
            <Suspense fallback={' ...'}>
              <MinCommitmentLockTime />
            </Suspense>
          </p>
        )}

        <AuthConnectButton className="w-152px self-end justify-self-end lt-md:w-full lt-md:mt-16px">
          <Button className="w-152px self-end justify-self-end lt-md:w-full lt-md:mt-16px" loading={inTranscation} onClick={() => commitRegistration({ domain, durationYears })}>
            申请
          </Button>
        </AuthConnectButton>
      </div>

      {!isMobile() && (
        <p className="mt-auto px-24px py-16px rounded-12px leading-24px bg-#26233E whitespace-normal">
          在此步骤中，您可以请求注册并执行两个交易中的第一个。 根据顺序，系统将执行第一个申请，以确保没有其他用户同时注册此域名。 最多需要等待
          <Suspense fallback={' ...'}>
            <MinCommitmentLockTime />
          </Suspense>
        </p>
      )}
    </RegisterBox>
  );
};

const MinCommitmentLockTime: React.FC = () => {
  const minCommitLockTime = useMinCommitLockTime();
  return <>{` ${minCommitLockTime} 秒。`}</>;
};

export default Step1;
