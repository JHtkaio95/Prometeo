import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PanelUsuarioComponent } from './pages/panel-usuario/panel-usuario.component';
import { panelGuard } from './guards/panel.guard';
import { PrevisorComponent } from './components/previsor/previsor.component';

export const routes: Routes = [
    {path: "", component:HomeComponent},
    {path: "auth", component:AuthComponent},
    {path: "panel", component:PanelUsuarioComponent, canActivate:[panelGuard]},
    {path: "previsor", component:PrevisorComponent}
];
