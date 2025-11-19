"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, User, Building, ArrowLeft, Save } from "lucide-react";
import useUser from "@/utils/useUser";

export default function MiPerfilPage() {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: user, loading: userLoading } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
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

  // Cargar perfil del usuario
  useEffect(() => {
    const fetchMiPerfil = async () => {
      try {
        const response = await fetch("/api/mi-perfil");
        const data = await response.json();

        if (response.ok && data.perfil) {
          const perfil = data.perfil;
          reset({
            nombre: perfil.nombre || "",
            telefono: perfil.telefono || "",
            profile_picture_url: perfil.profile_picture_url || "",
            direccion: perfil.direccion || "",
            pais_id: perfil.pais_id || "",
            ci: perfil.ci || "",
            fecha_nac: perfil.fecha_nac || "",
            nit: perfil.nit || "",
          });
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMiPerfil();
    }
  }, [user, reset]);

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
    setSaving(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/mi-perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          pais_id: data.pais_id ? parseInt(data.pais_id) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.error || "Error actualizando el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error actualizando el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
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
          <div className="flex items-center space-x-4">
            <a
              href="/dashboard"
              className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-[#999999]" />
            </a>
            <h1 className="text-2xl font-bold text-white font-inter">
              Mi Perfil
            </h1>
          </div>

          {success && (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
              <Save size={16} />
              <span className="font-inter">¡Perfil actualizado!</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-inter">
            Editar Mi Información
          </h2>
          <p className="text-xl text-[#999999] font-inter">
            Mantén tu información actualizada en el directorio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Foto de Perfil */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Foto de Perfil
            </h3>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative mx-auto md:mx-0">
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

              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold text-white mb-2 font-inter">
                  Cambiar Foto
                </h4>
                <p className="text-[#999999] mb-4 font-inter">
                  {uploadingImage
                    ? "Subiendo imagen..."
                    : "Haz clic en el ícono para subir una nueva foto"}
                </p>
                <p className="text-sm text-[#666666] font-inter">
                  JPG, PNG o GIF. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Información Básica */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Información Básica
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  Nombre Completo *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
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
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
              </div>
            </div>
          </div>

          {/* Información Personal/Empresa */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-inter">
              Información Adicional
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-[#999999] mb-2">
                  NIT (para establecimientos)
                </label>
                <input
                  {...register("nit")}
                  type="text"
                  placeholder="1234567890"
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <a
              href="/dashboard"
              className="w-full sm:w-auto text-center bg-[#333333] hover:bg-[#444444] text-white font-semibold py-4 px-8 rounded-lg transition-colors font-inter"
            >
              Cancelar
            </a>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 font-inter"
            >
              <Save size={20} />
              <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
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
