import config from '../config';
const API_BASE_URL = config.API_URL;

const upload = async (file) => {
  const formData = new FormData();
  formData.append('avatarFile', file);

  const response = await fetch(`${API_BASE_URL}/avatar`, {
    method: 'POST',
    body: formData,
  });

  if (response.status === 422) {
    throw new Error('Invalid file format');
  } else if (!response.ok) {
    throw new Error('Error uploading file');
  }

  return await response.json();
};

const getUrl = (id) => {
  return `${API_BASE_URL}/avatar/${id}.jpg`;
};

const AvatarService = {
  upload,
  getUrl,
};
export default AvatarService;
