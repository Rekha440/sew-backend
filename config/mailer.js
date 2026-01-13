import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') }); // important!



// ✅ Create Yahoo transporter
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.YAHOO_USER,
    pass: process.env.YAHOO_PASS,
  },
});

// ✅ Verify transporter
transporter.verify((err, success) => {
  if (err) {
    console.error('Email transporter error:', err);
  } else {
    console.log('Email transporter ready');
  }
});

export default transporter;
