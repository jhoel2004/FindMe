import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/crear-perfil",
        redirect: true,
      });
    } catch (err) {
      setError(
        "Este email ya está registrado o hay un error. Inténtalo de nuevo.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          className="bg-[#141414] border border-[#222222] rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white font-inter">
              Únete a Find Me
            </h1>
            <p className="text-[#999999] mt-2">
              Crea tu cuenta en el directorio
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#999999]">
                Email
              </label>
              <div className="relative">
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#999999]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  required
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#050505] border-0 border-b-2 border-[#333333] px-0 py-3 text-white placeholder-[#666666] focus:border-[#007BFF] focus:outline-none transition-colors text-lg font-inter"
                />
              </div>
              <p className="text-xs text-[#666666]">Mínimo 6 caracteres</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            <div className="text-center">
              <p className="text-[#999999] text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/account/signin"
                  className="text-[#007BFF] hover:text-[#0056b3] transition-colors font-semibold"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
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
