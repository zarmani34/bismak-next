export const getEquipmentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-primary/20 text-primary";
    case "in_use":
      return "bg-info/20 text-info";
    case "under_maintenance":
      return "bg-secondary/20 text-secondary";
    case "retired":
      return "bg-error/20 text-error";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};

export const getRequestStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-primary/20 text-primary";
    case "pending":
      return "bg-secondary/20 text-secondary";
    case "rejected":
      return "bg-error/20 text-error";
    case "returned":
      return "bg-info/20 text-info";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};