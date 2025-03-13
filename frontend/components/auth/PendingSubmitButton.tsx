import { useFormStatus } from 'react-dom';

type PendingSubmitButtonProps = {
  isPending?: boolean;
};

export default function PendingSubmitButton({ isPending }: PendingSubmitButtonProps = {}) {
  // If isPending is provided, use it; otherwise, fall back to useFormStatus
  const { pending: formStatusPending } = useFormStatus();
  const pending = isPending !== undefined ? isPending : formStatusPending;
  return (
    <button
      type='submit'
      className={`bg-primary text-white px-4 py-2 rounded-md disabled:bg-sky-200 disabled:text-gray-400 disabled:cursor-wait`}
      disabled={pending}
      aria-disabled={pending}
    >
      send
    </button>
  );
}
