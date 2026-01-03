const auditService = require("../services/audit.service.js");

const getAudits = async (req, res, next) => {
  try {
    const orgId = req.user.organization_id;

    const audits = await auditService.getOrgAudits(orgId);
    res.json(audits);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAudits,
};
