import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Fixed case-sensitive import
import UploadVideo from './components/UploadVideo';
import UploadedVideos from './components/UploadedVideos'; // Removed the extra semicolon

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/all-uploaded-videos" element={<UploadedVideos />} />
      </Routes>
    </Router>
  );
};

export default App;
