import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Forum from './Forum';
import Login from "./Login";
import Home from "./Home";
// import AddForum from "./AddForum";
import ErrorPage from "./ErrorPage";

function App() {

  const [cookies, setCookies, removeCookies] = useCookies(["username"]);
  
  function logInOut(state: boolean, username: string): void {
    if (state) {
      setCookies("username", username, { path: "/" });
    } else {
      removeCookies('username', { path: "/" });
    }
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login logIn={logInOut}/>}/>
      <Route path="/forum/:username" element={<Forum 
        authorised={cookies.username ? true : false} 
        logOut={logInOut}
        username={cookies.username}/>}/>
      <Route path="/*" element={<ErrorPage />}/>
      {/* <Route path="/forum/:username/add" element={<AddForum 
        authorised={isLogIn}/>} /> */}
    </Routes>
  </BrowserRouter>
}

export default App;