import React, { useState, useEffect } from 'react';
import { User } from '../../interfaces/User';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  // eslint-disable-next-line no-unused-vars
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(user.profilePhoto);

  useEffect(() => {
    setName(user.name);
    setPreviewPhoto(user.profilePhoto);
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.size <= 2 * 1024 * 1024 &&
      /image\/(jpeg|png)/.test(file.type)
    ) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid image file (jpg, png) up to 2MB.');
    }
  };

  const handleSave = () => {
    if (name.length < 3) {
      alert('Full Name must be at least 3 characters long.');
      return;
    }
    const updatedUser = { ...user, name, profilePhoto: previewPhoto };
    onSave(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Edit Profile
          </h2>
          <button
            className="text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              required
              minLength={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
              title="Choose a profile photo"
              placeholder="Choose a profile photo"
            />
            {previewPhoto && (
              <img
                src={previewPhoto}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 rounded-full"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
