import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import Company from './components/pages/Company'
import NewProject from './components/pages/NewProject'
import Projects from './components/pages/Projects'
import Project from './components/pages/Project'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'


import Container from './components/layout/Container'

function App() {
  return (
    <Router>
      <Navbar />

      <Container customClass="min_height">
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/projects"} element={<Projects />} />
          <Route exact path={"/company"} element={<Company />} />
          <Route exact path={"/contact"} element={<Contact />} />
          <Route exact path={"/newproject"} element={<NewProject />} />
          <Route exact path={"/project/:id"} element={<Project />} />
          
        </Routes>
      </Container>
      <Footer />
    </Router>

  );
}

export default App;