const express = require("express");
const router = express.Router();
const File = require("../models/File");
const fetchuser = require("../middleware/fetchuser");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer();
// const storage = multer.memoryStorage(); // Store the file in memory before processing

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Route 1 fetch all fiels form the database using : GET "/api/files/fetchallfiles"  login required
router.get("/fetchallfiles", fetchuser, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2 Add a new file  using : Post "/api/files/addfile"  login required
// router.post("/addfile", fetchuser, upload.single("file"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload_stream();

//     const file = new File({ user: req.user.id, filename: result.secure_url });
//     file.save();
//     const success = true;
//     res.send(success);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal server error");
//   }
// });

//Route 2 Add a new file using: POST "/api/files/addfile" login required
router.post("/addfile", fetchuser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Access the file buffer from req.file
    const fileBuffer = req.file.buffer;
    console.log(req.file);

    // Upload the file buffer to Cloudinary
    cloudinary.uploader
      .upload_stream(
        {
          folder: "your_folder_name", // Optional folder in Cloudinary
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            res.status(500).send("Upload to Cloudinary failed.");
          } else {
            console.log("Uploaded to Cloudinary:", result);

            // Create and save the file record in your database
            const file = new File({
              user: req.user.id,
              originalname: req.file.originalname,
              filename: result.secure_url,
            });
            const savedfle = await file.save();

            res.status(200).json(savedfle);
          }
        }
      )
      .end(fileBuffer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
// Utility function to extract public ID from Cloudinary URL
function extractPublicIdFromUrl(url) {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1]; // Get the last part of the URL
  const publicId = publicIdWithExtension.split(".")[0]; // Remove the extension
  return publicId;
}
//Route 3 Delete an existing file using : delete "/api/files/deletefile"  login required
router.delete("/deletefile/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be delete and delete it
    let file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if user owns it
    if (file.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    // Extract the public ID from the Cloudinary URL

    const publicId = extractPublicIdFromUrl(file.filename);

    // Delete the file from Cloudinary
    const id = `your_folder_name/${publicId}`;
    const deletionResult = await cloudinary.uploader.destroy(id);
    console.log("Deletion result from Cloudinary:", deletionResult);

    file = await File.findByIdAndDelete(req.params.id);

    res.json({ success: "File has been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
