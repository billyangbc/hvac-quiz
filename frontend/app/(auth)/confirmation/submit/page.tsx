import ConfirmationSubmit from '@/components/auth/confirmation/ConfirmationSubmit';

type paramsType = Promise<{ confirmation?: string }>;

export default async function page( props: {searchParams: paramsType}) {
  const { confirmation } = await props.searchParams;
  return <ConfirmationSubmit confirmationToken={confirmation} />;
}
