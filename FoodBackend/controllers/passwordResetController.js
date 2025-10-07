import userModel from "../models/userModal.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

// FORGOT PASSWORD - GENERATE RESET TOKEN AND SEND EMAIL
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password Reset Link:', resetLink);
    
    
    res.json({ 
      success: true, 
      message: "Password reset link created!",
      resetLink: resetLink // Always include for demo
    });

  } catch (error) {
    console.log("Forgot password error:", error);
    res.json({ success: false, message: "Error processing request" });
  }
};

// RESET PASSWORD WITH TOKEN
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user with valid token
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token WITH VALIDATION BYPASS
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false }); // ← FIXED LINE

    res.json({ 
      success: true, 
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.log("Reset password error:", error);
    res.json({ success: false, message: "Error resetting password" });
  }
};

// VERIFY RESET TOKEN (optional - for frontend validation)
const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    res.json({ 
      success: true, 
      message: "Token is valid" 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying token" });
  }
};

// EMAIL SENDING FUNCTION (configure with your email service)
const sendResetEmail = async (email, token) => {
  try {
    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email:", error);
    throw new Error("Failed to send reset email");
  }
};

export { forgotPassword, resetPassword, verifyResetToken };