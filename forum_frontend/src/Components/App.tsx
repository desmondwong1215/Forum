import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Forum from './Forum';
import Login from "./Login";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
import './App.css';


function App() {
  return<BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/forum/:username" element={<Forum />} />
      <Route path="/*" element={<ErrorPage />}/>
    </Routes>
  </BrowserRouter>
}

export default App;