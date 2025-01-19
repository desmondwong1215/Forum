import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import logo from "../image/forum_icon.png";
import "../Style/home.css"
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {

    let navigate = useNavigate();

    return <Zoom in={true} timeout={800} mountOnEnter>
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">

                {/* first item */}
                <div className="carousel-item active" data-bs-interval="10000">
                    <div className="home-container">
                        <Slide in={true} timeout={1000} mountOnEnter>
                            <div className="logoBox">
                                <h2>ChatterBox</h2>
                                <img src={logo}/>
                            </div>
                        </Slide>
                        <h4>Welcome to Our Community</h4>
                        <Button
                            variant="contained"
                            startIcon={<ForumRoundedIcon />}
                            size="large"
                            onClick={() => navigate("./login")}
                        >
                            Join Us Now
                        </Button>
                    </div>
                </div>

                {/* second item */}
                <div className="carousel-item" data-bs-interval="10000">
                    <div className="text-container home-container">
                        <p>
                            <span className="title">ChatterBox</span> is an interactive web forum designed 
                            to foster open discussions and idea sharing among people from diverse backgrounds. 
                            It's a digital space where users can post topics of interest, engage in lively 
                            conversations, and connect with others who share similar interests or viewpoints.
                            <br/> <br/>
                            Whether you're looking to discuss trending topics, share personal experiences, 
                            or seek advice, Chatterbox provides a welcoming platform for vibrant and 
                            meaningful conversations.
                        </p>
                    </div>
                </div>
                
            </div>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </Zoom>
    
}

export default Home;