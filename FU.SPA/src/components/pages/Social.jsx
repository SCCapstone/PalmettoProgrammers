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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setCurrentTab('posts')}>Posts</button>
        <button onClick={() => setCurrentTab('groups')}>Groups</button>
        <button onClick={() => setCurrentTab('players')}>Players</button>
      </div>
      <h1 style={{ textAlign: 'left' }}>{currentTab}</h1>
      {renderTabContent()}
    </>
  );

}
