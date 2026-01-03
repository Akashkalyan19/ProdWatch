const auditRepo = require("../repositories/audit.repo");

const getOrgAudits = async (orgId) => {
  const audits = await auditRepo.getOrgAudits(orgId);
  return audits;
};

module.exports = {
  getOrgAudits,
};
