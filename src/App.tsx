import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
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
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <main className="content" id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/identify" element={<IdentifyPage />} />
              <Route path="/map" element={<IdentifyPage />} />
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/apply" element={<ApplicationPage />} />
              <Route path="/mutation" element={<ApplicationPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/track/:id" element={<TrackPage />} />
              <Route path="/report" element={<TrackPage />} />
              <Route path="/officer" element={<OfficerPage />} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                  <h2 style={{ marginBottom: '0.5rem' }}>পেজটি পাওয়া যায়নি</h2>
                  <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>এই ঠিকানায় কোনো পেজ নেই।</p>
                  <a href="/" className="btn">হোমপেজে যান</a>
                </div>
              } />
            </Routes>
            <footer className="footnote no-print">
              © BhuProhori AI — LandTech Innovation Hackathon 2026. Geo-Integrated Smart e-Mutation & Land Verification System.
            </footer>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
