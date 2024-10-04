const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const Video = require('./model/Video'); // Import the Video model
const path = require('path');
const fs = require('fs');
const cors = require('cors');  

// Load environment variables
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON data

// Log the MongoDB URI for debugging
console.log('MongoDB URI:', process.env.MONGODB_URI);

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully!!!'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'der0czjyu',
  api_key: '312959722865758',
  api_secret: '5SpT7YGD1ShUn-51OGuYRRQs3Es',
});

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Video Upload Route
app.post('/api/videos', upload.array('video'), async (req, res) => {
  const { title, author } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No video files uploaded' });
  }

  try {
    // Loop through files and upload to Cloudinary
    const uploadedVideos = await Promise.all(req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video',
      });
      fs.unlinkSync(file.path); // Delete the file from the local server after uploading

      return {
        url: result.secure_url,  // Cloudinary URL
        public_id: result.public_id,  // Cloudinary public ID
      };
    }));

    // Save video details to MongoDB
    const newVideo = new Video({
      title,
      author,
      videos: uploadedVideos,  // Array of video objects (with url and public_id)
    });

    await newVideo.save(); // Save the video document to MongoDB
    res.status(200).json(newVideo); // Respond with the newly created video document
  } catch (error) {
    console.error('Error uploading videos:', error);
    res.status(500).json({ error: 'Failed to upload videos' });
  }
});

// Route to get all uploaded videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find(); // Fetch videos from MongoDB
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Route to delete a video
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get video ID from the request parameters
    const videoToDelete = await Video.findById(id); // Find the video by ID
    
    if (!videoToDelete) {
      return res.status(404).send({ message: 'Video not found' });
    }

    // Loop through videos and delete each from Cloudinary
    await Promise.all(videoToDelete.videos.map(async (video) => {
      await cloudinary.uploader.destroy(video.public_id);
    }));

    // Delete the video document from MongoDB
    await Video.findByIdAndDelete(id); 

    res.status(200).send({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Start server
const PORT = 5000;  // Hardcoded port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
