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
import { MessageDocPageComponent } from './pages/message.page';
import { InputDocPageComponent } from './pages/input.page';
import { AutocompleteDocPageComponent } from './pages/autocomplete.page';
import { ChangelogPageComponent } from './pages/changelog.page';
import { DividerDocPageComponent } from './pages/divider.page';
import { AvatarDocPageComponent } from './pages/avatar.page';
import { BadgeDocPageComponent } from './pages/badge.page';
import { TagDocPageComponent } from './pages/tag.page';
import { ChipDocPageComponent } from './pages/chip.page';
import { FieldsetDocPageComponent } from './pages/fieldset.page';
import { PanelDocPageComponent } from './pages/panel.page';
import { CardDocPageComponent } from './pages/card.page';
import { AccordionDocPageComponent } from './pages/accordion.page';
import { StepsDocPageComponent } from './pages/steps.page';
import { SliderDocPageComponent } from './pages/slider.page';
import { RatingDocPageComponent } from './pages/rating.page';
import { FileUploadDocPageComponent } from './pages/file-upload.page';
import { ListboxDocPageComponent } from './pages/listbox.page';
import { SplitButtonDocPageComponent } from './pages/split-button.page';
import { OverlayPanelDocPageComponent } from './pages/overlay-panel.page';
import { CascadeSelectDocPageComponent } from './pages/cascade-select.page';
import { SplitterDocPageComponent } from './pages/splitter.page';
import { TreeDocPageComponent } from './pages/tree.page';
import { TreeSelectDocPageComponent } from './pages/tree-select.page';
import { TimelineDocPageComponent } from './pages/timeline.page';

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
  { path: 'components/message', component: MessageDocPageComponent },
  { path: 'components/tabs', component: TabsDocPageComponent },
  { path: 'components/checkbox', component: CheckboxDocPageComponent },
  { path: 'components/spinner', component: SpinnerDocPageComponent },
  { path: 'components/card', component: CardDocPageComponent },
  { path: 'components/panel', component: PanelDocPageComponent },
  { path: 'components/fieldset', component: FieldsetDocPageComponent },
  { path: 'components/tag', component: TagDocPageComponent },
  { path: 'components/chip', component: ChipDocPageComponent },
  { path: 'components/avatar', component: AvatarDocPageComponent },
  { path: 'components/badge', component: BadgeDocPageComponent },
  { path: 'components/divider', component: DividerDocPageComponent },
  { path: 'components/accordion', component: AccordionDocPageComponent },
  { path: 'components/steps', component: StepsDocPageComponent },
  { path: 'components/slider', component: SliderDocPageComponent },
  { path: 'components/rating', component: RatingDocPageComponent },
  { path: 'components/file-upload', component: FileUploadDocPageComponent },
  { path: 'components/listbox', component: ListboxDocPageComponent },
  { path: 'components/split-button', component: SplitButtonDocPageComponent },
  { path: 'components/overlay-panel', component: OverlayPanelDocPageComponent },
  { path: 'components/cascade-select', component: CascadeSelectDocPageComponent },
  { path: 'components/splitter', component: SplitterDocPageComponent },
  { path: 'components/tree', component: TreeDocPageComponent },
  { path: 'components/tree-select', component: TreeSelectDocPageComponent },
  { path: 'components/timeline', component: TimelineDocPageComponent },
  { path: '**', redirectTo: '' },
];
