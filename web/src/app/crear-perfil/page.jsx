"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, User, Building } from "lucide-react";
import useUser from "@/utils/useUser";

export default function CrearPerfilPage() {
  const [paises, setPaises] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { data: user, loading: userLoading } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const profilePictureUrl = watch("profile_picture_url");

  // Cargar países
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await fetch("/api/paises");
        const data = await response.json();
        setPaises(data.paises || []);
      } catch (error) {
        console.error("Error cargando países:", error);
      }
    };

    fetchPaises();
  }, []);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setValue("profile_picture_url", data.url);
      } else {
        alert("Error subiendo la imagen");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error subiendo la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch("/api/perfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tipo_perfil: selectedTipo,
          pais_id: data.pais_id ? parseInt(data.pais_id) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert(result.error || "Error creando el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creando el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="bg-[#141414] border-b border-[#222222] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white font-inter">
            Crear Tu Perfil
          </h1>
          <a
            href="/account/logout"
            className="text-[#999999] hover:text-white transition-colors font-inter"
          >
            Cerrar Sesión
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-inter">
            ¡Casi terminamos!
          </h2>
          <p className="text-xl text-[#999999] font-inter">
            Completa tu perfil para aparecer en el directorio Find Me
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Foto de Perfil */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Foto de Perfil
            </h3>

            <div className="flex flex-col items-center">
              <div className="relative">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#007BFF]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#333333] flex items-center justify-center border-4 border-[#222222]">
                    <User size={48} className="text-[#666666]" />
                  </div>
                )}

                <label className="absolute bottom-0 right-0 bg-[#007BFF] hover:bg-[#0056b3] p-3 rounded-full cursor-pointer transition-colors">
                  <Upload size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <p className="text-[#999999] mt-4 text-center font-inter">
                {uploadingImage
                  ? "Subiendo imagen..."
                  : "Haz clic en el ícono para subir una foto"}
              </p>
            </div>
          </div>

          {/* Tipo de Perfil */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Tipo de Perfil
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setSelectedTipo("Persona")}
                className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                  selectedTipo === "Persona"
                    ? "border-[#007BFF] bg-[#007BFF]/10"
                    : "border-[#333333] hover:border-[#007BFF]/50"
                }`}
              >
                <img
                  src="https://raw.createusercontent.com/157dcfe5-737a-4c6f-bfcc-d936b648b64b/"
                  alt="Persona"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h4 className="text-xl font-bold text-white mb-2 font-inter">
                  Soy una Persona
                </h4>
                <p className="text-[#999999] font-inter">
                  Perfil personal para conectar con otros
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTipo("Establecimiento")}
                className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                  selectedTipo === "Establecimiento"
                    ? "border-[#007BFF] bg-[#007BFF]/10"
                    : "border-[#333333] hover:border-[#007BFF]/50"
                }`}
              >
                <img
                  src="https://raw.createusercontent.com/1aacb195-fac4-4194-8d36-488d9ba928e0/"
                  alt="Establecimiento"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h4 className="text-xl font-bold text-white mb-2 font-inter">
                  Soy un Establecimiento
                </h4>
                <p className="text-[#999999] font-inter">
                  Perfil de negocio o empresa
                </p>
              </button>
            </div>

            {!selectedTipo && (
              <p className="text-red-400 text-sm mt-4 font-inter">
                Por favor selecciona un tipo de perfil
              </p>
            )}
          </div>

          {/* Información Básica */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Información Básica
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  Nombre{" "}
                  {selectedTipo === "Establecimiento"
                    ? "del Negocio"
                    : "Completo"}{" "}
                  *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
                  placeholder={
                    selectedTipo === "Establecimiento"
                      ? "Mi Empresa S.A."
                      : "Juan Pérez"
                  }
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
                {errors.nombre && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  Número de Teléfono *
                </label>
                <input
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Formato de teléfono inválido",
                    },
                  })}
                  type="tel"
                  placeholder="+59175123456"
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
                {errors.telefono && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  País
                </label>
                <select
                  {...register("pais_id")}
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                >
                  <option value="">Seleccionar país</option>
                  {paises.map((pais) => (
                    <option
                      key={pais.id}
                      value={pais.id}
                      className="bg-[#141414]"
                    >
                      {pais.nombre_pais} ({pais.codigo_pais})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  Dirección
                </label>
                <input
                  {...register("direccion")}
                  type="text"
                  placeholder="Av. Principal 123"
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
              </div>
            </div>
          </div>

          {/* Información Específica */}
          {selectedTipo && (
            <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 font-inter">
                Información Adicional
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {selectedTipo === "Persona" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#999999] mb-2">
                        Cédula de Identidad
                      </label>
                      <input
                        {...register("ci")}
                        type="text"
                        placeholder="12345678 LP"
                        className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#999999] mb-2">
                        Fecha de Nacimiento
                      </label>
                      <input
                        {...register("fecha_nac")}
                        type="date"
                        className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#999999] mb-2">
                      NIT
                    </label>
                    <input
                      {...register("nit")}
                      type="text"
                      placeholder="1234567890"
                      className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botón Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedTipo}
              className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none text-lg font-inter"
            >
              {loading ? "Creando perfil..." : "Crear Mi Perfil"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
