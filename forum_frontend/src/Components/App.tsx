import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blueGrey } from '@mui/material/colors';
import Forum from './Forum';
import Login from "./Login";
import Home from "./Home";
import ErrorPage from "./ErrorPage";

function App() {

  const webTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: blueGrey,
    },
  });

  return <ThemeProvider theme={webTheme}>
    <CssBaseline>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/forum/:username" element={<Forum />} />
          <Route path="/*" element={<ErrorPage />}/>
        </Routes>
      </BrowserRouter>
    </CssBaseline>
  </ThemeProvider>
  
}

export default App;