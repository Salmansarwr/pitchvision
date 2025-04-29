import React from 'react';

const AboutPage = () => {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!'); // Replace with actual form submission logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header Section */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 fixed w-full top-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-2xl font-bold tracking-wide">
              PITCH VISION
            </span>
          </div>
          <nav className="hidden md:flex space-x-12">
            <a href="/" className="text-gray-300 hover:text-white transition text-lg">Home</a>
            <a href="/about" className="text-white border-b-2 border-indigo-500 font-medium transition text-lg">About</a>
            <a href="/contact" className="text-gray-300 hover:text-white transition text-lg">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a
              href="/login"
              className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
            >
              Sign In
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = '/register'; }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>
      
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pitch Vision</span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8"></div>
        <p className="text-gray-300 text-lg text-center max-w-3xl">
          Revolutionizing football analysis with advanced AI technology, helping teams and players reach their full potential.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 p-2">
                  {/* Football pitch with players */}
                  <div className="relative h-full w-full bg-gradient-to-r from-green-900 to-green-800 rounded border border-white border-opacity-20">
                    {/* Field markings */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
                    <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
                    <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
                    
                    {/* Players */}
                    <div className="absolute top-1/2 left-1/4 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"></div>
                    <div className="absolute top-1/3 left-1/2 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"></div>
                    <div className="absolute top-2/3 left-1/2 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"></div>
                    <div className="absolute top-1/2 left-3/4 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"></div>
                    
                    {/* Analysis visualization */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line x1="25%" y1="50%" x2="50%" y2="33%" stroke="rgba(147, 197, 253, 0.7)" strokeWidth="2" strokeDasharray="5,3" />
                      <line x1="50%" y1="33%" x2="50%" y2="67%" stroke="rgba(147, 197, 253, 0.7)" strokeWidth="2" strokeDasharray="5,3" />
                      <line x1="50%" y1="67%" x2="75%" y2="50%" stroke="rgba(147, 197, 253, 0.7)" strokeWidth="2" strokeDasharray="5,3" />
                    </svg>
                    
                    {/* YOLO bounding boxes */}
                    <div className="absolute top-[calc(50%-20px)] left-[calc(25%-20px)] h-40 w-40 border-2 border-green-400 rounded-sm opacity-50"></div>
                    <div className="absolute top-[calc(33%-20px)] left-[calc(50%-20px)] h-40 w-40 border-2 border-green-400 rounded-sm opacity-50"></div>
                    <div className="absolute top-[calc(67%-20px)] left-[calc(50%-20px)] h-40 w-40 border-2 border-green-400 rounded-sm opacity-50"></div>
                    <div className="absolute top-[calc(50%-20px)] left-[calc(75%-20px)] h-40 w-40 border-2 border-green-400 rounded-sm opacity-50"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700">
                <div className="text-xs text-gray-400">YOLO Object Detection</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
            <p className="text-gray-300 mb-6">
              Pitch Vision began in 2022 when a group of football enthusiasts with backgrounds in computer vision and machine learning came together with a shared vision: to make advanced sports analytics accessible to teams at all levels, not just elite clubs with massive budgets.
            </p>
            <p className="text-gray-300 mb-6">
              Frustrated by the gap between the sophisticated analysis tools available to top-tier teams and what smaller clubs and academies could access, we set out to develop a solution that would democratize football analytics.
            </p>
            <p className="text-gray-300">
              After two years of development and testing with partner clubs, Pitch Vision was born—combining state-of-the-art YOLO object detection with intuitive analytics dashboards that give meaningful insights to coaches, analysts, and players alike.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8 mx-auto"></div>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Powered by advanced computer vision and AI to deliver real-time insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">YOLO Object Detection</h3>
              <p className="text-gray-300">
                Our system uses the latest version of YOLO (You Only Look Once) to detect and track players, referees, and the ball in real-time with exceptional accuracy, even in challenging conditions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">DeepSORT Tracking</h3>
              <p className="text-gray-300">
                Combined with DeepSORT tracking algorithms, our system maintains player identity across frames, allowing for continuous tracking of movements, interactions, and performance metrics throughout the match.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-300">
                Our proprietary algorithms transform raw tracking data into actionable insights about team formations, player movements, tactical patterns, and performance metrics that coaches and analysts can immediately apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8 mx-auto"></div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            A dedicated group of sports enthusiasts, AI experts, and experienced developers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800"></div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Muhammad Hammad Yasin</h3>
                <p className="text-indigo-400 mb-3">Co-Founder & CEO</p>
                <p className="text-gray-400 text-sm">
                  Web developer with expertise in artificial intelligence and machine learning.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800"></div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Salman Sarwar</h3>
                <p className="text-indigo-400 mb-3">Co-Founder & CTO</p>
                <p className="text-gray-400 text-sm">
                  Web developer with expertise in front-end, back-end and database management.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800"></div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Nabia Khalid</h3>
                <p className="text-indigo-400 mb-3">Lead Supervisor</p>
                <p className="text-gray-400 text-sm">
                  Expert in computer vision and machine learning applications in sports analytics.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Member 4 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800"></div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Join Our Team</h3>
                <p className="text-indigo-400 mb-3">We're Hiring!</p>
                <p className="text-gray-400 text-sm">
                  Passionate about sports and technology? We're looking for talented individuals to join us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <div className="w-24 h-1 bg-white rounded-full mb-8 mx-auto"></div>
            <p className="text-white text-lg mb-8">
              "To democratize advanced sports analytics technology, making professional-level insights accessible to teams at all levels, empowering coaches and players to maximize their potential through data-driven decision making."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-200">
                  Making advanced analytics affordable and accessible for teams of all sizes and budgets.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-200">
                  Continuously pushing the boundaries of what's possible with sports technology.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Impact</h3>
                <p className="text-gray-200">
                  Creating meaningful change in how teams train, compete, and develop talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
            <p className="text-gray-300 mb-8">
              Have questions about Pitch Vision? We'd love to hear from you. Our team is ready to help you explore how our technology can transform your team's performance.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Email</h3>
                  <p className="text-gray-300">info@pitchvision.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Office</h3>
                  <p className="text-gray-300">Bahria University, Shangrila Road, Sector E-8, Islamabad</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-xl font-bold tracking-wide ml-2">
                  PITCH VISION
                </span>
              </div>
              <p className="text-gray-400 mt-4 max-w-xs">
                Advanced football analysis using AI and computer vision to transform team performance.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-indigo-900 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 text-xl font-bold">Quick Links</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <a href="/" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-center group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-8 w-8 bg-indigo-900 group-hover:bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">Home</span>
                </a>
                <a href="/about" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-center group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-8 w-8 bg-indigo-900 group-hover:bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">About</span>
                </a>
                <a href="/contact" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-center group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-8 w-8 bg-indigo-900 group-hover:bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">Contact</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Pitch Vision. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;