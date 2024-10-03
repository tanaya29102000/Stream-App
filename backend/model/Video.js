
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  videos: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
