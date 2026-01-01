CREATE OR REPLACE FUNCTION log_incident_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      table_name,
      record_id,
      action,
      old_values,
      new_values,
      changed_by,
      changed_at
    )
    VALUES (
      TG_TABLE_NAME,
      OLD.id,
      TG_OP,
      to_jsonb(OLD),
      to_jsonb(NEW),
      current_setting('app.current_user_id', true)::uuid,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incident_audit_trigger
AFTER UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION log_incident_audit();

