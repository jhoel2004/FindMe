import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Listar perfiles (GET)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const tipo = url.searchParams.get("tipo") || "";
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    let baseQuery = `
      SELECT 
        p.id,
        p.telefono,
        p.tipo_perfil,
        p.nombre,
        p.profile_picture_url,
        p.direccion,
        p.ci,
        p.fecha_nac,
        p.nit,
        pa.nombre_pais,
        pa.codigo_pais,
        p.created_at
      FROM perfiles p
      LEFT JOIN paises pa ON p.pais_id = pa.id
      WHERE 1=1
    `;

    const params = [];
    let paramCounter = 1;

    // Filtro por búsqueda
    if (search.trim()) {
      baseQuery += ` AND (
        LOWER(p.nombre) LIKE LOWER($${paramCounter})
        OR p.telefono LIKE $${paramCounter + 1}
      )`;
      params.push(`%${search}%`, `%${search}%`);
      paramCounter += 2;
    }

    // Filtro por tipo
    if (tipo && (tipo === "Persona" || tipo === "Establecimiento")) {
      baseQuery += ` AND p.tipo_perfil = $${paramCounter}`;
      params.push(tipo);
      paramCounter++;
    }

    // Ordenar y limitar
    baseQuery += ` ORDER BY p.created_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(limit, offset);

    const perfiles = await sql(baseQuery, params);

    // Contar total para paginación
    let countQuery = `
      SELECT COUNT(*) as total
      FROM perfiles p
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCounter = 1;

    if (search.trim()) {
      countQuery += ` AND (
        LOWER(p.nombre) LIKE LOWER($${countParamCounter})
        OR p.telefono LIKE $${countParamCounter + 1}
      )`;
      countParams.push(`%${search}%`, `%${search}%`);
      countParamCounter += 2;
    }

    if (tipo && (tipo === "Persona" || tipo === "Establecimiento")) {
      countQuery += ` AND p.tipo_perfil = $${countParamCounter}`;
      countParams.push(tipo);
    }

    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0]?.total || 0);

    return Response.json({
      perfiles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Crear perfil (POST)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      telefono,
      tipo_perfil,
      nombre,
      profile_picture_url,
      direccion,
      pais_id,
      ci,
      fecha_nac,
      nit,
    } = body;

    // Validaciones básicas
    if (!telefono || !tipo_perfil || !nombre) {
      return Response.json(
        { error: "Teléfono, tipo de perfil y nombre son obligatorios" },
        { status: 400 },
      );
    }

    if (!["Persona", "Establecimiento"].includes(tipo_perfil)) {
      return Response.json(
        { error: "Tipo de perfil debe ser 'Persona' o 'Establecimiento'" },
        { status: 400 },
      );
    }

    // Verificar que el teléfono no esté duplicado
    const existingProfile = await sql`
      SELECT id FROM perfiles WHERE telefono = ${telefono}
    `;

    if (existingProfile.length > 0) {
      return Response.json(
        { error: "Este número de teléfono ya está registrado" },
        { status: 409 },
      );
    }

    // Crear el perfil
    const nuevoPerfilResult = await sql`
      INSERT INTO perfiles (
        telefono,
        tipo_perfil,
        nombre,
        profile_picture_url,
        direccion,
        pais_id,
        ci,
        fecha_nac,
        nit,
        user_id
      )
      VALUES (
        ${telefono},
        ${tipo_perfil},
        ${nombre},
        ${profile_picture_url || null},
        ${direccion || null},
        ${pais_id || null},
        ${ci || null},
        ${fecha_nac || null},
        ${nit || null},
        ${session.user.id}
      )
      RETURNING *
    `;

    const nuevoPerfil = nuevoPerfilResult[0];

    return Response.json(
      {
        message: "Perfil creado exitosamente",
        perfil: nuevoPerfil,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
