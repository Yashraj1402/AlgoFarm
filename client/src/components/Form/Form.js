import React, { useState, useEffect } from 'react';
import classes from './Form.module.css';
import { TextField, Button, Typography, Paper } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';

// Get the current id of the post you are on:

const Form = ({ currentId, setCurrentID }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: ''
    });
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(postData);

        if (currentId) {
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
        } else {
            dispatch(createPost({...postData, name: user?.result?.name}));
        }

        clear();
    };
    const clear = () => {
        setCurrentID(null);
        setPostData({
            title: '',
            message: '',
            tags: '',
            selectedFile: ''
        })
    };

    useEffect(() => {
        if (post) setPostData(post);
    }, [post])

    if(!user?.result?.name){
        return(
            <Paper className={classes.paper}>
                <Typography variant='h6' align='center'>
                    Please Log In to create and like posts
                </Typography>
            </Paper>
        )
    }

    return (
        <Paper className={classes.paper}>
            <form autoComplete='off' noValidate className={classes.form} onSubmit={handleSubmit}>
                <Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
                <div className={classes.textField}><TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} /></div>
                <div className={classes.textField}><TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} /></div>
                <div className={classes.textField}><TextField name="tags" variant="outlined" label="Tags" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} /></div>
                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={(file) => setPostData({ ...postData, selectedFile: file.base64 })} /></div>
                <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
                <Button className={classes.buttonClear} variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    );
}

export default Form;