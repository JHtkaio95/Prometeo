import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';

export const panelGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loged = sessionStorage.getItem("token_Data");

  if(loged){
    return true;
  } else {
    window.alert("Inicia sesión o Registrate con nosotros.");
    router.navigate(['/auth']);
    return false;
  }

};
