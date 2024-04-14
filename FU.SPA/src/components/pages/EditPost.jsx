import PostForm from '../PostForm';
import PostService from '../../services/postService';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';


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
      Store.addNotification({
        title: 'Post Updated',
        message: 'Successfully updated post\n',
        type: 'success',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
      navigate(`/posts/${postId}`);
    } catch (e) {
      Store.addNotification({
        title: 'Error has occured',
        message: 'An error has occured.\n' + e,
        type: 'danger',
        insert: 'bottom',
        container: 'bottom-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
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
