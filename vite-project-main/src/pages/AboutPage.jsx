import React from "react";

const AboutPage = () => {
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
            <a
              href="/"
              className="text-gray-300 hover:text-white transition text-lg"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-white border-b-2 border-indigo-500 font-medium transition text-lg"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-300 hover:text-white transition text-lg"
            >
              Contact
            </a>
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
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/register";
              }}
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
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Pitch Vision
          </span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8"></div>
        <p className="text-gray-300 text-lg text-center max-w-3xl">
          Revolutionizing football analysis with advanced AI technology, helping
          teams and players reach their full potential.
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
                      <line
                        x1="25%"
                        y1="50%"
                        x2="50%"
                        y2="33%"
                        stroke="rgba(147, 197, 253, 0.7)"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
                      <line
                        x1="50%"
                        y1="33%"
                        x2="50%"
                        y2="67%"
                        stroke="rgba(147, 197, 253, 0.7)"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
                      <line
                        x1="50%"
                        y1="67%"
                        x2="75%"
                        y2="50%"
                        stroke="rgba(147, 197, 253, 0.7)"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
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
                <div className="text-xs text-gray-400">
                  YOLO Object Detection
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
            <p className="text-gray-300 mb-6">
              Pitch Vision began in 2024 when two football enthusiasts with
              backgrounds in computer vision and machine learning came together
              with a shared vision: to make advanced sports analytics accessible
              to teams at all levels, not just elite clubs with massive budgets.
            </p>
            <p className="text-gray-300 mb-6">
              Frustrated by the gap between the sophisticated analysis tools
              available to top-tier teams and what smaller clubs and academies
              could access, we set out to develop a solution that would
              democratize football analytics.
            </p>
            <p className="text-gray-300">
              After a year of development and testing with different
              technologies, Pitch Vision was born—combining state-of-the-art
              YOLO object detection with intuitive analytics dashboards that
              give meaningful insights to coaches, analysts, and players alike.
            </p>
          </div>
        </div>
      </section>
      {/* Technology Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Technology
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8 mx-auto"></div>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Powered by advanced computer vision and AI to deliver real-time
              insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                YOLO Object Detection
              </h3>
              <p className="text-gray-300">
                Our system uses the latest version of YOLO (You Only Look Once)
                to detect and track players, referees, and the ball in real-time
                with exceptional accuracy, even in challenging conditions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">ByteTrack Tracking</h3>
              <p className="text-gray-300">
                Combined with ByteTrack tracking algorithms, our system
                maintains player identity across frames, allowing for continuous
                tracking of movements, interactions, and performance metrics
                throughout the match.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-300">
                Our proprietary algorithms transform raw tracking data into
                actionable insights about team statistics, player movements,
                tactical patterns, and performance metrics that coaches and
                analysts can immediately apply.
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
            A dedicated group of sports enthusiasts, AI experts, and experienced
            developers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Team Member 1 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <img
                  src="images/hammad.jpg"
                  alt="Muhammad Hammad Yasin"
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-800"
                />
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">
                  Muhammad Hammad Yasin
                </h3>
                <p className="text-indigo-400 mb-3">Co-Founder & CEO</p>
                <p className="text-gray-400 text-sm">
                  Web developer with expertise in artificial intelligence and
                  machine learning.
                </p>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
            <div className="relative px-6 py-4">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <img
                  src="images/salman.jpg"
                  alt="Salman Sarwar"
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-800"
                />
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Salman Sarwar</h3>
                <p className="text-indigo-400 mb-3">Co-Founder & CTO</p>
                <p className="text-gray-400 text-sm">
                  Web developer with expertise in front-end, back-end and
                  database management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Mission Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <div className="w-24 h-1 bg-white rounded-full mb-8 mx-auto"></div>
            <p className="text-white text-lg mb-8">
              "To democratize advanced sports analytics technology, making
              professional-level insights accessible to teams at all levels,
              empowering coaches and players to maximize their potential through
              data-driven decision making."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-200">
                  Making advanced analytics affordable and accessible for teams
                  of all sizes and budgets.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-200">
                  Continuously pushing the boundaries of what's possible with
                  sports technology.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Impact</h3>
                <p className="text-gray-200">
                  Creating meaningful change in how teams train, compete, and
                  develop talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Pitch Vision. All rights
                reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/Salmansarwr/pitchvision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
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
