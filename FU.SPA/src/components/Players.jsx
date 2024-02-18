import PlayerCard from './PlayerCard';

const Players = ({ players }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {players.map((user) => 
      
      (
        <PlayerCard key={user.id} user={user} />
      ))}
    </div>
  );
};
export default Players;