import express from "express";
import { userInfo } from "os";
import { authenticateUser } from "../middlewares/auth.js";

export const router = express.Router();
export const prefix = '/posts';
const { privateStore } = require('../data/DataStore');

router.use(authenticateUser);

router.get('/list', function (req, res) {
  // Send a list of posts from connections (friends/matches).
  // We access user's connections and see if it includes post i's user.
  // If it does, then we add that to the list of posts we send out.
  res.send({
    "list": privateStore.get("posts").filter(x => { req.username.connections.includes(x.username) }),
  });
});

// When sending axios request to create post, request should include an object with username and content.
router.post('/create', authenticateUser, async function (req, res) {
  if (!req.username || !req.content) {
    res.status(401).send({ msg: 'Expected username and content.' });
    return;
  }

  let postId = getRandomInt();
  // Customizes data store.
  privateStore.set(`posts.${postId}`, {
    "id": postId,
    "username": req.username,
    "content": req.content,
    "replies": [],
    "hearts": [],
    "timestamp": new Date()
  });

  // Sends response
  res.send({ "data": req.content, "status": "Successfully created post!!" });
});

// When sending axios request to like post, request should include an object with username and postId
router.post('/like', function (req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({ msg: 'Expected username and postID.' });
    return;
  }

  // updates heart to post
  // CHECK IF POST HASN'T ALREADY BEEN LIKED.
  let tempPost = privateStore.get(`posts.${req.postId}`);
  privateStore.delete(`posts.${req.postId}`);
  tempPost.hearts.push(req.username);
  privateStore.set(`posts.${postId}`, tempPost);

  // Sends response
  res.send({ "status": "Successfully liked post!!" });
});

// When sending axios request to unlike post, request should include an object with username and postId
router.post('/unlike', function (req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({ msg: 'Expected username and postID.' });
    return;
  }

  // updates lack of heart to post
  // CHECK IF POST HASN'T ALREADY BEEN LIKED.
  let tempPost = privateStore.get(`posts.${req.postId}`);
  privateStore.delete(`posts.${req.postId}`);
  tempPost.hearts = tempPost.hearts.filter(x => x != req.username);
  privateStore.set(`posts.${postId}`, tempPost);

  // Sends response
  res.send({ "status": "Successfully unliked post!!" });
});

// When sending axios request to delete post, request should include an object with username and postId
router.post('/delete', function (req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({ msg: 'Expected username and postID.' });
    return;
  }

  privateStore.delete(`posts.${req.postId}`);

  // Sends response
  res.send({ "status": "Successfully deleted post!!" });
});


// When sending axios request to reply to post, request should include an object with username, content, and the id of the post being replied to.
router.post('/reply', function (req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({ msg: 'Expected username and postID.' });
    return;
  }

  if (!req.content) {
    res.status(401).send({ msg: 'Expected reply.' });
    return;
  }

  // updates Replies array.
  let tempPost = privateStore.get(`posts.${req.postId}`);
  privateStore.delete(`posts.${req.postId}`);
  tempPost.replies.push({
    "id": getRandomInt(),
    "parentId": req.postId,
    "username": req.username,
    "content": req.content,
    "hearts": [],
    "timestamp": new Date()
  })
  privateStore.set(`posts.${postId}`, tempPost);

  // Sends response
  res.send({ "status": "Successfully replied to post!!" });
});


// When sending axios request to edit post, request should include an object with username, content, and the id of the post being edited.
router.post('/edit', function (req, res) {
  if (!req.username || !req.postId) {
    res.status(401).send({ msg: 'Expected username and postID.' });
    return;
  }

  if (!req.content) {
    res.status(401).send({ msg: 'Expected content.' });
    return;
  }

  let tempPost = privateStore.get(`posts.${req.postId}`);
  privateStore.delete(`posts.${req.postId}`);
  tempPost.content = req.content;
  privateStore.set(`posts.${postId}`, tempPost);

  // Sends response
  res.send({ "status": "Successfully edited post!!" });
});

let getRandomInt = function () {
  return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
};