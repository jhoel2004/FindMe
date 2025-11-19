import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-semibold text-white font-inter mb-4">
            Cerrar Sesión
          </h1>
          <p className="text-[#999999] mb-8">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#007BFF]/25 transform hover:scale-[1.02]"
            >
              Cerrar Sesión
            </button>

            <a
              href="/dashboard"
              className="block w-full bg-[#333333] hover:bg-[#444444] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-center"
            >
              Cancelar
            </a>
          </div>
        </div>
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
