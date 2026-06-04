import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar   from './components/Navbar.jsx'
import Banner   from './components/Banner.jsx'
import Footer   from './components/Footer.jsx'

import HomePage    from './pages/HomePage.jsx'
import AboutPage   from './pages/AboutPage.jsx'
import PredictPage from './pages/PredictPage.jsx'
import ModelPage   from './pages/ModelPage.jsx'
import ExplainPage from './pages/ExplainPage.jsx'
import AuthorPage  from './pages/AuthorPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"        element={<HomePage />}    />
            <Route path="/about"   element={<AboutPage />}   />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/model"   element={<ModelPage />}   />
            <Route path="/explain" element={<ExplainPage />} />
            <Route path="/author"  element={<AuthorPage />}  />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
