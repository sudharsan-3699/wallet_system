// This is a mock email utility. In production, configure nodemailer.
exports.sendEmail = async (to, subject, text) => {
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
};
