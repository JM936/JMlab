import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const EnsaiosCategoriesPage = lazy(() => import('./pages/EnsaiosCategoriesPage'));
const EnsaioDetailPage = lazy(() => import('./pages/EnsaioDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:articleId" element={<ArticleDetailPage />} />
              <Route path="/ensaios" element={<EnsaiosCategoriesPage />} />
              <Route path="/ensaio/:ensaioId" element={<EnsaioDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsOfUsePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;