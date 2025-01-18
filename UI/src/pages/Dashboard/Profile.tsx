import React, { useState } from 'react';
import ProfileDisplay from '../../components/Profile/ProfileDisplay';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { User, UserRole } from '../../interfaces/User';

const initialUser: User = {
  email: 'johndoe@example.com',
  name: 'John Doe',
  role: UserRole.USER,
  profilePhoto: '/path-to-placeholder-image.jpg',
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <ProfileDisplay user={user} onEdit={handleEdit} />
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;
