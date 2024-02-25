import Edit from '../Edit.jsx';
import { useParams } from 'react-router';

export default function EditPost() {
  const { postId } = useParams();
  return <Edit postId={postId} />;
}
