'use client';

import { useRef, useState } from 'react';
import changePasswordAction from '../../../lib/actions/auth/change-password-action';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PendingSubmitButton from '@/components/auth/PendingSubmitButton';
import { Input } from '@/components/ui/input';

import { ChangePasswordActionStateT } from '@/types/auth/ChangePasswordActionState';

export default function ChangePassword() {
  const [actionState, setActionState] = useState<ChangePasswordActionStateT>({
    error: false,
  });
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { update } = useSession();

  async function handleSubmit(formData: FormData) {
    const actionRes = await changePasswordAction(formData);
    setActionState(actionRes);

    // if actionRes was successfull (password was updated)
    // the actionRes returns us a new jwt strapiToken
    // we use this token to update next auth token and session
    if (
      !actionRes.error &&
      'message' in actionRes &&
      actionRes.message === 'Success'
    ) {
      // reset formfields with useRef
      // https://sabin.dev/blog/how-to-clear-your-forms-when-using-server-actions-in-nextjs
      formRef.current?.reset();
      // update next auth
      await update({ strapiToken: actionRes.data.strapiToken });
      // after update we should do a router.refresh to refresh the server session
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} ref={formRef} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm">
          Current Password
        </label>
        <Input
          type="password"
          id="currentPassword"
          name="currentPassword"
          required
        />
        {actionState.error && actionState?.inputErrors?.currentPassword && (
          <div className="text-red-700 text-sm" aria-live="polite">
            {actionState.inputErrors.currentPassword[0]}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm">
          New Password
        </label>
        <Input
          type="password"
          id="newPassword"
          name="newPassword"
          required
        />
        {actionState.error && actionState?.inputErrors?.newPassword && (
          <div className="text-red-700 text-sm" aria-live="polite">
            {actionState.inputErrors.newPassword[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="passwordConfirmation" className="text-sm">
          Confirm Password
        </label>
        <Input
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          required
        />
        {actionState.error && actionState?.inputErrors?.passwordConfirmation && (
          <div className="text-red-700 text-sm" aria-live="polite">
            {actionState.inputErrors.passwordConfirmation[0]}
          </div>
        )}
      </div>
      
      <PendingSubmitButton />
      
      {actionState.error && actionState.message && (
        <div className="text-red-700 text-sm" aria-live="polite">
          {actionState.message}
        </div>
      )}
      
      {!actionState.error && 'message' in actionState && actionState.message === 'Success' && (
        <div className="text-green-700 text-sm" aria-live="polite">
          Your password was updated
        </div>
      )}
    </form>
  );
}
