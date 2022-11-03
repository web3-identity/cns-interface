import React, { Suspense, useTransition } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import Button from '@components/Button';
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
      <div className="mt-40px grid grid-cols-3 items-center text-14px">
        <div>
          <p>总计花费</p>

          <PayPrice className="mt-4px h-54px leading-54px text-45px" domain={domain} isPending={isPending} />
        </div>

        <div className='flex justify-center'>
          <div>
            <p className="w-fit">注册时长</p>

            <div className="mt-4px flex items-center">
              <button
                onClick={() => startTransition(decrease)}
                className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none"
                disabled={inTranscation}
              >
                <span className="i-fluent:subtract-12-filled text-16px font-bold" />
              </button>
              <p className="mx-24px">
                <span className="inline-block min-w-60px text-center leading-54px text-45px text-grey-normal font-bold">
                  {durationYears < 10 ? `0${durationYears}` : durationYears}
                </span>
                <span className="ml-4px">年</span>
              </p>
              <button
                onClick={() => startTransition(increase)}
                className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors disabled:pointer-events-none"
                disabled={inTranscation}
              >
                <span className="i-fluent:add-12-filled text-15px font-bold" />
              </button>
            </div>
          </div>
        </div>

        <AuthConnectButton className="w-152px h-48px self-end justify-self-end">
          <Button className="w-152px h-48px self-end justify-self-end" loading={inTranscation} onClick={() => commitRegistration({ domain, durationYears })}>
            申请
          </Button>
        </AuthConnectButton>
      </div>

      <p className="mt-auto px-24px py-16px rounded-12px leading-24px bg-#26233E whitespace-normal">
        在此步骤中，您可以请求注册并执行两个交易中的第一个。 根据顺序，系统将执行第一个申请，以确保没有其他用户同时注册此域名。 最多需要等待
        <Suspense fallback={' ...'}>
          <MinCommitmentLockTime />
        </Suspense>
      </p>
    </RegisterBox>
  );
};

const MinCommitmentLockTime: React.FC = () => {
  const minCommitLockTime = useMinCommitLockTime();
  return <>{` ${minCommitLockTime} 秒。`}</>;
};

export default Step1;
