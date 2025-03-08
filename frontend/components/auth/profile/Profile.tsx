import { getCurrentUser } from '@/lib/services/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserCircle, LockKeyhole, CalendarClock } from 'lucide-react';
import EditUsername from './EditUsername';
import ChangePassword from '../password/ChangePassword';

export default async function Profile() {
  const currentUser = await getCurrentUser();
  return (
    <div className="max-w-2xl w-full">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-sky-600" />
            <div>
              <CardTitle className="text-xl">User Profile</CardTitle>
              <CardDescription className="text-sm">
                Manage your account settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sky-600">
                <Badge className="w-8 h-8 flex items-center justify-center">
                  <span className="text-lg font-mono">
                    {currentUser.username[0].toUpperCase()}
                  </span>
                </Badge>
                <h3 className="font-semibold flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Account Details
                </h3>
              </div>
              
              <EditUsername username={currentUser.username} />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium w-20">Email:</span>
                  <span className="text-muted-foreground">
                    {currentUser.email}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Contact support for email changes
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="w-4 h-4" />
                <span>
                  Last updated:{" "}
                  {new Date(currentUser.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sky-600">
                <LockKeyhole className="w-5 h-5" />
                Security Settings
              </h3>
              <ChangePassword />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
