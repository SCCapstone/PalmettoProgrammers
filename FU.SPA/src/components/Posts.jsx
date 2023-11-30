import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';


const Posts = ({ posts }) => {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {posts.map((post) => (
        <Card key={post.id}>
          {post.title}
          <CardContent>
            <Typography variant="body5" color="text.primary">
              {post.creator}
            </Typography>
            <Typography gutterBottom variant="h3" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.startTime}
            </Typography>
            <Typography variant="body1" color="black">
              {post.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Join</Button>
            <Button size="small">View</Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};
export default Posts;
