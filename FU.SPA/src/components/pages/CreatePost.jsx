import PostService from '../../services/postService';
import { useNavigate } from 'react-router-dom';
import PostForm from '../PostForm';

export default function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async (post) => {
    try {
      const newPost = await PostService.createPost(post);
      navigate(`/posts/${newPost.id}`);
    } catch (e) {
      window.alert(e);
      console.error(e);
    }
  };

  return <PostForm onSubmit={handleSubmit} submitButtonText="Create Post" />;
}
