import PostService from '../../services/postService';
import { useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import PostForm from '../PostForm';

export default function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async (post) => {
    try {
      const newPost = await PostService.createPost(post);
      navigate(`/posts/${newPost.id}`);
    } catch (e) {
      // generic error notification
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

  return <PostForm onSubmit={handleSubmit} submitButtonText="Create Post" />;
}
