import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectdeRoute({ children }) {
    const [isAutorized, setisAutorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setisAutorized(false))
    }, [])


    const refershToken = async () => {
        const refershToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refershToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setisAutorized(true)
            } else {
                setisAutorized(false)
            }

        } catch (erorr) {
            f;
            console.log(erorr);
            setisAutorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setisAutorized(false);
            return;
        }
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refershToken();
        } else {
            setisAutorized(true);
        }
    };

    if (isAutorized == null) {
        return <div>Loading...</div>;
    }

    return isAutorized ? children : <Navigate to="/login/" />;
}

export default ProtectdeRoute;
