import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false
        },
        avatar: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" }
        },
        role: {
            type: String,
            enum: ["CUSTOMER", "ADMIN"],
            default: "CUSTOMER"
        },
        refreshToken: {
            type: String,
            select: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User', userSchema);