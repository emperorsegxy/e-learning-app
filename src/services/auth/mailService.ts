import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface SendOtpEmailOptions {
    to: string;
    otp: string;
    user?: {
        firstName?: string;
        lastName?: string;
    };
    purpose?: 'register' | 'forgot-password' | string;
}

export const sendOtpEmail = async ({to, otp, user, purpose = 'register'}: SendOtpEmailOptions) => {
    const fullName = user ? `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim() : 'there';

    const subjectMap: Record<string, string> = {
        'register': '[Action Required] Verify your email',
        'forgot-password': 'Reset your password',
    };

    const messageMap: Record<string, string> = {
        'register': `<p>To complete your registration, please use the OTP below:</p>`,
        'forgot-password': `<p>Looks like you requested to reset your password. Please use the code below to reset the password for your account.</p>`,
    };

    const subject = subjectMap[purpose] || '[Notification] OTP Code';
    const message = messageMap[purpose] || `<p>Use the OTP below:</p>`;

    const mailOptions = {
        from: `"E-learning" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: `<p>Hello ${fullName},</p> 
                ${message}
               <p><strong><h2>${otp}</h2></strong></p>
               <p>This code will expire in 10 minutes.</p>
               <p>${purpose === 'forgot-password' ? 'If you didn’t make this request, please ignore this mail.' : ''}</p>
              `,
    };

    return transporter.sendMail(mailOptions);
};
