import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';

export const panelGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loged = localStorage.getItem('loged');

  if(loged === 'true'){
    return true;
  } else {
    //window.alert("Acceso denegado, hay que estar loggeado para acceder al panel");
    //router.navigate(['/']);
    return true;
  }

};
