import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { googleLogin } from "@/services/auth/Auth";
import type { AppDispatch } from "@/store/Store";
import { setToken } from "@/store/UserSlice";

const Google: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) return;

        const idToken = credentialResponse.credential;

        const resultAction = await dispatch(googleLogin({ idToken }));
        console.log("🔑 Google Login Response:", resultAction);

        if (googleLogin.fulfilled.match(resultAction)) {
            const payload = resultAction.payload;

            const accessToken =
                payload.data?.accessToken || payload.data?.idToken;
            const refreshToken = payload.data?.refreshToken || "";
            const idToken = payload.data?.idToken || "";

            dispatch(setToken({
                accessToken,
                refreshToken,
                idToken
            }));

            console.log("✅ Login successful, token saved:", accessToken);
            navigate("/");
        } else {
            console.log("❌ Login failed or rejected:", resultAction);
        }
    };

    const onError = () => {
        console.log("❌ Google Login Failed");
    };
    const resize = () => (window.innerWidth > 500 ? 400 : 300);

    return (
        <div className="flex justify-center w-full">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                width={resize()}
                text="signin_with"
            />
        </div>
    );
};

export default Google;
