import { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import Posts from '../Posts';

export default function Social() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    UserService.getConnectedPosts().then(setPosts);
  }, []);

  return (
    <>
      <h1 style={{ textAlign: 'left' }}>Posts</h1>
      <Posts posts={posts} />
    </>
  );
}
