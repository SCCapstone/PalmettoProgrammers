import React  from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';


const Posts = ({posts}) => {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <ul>
  {posts.map((post) => (
      <li key={post.Id}>{post.Title}
        <Card sx={{ minWidth: 345, maxWidth: 345 }}>
        <CardContent>
        <Typography variant="body5" color="text.primary">
          {post.Creator}
        </Typography>
        <Typography gutterBottom variant="h3" component="div">
          {post.Title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {post.StartTime}
        </Typography>
        <Typography variant="body1" color="black">
          {post.Description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Join</Button>
        <Button size="small">View</Button>
      </CardActions>
    </Card>
    </li>
        ))}
</ul>
</div>
);
};
export default Posts;
