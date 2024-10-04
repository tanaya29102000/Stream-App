import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadedVideos.css';

const UploadedVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`);
      setVideos(videos.filter(video => video._id !== videoId));
      // Show an alert when video is successfully deleted
      alert('Video has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    }
  };

  return (
    <div className="all-videos-container">
      <h1>All Uploaded Videos</h1>
      {videos.map(video => (
        <div className="video-item" key={video._id}>
          <h3>{video.title} by {video.author}</h3>
          
          {video.videos.map((vid, index) => (
            <video key={index} src={vid.url} controls preload="metadata">
              <source src={vid.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          <br/>
          <button onClick={() => handleDelete(video._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UploadedVideos;