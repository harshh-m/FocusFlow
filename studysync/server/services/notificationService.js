import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const secure = process.env.EMAIL_SECURE === "true";

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const getDefaultFrom = () => {
  return process.env.EMAIL_FROM || `FocusFlow <${process.env.EMAIL_USER || "no-reply@focusflow.app"}>`;
};

export const sendMockNotification = (email, phone, type) => {
  console.log("\n=============================================");
  console.log("🔔 [SIMULATED NOTIFICATION SERVER DISPATCH]");
  console.log("=============================================");
  
  if (type === "welcome_email") {
    console.log(`📧 TO: [${email}]`);
    console.log(`✉️  SUBJECT: Welcome to FocusFlow`);
    console.log(`📝 BODY: Hi there! Your FocusFlow account has been created successfully.`);
  }

  if (type === "login_alert") {
    console.log(`📧 TO: [${email}]`);
    console.log(`✉️  SUBJECT: Login Alert for FocusFlow`);
    console.log(`📝 BODY: You just logged in to FocusFlow. If this was not you, please secure your account.`);
  }

  if (type === "welcome_sms") {
    console.log(`📱 TO PHONE: [${phone || 'No phone provided'}]`);
    console.log(`💬 MESSAGE: FocusFlow SMS Alerts Activated. Ready to study!`);
  }

  if (type === "verification_email") {
    console.log(`📧 TO: [${email}]`);
    console.log(`✉️  SUBJECT: Verify your FocusFlow account`);
    console.log(`📝 BODY: Please click the verification link sent to your email to activate your FocusFlow account.`);
  }

  console.log("=============================================\n");
};

export const sendEmailNotification = async (email, subject, text, html, fallbackType = "welcome_email") => {
  const transporter = createTransporter();
  if (!transporter) {
    sendMockNotification(email, null, fallbackType);
    return;
  }

  await transporter.sendMail({
    from: getDefaultFrom(),
    to: email,
    subject,
    text,
    html,
  });
};

export const sendWelcomeEmail = async (email, fullName) => {
  const subject = "Welcome to FocusFlow!";
  const text = `Hello ${fullName || "student"},\n\nYour FocusFlow account has been created successfully. Start organizing your study tasks and stay focused today!\n\nThanks for joining FocusFlow.`;
  const html = `<p>Hello ${fullName || "student"},</p><p>Your <strong>FocusFlow</strong> account has been created successfully. Start organizing your study tasks and stay focused today!</p><p>Thanks for joining FocusFlow.</p>`;

  await sendEmailNotification(email, subject, text, html);
};

export const sendLoginAlertEmail = async (email, fullName) => {
  const subject = "FocusFlow Login Alert";
  const text = `Hello ${fullName || "student"},\n\nYou just logged in to FocusFlow. If this was not you, please secure your account immediately.`;
  const html = `<p>Hello ${fullName || "student"},</p><p>You just logged in to <strong>FocusFlow</strong>. If this was not you, please secure your account immediately.</p>`;

  await sendEmailNotification(email, subject, text, html, "login_alert");
};

export const sendVerificationEmail = async (email, fullName, token) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verifyLink = `${clientUrl}/verify-email?token=${token}`;
  const subject = "Verify your FocusFlow account";
  const text = `Hello ${fullName || "student"},\n\nThank you for registering with FocusFlow. Please verify your email by clicking the link below:\n\n${verifyLink}\n\nIf you did not create this account, please ignore this message.`;
  const html = `<p>Hello ${fullName || "student"},</p><p>Thank you for registering with <strong>FocusFlow</strong>. Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify Email</a></p><p>If you did not create this account, please ignore this message.</p>`;

  await sendEmailNotification(email, subject, text, html, "verification_email");
};
