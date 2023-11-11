import { Avatar, Button, Grid, Menu, MenuItem } from "@mui/material";
import { useState, useEffect } from 'react';
import "./landingPage.css";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (localStorage.getItem("user")) {
            async function checkLoggedIn() {
                setLoading(true);
                const res = await axios({
                    url: "https://jwt-nodejs-server-test.onrender.com/v1/auth/logged-in",
                    method: "POST",
                    withCredentials: true,
                    headers: {
                        token: `Bearer ${JSON.parse(localStorage.getItem("user"))['accessToken']}`
                    }
                });
                return res;
            }
            checkLoggedIn().then(res => {
                if (res.data === "Logged in") navigate("/home");
            })
                .catch(err => {
                    localStorage.removeItem("user");
                    setLoading(false);
                });
        }
        else {
            setLoading(false);
        }
    }, [navigate]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickSignInPage = () => {
        navigate("/login");
    }
    const handleClickSignUpPage = () => {
        navigate("/sign-up");
    }
    if (loading) return <></>
    return (
        <Grid className="landing-page-container" container flexDirection={"column"} justifyContent={"space-between"}>
            <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} rowGap={2} marginBottom={2}>
                <Grid item>
                    <Grid container flexDirection={"row"} alignItems={"center"}>
                        <Avatar alt="Ashir Creatives" src="https://jwt-nodejs-server-test.onrender.com/logo.png" />
                        <span className="brandText" style={{ fontWeight: "600" }}>Ashir Creatives</span>
                        <div className="menu-icon">
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <MenuOutlinedIcon style={{ backgroundColor: "#fff3e5", color: "black" }} />
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Home</MenuItem>
                                <MenuItem onClick={handleClose}>Careers</MenuItem>
                                <MenuItem onClick={handleClose}>Blog</MenuItem>
                                <MenuItem onClick={handleClose}>About Us</MenuItem>
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container flexDirection={"row"} alignItems={"center"}>
                        <span className="Home" style={{ userSelect: "none", cursor: "pointer", transition: "all 0.2s linear" }}>Home</span>
                        <span className="Careers" style={{ userSelect: "none", cursor: "pointer", transition: "all 0.2s linear" }}>Careers</span>
                        <span className="Blog" style={{ userSelect: "none", cursor: "pointer", transition: "all 0.2s linear" }}>Blog</span>
                        <span className="AboutUs" style={{ userSelect: "none", cursor: "pointer", transition: "all 0.2s linear" }}>About Us</span>
                        <Button style={{ color: "black", margin: "0 10px", backgroundColor: "white", borderRadius: "20px" }} variant="contained" onClick={handleClickSignInPage}>Sign In</Button>
                        <Button style={{ color: "white", margin: "0 10px", backgroundColor: "#f38b06", borderRadius: "20px" }} variant="contained" onClick={handleClickSignUpPage}>Sign Up</Button>
                    </Grid>
                </Grid>
            </Grid>
            <div className="landing-page-body">
                <div className="landing-page-body-left">
                    <p className="paragraph1">It's Now Easier To</p>
                    <p className="paragraph2">Study Online</p>
                    <p className="paragraph3">We are interesting platform that will teach you more in an interactive way</p>
                    <div className="getting-started-watch-how">
                        <div className="getting-started">Get Started</div>
                        <div className="watch-how">
                            <div className="watch-icon">
                                <div className="watch-icon-triangle"></div>
                            </div>
                            <span>Watch how it works</span>
                        </div>
                    </div>
                </div>
                <div className="landing-page-body-right">
                    <img src="https://jwt-nodejs-server-test.onrender.com/education.webp" alt="" />
                </div>
            </div>
        </Grid>
    );
}

export default LandingPage;