import "./login.css";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErrorState, setUsernameErrorState] = useState(false);
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [passwordErrorState, setPasswordErrorState] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
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
    const loginLockStyles = {
        backgroundColor: "#1bbd7e"
    }
    const loginUsernameStyles = {
        marginTop: "16px"
    }
    const loginPasswordStyles = {
        marginTop: "16px"
    }
    const loginSubmitBtn = {
        marginTop: "16px"
    }
    const handleSubmitLogin = () => {
        if (username === "") {
            setUsernameErrorState(true);
            setUsernameErrorMsg("Required");
        }
        if (password === "") {
            setPasswordErrorState(true);
            setPasswordErrorMsg("Required");
        }
        if (username !== "" && password !== "") {
            async function login() {
                const res = await axios({
                    url: "https://jwt-nodejs-server-test.onrender.com/v1/auth/login",
                    method: "POST",
                    data: {
                        username,
                        password
                    },
                    withCredentials: true
                });
                return res;
            }
            login().then(res => {
                navigate("/home");
                localStorage.setItem("user", JSON.stringify(res.data));
            })
                .catch(err => alert(err.response.data));
        }
    }
    if (loading) return <></>
    return (
        <Grid container justifyContent={"center"} direction={"row"}>
            <Grid item xs={12} sm={8} md={4} className="login-container" style={{ marginTop: "20px" }}>
                <Paper elevation={10} className="login-form">
                    <Grid container alignItems={"center"} flexDirection={"column"}>
                        <Avatar style={loginLockStyles}><LockOutlinedIcon /></Avatar>
                        <h2 className="login-title">Sign In</h2>
                    </Grid>
                    <TextField error={usernameErrorState} helperText={usernameErrorMsg} style={loginUsernameStyles} label="Username" placeholder="Enter username" variant="standard" autoComplete="off" required fullWidth spellCheck="false" value={username} onChange={e => {
                        setUsername(e.target.value);
                        if (e.target.value !== "") {
                            setUsernameErrorState(false);
                            setUsernameErrorMsg("");
                        }
                        else {
                            setUsernameErrorState(true);
                            setUsernameErrorMsg("Required");
                        }
                    }} />
                    <TextField error={passwordErrorState} helperText={passwordErrorMsg} style={loginPasswordStyles} type="password" label="Password" placeholder="Enter username" autoComplete="off" variant="standard" required fullWidth value={password} onChange={e => {
                        setPassword(e.target.value);
                        if (e.target.value !== "") {
                            setPasswordErrorState(false);
                            setPasswordErrorMsg("");
                        }
                        else {
                            setPasswordErrorState(true);
                            setPasswordErrorMsg("Required");
                        }
                    }} />
                    <Button style={loginSubmitBtn} color="success" type="submit" variant="contained" fullWidth onClick={handleSubmitLogin}>Sign in</Button>
                    <Typography style={{ marginTop: "16px" }}>
                        <span className="not-registered">Not registered? </span><span className="create-account" onClick={e => navigate("/sign-up")}>Create an account</span>
                    </Typography>
                    <Grid container marginTop={4} justifyContent={"center"} alignItems={"center"}>
                        <Avatar style={{ backgroundColor: "#1bbd7e" }}><UndoOutlinedIcon /></Avatar>
                        <span className="back-to-landing-page" onClick={e => navigate("/landing")}>Back to landing page</span>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Login;