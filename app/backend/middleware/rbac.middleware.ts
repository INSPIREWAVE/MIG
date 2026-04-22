export const authorizeRoles = (allowedRoles: string[]) => {
  return (userRole: string) => allowedRoles.includes(userRole);
};
