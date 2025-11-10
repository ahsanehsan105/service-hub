import express from "express";
import User from "../models/authModel.js";
import { hashPassword, comparePassword } from "../helper/auth.js";
import nodemailer from "nodemailer";
import { z } from "zod";
import jwt from "jsonwebtoken";
const router = express.Router();

// Validation schemas
const signupSchema = z.object({
    fullName: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    
    email: z.string()
        .email("Please enter a valid email address"),
    
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one capital letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)"),
    
    role: z.enum(["user", "worker"], {
        errorMap: () => ({ message: "Role must be either 'user' or 'worker'" })
    })
});

// Password validation schema reused for reset/change flows
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)");


// Nodemailer transporter (configure with env vars)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === "true" : true,
    auth: {
        user: process.env.EMAIL_USER || "ahsanehsan00@gmail.com",
        pass: process.env.EMAIL_PASS || "ivkv niyo ncme jlif",
    },
});

// Verify transporter at startup (non-blocking) to give early feedback in logs
transporter.verify()
    .then(() => console.log("SMTP transporter verified — ready to send mail"))
    .catch((err) => console.error("SMTP transporter verification failed:", err && err.message ? err.message : err));

// Pretty OTP email template generator (returns { subject, text, html })
const generateOtpEmail = (otp, purpose = "Verification") => {
        const appName = process.env.APP_NAME || "ServiceHub";
        const subject = purpose === "Reset" ? `${appName} — Password reset code` : `${appName} — Your verification code`;
        const text = `Your ${purpose.toLowerCase()} code is: ${otp}\n\nIf you didn't request this, please ignore this email.`;

        // Allow overriding the accent gradient via env vars to match site theme
        const gradientFrom = process.env.EMAIL_GRADIENT_FROM || '#06b6d4';
        const gradientTo = process.env.EMAIL_GRADIENT_TO || '#7c3aed';

        const html = `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <title>${subject}</title>
            </head>
            <body style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
                                <tr>
                                    <td style="background:#ffffff;border-radius:14px;padding:32px;border:1px solid #e6e9ee;box-shadow:0 10px 30px rgba(17,24,39,0.06);">
                                        <div style="text-align:center;margin-bottom:8px">
                                            <h1 style="margin:0;font-size:20px;color:#0f172a">${appName}</h1>
                                            <p style="margin:6px 0 0;color:#475569">${purpose} code to continue</p>
                                        </div>

                                        <!-- Centered OTP box -->
                                        <div style="display:flex;align-items:center;justify-content:center;padding:20px 0">
                                            <div style="border-radius:12px;padding:6px;background:linear-gradient(90deg, ${gradientFrom}, ${gradientTo});">
                                                <div style="background:#fff;border-radius:8px;padding:18px 28px;min-width:220px;text-align:center;box-shadow:0 6px 18px rgba(2,6,23,0.08);">
                                                    <div style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono',monospace;font-size:30px;letter-spacing:6px;color:#0f172a;font-weight:700">${otp}</div>
                                                    <div style="margin-top:8px;font-size:12px;color:#64748b">Valid for 10 minutes</div>
                                                </div>
                                            </div>
                                        </div>

                                        <p style="color:#475569;font-size:14px;line-height:1.6;margin-top:18px;text-align:center">Use this code to ${purpose.toLowerCase()} your ${appName} account. The code will expire in 10 minutes. If you did not request this, you can safely ignore this message.</p>

                                        <div style="margin-top:22px;padding-top:18px;border-top:1px solid #eef2f7;text-align:center;color:#94a3b8;font-size:12px">
                                            © ${new Date().getFullYear()} ${appName}. All rights reserved.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>`;
        return { subject, text, html };
}

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const signToken = (user) => {
    const payload = { id: user._id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET || "dev_jwt_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    return jwt.sign(payload, secret, { expiresIn });
};

// In-memory store for pending signups: { email -> { fullName, email, password, role, otp, otpExpiry } }
// Note: this is ephemeral (lost on server restart). For production, use a persistent store (Redis, DB table).
const pendingUsers = new Map();

export const signup = async (req, res) => {
    try {
        // Validate request body against schema
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error.issues[0].message
            });
        }

        const { fullName, email, password, role } = validationResult.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "An account with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate 4-digit OTP and expiry (10 minutes)
        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes (ms)

        // Prevent duplicate pending signup for same email
        if (pendingUsers.has(email)) {
            return res.status(400).json({ error: "A signup is already pending for this email. Please verify the OTP or request a new one." });
        }

        // Store signup data in-memory until OTP is verified
        pendingUsers.set(email, {
            fullName,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpiry
        });

        // Send OTP email (best-effort) and log/send minimal debug info
        let emailSent = false;
        let mailMessageId = null;
        try {
            const tpl = generateOtpEmail(otp, "Verification")
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: tpl.subject,
                text: tpl.text,
                html: tpl.html,
            };

            const info = await transporter.sendMail(mailOptions);
            emailSent = true;
            mailMessageId = info && info.messageId ? info.messageId : null;
            console.log(`OTP email sent to ${email} messageId=${mailMessageId}`);
        } catch (mailErr) {
            console.error("Error sending OTP email:", mailErr && mailErr.message ? mailErr.message : mailErr);
            // Do not delete pending user; allow resend
        }

        // Return whether we successfully handed the message off to SMTP (emailSent) and an optional messageId
        res.status(200).json({
            success: true,
            message: "OTP generated.",
            emailSent,
            messageId: mailMessageId,
            note: emailSent ? "Check spam/junk if not in inbox." : "SMTP send failed — check server logs and SMTP credentials."
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            error: "Error in signup. Please try again."
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`Verifying OTP for ${email}: provided=${otp}`);

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const pending = pendingUsers.get(email);
        // Debug: log limited pending info to help diagnose 400s without leaking passwords
        if (pending) {
            console.log(`pendingUsers entry for ${email}: otp=${pending.otp ? '[SET]' : '[NONE]'} expiry=${pending.otpExpiry}`);
        } else {
            console.log(`No pendingUsers entry for ${email}. pendingUsers size=${pendingUsers.size}`);
        }
        if (!pending) {
            return res.status(400).json({ error: "No pending signup found for this email. Please signup first." });
        }


        if (Date.now() > Number(pending.otpExpiry)) {
            pendingUsers.delete(email);
            return res.status(400).json({ error: "OTP expired. Please signup again to receive a new code." });
        }

        if (pending.otp !== String(otp).trim()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Before creating, ensure no existing user (race condition check)
        const existingUser = await User.findOne({ email: pending.email });
        if (existingUser) {
            pendingUsers.delete(email);
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        // Create user in DB with an optional username derived from email
        const username = pending.username || pending.email.split('@')[0];
        const newUser = new User({
            fullName: pending.fullName,
            email: pending.email,
            password: pending.password,
            role: pending.role,
            username: username
        });

        try {
            await newUser.save();
        } catch (saveErr) {
            console.error("Error saving new user in verifyOtp:", saveErr && saveErr.message ? saveErr.message : saveErr);
            // Attach validation details when available
            const msg = (saveErr && saveErr.errors) ? Object.values(saveErr.errors).map(e => e.message).join(", ") : (saveErr.message || "Failed to create user");
            // Clean up pending entry to avoid stuck state if creation failed due to conflict
            pendingUsers.delete(email);
            return res.status(400).json({ error: msg });
        }

        pendingUsers.delete(email);

        // Sign JWT and return user + token so frontend can use it immediately
        const token = signToken(newUser);
        const userPayload = {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
        };

        return res.status(201).json({ success: true, message: "Account created and verified successfully", user: userPayload, token });
    } catch (error) {
        console.error("verifyOtp error:", error && error.stack ? error.stack : error);
        return res.status(500).json({ error: error && error.message ? error.message : "Error verifying OTP" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        // (No verification check here — users are only created after OTP verification)

        // Check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        // Sign JWT and return user + token
        const token = signToken(user);
        const userPayload = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userPayload,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Error in login. Please try again."
        });
    }
};

// Resend OTP for pending signup
export const resendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const pending = pendingUsers.get(email);
        if (!pending) return res.status(400).json({ error: "No pending signup for this email" });

        // generate new otp and expiry
        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        pending.otp = otp;
        pending.otpExpiry = otpExpiry;
        pendingUsers.set(email, pending);

        let emailSent = false;
        try {
            const tpl = generateOtpEmail(otp, "Verification")
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: tpl.subject,
                text: tpl.text,
                html: tpl.html,
            });
            emailSent = true;
        } catch (err) {
            console.error("Error resending OTP email:", err && err.message ? err.message : err);
        }

        return res.status(200).json({ success: true, emailSent });
    } catch (err) {
        console.error("resendSignupOtp error:", err);
        return res.status(500).json({ error: "Error resending OTP" });
    }
};

// Forgot password: send OTP to registered email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();

        let emailSent = false;
        try {
            const tpl = generateOtpEmail(otp, "Reset")
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: tpl.subject,
                text: tpl.text,
                html: tpl.html,
            });
            emailSent = true;
        } catch (err) {
            console.error("Error sending reset OTP email:", err && err.message ? err.message : err);
        }

        return res.status(200).json({ success: true, emailSent });
    } catch (err) {
        console.error("forgotPassword error:", err);
        return res.status(500).json({ error: "Error processing forgot password" });
    }
};

// Reset password: verify OTP and set new password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ error: "Email, OTP and newPassword are required" });

        const pwdResult = passwordSchema.safeParse(newPassword);
        if (!pwdResult.success) return res.status(400).json({ error: pwdResult.error.issues[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        if (!user.resetOtp || !user.resetOtpExpiry) return res.status(400).json({ error: "No reset requested for this user" });

        if (Date.now() > Number(user.resetOtpExpiry)) {
            user.resetOtp = null;
            user.resetOtpExpiry = null;
            await user.save();
            return res.status(400).json({ error: "OTP expired. Please request a new reset code." });
        }

        if (String(user.resetOtp).trim() !== String(otp).trim()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        user.password = await hashPassword(newPassword);
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ error: "Error resetting password" });
    }
};

// Change password when user knows current password
export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) return res.status(400).json({ error: "Email, oldPassword and newPassword are required" });

        const pwdResult = passwordSchema.safeParse(newPassword);
        if (!pwdResult.success) return res.status(400).json({ error: pwdResult.error.issues[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

        user.password = await hashPassword(newPassword);
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.error("changePassword error:", err);
        return res.status(500).json({ error: "Error changing password" });
    }
};

export default router;