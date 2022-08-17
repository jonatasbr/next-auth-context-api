import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { validateUserRolesPermissions } from '../utils/validateUserRolesPermissions';

export function useCan({ permissions, roles }) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidRolesPermissions = validateUserRolesPermissions({
    user,
    permissions, 
    roles 
  });

  return userHasValidRolesPermissions;
} 