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
  const [keyWords, setKeyWords] = useState<string>("");
  const navigate = useNavigate();
  const { username } = useParams();

  // get the list of posts, together with their respective comments from the backend system
  async function getForumPosts(): Promise<void> {
    try {
      var newPosts = (await axios.get(`${API_URL}/forum/${username}/${keyWords}`)).data
      setPosts(newPosts);
    } catch(e) {
      return;
    }
  }

  // change according to the keyword input from the user
  function keyWordsOnChange(event: React.FormEvent<EventTarget>): void {
    setKeyWords((event.target as HTMLFormElement).value);
  }

  // remove the user cookies and navigate to the `login` page
  async function LogOutBut(): Promise<void> {
    Cookies.remove("username");
    navigate("../login");
  }

  // edit the content of the target item
  async function edit(id: number, isPost: boolean, newContent: string): Promise<void> {
    await axios.put(`${API_URL}/forum/${username}`, {
      "id": id,
      "type": isPost ? "post" : "comment",
      "content": newContent
    })
    getForumPosts();
  }

  // update the like of the target item, commentId will be 0 if and only if the item is a post
  async function likeClicked(postId: number, commentId: number, like: number, clicked: boolean): Promise<void>{
    await axios.patch(`${API_URL}/forum/${username}/${postId}`, {
      "id": commentId,
      "type": commentId === 0 ? "post" : "comment",
      "content": clicked ? "true" : "false",
      "like": like + (clicked ? -1 : 1),
    });
    getForumPosts();
  }

  // add a new post and send it to the backend system
  async function addPost(title: string): Promise<void> {
    await axios.post(`${API_URL}/forum/${username}`, {
      "type": "post",
      "title": title
    })
    getForumPosts();
  }

  // add a new comment to the post and send it to the backend system
  async function addComment(postId: number, content: string): Promise<void> {
    await axios.post(`${API_URL}/forum/${username}`, {
      "type": "comment",
      "content": content,
      "postId": postId
    })
    getForumPosts();
  }

  // delete the target item and everything related to it
  async function deleteItem(type: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/forum/${username}/${type}/${id}`);
    getForumPosts();
  }

  // block the user if there is no cookies
  // check the username parameter in the url and change it to the cookies.username if they do not match
  // else load the forum for the user
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

  useEffect(() => {
    getForumPosts();
  }, [keyWords]);

  return <div>
    <p>My forum</p>
    <input value={keyWords} placeholder={"Enter Keyword"} onChange={keyWordsOnChange}></input>
    <Input value={undefined} submit={addPost} type={"Post"} back={() => {}}/>

    {/* generate the list of post for the user. */}
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
        deleteItem={deleteItem}
        likeClicked={likeClicked}
        edit={edit}
        submit={addComment}
    />)
    }
    <button onClick={LogOutBut}>Log Out</button>
  </div>
    
    
}

export default Forum;