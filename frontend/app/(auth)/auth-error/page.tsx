type paramsType = Promise<{ error?: string }>;
export default async function AuthErrorPage(props: {searchParams: paramsType}) {
  const { error } = await props.searchParams;

  return (
    <div className='bg-zinc-100 rounded-sm px-4 py-8 mb-8'>
      AuthError: { error }
    </div>
  );
}
