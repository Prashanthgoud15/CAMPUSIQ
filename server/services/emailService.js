const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (user) => {
  try {
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7fb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800;">GPCET CampusIQ</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Your Intelligent Academic Hub</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Welcome aboard, ${user.display_name}! 🚀</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We are absolutely thrilled to have you join GPCET CampusIQ. You've just unlocked the ultimate study companion tailored specifically for your academic journey.
          </p>
          
          <div style="background-color: #f3f4f6; border-left: 4px solid #4f46e5; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0; color: #374151; font-weight: 600; font-size: 14px; text-transform: uppercase;">Your Registered Profile</p>
            <ul style="list-style: none; padding: 0; margin: 10px 0 0 0; color: #4b5563;">
              <li style="margin-bottom: 5px;"><strong>Branch:</strong> ${user.branch}</li>
              <li style="margin-bottom: 5px;"><strong>Regulation:</strong> ${user.regulation}</li>
              <li><strong>Current Status:</strong> Year ${user.year}, Semester ${user.semester}</li>
            </ul>
          </div>
          
          <h3 style="color: #111827; font-size: 16px;">Here is what you can do right now:</h3>
          <ul style="color: #4b5563; line-height: 1.6; padding-left: 20px;">
            <li style="margin-bottom: 10px;">📚 <strong>Browse Notes:</strong> Access highly curated study materials for all your subjects.</li>
            <li style="margin-bottom: 10px;">🤖 <strong>Meera AI Tutor:</strong> Chat with our context-aware AI. Try the "Exam Emergency" mode for last-minute prep!</li>
            <li>⚙️ <strong>Update Profile:</strong> Whenever you move to a new semester, just update it in your Settings.</li>
          </ul>
          
          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Get Started Now</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>This is an automated message from GPCET CampusIQ. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} GPCET CampusIQ Team. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"GPCET CampusIQ" <' + process.env.EMAIL_USER + '>',
      to: user.email,
      subject: 'Welcome to GPCET CampusIQ! 🚀',
      html: htmlTemplate
    };

    // Send the email asynchronously without waiting for it to finish
    // so we don't slow down the user's registration process
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending welcome email to:', user.email, error.message);
      } else {
        console.log('Welcome email sent successfully to:', user.email);
      }
    });

  } catch (error) {
    console.error('Email setup error:', error);
  }
};

module.exports = { sendWelcomeEmail };
