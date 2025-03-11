'use client';

import { useActionState } from 'react';
import confirmationNewRequestAction from '@/lib/actions/auth/confirm-new-request-action';
import { InitialFormStateT, ConfirmationNewRequestFormStateT } from '@/types/auth/ConfirmationNewRequestFormState';

const initialState: InitialFormStateT = {
  error: false,
};
export default function ConfirmationNewRequest() {
  const [state, dispatch, isPending] = useActionState<
    ConfirmationNewRequestFormStateT,
    FormData
  >(confirmationNewRequestAction, initialState);

  return (
    <div className='mx-auto my-8 p-8 max-w-lg bg-zinc-100 rounded-sm'>
      <h2 className='text-center text-2xl text-blue-400 mb-8 font-bold'>
        Confirmation request
      </h2>
      <p className='mb-4'>
        Request a new confirmation email. Maybe some info about token expiry or
        limited request here.
      </p>
      <form action={dispatch} className='my-8'>
        <div className='mb-3'>
          <label htmlFor='email' className='block mb-1'>
            Email *
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            className='bg-white border border-zinc-300 w-full rounded-sm p-2'
          />
          {state.error && state?.inputErrors?.email ? (
            <div className='text-red-700' aria-live='polite'>
              {state.inputErrors.email[0]}
            </div>
          ) : null}
        </div>
        <div className='mb-3'>
          <button
            type='submit'
            className={`bg-primary text-white px-4 py-2 rounded-md disabled:bg-sky-200 disabled:text-gray-400 disabled:cursor-wait`}
            disabled={isPending}
            aria-disabled={isPending}
          >
            send
          </button>
        </div>
        {state.error && state.message ? (
          <div className='text-red-700' aria-live='polite'>
            {state.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
