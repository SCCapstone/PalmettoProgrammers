import { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import Posts from '../Posts';

export default function Social() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Pass in empty object for later query parameters
    var query = {
      limit: 100,
    };
    UserService.getConnectedPosts(query).then(setPosts);
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
