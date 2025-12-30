CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    incident_id UUID REFERENCES incidents(id),
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('release', 'hotfix', 'rollback', 'config_change')),
    description TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
