/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { UniversityProvider, useUniversity } from './context/UniversityContext';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { InteractiveLabsPage } from './components/labs/InteractiveLabsPage';
import { LearningEnvironmentPage } from './components/learn/LearningEnvironmentPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { CourseDetailPage } from './components/pages/CourseDetailPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { GlobalSearchModal } from './components/pages/GlobalSearchModal';
import { HomePage } from './components/pages/HomePage';
import { JourneyPage } from './components/pages/JourneyPage';
import { LibraryPage } from './components/pages/LibraryPage';
import { VerifyCertificatePage } from './components/pages/VerifyCertificatePage';

const PlatformRouter: React.FC = () => {
  const { view } = useUniversity();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#020B1C] antialiased">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {view.page === 'home' && <HomePage />}
        {view.page === 'courses' && (
          <CoursesPage initialCategory={view.categoryFilter} />
        )}
        {view.page === 'categories' && (
          <CategoriesPage initialCategory={view.selectedCategory} />
        )}
        {view.page === 'course-detail' && (
          <CourseDetailPage courseId={view.courseId} />
        )}
        {view.page === 'learn' && (
          <LearningEnvironmentPage
            courseId={view.courseId}
            initialLessonId={view.lessonId}
            initialTab={view.tab}
          />
        )}
        {view.page === 'library' && (
          <LibraryPage initialCourseFilter={view.courseFilter} />
        )}
        {view.page === 'labs' && <InteractiveLabsPage initialCourseId={view.courseId} />}
        {view.page === 'journey' && <JourneyPage initialSubtab={view.subtab} />}
        {view.page === 'verify-certificate' && (
          <VerifyCertificatePage initialCode={view.code} />
        )}
      </main>

      <Footer />
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <UniversityProvider>
      <PlatformRouter />
    </UniversityProvider>
  );
}
