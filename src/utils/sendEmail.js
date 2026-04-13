const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLeadEmail = async (lead) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `New Broadband Lead — ${lead.fullName} (${lead.businessName})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        
        <div style="background-color: #1976d2; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">📡 New Broadband Enquiry</h1>
        </div>

        <div style="padding: 24px;">
          <h2 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">
            Contact Details
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Full Name</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.fullName}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px 0; color: #666;">Business Name</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.businessName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.email}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px 0; color: #666;">Phone</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Address / Postcode</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.address}</td>
            </tr>
          </table>

          <h2 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px; margin-top: 24px;">
            Current Broadband Details
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Current Provider</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.currentProvider}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px 0; color: #666;">Monthly Payment</td>
              <td style="padding: 8px 0; font-weight: bold;">£${lead.monthlyPayment}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Contract End Date</td>
              <td style="padding: 8px 0; font-weight: bold;">${lead.contractEndDate || "Not specified"}</td>
            </tr>
          </table>

          ${
            lead.notes
              ? `
          <h2 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px; margin-top: 24px;">
            Additional Notes
          </h2>
          <p style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; color: #333;">
            ${lead.notes}
          </p>
          `
              : ""
          }

          <div style="background-color: #e3f2fd; padding: 16px; border-radius: 8px; margin-top: 24px;">
            <p style="margin: 0; color: #1976d2; font-weight: bold;">
              Reference: BB-${lead._id.toString().slice(-5).toUpperCase()}
            </p>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">
              Submitted: ${new Date().toLocaleString("en-GB")}
            </p>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://broadband-frontend.vercel.app/admin" 
               style="background-color: #1976d2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              View in Admin Panel
            </a>
          </div>
        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendLeadEmail;
