import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { panelGuard } from './guards/panel.guard';
import { PrevisorComponent } from './components/previsor/previsor.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {
        path: 'auth',
        loadComponent: () =>
            import('./pages/auth/auth.component')
                .then(m => m.AuthComponent),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./components/login/login.component')
                        .then(m => m.LoginComponent)
            },
            {
                path: 'registerUser',
                loadComponent: () =>
                    import('./components/register/register.component')
                        .then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: 'verificar/:hash',
        loadComponent: () =>
            import('./components/verificarqr/verificarqr.component')
                .then(m => m.VerificarqrComponent)
    },
    {path: 'previsor', component:PrevisorComponent},
    {
        path: 'panel',
        canActivate:[panelGuard],
        loadComponent: () =>
          import('./pages/panel-usuario/panel-usuario.component')
            .then(m => m.PanelUsuarioComponent),
        children: [
            {
                path: '',
                redirectTo: 'visor-dt',
                pathMatch: 'full'
            },
            {
                path: 'visor-dt',
                loadComponent: () =>
                    import('./pages/visor-dt/visor-dt.component')
                        .then(m => m.VisorDTComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'datos-empresa',
                        pathMatch: 'full'
                    },
                    {
                        path: 'datos-empresa',
                        loadComponent: () =>
                            import('./components/datos-empresa/datos-empresa.component')
                                .then(m => m.DatosEmpresaComponent)
                    },
                    {
                        path: 'tarifas',
                        loadComponent: () =>
                            import('./components/tarifas/tarifas.component')
                                .then(m => m.TarifasComponent)
                    }
                ]

            },
            {
                path: 'visor-fg',
                loadComponent: () =>
                    import('./pages/visor-fg/visor-fg.component')
                        .then(m => m.VisorFGComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'facturacion',
                        pathMatch: 'full'
                    },
                    {
                        path: 'facturacion',
                        loadComponent: () =>
                            import('./components/facturacion/facturacion.component')
                                .then(m => m.FacturacionComponent)
                    },
                    {
                        path: 'cargarFactura',
                        loadComponent: () =>
                            import('./components/cargar-factura/cargar-factura.component')
                                .then(m => m.CargarFacturaComponent)
                    }
                ]
            },
            {
                path: 'visor-rg',
                loadComponent: () =>
                    import('./pages/visor-rg/visor-rg.component')
                        .then(m => m.VisorRGComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'registro',
                        pathMatch: 'full'
                    },
                    {
                        path: 'registro',
                        loadComponent: () =>
                            import('./components/registro-facturas/registro-facturas.component')
                                .then(m => m.RegistroFacturasComponent)
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
