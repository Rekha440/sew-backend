import express from 'express';
import ContactInquiry from '../models/ContactInquiry.js';
import transporter from '../config/mailer.js';

const router = express.Router();

// ===================== POST INQUIRY =====================
router.post('/inquiries', async (req, res) => {
  try {
    const { name, email, phone, company, product_interest, message } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // ✅ Save inquiry to MongoDB
    const newInquiry = new ContactInquiry({
      name,
      email,
      phone,
      company: company || '',
      product_interest: product_interest || '',
      message,
    });

    await newInquiry.save();

    // ================= SEND ADMIN EMAIL =================
    try {
      await transporter.sendMail({
        from: `"Website Contact Form" <${process.env.YAHOO_USER}>`,
        to: process.env.YAHOO_USER,
        subject: `New Inquiry from ${name}`,
        text: `
New Contact Inquiry Received

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || '-'}
Product Interest: ${product_interest || '-'}
Message:
${message}
        `,
      });
    } catch (adminErr) {
      console.error('Admin email send error:', adminErr);
    }

    // ================= SEND USER CONFIRMATION EMAIL =================
    try {
      await transporter.sendMail({
        from: `"Santosh Engineering Works" <${process.env.YAHOO_USER}>`,
        to: email,
        subject: 'We received your inquiry',
        text: `Hi ${name},

Thank you for contacting Santosh Engineering Works.
We have received your inquiry and our team will contact you shortly.

Regards,
Santosh Engineering Works
(+91 9810213744)
        `,
      });
    } catch (userErr) {
      console.error('User confirmation email send error:', userErr);
    }

    // ✅ Respond success
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit inquiry',
    });
  }
});

// ===================== GET INQUIRIES =====================
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Fetch inquiry error:', error);
    res.status(500).json({ success: false });
  }
});

export default router;
