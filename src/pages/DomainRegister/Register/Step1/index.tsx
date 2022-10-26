import React, { Suspense, useTransition } from 'react';
import Button from '@components/Button';
import Spin from '@components/Spin';
import { useMinCommitLockTime, useRegisterDurationYearsState, commitRegistration as _commitRegistration, usePayPrice } from '@service/domain/register';
import { useAccountMethod } from '@service/account';
import useInTranscation from '@hooks/useInTranscation';
import { RegisterContainer } from '../index';

const Step1: React.FC<{ domain: string }> = ({ domain }) => {
  const accountMethod = useAccountMethod();

  const { durationYears, increase, decrease } = useRegisterDurationYearsState(domain);
  const { inTranscation, execTranscation: commitRegistration } = useInTranscation(_commitRegistration);
  const [isPending, startTransition] = useTransition();

  return (
    <RegisterContainer title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
      <div className="mt-40px grid grid-cols-3 items-center text-14px">
        <div>
          <p>总计花费</p>

          <p className="mt-4px">
            {isPending ? <Spin className="leading-54px text-45px text-grey-normal font-bold" /> : null}
            <span className="leading-54px text-45px text-grey-normal font-bold">
              <Suspense>
                <TotalPayPrice domain={domain} />
              </Suspense>
            </span>
            <span className="ml-4px">{!accountMethod || accountMethod === 'fluent' ? 'CFX' : '￥'}</span>
          </p>
        </div>

        <div>
          <p className="w-fit">注册时长</p>

          <div className="mt-4px flex items-center justify-self-end">
            <button
              onClick={() =>
                startTransition(() => {
                  decrease();
                })
              }
              className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors"
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
              onClick={() =>
                startTransition(() => {
                  increase();
                })
              }
              className="mt-6px w-24px h-24px p-0 rounded-4px border-none text-grey-normal-hover text-opacity-50 bg-purple-dark-hover hover:bg-purple-dark cursor-pointer transition-colors"
            >
              <span className="i-fluent:add-12-filled text-15px font-bold" />
            </button>
          </div>
        </div>

        <Button className="mb-4px w-156px h-44px self-end justify-self-end" loading={inTranscation} onClick={() => commitRegistration({ domain, durationYears })}>
          申请
        </Button>
      </div>

      <p className="mt-auto px-24px py-16px rounded-12px leading-24px bg-#26233E whitespace-normal">
        在此步骤中，您可以请求注册并执行两个交易中的第一个。 根据顺序，系统将执行第一个申请，以确保没有其他用户同时注册此域名。 最多需要等待
        <Suspense fallback={' ...'}>
          <MinCommitmentLockTime />
        </Suspense>
      </p>
    </RegisterContainer>
  );
};

const TotalPayPrice: React.FC<{ domain: string }> = ({ domain }) => {
  const payPrice = usePayPrice(domain);

  return <>{Math.round(+payPrice.toDecimalStandardUnit())}</>;
};

const MinCommitmentLockTime: React.FC = () => {
  const minCommitLockTime = useMinCommitLockTime();
  return <>{` ${minCommitLockTime} 秒。`}</>;
};

export default Step1;
