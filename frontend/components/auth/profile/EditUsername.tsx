'use client';

import { FormEvent, useState } from 'react';
import editUsernameAction, { EditUsernameActionT } from '@/lib/actions/auth/edit-username-action';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Pencil, CircleX } from 'lucide-react';

type Props = {
  username: string;
};

export default function EditUsername({ username }: Props) {
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    // validate newUsername
    if (newUsername === '' || newUsername.length < 4) {
      setError('Username is too short.');
      setLoading(false);
      return;
    }

    // call server action
    const actionResponse: EditUsernameActionT = await editUsernameAction(
      newUsername
    );
    // screen flicker only in dev mode because of revalidateTags in editUsernameAction

    // handle error
    if (actionResponse.error) {
      setError(actionResponse.message);
      setMessage(actionResponse.message);
      setLoading(false);
      return;
    }

    // handle success
    // username is updated in DB and getCurrentUser fetch was updated with revalidateTag
    if (!actionResponse.error && actionResponse.message === 'Success') {
      // inform user of success
      setError(null);
      setMessage('Updated username.');
      setLoading(false);

      // update NextAuth token
      await update({ username: actionResponse.data.username });
      // refresh server components
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        {!edit && (
          <div className="font-medium text-sm">{username}</div>
        )}
        {edit && (
          <>
            <Input
              type="text"
              required
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button
              type="submit"
              disabled={loading}
              className="gap-1"
            >
              {loading ? 'Saving...' : <Save /> }
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="ghost"
          className="text-sky-600 hover:text-sky-700"
          onClick={() => {
            setEdit((prev) => !prev)
            setError(null)
            setMessage(null)
            setNewUsername(username)
          }}
        >
          {edit ? <CircleX /> : <Pencil />
          }
        </Button>
      </div>
      {edit && error && (
        <div className="text-red-700 text-sm" aria-live="polite">
          Something went wrong: {error}
        </div>
      )}
      {edit && !error && message && (
        <div className="text-green-700 text-sm" aria-live="polite">
          {message}
        </div>
      )}
    </form>
  );
}
