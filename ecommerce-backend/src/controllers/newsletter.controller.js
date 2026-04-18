const NewsletterSubscriber = require("../models/NewsletterSubscriber.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.subscribe = asyncHandler(async (req, res) => {
  const rawEmail = req.body?.email;
  const sourceRaw = req.body?.source;

  if (!rawEmail || typeof rawEmail !== "string") {
    throw new ApiError(400, "E-posta adresi gerekli", true);
  }

  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 320) {
    throw new ApiError(400, "Gecerli bir e-posta adresi girin", true);
  }

  let source = "home";
  if (sourceRaw === "footer") {
    source = "footer";
  } else if (sourceRaw === "home") {
    source = "home";
  }

  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing) {
    return res.status(200).json({
      success: true,
      message: "Bu e-posta zaten bulten listesinde.",
      data: { email, alreadySubscribed: true },
    });
  }

  await NewsletterSubscriber.create({ email, source });

  return res.status(201).json({
    success: true,
    message: "Bultene basariyla kaydoldunuz.",
    data: { email, alreadySubscribed: false },
  });
});
