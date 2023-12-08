import { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import Posts from '../Posts';

export default function Social() {
  const [currentTab, setCurrentTab] = useState('posts'); // ['posts', 'players', 'groups']
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (currentTab === 'posts') {
      UserService.getConnectedPosts().then(setPosts);
    } else if (currentTab === 'groups') {
      UserService.getConnectedGroups().then(setGroups);
    } else if (currentTab === 'players') {
      UserService.getConnectedPlayers().then(setPlayers);
    }
  }, [currentTab]);

  const renderTabContent = () => {
    if (currentTab === 'posts') {
      return <Posts posts={posts} />;
    } else if (currentTab === 'groups') {
      return <p>Groups</p>;
    } else if (currentTab === 'players') {
      return <p>Players</p>;
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'left' }}>Associated Posts</h1>
      {renderTabContent()}
    </>
  );
}
