import express from "express";
import { userInfo } from "os";

export const router = express.Router();
export const prefix = '/posts';
const {privateStore} = require('../data/DataStore');

router.use(authenticateUser);

// To Do List: Create Post, Like Post, Unlike Post, Reply to Post, Delete Post, Edit Post


router.get('/list', function (req, res) {
  // Send a list of posts from connections (friends/matches).
  // We access user's connections and see if it includes post i's user.
  // If it does, then we add that to the list of posts we send out.
  res.send({
    "list": privateStore.get("posts").filter(x => {req.username.connections.includes(x.username)}),    
  });
});

// When sending axios request to create post, request should include username and content.
router.post('/create', function(req, res) {
  if (!req.username || !req.content) {
    res.status(401).send({msg: 'Expected username and content.'});
    return;
  }

  // ASSIGN RANDOM NUMBER THAT HASNT BEEN USED BEFORE.
  let randomId = 1;

  // Customizes data store.
  privateStore.set(`posts.${postId}`, {
    "id": randomId,
    "username": req.username,
    "content": req.content,
    "replies": [],
    "hearts": []
  });

  // Sends response
  res.send({"data" : req.content, "status": "Successfully created post!!"});
});

// When sending axios request to like post, request should include username and postId
router.post('/like', function(req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({msg: 'Expected username and postID.'});
    return;
  }

  // updates heart to post
  // CHECK IF POST HASN'T ALREADY BEEN LIKED.
  let tempPost = privateStore.get(`posts.${req.postId}`);
  privateStore.delete(`posts.${req.postId}`);
  tempPost.hearts.push(req.username);
  privateStore.set(`posts.${postId}`, tempPost);

  // Sends response
  res.send({"status": "Successfully liked post!!"});
});