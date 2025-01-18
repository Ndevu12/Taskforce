import React from 'react';
import { User } from '../../interfaces/User';

interface ProfileDisplayProps {
  user: User;
  onEdit: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePhoto || '/path-to-placeholder-image.jpg'}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <p className="text-gray-600 dark:text-gray-400 capitalize">
            {user.role}
          </p>
        </div>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
        onClick={onEdit}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileDisplay;
