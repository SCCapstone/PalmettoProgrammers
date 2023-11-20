import React  from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'; 


const Posts = ({posts}) => {

  return (
    <div>
    <ul>
    {posts.map((post) => (
      <li key={post.Id}>{post.Title}
        <Card sx={{ maxWidth: 345 }}>
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
