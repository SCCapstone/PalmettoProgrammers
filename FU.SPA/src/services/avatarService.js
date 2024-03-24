import config from '../config';
const API_BASE_URL = config.API_URL;
import AuthService from './authService';

const upload = async (file) => {
  const formData = new FormData();
  formData.append('avatarFile', file);

  const response = await fetch(`${API_BASE_URL}/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });

  if (response.status === 422) {
    throw new Error('Invalid file format');
  } else if (!response.ok) {
    throw new Error('Error uploading file');
  }

  return await response.json();
};

const AvatarService = {
  upload,
};
export default AvatarService;
