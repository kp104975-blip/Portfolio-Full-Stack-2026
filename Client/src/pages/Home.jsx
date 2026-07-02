import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import About from './About'
import Project from './Project'
import Contact from './Contact'
import Services from './Services'
import HeroSection from './HeroSection'

function Home() {

    return (
        <>

            <main className="bg-slate-950 text-white overflow-hidden">

                {/* Hero Section */}
                <HeroSection/>

                {/* About Section */}
                <About/>

                {/* Services Section */}
                <Services/>

                {/* Projects */}
                <Project/>

                {/* Contact CTA */}
                <Contact/>
            </main>

        </>
    )
}

export default Home