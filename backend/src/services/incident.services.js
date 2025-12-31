const incRepo = require("../repositories/incident.repo");
const { isValidTransition } = require("../utils/incident.transitions");
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

  return await incRepo.createInc({
    organization_id: user.organization_id,
    created_by: user.id,
    title,
    description,
  });
};

const updateInc = async (user, id, newStatus) => {
  const incident = await incRepo.getIncById(user.organization_id, id);

  if (!incident) {
    throw new Error("Incident not found");
  }

  if (!isValidTransition(incident.status, newStatus)) {
    throw new Error(
      `Invalid status transition from '${incident.status}' to '${newStatus}'`
    );
  }

  return await incRepo.updateIncStatus(user.organization_id, id, newStatus);
};
module.exports = {
  getAllInc,
  getIncById,
  createInc,
  updateInc,
};
