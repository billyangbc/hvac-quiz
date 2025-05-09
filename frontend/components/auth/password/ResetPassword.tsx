'use client';

import { useActionState } from 'react';
import resetPasswordAction from '@/lib/actions/auth/reset-password-action';
import Link from 'next/link';
import PendingSubmitButton from '@/components/auth/PendingSubmitButton';
import { ResetPasswordFormStateT } from '@/types/auth/ResetPasswordFormState';

type Props = {
  code: string | undefined;
};
export default function ResetPassword({ code }: Props) {
  const initialState: ResetPasswordFormStateT = {
    error: false,
    code: code || '',
  };
  const [state, formAction, isPending] = useActionState<ResetPasswordFormStateT, FormData>(
    resetPasswordAction,
    initialState
  );

  if (!code) return <p>Error, please use the link we mailed you.</p>;
  if (!state.error && 'message' in state && state.message === 'Success') {
    return (
      <div className='bg-zinc-100 rounded-sm px-4 py-8 mb-8'>
        <h2 className='font-bold text-lg mb-4'>Password was reset</h2>
        <p>
          Your password was reset. You can now{' '}
          <Link href='/signin' className='underline'>
            sign in
          </Link>{' '}
          with your new password.
        </p>
      </div>
    );
  }

  return (
    <div className='mx-auto my-8 p-8 max-w-lg bg-zinc-100 rounded-sm'>
      <h2 className='text-center text-2xl text-blue-400 mb-8 font-bold'>
        Reset your password
      </h2>
      <p className='mb-4'>
        To reset your password, enter your new password, confirm it by entering
        it again and then click send.
      </p>
      <form action={formAction} className='my-8'>
        <div className='mb-3'>
          <label htmlFor='password' className='block mb-1'>
            Password *
          </label>
          <input
            type='password'
            id='password'
            name='password'
            required
            className='bg-white border border-zinc-300 w-full rounded-sm p-2'
          />
          {state.error && state?.inputErrors?.password ? (
            <div className='text-red-700' aria-live='polite'>
              {state.inputErrors.password[0]}
            </div>
          ) : null}
        </div>
        <div className='mb-3'>
          <label htmlFor='passwordConfirmation' className='block mb-1'>
            confirm your password *
          </label>
          <input
            type='password'
            id='passwordConfirmation'
            name='passwordConfirmation'
            required
            className='bg-white border border-zinc-300 w-full rounded-sm p-2'
          />
          {state.error && state?.inputErrors?.passwordConfirmation ? (
            <div className='text-red-700' aria-live='polite'>
              {state.inputErrors.passwordConfirmation[0]}
            </div>
          ) : null}
        </div>
        <div className='mb-3'>
          <PendingSubmitButton isPending={isPending} />
        </div>
        {state.error && state.message ? (
          <div className='text-red-700' aria-live='polite'>
            Error: {state.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
