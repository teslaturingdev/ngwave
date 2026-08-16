import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './pages/home.component';
import { ButtonPageComponent } from './pages/button.page';
import { DataTablePageComponent } from './pages/data-table.page';
import { DialogPageComponent } from './pages/dialog.page';
import { DropdownPageComponent } from './pages/dropdown.page';
import { CheckboxDocPageComponent } from './pages/checkbox.page';
import { SpinnerDocPageComponent } from './pages/spinner.page';
import { TabsDocPageComponent } from './pages/tabs.page';
import { ToastPageComponent } from './pages/toast.page';
import { InputDocPageComponent } from './pages/input.page';
import { AutocompleteDocPageComponent } from './pages/autocomplete.page';
import { ChangelogPageComponent } from './pages/changelog.page';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'migrate',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/migrate.page').then((m) => m.MigratePageComponent),
  },
  {
    path: 'migrate/ai',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/migrate-ai.page').then((m) => m.MigrateAiPageComponent),
  },
  {
    path: 'migrate/report',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/migrate-report.page').then((m) => m.MigrateReportPageComponent),
  },
  {
    path: 'migrate/project',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/migrate-project.page').then((m) => m.MigrateProjectPageComponent),
  },
  {
    path: 'migrate/library',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/migrate-library.page').then((m) => m.MigrateLibraryPageComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard.page').then((m) => m.DashboardPageComponent),
  },
  { path: 'changelog', component: ChangelogPageComponent },
  { path: 'components/button', component: ButtonPageComponent },
  { path: 'components/data-table', component: DataTablePageComponent },
  { path: 'components/dropdown', component: DropdownPageComponent },
  { path: 'components/autocomplete', component: AutocompleteDocPageComponent },
  { path: 'components/input', component: InputDocPageComponent },
  { path: 'components/dialog', component: DialogPageComponent },
  { path: 'components/toast', component: ToastPageComponent },
  { path: 'components/tabs', component: TabsDocPageComponent },
  { path: 'components/checkbox', component: CheckboxDocPageComponent },
  { path: 'components/spinner', component: SpinnerDocPageComponent },
  { path: '**', redirectTo: '' },
];
