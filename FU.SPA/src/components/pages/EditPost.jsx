import PostForm from '../PostForm';
import PostService from '../../services/postService';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditPost() {
  const { postId } = useParams();
  const [ogPost, setOgPost] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      const ogPostDetails = await PostService.getPostDetails(postId);
      setOgPost(ogPostDetails);
    };
    getPost();
  }, [postId]);

  const handleSubmit = async (newPost) => {
    try {
      await PostService.updatePost(newPost, postId);
      alert('Post updated successfully!');
      navigate(`/posts/${postId}`);
    } catch (e) {
      window.alert(e);
      console.error(e);
    }
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      initialValue={ogPost}
      submitButtonText="Update Post"
    />
  );
}
