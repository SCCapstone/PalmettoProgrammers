import React from 'react';
import PostCard from './PostCard';

const Posts = ({ posts }) => {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};
export default Posts;
