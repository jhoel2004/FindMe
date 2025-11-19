import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const paises = await sql`
      SELECT id, nombre_pais, codigo_pais 
      FROM paises 
      ORDER BY nombre_pais ASC
    `;

    return Response.json({ paises });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
