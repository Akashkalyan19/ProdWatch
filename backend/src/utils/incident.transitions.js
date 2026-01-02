const INCIDENT_TRANSITIONS = {
  open: ["investigating"],
  investigating: ["mitigated", "resolved"],
  mitigated: ["resolved", "investigating"],
  resolved: [],
};

const isValidTransition = (currentStatus, newStatus) => {
  const allowed = INCIDENT_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
};

module.exports = {
  INCIDENT_TRANSITIONS,
  isValidTransition,
};
