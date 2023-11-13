import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./homepage.css";
import { Grid, Avatar, Box, Tooltip, IconButton, Menu, MenuItem, Divider, ListItemIcon, Typography } from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import socketIOClient from "socket.io-client";
const Homepage = () => {
    const socketRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
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
                if (res.data === "Logged in") setLoading(false);
            })
                .catch(err => {
                    localStorage.removeItem("user");
                    navigate("/login");
                });
        }
        else {
            navigate("/login");
        }
    }, [navigate]);
    useEffect(() => {
        socketRef.current = socketIOClient.connect("https://jwt-nodejs-server-test.onrender.com");
        if (localStorage.getItem("user")) {
            socketRef.current.emit('setOnlineUser', JSON.parse(localStorage.getItem("user"))['username']);
            socketRef.current.emit('sendDataClient');
            socketRef.current.on("SendDataServer", data => {
                setUsers(prev => {
                    const rows = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].admin === true) rows.push(createData(data[i].userId, `${data[i].username}`, `${data[i].email}`, 'admin', `${data[i].status}`));
                        else rows.push(createData(data[i].userId, `${data[i].username}`, `${data[i].email}`, 'user', `${data[i].status}`));
                    }
                    return rows;
                });
            });
        }
        return () => {
            socketRef.current.disconnect();
        }
    }, []);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    if (loading) return <></>
    return (
        <div className="homepage-container">
            <Grid container justifyContent={"space-between"} alignItems={"center"} marginBottom={10} flexDirection={"row"}>
                <Grid item>
                    <Grid container justifyContent={"space-between"} alignItems={"center"} flexDirection={"row"}>
                        <Avatar alt="Ashir Creatives" src="https://jwt-nodejs-server-test.onrender.com/logo.PNG" />
                        <span className="brandText" style={{ fontWeight: "600" }}>Ashir Creatives</span>
                    </Grid>
                </Grid>
                <Grid item >
                    <Grid container justifyContent={"space-between"} alignItems={"center"} flexDirection={"row"}>
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Typography style={{ userSelect: "none" }} sx={{ minWidth: 100 }}>Hi, {JSON.parse(localStorage.getItem("user"))['username']}!</Typography>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Account Settings
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">userId</StyledTableCell>
                            <StyledTableCell align="left">username</StyledTableCell>
                            <StyledTableCell align="left">email</StyledTableCell>
                            <StyledTableCell align="left">role</StyledTableCell>
                            <StyledTableCell align="left">status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell align="left">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.calories}</StyledTableCell>
                                <StyledTableCell align="left">{row.fat}</StyledTableCell>
                                <StyledTableCell align="left">{row.carbs}</StyledTableCell>
                                <StyledTableCell align="left">{row.protein}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Homepage;




