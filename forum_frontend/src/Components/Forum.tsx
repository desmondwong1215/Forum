import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Post from './Post';
import Input from './Input';
import { post } from "../lib/dataTypes"
import axios from "axios";

const API_URL = "http://localhost:9090"

function Forum() {

  const [posts, setPosts] = useState<post []>([]);
  const navigate = useNavigate();
  const { username } = useParams();

  async function LogOutBut(): Promise<void> {
    Cookies.remove("username")
    navigate("../login");
  }

  async function getForumPosts(): Promise<void> {
    try {
      var newPosts = (await axios.get(`${API_URL}/forum/${username}`)).data
      setPosts(newPosts);
    } catch(e) {
      return;
    }
  }

  async function edit(id: number, isPost: boolean, newContent: string): Promise<void> {
    await axios.put(`${API_URL}/forum/${username}`, {
      "id": id,
      "type": isPost ? "post" : "comment",
      "content": newContent
    })
    getForumPosts();
  }

  async function likeClicked(postId: number, commentId: number, like: number, clicked: boolean): Promise<void>{
    await axios.patch(`${API_URL}/forum/${username}/${postId}`, {
      "id": commentId,
      "type": commentId === 0 ? "post" : "comment",
      "content": clicked ? "true" : "false",
      "like": like + (clicked ? -1 : 1),
    });
    getForumPosts();
  }

  async function addPost(title: string): Promise<void> {
    await axios.post(`${API_URL}/forum/${username}`, {
      "type": "post",
      "title": title
    })
    getForumPosts();
  }

  async function addComment(postId: number, content: string): Promise<void> {
    await axios.post(`${API_URL}/forum/${username}`, {
      "type": "comment",
      "content": content,
      "postId": postId
    })
    getForumPosts();
  }

  async function deletePost(type: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/forum/${username}/${type}/${id}`);
    getForumPosts();
  }

  async function deleteComment(type: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/forum/${username}/${type}/${id}`);
    getForumPosts();
  }

  useEffect(() => {
    const cookieUsername = Cookies.get("username");
    if (!cookieUsername) {
      navigate("../login");
    } else if (username !== cookieUsername) {
      navigate(`../forum/${cookieUsername}`);
    } else {
      getForumPosts();
    }
  }, [username]);

  return <div>
    <p>My forum</p>
    <Input submit={addPost} type={"Post"}/>
    {
    posts.map((post: post) => <Post 
        key={post.id}
        id={post.id}
        title={post.title}
        comments={post.comments}
        like={post.like}
        clicked={post.clicked}
        user={post.user}
        sameUser={post.user === username}
        deletePost={deletePost}
        deleteComment={deleteComment}
        likeClicked={likeClicked}
        edit={edit}
        submit={addComment}
    />)
    }
    <button onClick={LogOutBut}>Log Out</button>
  </div>
    
    
}

export default Forum;