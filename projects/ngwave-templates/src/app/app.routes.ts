import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/gallery.page').then((m) => m.GalleryPageComponent),
  },
  {
    path: 'landing-page',
    loadComponent: () =>
      import('./landing-page/landing-page.page').then((m) => m.LandingPageTemplateComponent),
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.page').then(
        (m) => m.AdminDashboardTemplateComponent,
      ),
  },
  {
    path: 'admin-users',
    loadComponent: () =>
      import('./admin-users/admin-users.page').then((m) => m.AdminUsersTemplateComponent),
  },
  {
    path: 'admin-files',
    loadComponent: () =>
      import('./admin-files/admin-files.page').then((m) => m.AdminFilesTemplateComponent),
  },
  { path: '**', redirectTo: '' },
];
