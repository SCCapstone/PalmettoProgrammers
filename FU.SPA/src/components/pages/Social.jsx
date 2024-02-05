import { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import Posts from '../Posts';

export default function Social() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    UserService.getConnectedPosts().then(setPosts);
  }, []);

  const renderTabContent = () => {
    return <Posts posts={posts} />;
  };

  return (
    <>
      <h1 style={{ textAlign: 'left' }}>Associated Posts</h1>
      {renderTabContent()}
    </>
  );
}
