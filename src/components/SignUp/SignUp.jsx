import { Avatar, Grid, Paper, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, Button, Typography } from "@mui/material";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import "./signUp.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [admin, setAdmin] = useState("false");
    const [usernameErrorState, setUsernameErrorState] = useState(false);
    const [passwordErrorState, setPasswordErrorState] = useState(false);
    const [emailErrorState, setEmailErrorState] = useState(false);
    const [confirmPasswordErrorState, setConfirmPasswordErrorState] = useState(false);
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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
    const signUpIconStyles = {
        backgroundColor: "#1bbd7e"
    }
    const handleClickSignUp = () => {
        if (username === "") {
            setUsernameErrorState(true);
            setUsernameErrorMsg("Required");
        }
        if (password === "") {
            setPasswordErrorState(true);
            setPasswordErrorMsg("Required");
        }
        if (email === "") {
            setEmailErrorState(true);
            setEmailErrorMsg("Required");
        }
        if (confirmPassword === "") {
            setConfirmPasswordErrorState(true);
            setConfirmPasswordErrorMsg("Required");
        }
        if (username !== "" && password !== "" && email !== "" && confirmPassword !== "" && !usernameErrorState && !passwordErrorState && !emailErrorState && !confirmPasswordErrorState) {
            const newUser = {
                username,
                password,
                email,
                admin
            };
            async function register() {
                const res = await axios({
                    url: "https://jwt-nodejs-server-test.onrender.com/v1/auth/register",
                    method: "POST",
                    data: newUser,
                    withCredentials: true
                });
                return res;
            }
            register().then(res => {
                alert(res.data);
                navigate("/login");
            })
                .catch(err => alert(err.response.data));
        }
    }
    if (loading) return <></>
    return (
        <Grid container justifyContent={"center"}>
            <Grid item xs={12} sm={8} md={4} className="signUp-container" style={{ marginTop: "20px" }}>
                <Paper elevation={10} className="signUp-form">
                    <Grid container direction={"column"} alignItems={"center"}>
                        <Avatar style={signUpIconStyles}><AppRegistrationOutlinedIcon /></Avatar>
                        <h2 className="signUp-title">Sign Up</h2>
                    </Grid>
                    <TextField error={usernameErrorState} helperText={usernameErrorMsg} style={{ marginTop: "16px" }} label="Username" variant="standard" fullWidth placeholder="Enter username" spellCheck="false" autoComplete="off" required value={username} onChange={e => {
                        setUsername(e.target.value);
                        if (e.target.value === "") {
                            setUsernameErrorState(true);
                            setUsernameErrorMsg("Required");
                        }
                        else {
                            const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
                            if (usernameRegex.test(e.target.value) === false) {
                                setUsernameErrorState(true);
                                setUsernameErrorMsg("The username must have a minimum length of 6 characters, including: letters, numbers, and _");
                            }
                            else {
                                setUsernameErrorState(false);
                                setUsernameErrorMsg("");
                            }
                        }
                    }} />
                    <TextField error={emailErrorState} helperText={emailErrorMsg} style={{ margin: "16px 0" }} label="Email" variant="standard" fullWidth placeholder="Enter email" spellCheck="false" autoComplete="none" required value={email} onChange={e => {
                        setEmail(e.target.value);
                        if (e.target.value === "") {
                            setEmailErrorState(true);
                            setEmailErrorMsg("Required");
                        }
                        else {
                            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                            if (emailRegex.test(e.target.value) === false) {
                                setEmailErrorState(true);
                                setEmailErrorMsg("The email is not valid");
                            }
                            else {
                                setEmailErrorState(false);
                                setEmailErrorMsg("");
                            }
                        }
                    }} />
                    <FormLabel id="demo-controlled-radio-buttons-group">Role</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={admin}
                        onChange={e => setAdmin(e.target.value)}
                    >
                        <FormControlLabel value="false" control={<Radio />} label="User" />
                        <FormControlLabel value="true" control={<Radio />} label="Admin" />
                    </RadioGroup>
                    <TextField error={passwordErrorState} helperText={passwordErrorMsg} label="Password" variant="standard" fullWidth placeholder="Enter password" autoComplete="off" required type="password" value={password} onChange={e => {
                        setPassword(e.target.value);
                        if (e.target.value === "") {
                            setPasswordErrorState(true);
                            setPasswordErrorMsg("Required");
                        }
                        else {
                            const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$/;
                            if (passwordRegex.test(e.target.value) === false) {
                                setPasswordErrorState(true);
                                setPasswordErrorMsg("The password must: at least one digit [0-9], at least one lowercase character [a-z], at least one uppercase character [A-Z], at least one special character [!@#$%^&*], at least 8 characters in length, but no more than 32.");
                            }
                            else {
                                setPasswordErrorState(false);
                                setPasswordErrorMsg("");
                            }
                        }
                    }} />
                    <TextField error={confirmPasswordErrorState} helperText={confirmPasswordErrorMsg} style={{ marginTop: "16px" }} label="Confirm password" variant="standard" fullWidth placeholder="Enter confirm password" autoComplete="off" required type="password" value={confirmPassword} onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value === "") {
                            setConfirmPasswordErrorState(true);
                            setConfirmPasswordErrorMsg("Required");
                        }
                        else {
                            if (e.target.value !== password) {
                                setConfirmPasswordErrorState(true);
                                setConfirmPasswordErrorMsg("The confirm password does not match");
                            }
                            else {
                                setConfirmPasswordErrorState(false);
                                setConfirmPasswordErrorMsg("");
                            }
                        }
                    }} />
                    <Button style={{ marginTop: "16px" }} color="success" type="submit" variant="contained" fullWidth onClick={handleClickSignUp}>Sign up</Button>
                    <Typography style={{ marginTop: "16px" }}>
                        <span className="have-an-account">Already have an account? </span><span className="login-now" onClick={e => navigate("/login")}>Login now</span>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default SignUp;