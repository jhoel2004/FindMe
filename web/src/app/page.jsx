"use client";

import { useState, useEffect } from "react";
import { Search, User, Building, Phone, MapPin } from "lucide-react";
import useUser from "@/utils/useUser";

export default function FindMeLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroText, setHeroText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const { data: user, loading } = useUser();

  // Typewriter effect for hero title
  useEffect(() => {
    const text = "Find Me";
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setHeroText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 600);

    return () => clearInterval(cursor);
  }, []);

  // Mouse tracking for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const heroImageRotation = {
    transform: `
      perspective(1000px) 
      rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) 
      rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.01}deg)
      translateY(${scrollY * 0.3}px)
    `,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-[#222222]/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center">
                <Search size={16} className="text-white" />
              </div>
              <span className="text-xl font-semibold font-inter">Find Me</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#como-funciona"
                className="text-[#999999] hover:text-white transition-colors font-inter"
              >
                Cómo funciona
              </a>
              <a
                href="#caracteristicas"
                className="text-[#999999] hover:text-white transition-colors font-inter"
              >
                Características
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <a
                  href="/dashboard"
                  className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] font-inter"
                >
                  Mi Directorio
                </a>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="text-[#999999] hover:text-white transition-colors font-inter font-semibold"
                  >
                    Iniciar Sesión
                  </a>
                  <a
                    href="/account/signup"
                    className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] font-inter"
                  >
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* 3D Hero Image */}
          <div className="mb-12 relative">
            <div
              className="mx-auto transition-transform duration-300 ease-out"
              style={heroImageRotation}
            >
              <img
                src="https://raw.createusercontent.com/f84ed8c0-b0ee-4ccc-b1dc-437da9fa3bbf/"
                alt="Find Me 3D Visual"
                className="w-80 h-80 md:w-96 md:h-96 object-contain mx-auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/20 pointer-events-none"></div>
          </div>

          {/* Hero Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 font-inter">
            <span className="text-[#007BFF]">{heroText}</span>
            <span
              className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity text-[#007BFF]`}
            >
              |
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-[#999999] mb-4 font-inter">
            El directorio telefónico universal
          </p>

          <p className="text-lg text-[#666666] mb-12 max-w-3xl mx-auto font-inter">
            Encuentra personas y establecimientos de forma rápida y sencilla.
            Conecta con quien necesites, cuando lo necesites.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto">
            {user ? (
              <a
                href="/dashboard"
                className="w-full sm:w-auto bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] text-lg font-inter"
              >
                Ir al Directorio
              </a>
            ) : (
              <>
                <a
                  href="/account/signup"
                  className="w-full sm:w-auto bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] text-lg font-inter"
                >
                  Comenzar Gratis
                </a>
                <a
                  href="/account/signin"
                  className="w-full sm:w-auto border-2 border-[#333333] hover:border-[#007BFF] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:bg-[#007BFF]/10 text-lg font-inter"
                >
                  Iniciar Sesión
                </a>
              </>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[#333333] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#007BFF] rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-inter">
              Características Principales
            </h2>
            <p className="text-xl text-[#999999] font-inter">
              Todo lo que necesitas para encontrar y ser encontrado
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: User,
                title: "Perfiles Personales",
                desc: "Crea tu perfil personal con toda tu información de contacto",
                color: "#007BFF",
              },
              {
                icon: Building,
                title: "Establecimientos",
                desc: "Registra tu negocio y hazlo visible para todos",
                color: "#00D4AA",
              },
              {
                icon: Search,
                title: "Búsqueda Inteligente",
                desc: "Encuentra exactamente lo que buscas con nuestro motor de búsqueda",
                color: "#FF6B6B",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-[#141414] border border-[#222222] rounded-2xl p-8 transition-all duration-300 hover:border-[#007BFF]/50 hover:shadow-xl hover:shadow-[#007BFF]/10 hover:scale-[1.02]"
              >
                <div
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: `${feature.color}20`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <feature.icon size={32} style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-inter">
                  {feature.title}
                </h3>
                <p className="text-[#999999] leading-relaxed font-inter">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-inter">
              Cómo Funciona
            </h2>
            <p className="text-xl text-[#999999] font-inter">
              Tres simples pasos para empezar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Regístrate",
                desc: "Crea tu cuenta y comienza a formar parte del directorio",
              },
              {
                step: "02",
                title: "Crea tu Perfil",
                desc: "Añade tu información personal o de tu establecimiento",
              },
              {
                step: "03",
                title: "Conecta",
                desc: "Encuentra y conecta con las personas que necesitas",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-full flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300 font-inter">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-inter">
                  {step.title}
                </h3>
                <p className="text-[#999999] leading-relaxed font-inter">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center mr-3">
              <Search size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-inter">
              Find Me
            </span>
          </div>

          <p className="text-[#666666] mb-8 font-inter">
            El directorio telefónico universal que conecta a las personas.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a
              href="#"
              className="text-[#999999] hover:text-white transition-colors font-inter"
            >
              Términos y Condiciones
            </a>
            <a
              href="#"
              className="text-[#999999] hover:text-white transition-colors font-inter"
            >
              Política de Privacidad
            </a>
            <a
              href="#"
              className="text-[#999999] hover:text-white transition-colors font-inter"
            >
              Contacto
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-[#222222]">
            <p className="text-sm text-[#666666] font-inter">
              © 2024 Find Me. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        
        .bg-gradient-mesh {
          background-image: 
            linear-gradient(rgba(0, 123, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 123, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: mesh-move 20s linear infinite;
        }
        
        @keyframes mesh-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #007BFF;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}
