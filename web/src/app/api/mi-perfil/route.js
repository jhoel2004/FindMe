import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Obtener mi perfil (GET)
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const perfiles = await sql`
      SELECT 
        p.id,
        p.telefono,
        p.tipo_perfil,
        p.nombre,
        p.profile_picture_url,
        p.direccion,
        p.pais_id,
        p.ci,
        p.fecha_nac,
        p.nit,
        pa.nombre_pais,
        pa.codigo_pais
      FROM perfiles p
      LEFT JOIN paises pa ON p.pais_id = pa.id
      WHERE p.user_id = ${session.user.id}
    `;

    return Response.json({ perfil: perfiles[0] || null });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// Actualizar mi perfil (PUT)
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario tenga un perfil
    const perfilExistente = await sql`
      SELECT id FROM perfiles WHERE user_id = ${session.user.id}
    `;

    if (perfilExistente.length === 0) {
      return Response.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const {
      telefono,
      nombre,
      profile_picture_url,
      direccion,
      pais_id,
      ci,
      fecha_nac,
      nit,
    } = body;

    // Construir campos a actualizar
    const setClauses = [];
    const values = [];
    let paramCounter = 1;

    if (telefono !== undefined) {
      // Verificar que el teléfono no esté duplicado por otro perfil
      const telefonoDuplicado = await sql`
        SELECT id FROM perfiles 
        WHERE telefono = ${telefono} 
        AND user_id != ${session.user.id}
      `;

      if (telefonoDuplicado.length > 0) {
        return Response.json(
          {
            error:
              "Este número de teléfono ya está registrado por otro usuario",
          },
          { status: 409 },
        );
      }

      setClauses.push(`telefono = $${paramCounter}`);
      values.push(telefono);
      paramCounter++;
    }

    if (nombre !== undefined) {
      setClauses.push(`nombre = $${paramCounter}`);
      values.push(nombre);
      paramCounter++;
    }

    if (profile_picture_url !== undefined) {
      setClauses.push(`profile_picture_url = $${paramCounter}`);
      values.push(profile_picture_url || null);
      paramCounter++;
    }

    if (direccion !== undefined) {
      setClauses.push(`direccion = $${paramCounter}`);
      values.push(direccion || null);
      paramCounter++;
    }

    if (pais_id !== undefined) {
      setClauses.push(`pais_id = $${paramCounter}`);
      values.push(pais_id || null);
      paramCounter++;
    }

    if (ci !== undefined) {
      setClauses.push(`ci = $${paramCounter}`);
      values.push(ci || null);
      paramCounter++;
    }

    if (fecha_nac !== undefined) {
      setClauses.push(`fecha_nac = $${paramCounter}`);
      values.push(fecha_nac || null);
      paramCounter++;
    }

    if (nit !== undefined) {
      setClauses.push(`nit = $${paramCounter}`);
      values.push(nit || null);
      paramCounter++;
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 },
      );
    }

    setClauses.push(`updated_at = $${paramCounter}`);
    values.push(new Date());
    paramCounter++;

    const updateQuery = `
      UPDATE perfiles 
      SET ${setClauses.join(", ")} 
      WHERE user_id = $${paramCounter}
      RETURNING *
    `;
    values.push(session.user.id);

    const perfilActualizado = await sql(updateQuery, values);

    return Response.json({
      message: "Perfil actualizado exitosamente",
      perfil: perfilActualizado[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
