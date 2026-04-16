import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProjectionPage } from './pages/ProjectionPage';
import { SchedulePage } from './pages/SchedulePage';
import { ShiftChangePage } from './pages/ShiftChangePage';
import { DiscrepancyPage } from './pages/DiscrepancyPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ProjectionPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="shift-changes" element={<ShiftChangePage />} />
          <Route path="discrepancies" element={<DiscrepancyPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
