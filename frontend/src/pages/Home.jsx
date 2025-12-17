import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Tesitmonial'
import Newsletter from '../components/newsletter'

const Home = () => {
  return (
    <>
    <Hero/>
    <FeaturedSection />
    <Banner />
    <Testimonial />
    <Newsletter />
    </>
  )
}

export default Home