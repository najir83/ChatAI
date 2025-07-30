import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, message } = await req.json();
  // console.log(name, email, message);
  if (!name || !email || !message) {
    return new Response("All fields are required", { status: 400 });
  }
  // console.log(process.env.EMAIL_APP_PASSWORD);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD, // Use Gmail App Password if 2FA is ON
    },
  });

  const mailOptions = {
    from: `"ChatAI Contact" <${process.env.EMAIL}>`, 
    to: process.env.EMAIL, // You (the receiver)
    subject: `Contact Form Message from ${name}`,
    text: `You received a new message from ChatAI:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return new Response("Message sent successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to send message", { status: 500 });
  }
}
