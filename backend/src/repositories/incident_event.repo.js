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
    SELECT id, event_type, message, created_by, created_at
    FROM incident_events
    WHERE incident_id = $1
      AND organization_id = $2
    ORDER BY created_at ASC
    `,
    [incidentId, orgId]
  );
  return result.rows;
};

module.exports = {
  createEvent,
  getByIncidentId,
};
