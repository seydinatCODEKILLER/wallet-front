import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  //   // --- Authentification ---
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // --- Espace Client ---
  {
    path: 'client',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/client-layout/client-layout.component').then((m) => m.ClientLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/client/dashboard-client/dashboard-client.component').then(
            (m) => m.DashboardClientComponent,
          ),
      },
      {
        path: 'virement',
        loadComponent: () =>
          import('./features/client/virement/virement.component').then((m) => m.VirementComponent),
      },
      {
        path: 'prets',
        loadComponent: () =>
          import('./features/client/prets/liste-prets/liste-prets.component').then(
            (m) => m.ListePretsComponent,
          ),
      },
      {
        path: 'prets/nouvelle-demande',
        loadComponent: () =>
          import('./features/client/prets/nouvelle-demande/nouvelle-demande.component').then(
            (m) => m.NouvelleDemandeComponent,
          ),
      },
      {
        path: 'prets/:id',
        loadComponent: () =>
          import('./features/client/prets/detail-pret/detail-pret.component').then(
            (m) => m.DetailPretComponent,
          ),
      },
      {
        path: 'historique',
        loadComponent: () =>
          import('./features/client/historique/historique.component').then(
            (m) => m.HistoriqueComponent,
          ),
      },
    ],
  },

  //   // --- Espace Admin ---
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard-admin/dashboard-admin.component').then(
            (m) => m.DashboardAdminComponent,
          ),
      },
      // {
      //   path: 'utilisateurs',
      //   loadComponent: () =>
      //     import('./features/admin/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent)
      // },
      {
        path: 'prets-en-attente',
        loadComponent: () =>
          import('./features/admin/prets-en-attente/prets-en-attente.component').then(
            (m) => m.PretsEnAttenteComponent,
          ),
      },
    ],
  },

  //   // --- Erreurs ---
  //   {
  //     path: 'acces-refuse',
  //     loadComponent: () =>
  //       import('./shared/components/acces-refuse/acces-refuse.component').then(m => m.AccesRefuseComponent)
  //   },
  {
    path: '**',
    redirectTo: 'login',
  },
];
