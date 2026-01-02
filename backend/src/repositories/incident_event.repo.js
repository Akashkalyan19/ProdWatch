const pool = require("../db/pool");

const createEvent = async ({
  incident_id,
  organization_id,
  event_type,
  created_by,
  message = null,
}) => {
  const result = await pool.query(
    `
    INSERT INTO incident_events (
      incident_id,
      organization_id,
      event_type,
      created_by,
      message
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [incident_id, organization_id, event_type, created_by, message]
  );

  return result.rows[0];
};
const getByIncidentId = async (orgId, incidentId) => {
  const result = await pool.query(
    `
    SELECT
      ie.id,
      ie.event_type,
      ie.message,
      ie.created_at,

      u.id    AS actor_id,
      u.name  AS actor_name,
      u.email AS actor_email

    FROM incident_events ie
    JOIN users u
      ON ie.created_by = u.id

    WHERE ie.incident_id = $1
      AND ie.organization_id = $2

    ORDER BY ie.created_at ASC
    `,
    [incidentId, orgId]
  );

  return result.rows;
};

module.exports = {
  createEvent,
  getByIncidentId,
};
