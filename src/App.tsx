import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ReviewPage from './pages/ReviewPage';
import IdentifyPage from './pages/IdentifyPage';
import VerificationPage from './pages/VerificationPage';
import ApplicationPage from './pages/ApplicationPage';
import TrackPage from './pages/TrackPage';
import OfficerPage from './pages/OfficerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/track/:id" element={<TrackPage />} />
          <Route path="/officer" element={<OfficerPage />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'Hind Siliguri, sans-serif' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
              <h2 style={{ marginBottom: '0.5rem' }}>পেজটি পাওয়া যায়নি</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>এই ঠিকানায় কোনো পেজ নেই।</p>
              <a href="/" className="btn btn-primary">হোমপেজে যান</a>
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
