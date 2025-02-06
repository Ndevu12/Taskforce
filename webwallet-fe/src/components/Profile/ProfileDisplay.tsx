import React from 'react';
import { User } from '../../interfaces/User';
import { FaUser } from 'react-icons/fa';

interface ProfileDisplayProps {
  user: User;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <FaUser className="text-6xl text-gray-700 dark:text-gray-300" />
        <div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {user?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <p className="text-gray-600 dark:text-gray-400 capitalize">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
