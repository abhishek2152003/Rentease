import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `RentEase <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #1D3557; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">RentEase Verification</h1>
                </div>
                <div style="padding: 30px; color: #1D3557;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Thank you for registering with RentEase. To complete your registration, please use the following One-Time Password (OTP):</p>
                    <div style="background-color: #FAFAFA; border: 1px dashed #00A896; border-radius: 5px; padding: 20px; text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 32px; font-weight: bold; color: #00A896; letter-spacing: 5px;">${options.otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #666666;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
                <div style="background-color: #FAFAFA; color: #999999; padding: 20px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">&copy; 2026 RentEase Furniture Rental. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
