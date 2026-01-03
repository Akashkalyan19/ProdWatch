CREATE OR REPLACE FUNCTION log_incident_audit()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      table_name,
      record_id,
      action,
      new_values,
      changed_by,
      changed_at
    )
    VALUES (
      TG_TABLE_NAME,
      NEW.id,  -- ✅ ALWAYS incidents.id
      TG_OP,
      to_jsonb(NEW),
      current_setting('app.current_user_id', true)::uuid,
      NOW()
    );
    RETURN NEW;
  END IF;

  -- UPDATE
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
      NEW.id,  -- ✅ FIXED (this was the bug)
      TG_OP,
      to_jsonb(OLD),
      to_jsonb(NEW),
      current_setting('app.current_user_id', true)::uuid,
      NOW()
    );
    RETURN NEW;
  END IF;

  -- DELETE
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      table_name,
      record_id,
      action,
      old_values,
      changed_by,
      changed_at
    )
    VALUES (
      TG_TABLE_NAME,
      OLD.id,  -- ✅ DELETE uses OLD
      TG_OP,
      to_jsonb(OLD),
      current_setting('app.current_user_id', true)::uuid,
      NOW()
    );
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS incident_audit_trigger ON incidents;

CREATE TRIGGER incident_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON incidents
FOR EACH ROW
EXECUTE FUNCTION log_incident_audit();
