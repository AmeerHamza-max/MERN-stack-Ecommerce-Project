const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dacqh79dn", // your cloud name
  api_key: "771634578923789",
  api_secret: "H3O8AvL9O_oGmIXvJ5TpKFYEVPc",
  secure: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function imageUploadUtils(file) {
  try {
    if (!file) throw new Error("No file provided for upload");

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      folder: "products",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    console.log("✅ Cloudinary Upload Successful:", result.secure_url);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    throw new Error("Cloudinary upload failed. Please try again later.");
  }
}

module.exports = { upload, imageUploadUtils };
