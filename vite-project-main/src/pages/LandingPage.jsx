import React, { useState } from "react";
import Navbar from '../components/shared/Navbar';

// Utility Components
const BenefitCard = ({ icon, title, description, color }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
      <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, title }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-transform hover:transform hover:scale-105">
      <div className="mb-4">
        <svg className="h-8 w-8 text-indigo-400 mb-2" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
        </svg>
        <p className="text-gray-300 italic">"{quote}"</p>
      </div>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-600 mr-3"></div>
        <div>
          <h4 className="text-white font-medium">{author}</h4>
          <p className="text-gray-400 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [pricingMode, setPricingMode] = useState("monthly");

  // Feature Data
  const features = [
    {
      title: "Real-time Player Tracking",
      description: "Track player movements with AI-powered precision. Analyze performance metrics in real-time.",
      icon: "👥",
      color: "from-blue-600 to-cyan-400"
    },
    {
      title: "Advanced Event Detection",
      description: "Automatically detect and analyze key match events with machine learning algorithms.",
      icon: "⚽",
      color: "from-green-500 to-emerald-400"
    },
    {
      title: "Tactical Analysis",
      description: "Deep insights into team formations, player interactions, and strategic patterns.",
      icon: "📋",
      color: "from-purple-600 to-indigo-400"
    },
    {
      title: "Comprehensive Reporting",
      description: "Generate detailed match reports with interactive visualizations and performance metrics.",
      icon: "📈",
      color: "from-amber-500 to-orange-400"
    }
  ];

  // Benefits Data
  const benefits = [
    {
      title: "Improve Team Performance",
      description: "Identify strengths and weaknesses in your team's play with data-driven insights.",
      icon: "🏆",
      color: "from-green-600 to-teal-400"
    },
    {
      title: "Save Time & Resources",
      description: "Automate the analysis process that would typically require multiple staff members.",
      icon: "⏱️",
      color: "from-blue-600 to-indigo-400"
    },
    {
      title: "Player Development",
      description: "Track individual player progress and identify specific areas for improvement.",
      icon: "📈",
      color: "from-purple-600 to-pink-400"
    },
    {
      title: "Tactical Advantage",
      description: "Discover opponent patterns and prepare effective counter-strategies.",
      icon: "🧠",
      color: "from-red-600 to-orange-400"
    },
    {
      title: "Objective Decision Making",
      description: "Base coaching and management decisions on concrete data rather than subjective observations.",
      icon: "📊",
      color: "from-yellow-600 to-amber-400"
    },
    {
      title: "Injury Prevention",
      description: "Monitor player workload and identify fatigue patterns to reduce injury risks.",
      icon: "🩺",
      color: "from-indigo-600 to-blue-400"
    }
  ];

  const testimonials = [
    {
      quote: "Pitch Vision has transformed our approach to player analysis. The insights are game-changing!",
      author: "Carlos Rodriguez",
      title: "Head Coach, FC Barcelona Academy"
    },
    {
      quote: "Our team's performance has improved dramatically thanks to the detailed tracking and analysis.",
      author: "Sarah Johnson",
      title: "Performance Director, Liverpool FC"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small clubs and academies.",
      monthlyPrice: "99",
      annualPrice: "999"
    },
    {
      name: "Pro",
      description: "Ideal for professional teams.",
      monthlyPrice: "199",
      annualPrice: "1999"
    },
    {
      name: "Enterprise",
      description: "For leagues and organizations.",
      monthlyPrice: "Custom",
      annualPrice: "Custom"
    }
  ];

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
            <a href="#features" className="text-gray-300 hover:text-white transition text-lg">Features</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition text-lg">Benefits</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition text-lg">Pricing</a>
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
              onClick={(e) => { e.preventDefault(); window.location.href = '/signup'; }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>
      
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transform Football Analysis with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> AI-Powered Insights</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Pitch Vision leverages YOLO object detection to provide real-time tracking, tactical analysis, and performance metrics for football teams of all levels.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.location.href = '/register'; }}
                className="px-6 py-3 text-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition shadow-lg"
              >
                Start Free Trial
              </a>
              <a
                href="#demo"
                className="px-6 py-3 text-center rounded-full bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
              >
                Watch Demo
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              {/* GIF Image */}
              <img 
                src="https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif" 
                alt="Football analytics visualization" 
                className="w-full h-full object-cover hidden"
              />
              
              {/* Football field with player analysis */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 p-2">
                {/* Football pitch */}
                <div className="relative h-full w-full bg-gradient-to-r from-green-900 to-green-800 rounded border border-white border-opacity-20">
                  {/* Field markings */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
                  <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
                  <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
                  
                  {/* Team A (Blue) - 4-3-3 Formation (11 players) */}
                  {/* Goalkeeper */}
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-1/2 left-[8%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  
                  {/* Defenders */}
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[15%] left-[20%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[38%] left-[20%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[62%] left-[20%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[85%] left-[20%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  
                  {/* Midfielders */}
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[25%] left-[35%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">6</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[50%] left-[35%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">8</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[75%] left-[35%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">7</span>
                  </div>
                  
                  {/* Forwards */}
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[20%] left-[50%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">11</span>
                  </div>
                  <div className="absolute h-6 w-6 bg-blue-600 border-2 border-blue-300 rounded-full top-[50%] left-[50%] flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-xs font-bold">10</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-blue-600 border-2 border-white rounded-full top-[80%] left-[50%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">9</span>
                  </div>
                  
                  {/* Team B (Red) - 4-4-2 Formation (11 players) */}
                  {/* Goalkeeper */}
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[50%] left-[92%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  
                  {/* Defenders */}
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[15%] left-[80%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[38%] left-[80%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[62%] left-[80%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[85%] left-[80%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  
                  {/* Midfielders */}
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[15%] left-[65%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">7</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[38%] left-[65%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">8</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[62%] left-[65%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">6</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[85%] left-[65%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">11</span>
                  </div>
                  
                  {/* Forwards */}
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[35%] left-[50%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">9</span>
                  </div>
                  <div className="absolute h-5 w-5 bg-red-600 border-2 border-white rounded-full top-[65%] left-[50%] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">10</span>
                  </div>
                  
                  {/* Ball */}
                  <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"></div>
                  
                  {/* Analysis visualization - heat map for highlighted player */}
                  <div className="absolute top-[50%] left-[50%] h-32 w-32 bg-blue-500 rounded-full opacity-10 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-[50%] left-[50%] h-20 w-20 bg-blue-500 rounded-full opacity-20 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Connection lines for player 10 movement */}
                  <svg className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 240,150 C 260,140 280,135 300,130" stroke="rgba(147, 197, 253, 0.7)" strokeWidth="2" fill="none" strokeDasharray="5,3" />
                    <path d="M 300,130 C 320,125 330,130 340,150" stroke="rgba(147, 197, 253, 0.7)" strokeWidth="2" fill="none" strokeDasharray="5,3" />
                  </svg>
                </div>
              </div>
              
              {/* UI Overlay */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 bg-opacity-70 rounded text-xs text-cyan-400">
                LIVE TRACKING
              </div>
              
              {/* Text overlay removed */}
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-4 -right-4 bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700 w-48">
              <div className="text-xs text-gray-400 mb-1">Player #10 Stats</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Distance</span>
                  <span className="text-white">8.7 km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Top Speed</span>
                  <span className="text-white">32.1 km/h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Pass Acc.</span>
                  <span className="text-white">87%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Powerful tools to transform your team's performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <BenefitCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </section>
        
        {/* Benefits Section */}
        <section id="benefits" className="container mx-auto px-4 py-20 bg-gray-900 rounded-xl shadow-xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Pitch Vision?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience game-changing benefits that elevate your team's performance and decision-making
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard 
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                color={benefit.color}
              />
            ))}
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="demo" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Simple setup, powerful results. Get started in minutes with Pitch Vision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Setup Camera</h3>
              <p className="text-gray-300">
                Position your camera with a clear view of the field.
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Tracking</h3>
              <p className="text-gray-300">
                Our AI system automatically detects and tracks all players.
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
              <p className="text-gray-300">
                Access real-time insights and comprehensive post-match analysis.
              </p>
            </div>
          </div>
          <div className="mt-16 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl text-white font-semibold mb-4">See It In Action</h3>
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {/* Here you would upload your own GIF */}
              <img 
                src="/images/demo.gif" 
                alt="Pitch Vision demo showing player tracking and analysis" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Optional caption or explanation */}
            <p className="text-gray-400 text-sm mt-3 text-center">
              Watch how Pitch Vision tracks player movements and analyzes performance metrics in real-time.
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Trusted by coaches and analysts worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                title={testimonial.title}
              />
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your team's needs.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setPricingMode("monthly")}
                className={`px-4 py-2 rounded-l-full ${
                  pricingMode === "monthly" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingMode("annual")}
                className={`px-4 py-2 rounded-r-full ${
                  pricingMode === "annual" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                Annual
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="text-4xl font-bold mb-6">
                  ${pricingMode === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                  <span className="text-lg text-gray-400">/{pricingMode === "monthly" ? "mo" : "yr"}</span>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-900 to-purple-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Team's Performance?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Join hundreds of teams already using Pitch Vision to gain a competitive edge
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg transition">
                Start Free Trial
              </button>
              <a 
                href="/contact" 
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-full shadow-lg transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

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
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 text-xl font-bold">Help & Support</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
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
                <a href="/contact#faq" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-center group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">                  <div className="h-8 w-8 bg-indigo-900 group-hover:bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">FAQ</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Pitch Vision. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.39 4.49A13.978 13.978 0 011.671 3.15a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616v.061a4.926 4.926 0 003.95 4.827 4.996 4.996 0 01-2.224.084 4.918 4.918 0 004.59 3.413A9.863 9.863 0 010 19.542a13.94 13.94 0 007.548 2.212c9.057 0 14.009-7.5 14.009-14.01 0-.21-.005-.422-.014-.632A10.039 10.039 0 0024 4.557z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;