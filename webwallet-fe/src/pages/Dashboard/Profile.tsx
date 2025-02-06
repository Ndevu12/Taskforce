import React, { useState } from 'react';
import ProfileDisplay from '../../components/Profile/ProfileDisplay';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../interfaces/User';

const Profile: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const [user] = useState<User>(
    getCurrentUser() || { email: '', name: '', role: 'USER' as UserRole },
  );

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <ProfileDisplay user={user} />
    </div>
  );
};

export default Profile;
