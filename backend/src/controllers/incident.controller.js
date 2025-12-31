const incService = require("../services/incident.services");

const getAllInc = async (req, res, next) => {
  try {
    const incidents = await incService.getAllInc(req.user);
    res.status(200).json(incidents);
  } catch (err) {
    next(err);
  }
};

const getIncById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await incService.getIncById(req.user, id);
    res.status(200).json(incident);
  } catch (err) {
    next(err);
  }
};

const createInc = async (req, res, next) => {
  try {
    const incident = await incService.createInc(req.user, req.body);
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
};

const updateInc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const updated = await incService.updateInc(req.user, id, status, message);

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllInc,
  getIncById,
  createInc,
  updateInc,
};
