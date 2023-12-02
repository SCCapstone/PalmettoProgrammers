import React, { useEffect } from 'react';
import { Button, Card, CardHeader, CardContent, TextField, Link, Box, Container, Typography, CssBaseline, Avatar, FormControlLabel, Icon, Grid, Checkbox } from '@mui/material';
import { useParams } from 'react-router-dom';
import { purple } from '@mui/material/colors';
//export default function Discover() {
    //return <h1>Discover</h1>
    const boxStyle = {
      maxWidth: 450,
      margin: 'auto',
      marginTop: 16,
      marginLeft: 15, 
      marginRight: 0, 
      padding: 16,
      display: 'flex',
      flexDirection: 'column'
    };
      const Discover = ({ posts }) => {
        const { postId } = useParams();
        const post = posts.find((p) => p.Id === parseInt(postId, 10));
      
        useEffect(() => {
        }, [postId]);
    return (
      <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
      
      <Box style={boxStyle}>
          <Typography variant="h4" gutterBottom>
            {postId.Title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Creator: {post.Creator}
          </Typography>
          <Typography variant="body" color="textSecondary" paragraph>
            Start Time: {post.SartTime}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {post.Description} 
          </Typography>
          {/* Add other details as needed */}
        </Box>
      
    </Container>
    )
  //}
}
export default Discover;