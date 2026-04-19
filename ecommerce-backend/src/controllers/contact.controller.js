const ContactMessage = require("../models/ContactMessage.model");
const asyncHandler = require("../utils/asyncHandler");

exports.createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, category, subject, message } = req.body;

  await ContactMessage.create({
    name,
    email,
    category: category || "diger",
    subject: subject || "",
    message,
    source: "support",
  });

  res.status(201).json({
    success: true,
    message: "Mesajiniz alindi. En kisa surede size donus yapacagiz.",
  });
});
