import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const panelAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const admin = JSON.parse(sessionStorage.getItem("USER_Data") || "{}");

  if(admin.role === "administrador") {
    return true;
  } else {
    return false;
  }

};
