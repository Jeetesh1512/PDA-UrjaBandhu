const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

const sendNotificationEmail = async(to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try{
        const info = await transporter.sendMail(mailOptions);
        console.log("Notification email sent to: ",to);
        return info;
    }
    catch(error){
        console.error("Error sending email: ",error);
        return null;
    }
}

module.exports = {sendNotificationEmail};