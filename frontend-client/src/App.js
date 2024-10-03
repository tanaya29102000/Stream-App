import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UploadVideo from './components/UploadVideo';
import UploadedVideos from './components/UploadedVideos';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload-video" />} /> {/* Redirect root to upload-video */}
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/all-uploaded-videos" element={<UploadedVideos />} />
      </Routes>
    </Router>
  );
};

export default App;
