import UserCard from './UserCard';

const Users = ({ users, showRelationStatus }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          showRelationStatus={showRelationStatus}
          showActions={true}
        />
      ))}
    </div>
  );
};
export default Users;
