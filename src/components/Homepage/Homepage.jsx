import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
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
    if (loading) return <></>
    return (
        <>Homepage</>
    );
}

export default Homepage;