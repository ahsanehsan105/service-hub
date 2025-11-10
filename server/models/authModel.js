import { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters"],
        maxlength: [50, "Full name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            "Please enter a valid email address"
        ]
    },
    username: {
        type: String,
        default: null,  // Default to null, will be set in controller if not provided
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: {
            values: ["user", "worker"],
            message: "Role must be either 'user' or 'worker'"
        }
    },
    // OTP fields for password reset (used by forgot/reset password flows)
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpiry: {
        type: Number,
        default: null
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Prevent returning password in queries
userSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password'];
        // hide sensitive reset OTP fields when serializing
        if (ret.resetOtp) delete ret.resetOtp;
        if (ret.resetOtpExpiry) delete ret.resetOtpExpiry;
        return ret;
    }
});

const Auth = model("User", userSchema);
export default Auth;
