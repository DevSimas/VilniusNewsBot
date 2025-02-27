const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Creates a Nodemailer transporter using environment variables.
 * @returns {nodemailer.Transporter} Configured transporter.
 */
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

/**
 * Sends an email with new articles.
 * @param {Array<{pid: string, title: string, link: string}>} articles - list of new articles.
 * @returns {Promise<void>}
 */
async function sendArticlesEmail(articles) {
    if (articles.length === 0) return;

    const transporter = createTransporter();

    const emailBody = articles
        .map((article) => `<p><a href='${article.link}'>${article.title}</a></p>`)
        .join('');

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.EMAIL_TO,
        subject: `📰 ${articles.length} new articles found!`,
        html: `<h2>Here are the latest articles:</h2>${emailBody}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Articles email sent successfully!`);
    } catch (error) {
        console.error('❌ Failed to send articles email:', error);
    }
}

/**
 * Sends an error mail to the administrator.
 * @param {Error} error - The error to report.
 * @returns {Promise<void>}
 */

async function sendErrorEmail(error) {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 VilniusNewsBot Error Report`,
        text: `An error occurred: ${error.message}\n\nStack trace:\n${error.stack}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Error report email sent!`);
    } catch (error) {
        console.error('❌ Failed to send error report email:', error);
    }
}

module.exports = { sendArticlesEmail, sendErrorEmail };