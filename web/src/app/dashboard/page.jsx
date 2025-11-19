"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Building,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Filter,
  X,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function DashboardPage() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const { data: user, loading: userLoading } = useUser();

  // Cargar perfiles
  const fetchPerfiles = async (reset = false, showSearching = false) => {
    const offset = reset ? 0 : perfiles.length;
    setLoadingMore(!reset && !showSearching);
    if (reset) {
      if (showSearching) {
        setSearching(true);
      } else {
        setLoading(true);
      }
    }

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        tipo: filterType,
        limit: "20",
        offset: offset.toString(),
      });

      const response = await fetch(`/api/perfiles?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPerfiles(reset ? data.perfiles : [...perfiles, ...data.perfiles]);
        setPagination(data.pagination);
      } else {
        console.error("Error fetching profiles:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearching(false);
    }
  };

  // Función de búsqueda con debounce mejorado
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchValue, filterValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchPerfiles(true, true);
        }, 800); // Aumentado a 800ms para ser menos agresivo
      };
    })(),
    [searchTerm, filterType],
  );

  // Cargar perfiles inicial
  useEffect(() => {
    fetchPerfiles(true);
  }, []);

  // Búsqueda con debounce mejorado
  useEffect(() => {
    // Solo buscar si hay al menos 2 caracteres o está vacío
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
      debouncedSearch(searchTerm, filterType);
    }
  }, [searchTerm, debouncedSearch]);

  // Filtro inmediato (sin debounce)
  useEffect(() => {
    fetchPerfiles(true, true);
  }, [filterType]);

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchPerfiles(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPerfiles(true, true);
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
      <div className="bg-[#141414] border-b border-[#222222] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center">
                  <Search size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold font-inter">Find Me</span>
              </div>

              <div className="hidden md:block">
                <span className="text-[#999999] font-inter">
                  Directorio Universal
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/mi-perfil"
                className="flex items-center space-x-2 text-[#999999] hover:text-white transition-colors font-inter"
              >
                <Settings size={20} />
                <span className="hidden md:inline">Mi Perfil</span>
              </a>

              <a
                href="/account/logout"
                className="flex items-center space-x-2 text-[#999999] hover:text-white transition-colors font-inter"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Salir</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {searching ? (
                  <div className="w-5 h-5 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search size={20} className="text-[#666666]" />
                )}
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono... (mínimo 2 caracteres)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] rounded-xl pl-12 pr-12 py-4 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors font-inter"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#666666] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter size={20} className="text-[#666666]" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#141414] border border-[#333333] rounded-xl pl-12 pr-8 py-4 text-white focus:border-[#007BFF] focus:outline-none transition-colors font-inter appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="">Todos</option>
                <option value="Persona">Personas</option>
                <option value="Establecimiento">Establecimientos</option>
              </select>
            </div>

            {/* Botón de búsqueda manual */}
            <button
              type="submit"
              disabled={searching}
              className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none font-inter font-semibold"
            >
              {searching ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {/* Búsqueda activa indicator */}
          {searching && (
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-[#007BFF] bg-[#007BFF]/10 px-4 py-2 rounded-lg">
                <div className="w-4 h-4 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
                <span className="font-inter">Buscando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Stats */}
        <div className="mb-6">
          <p className="text-[#999999] font-inter">
            {pagination.total > 0 ? (
              <>
                Mostrando {perfiles.length} de {pagination.total} resultados
                {searchTerm &&
                  searchTerm.length >= 2 &&
                  ` para "${searchTerm}"`}
                {filterType && ` · Filtrado por: ${filterType}`}
              </>
            ) : searching ? (
              "Buscando..."
            ) : searchTerm && searchTerm.length < 2 ? (
              "Escribe al menos 2 caracteres para buscar"
            ) : (
              "No se encontraron resultados"
            )}
          </p>
        </div>

        {/* Profiles Grid */}
        {perfiles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perfiles.map((perfil) => (
              <div
                key={perfil.id}
                className="group bg-[#141414] border border-[#222222] rounded-2xl p-6 transition-all duration-300 hover:border-[#007BFF]/50 hover:shadow-xl hover:shadow-[#007BFF]/10 hover:scale-[1.02] cursor-pointer"
              >
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                  {perfil.profile_picture_url ? (
                    <img
                      src={perfil.profile_picture_url}
                      alt={perfil.nombre}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#333333] group-hover:border-[#007BFF] transition-colors"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#333333] border-2 border-[#333333] group-hover:border-[#007BFF] transition-colors flex items-center justify-center">
                      {perfil.tipo_perfil === "Persona" ? (
                        <User size={32} className="text-[#666666]" />
                      ) : (
                        <Building size={32} className="text-[#666666]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#007BFF] transition-colors font-inter">
                    {perfil.nombre}
                  </h3>

                  <div className="space-y-2 text-sm text-[#999999]">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone size={14} />
                      <span className="font-inter">{perfil.telefono}</span>
                    </div>

                    {perfil.nombre_pais && (
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin size={14} />
                        <span className="font-inter">{perfil.nombre_pais}</span>
                      </div>
                    )}

                    {perfil.direccion && (
                      <p className="text-xs text-[#666666] mt-2 font-inter">
                        {perfil.direccion}
                      </p>
                    )}
                  </div>

                  {/* Profile Type Badge */}
                  <div className="mt-4 flex justify-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-inter ${
                        perfil.tipo_perfil === "Persona"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {perfil.tipo_perfil === "Persona" ? (
                        <User size={12} className="mr-1" />
                      ) : (
                        <Building size={12} className="mr-1" />
                      )}
                      {perfil.tipo_perfil}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !searching && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#141414] rounded-full flex items-center justify-center">
                <Search size={48} className="text-[#666666]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-inter">
                {searchTerm && searchTerm.length < 2
                  ? "Escribe al menos 2 caracteres para buscar"
                  : "No se encontraron perfiles"}
              </h3>
              <p className="text-[#999999] mb-8 font-inter">
                {searchTerm && searchTerm.length >= 2
                  ? "Intenta con otros términos de búsqueda o filtros."
                  : "Usa la barra de búsqueda para encontrar personas o establecimientos."}
              </p>
              {!searchTerm && !filterType && (
                <a
                  href="/crear-perfil"
                  className="inline-block bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] font-inter"
                >
                  Crear el primer perfil
                </a>
              )}
            </div>
          )
        )}

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-[#333333] hover:bg-[#444444] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 font-inter"
            >
              {loadingMore ? "Cargando..." : "Cargar Más"}
            </button>
          </div>
        )}
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
