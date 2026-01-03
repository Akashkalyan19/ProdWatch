const pool = require("../db/pool");

const getOrgAudits = async (orgId) => {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.table_name,
      a.record_id,
      a.action,
      a.old_values,
      a.new_values,
      a.changed_at,

      u.id AS actor_id,
      u.name AS actor_name,
      u.email AS actor_email,

      i.title AS incident_title

    FROM audit_logs a
    LEFT JOIN users u
      ON a.changed_by = u.id

    LEFT JOIN incidents i
      ON a.table_name = 'incidents'
     AND a.record_id = i.id

    WHERE u.organization_id = $1
    ORDER BY a.changed_at DESC
    LIMIT 100
    `,
    [orgId]
  );

  return result.rows;
};

module.exports = {
  getOrgAudits,
};
