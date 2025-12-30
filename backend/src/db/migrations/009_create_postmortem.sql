CREATE TABLE postmortems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL UNIQUE REFERENCES incidents(id),
    summary TEXT NOT NULL,
    root_cause TEXT NOT NULL,
    impact TEXT NOT NULL,
    resolution TEXT NOT NULL,
    lessons_learned TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
