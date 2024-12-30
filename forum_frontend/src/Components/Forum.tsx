import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import Input from './Input';
import { comment, post, likedItem } from "../lib/dataTypes"

let forumPosts: post[] = [
  {
    id: 0,
    title: "title1",
    comments: [
      {
        id: 0,
        content: "content1",
        like: 1,
        clicked: false,
        user: "qwe",
      },
      {
        id: 1,
        content: "content2",
        like: 1,
        clicked: false,
        user: "qwe",
      }
    ],
    like: 1,
    clicked: false,
    user: "des",
  },
  {
    id: 1,
    title: "title2",
    comments: [
      {
        id: 0,
        content: "content1",
        like: 1,
        clicked: false,
        user: "des",
      },
      {
        id: 1,
        content: "content2",
        like: 1,
        clicked: false,
        user: "des",
      }
    ],
    like: 1,
    clicked: false,
    user: "qwe",
  },
];

let likedItems: likedItem[] = [
  {
    type: "post",
    user: "des",
    postId: 1,
    commentId: undefined,
  },
  {
    type: "comment",
    user: "des",
    postId: 1,
    commentId: 0,
  },
];

function Forum(props: any) {

  const [posts, setPosts] = useState<post []>([]);
  let navigate = useNavigate();
  let { username } = useParams();

  function LogOutBut(): void {
    props.logOut(false, "");
    navigate("../login");
  }

  function updatePosts(newPosts: post[]): post[] {
    newPosts.forEach((post: post) => {
      post.clicked = false;
      post.comments.forEach((comment: comment) => {
        comment.clicked = false;
      });
    });
    likedItems.forEach((item) => {
      if (item.user === username) {
        if (item.type === "post") {
          newPosts.forEach((post: post) => {
            if (post.id === item.postId) {
              post.clicked = true;
            }
          });
        } else {
          newPosts.forEach((post: post) => {
            if (post.id === item.postId) {
              post.comments.forEach((comment: comment) => {
                if (comment.id === item.commentId) {
                  comment.clicked = true;
                }
              });
            }
          });
        } 
      }
    });
    return newPosts;
  }

  function postLikeClicked(postId: number): void{
    let newLikedItems: likedItem[] = likedItems.filter((item: likedItem) => 
      item.user !== username || item.postId !== postId);
    let post: post = posts.filter((post: post) => post.id === postId)[0];
    if (newLikedItems.length != likedItems.length) {
      post.clicked = false;
      post.like -= 1;
    } else {
      post.clicked = true;
      post.like += 1;
      let newItem: likedItem = {
        type: "post",
        user: username,
        postId: postId,
        commentId: undefined,
      };
      newLikedItems.push(newItem);
    }
    likedItems = newLikedItems;
    setPosts([...posts]);
  }

  function commentLikeClicked(postId: number, commentId: number): void {
    let newLikedItems: likedItem[] = likedItems.filter((item: likedItem) => 
      item.user !== username || item.postId !== postId || item.commentId !== commentId);4
    let post: post = posts.filter((post: post) => post.id === postId)[0];
    if (newLikedItems.length != likedItems.length) {
      post.comments[commentId].clicked = false;
      post.comments[commentId].like -= 1;
    } else {
      post.comments[commentId].clicked = true;
      post.comments[commentId].like += 1;
      let newItem: likedItem = {
        type: "comment",
        user: username,
        postId: postId,
        commentId: commentId,
      };
      newLikedItems.push(newItem);
    }
    likedItems = newLikedItems;
    setPosts([...posts]);
  }

  function addPost(content: string): void {
    setPosts((prev: post[]) => {
      let newPost: post = {
        id: prev[prev.length - 1].id + 1,
        title: content,
        comments: [],
        like: 0,
        clicked: false,
        user: username,
      };
      posts.push(newPost);
      return [...posts];
    })
  }

  function addComment(postId: number, content: string): void {
    setPosts((prev: post[]) => {
      let post: post = prev.filter((post: post) => post.id === postId)[0];
      let comments: comment[] = post.comments;
      let newComment: comment = {
        id: comments.length === 0 ? 0 : comments[comments.length - 1].id + 1,
        content: content,
        like: 0,
        clicked: false,
        user: username,
      }
      post.comments = [...comments, newComment];
      return [...prev];
    });
  }

  function wantDelete(postId: number): void {
    forumPosts = forumPosts.filter((post: post) => post.id !== postId);
    setPosts(forumPosts);
  }

  useEffect(() => {
    if (username !== props.username) {
      navigate(`../forum/${props.username}`);
    }
    let updatedPosts = updatePosts(forumPosts);
    setPosts(updatedPosts);
  }, []);

  return props.authorised ? 
    <div>
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
            wantDelete={wantDelete}
            postLikeClicked={postLikeClicked}
            commentLikeClicked={commentLikeClicked}
            submit={addComment}
        />)
        }
        <button onClick={LogOutBut}>Log Out</button>
        {/* <button onClick={() => navigate("./add", {state: {submit: addPost}})}>Add Post</button> */}
    </div>
    : <Navigate to="../login" />
    
}

export default Forum;