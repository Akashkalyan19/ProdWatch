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

module.exports = {
  createEvent,
};
