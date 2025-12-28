import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSocialMedia } from '../redux/slices/socialMediaSlice';
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Home/Hero';
import AboutUs from '../components/Home/AboutUs';
import Education from '../components/Home/Education';
import Experience from '../components/Home/Experience';
import Projects from '../components/Home/Projects';
import Contact from '../components/Home/Contact';
import HireMe from '../components/Home/HireMe';
import Languages from '../components/Home/Languages';
import Footer from '../components/Layout/Footer';
import Skills from '../components/Home/Skills';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Languages />
        <HireMe />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
