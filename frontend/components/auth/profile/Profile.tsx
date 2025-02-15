import { getCurrentUser } from '@/lib/fetch/getCurrentUser';
import EditUsername from './EditUsername';
import ChangePassword from '../password/ChangePassword';

export default async function Profile() {
  const currentUser = await getCurrentUser();
  return (
    <div className='min-w-[40vh] bg-zinc-100 rounded-sm px-4 py-8 mb-8'>
      <h2 className='font-bold text-lg mb-4'>Profile</h2>

      <div className='mb-8'>
        <h3 className='font-bold mb-4 text-sky-700'>User Data</h3>
        <EditUsername username={currentUser.username} />
        <div className='mb-2'>
          <div className='block italic'>Email: </div>
          <div>{currentUser.email}</div>
          <div>(You cannot edit your email.)</div>
        </div>
        <div className='mb-2'>
          Last updated: {new Date(currentUser.updatedAt).toLocaleString()}
        </div>
      </div>

      <div className='mb-8'>
        <h3 className='font-bold mb-4 text-sky-700'>Change password</h3>
        <ChangePassword />
      </div>
    </div>
  );
}
