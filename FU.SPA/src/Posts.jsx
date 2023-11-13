import React, { useState, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'; 


const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

const getPosts = async () => {
      const response = await fetch(`http://localhost:5173/api/posts`);
      const data = await response.json();
      setPosts(data);
  };

  return (
    <div>
    <ul>
    {posts.map((post) => (
      <li key={post.Id}>
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
