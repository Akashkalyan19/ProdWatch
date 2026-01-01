const incRepo = require("../repositories/incident.repo");
const { isValidTransition } = require("../utils/incident.transitions");
const incEventRepo = require("../repositories/incident_event.repo");

const requiresMessage = (fromStatus, toStatus) => {
  return (
    (fromStatus === "investigating" && toStatus === "mitigated") ||
    (fromStatus === "mitigated" && toStatus === "resolved")
  );
};

const getAllInc = async (user) => {
  return await incRepo.getAllInc(user.organization_id);
};

const getIncById = async (user, id) => {
  const incident = await incRepo.getIncById(user.organization_id, id);

  if (!incident) {
    throw new Error("Incident not found");
  }

  return incident;
};
const createInc = async (user, data) => {
  const { title, description } = data;

  if (!title || !description) {
    throw new Error("Missing required fields");
  }

  const incident = await incRepo.createInc({
    organization_id: user.organization_id,
    created_by: user.id,
    title,
    description,
  });

  // INCIDENT CREATED EVENT
  await incEventRepo.createEvent({
    incident_id: incident.id,
    organization_id: user.organization_id,
    event_type: "incident_created",
    created_by: user.id,
  });

  return incident;
};

const getIncidentEvents = async (user, incidentId) => {
  return await incEventRepo.getByIncidentId(user.organization_id, incidentId);
};

const updateInc = async (user, id, newStatus, message) => {
  const incident = await incRepo.getIncById(user.organization_id, id);

  if (!incident) {
    throw new Error("Incident not found");
  }

  if (!isValidTransition(incident.status, newStatus)) {
    throw new Error(
      `Invalid status transition from '${incident.status}' to '${newStatus}'`
    );
  }

  // 🔒 MESSAGE VALIDATION
  if (requiresMessage(incident.status, newStatus)) {
    if (!message || message.trim().length < 5) {
      throw new Error("A short explanation is required for this status change");
    }
  }

  const updatedIncident = await incRepo.updateIncStatus(
    user.organization_id,
    id,
    newStatus,
    user.id
  );

  // 🧾 INCIDENT EVENT WITH MESSAGE
  await incEventRepo.createEvent({
    incident_id: incident.id,
    organization_id: user.organization_id,
    event_type: `status_${newStatus}`,
    created_by: user.id,
    message: message || null,
  });

  return updatedIncident;
};

const addMessage = async (user, incidentId, message) => {
  if (!message || message.trim().length < 5) {
    throw new Error("Message must be at least 5 characters long");
  }

  const incident = await incRepo.getIncById(user.organization_id, incidentId);

  if (!incident) {
    throw new Error("Incident not found");
  }

  return await incEventRepo.createEvent({
    incident_id: incidentId,
    organization_id: user.organization_id,
    event_type: "note_added",
    created_by: user.id,
    message: message.trim(),
  });
};

module.exports = {
  getAllInc,
  getIncById,
  createInc,
  updateInc,
  addMessage,
  getIncidentEvents,
};
