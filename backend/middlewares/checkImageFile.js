const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

module.exports = (req, res, next) => {
  if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: "Only image files (JPG, JPEG, PNG, WEBP) are allowed.",
    });
  }
  next();
};
