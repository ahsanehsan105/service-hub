import express from "express";
import {
	login,
	signup,
	verifyOtp,
	resendSignupOtp,
	forgotPassword,
	resetPassword,
	changePassword,
} from "../controllers/authController.js";

const authRoute = express.Router();

// Signup / login / OTP
authRoute.post("/signup", signup);
authRoute.post("/signup/resend-otp", resendSignupOtp);
authRoute.post("/login", login);
authRoute.post("/verify-otp", verifyOtp);

// Forgot / reset password
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);

// Change password (expects email, oldPassword, newPassword)
authRoute.post("/change-password", changePassword);

export default authRoute;
