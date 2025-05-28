import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to: string,user:any, otp: string) => {
    const mailOptions = {
        from: `"E-learning" <${process.env.EMAIL_USER}>`,
        to,
        subject: '[Action Required] Verify your email',
        html: `<p>Hello ${user.lastName} ${user.firstName},</p>
               <p>To complete your registration, please kindly use the otp below</p>
               <p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    return transporter.sendMail(mailOptions);
};
