import PostCard from './PostCard';

const Posts = ({ posts, onTagClick, showJoinedStatus }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onTagClick={onTagClick}
          showJoinedStatus={showJoinedStatus}
        />
      ))}
    </div>
  );
};
export default Posts;
