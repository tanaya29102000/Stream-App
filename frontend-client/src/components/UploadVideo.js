import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UploadVideo.css';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const onClickHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('video', selectedFiles[i]);
    }
    formData.append('title', title);
    formData.append('author', author);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const url = 'https://stream-app-f6ao.vercel.app/api/upload-video';
      const response = await axios.post(url, formData, config);

      // Show success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Video Uploaded',
        text: 'Your video has been uploaded successfully!',
        confirmButtonText: 'OK',
        timer: 3000
      });

      // Reset form inputs
      setTitle('');
      setAuthor('');
      setSelectedFiles([]);

      console.log('Upload successful:', response.data);
    } catch (err) {
      console.log('Error uploading video:', err.response);

      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload video. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Upload Video</h1>
      <form className="card-form">
        <div className="form-group">
          <label>Title-</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="card-input"
          />
        </div>
        <div className="form-group">
          <label>Author-</label>
          <input 
            type="text" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            className="card-input"
          />
        </div>
        <div className="form-group">
          <label>Video-</label>
          <input 
            type="file" 
            multiple 
            onChange={onFileChange} 
            className="card-input"
          />
        </div>
        <button onClick={onClickHandler} className="card-button">Upload Video</button>
      </form>
    </div>
  );
};

export default UploadVideo;
