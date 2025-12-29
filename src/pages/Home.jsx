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
import Languages from '../components/Home/Languages';
import Footer from '../components/Layout/Footer';

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
        <Languages />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
