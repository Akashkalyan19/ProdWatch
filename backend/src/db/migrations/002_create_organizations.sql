CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    join_code INTEGER NOT NULL DEFAULT (FLOOR(100000 + RANDOM() * 900000)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX organizations_name_unique_ci
ON organizations (LOWER(name));
