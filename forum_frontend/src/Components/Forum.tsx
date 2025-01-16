import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Post from './Post';
import ForumNavbar from './ForumNavBar';
import CreatePost from './CreatePost';
import ForumAxios from '../forumAxios';
import { post } from "../lib/dataTypes";
import "../Style/forum.css";
import { brown } from '@mui/material/colors';

function Forum() {

  const [posts, setPosts] = useState<post []>([]);
  const [keyWords, setKeyWords] = useState<string>("");
  const [isLight, setLight] = useState<boolean>(Cookies.get("mode") === "light");
  const [showCreatePost, setCreatePost] = useState<boolean>(false);
  const navigate = useNavigate();
  const { username } = useParams();
  let tokenUsername: string;

  const webTheme = createTheme({
    palette: {
      mode: isLight ? 'light' : 'dark',
      primary: {
        main: brown[300],
      }
    },
    typography: {
      "fontFamily": `"Kanit", serif`,
      "fontWeightMedium": 400,
      "fontSize": 15,
    }
  });

  // get the list of posts, together with their respective comments from the backend system
  async function getForumPosts(): Promise<void> {
    try {
      var newPosts = (await ForumAxios.get(`/forum/${username}/${keyWords}`)).data
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
  async function logOutBut(): Promise<void> {

    // remove jwt
    await ForumAxios.post(`/logout`, {}, {withCredentials: true})

    // remove the access_token stored in local storage
    localStorage.removeItem("access_token");
    Cookies.remove("mode");
    navigate("../login");
  }

  // edit the content of the target comment
  async function editComment(id: number, newContent: string): Promise<void> {
    await ForumAxios.put(`/forum/${username}`, {
      "id": id,
      "type": "comment",
      "content": newContent
    })
    getForumPosts();
  }

  // edit the content of the target comment
  async function editPost(id: number, newTitle: string, newContent: string): Promise<void> {
    await ForumAxios.put(`/forum/${username}`, {
      "id": id,
      "type": "post",
      "title": newTitle,
      "content": newContent
    })
    getForumPosts();
  }

  // update the like of the target item, commentId will be 0 if and only if the item is a post
  async function likeClicked(postId: number, commentId: number, like: number, clicked: boolean): Promise<void>{
    await ForumAxios.patch(`/forum/${username}/${postId}`, {
      "id": commentId,
      "type": commentId === 0 ? "post" : "comment",
      "content": clicked ? "true" : "false",
      "like": like + (clicked ? -1 : 1),
    });
    getForumPosts();
  }

  // add a new post and send it to the backend system
  async function addPost(title: string, content: string): Promise<void> {
    await ForumAxios.post(`/forum/${username}`, {
      "type": "post",
      "title": title,
      "content": content,
    })
    getForumPosts();
  }

  // add a new comment to the post and send it to the backend system
  async function addComment(postId: number, content: string): Promise<void> {
    await ForumAxios.post(`/forum/${username}`, {
      "type": "comment",
      "content": content,
      "postId": postId
    })
    getForumPosts();
  }

  // delete the target item and everything related to it
  async function deleteItem(type: string, id: number): Promise<void> {
    await ForumAxios.delete(`/forum/${username}/${type}/${id}`);
    getForumPosts();
  }

  // control the light and dark mode of the website
  function controlMode() {
    setLight(!isLight);
    Cookies.set("mode", isLight ? 'dark' : 'light', {path: "/"});
  }

  // block the user if there is no cookies
  // check the username parameter in the url and change it to the cookies.username if they do not match
  // else load the forum for the user
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenPayload = JSON.parse(atob(token!.split(".")[1]!));
    tokenUsername = tokenPayload["user"];
    if (!tokenUsername) {
      navigate("../login");
    } else if (username !== tokenUsername) {
      navigate(`../forum/${tokenUsername}`);
    } else {
      getForumPosts();
    }
  }, [username]);

  // get the post according to the keyword
  useEffect(() => {
    if (username !== tokenUsername) return;
    getForumPosts();
  }, [keyWords]);

  return <ThemeProvider theme={webTheme} >
      <CssBaseline>
        <div id="forum-div">

          {/* the navbar of the website */}
          <ForumNavbar 
            username={username}
            keyWords={keyWords}
            isLight={isLight}
            keyWordsOnChange={keyWordsOnChange}
            controlMode={controlMode}
            logOutBut={logOutBut}
            setCreatePost={() => setCreatePost(true)}/>

          {/* text field for user to create Post */}
          <CreatePost submit={addPost}
            showCreatePost={showCreatePost}
            cancelCreatePost={() => setCreatePost(false)}/>

          <div className={"forum-body ".concat(showCreatePost ? "blur" : "")}>
                {/* generate the list of post for the user. */}
                {
                posts.map((post: post) =>
                    <Post 
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        year={post.year}
                        month={post.month}
                        day={post.day}
                        comments={post.comments}
                        like={post.like}
                        clicked={post.clicked}
                        user={post.user}
                        sameUser={post.user === username}
                        isLight={isLight}
                        deleteItem={deleteItem}
                        likeClicked={likeClicked}
                        editPost={editPost}
                        editComment={editComment}
                        submit={addComment}
                    />)
                }
            </div>
          </div>
      </CssBaseline>
    </ThemeProvider>
}

export default Forum;