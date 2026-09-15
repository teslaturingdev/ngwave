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
import { MenuDocPageComponent } from './pages/menu.page';
import { MegaMenuDocPageComponent } from './pages/mega-menu.page';
import { MenubarDocPageComponent } from './pages/menubar.page';
import { TreeTableDocPageComponent } from './pages/tree-table.page';
import { TieredMenuDocPageComponent } from './pages/tiered-menu.page';
import { ContextMenuDocPageComponent } from './pages/context-menu.page';
import { PanelMenuDocPageComponent } from './pages/panel-menu.page';
import { ConfirmPopupDocPageComponent } from './pages/confirm-popup.page';
import { InputDocPageComponent } from './pages/input.page';
import { InputGroupDocPageComponent } from './pages/input-group.page';
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
import { SelectButtonDocPageComponent } from './pages/select-button.page';
import { ProgressBarDocPageComponent } from './pages/progress-bar.page';
import { ToolbarDocPageComponent } from './pages/toolbar.page';
import { TooltipDocPageComponent } from './pages/tooltip.page';
import { ToggleButtonDocPageComponent } from './pages/toggle-button.page';
import { FileUploadDocPageComponent } from './pages/file-upload.page';
import { ListboxDocPageComponent } from './pages/listbox.page';
import { SplitButtonDocPageComponent } from './pages/split-button.page';
import { OverlayPanelDocPageComponent } from './pages/overlay-panel.page';
import { CascadeSelectDocPageComponent } from './pages/cascade-select.page';
import { ChartDocPageComponent } from './pages/chart.page';
import { SplitterDocPageComponent } from './pages/splitter.page';
import { TreeDocPageComponent } from './pages/tree.page';
import { TreeSelectDocPageComponent } from './pages/tree-select.page';
import { TimelineDocPageComponent } from './pages/timeline.page';
import { FloatLabelDocPageComponent } from './pages/float-label.page';
import { PasswordDocPageComponent } from './pages/password.page';
import { DataViewDocPageComponent } from './pages/data-view.page';
import { PickListDocPageComponent } from './pages/pick-list.page';
import { OrderListDocPageComponent } from './pages/order-list.page';

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
  { path: 'components/input-group', component: InputGroupDocPageComponent },
  { path: 'components/dialog', component: DialogPageComponent },
  { path: 'components/toast', component: ToastPageComponent },
  { path: 'components/message', component: MessageDocPageComponent },
  { path: 'components/menu', component: MenuDocPageComponent },
  { path: 'components/mega-menu', component: MegaMenuDocPageComponent },
  { path: 'components/menubar', component: MenubarDocPageComponent },
  { path: 'components/tree-table', component: TreeTableDocPageComponent },
  { path: 'components/tiered-menu', component: TieredMenuDocPageComponent },
  { path: 'components/context-menu', component: ContextMenuDocPageComponent },
  { path: 'components/panel-menu', component: PanelMenuDocPageComponent },
  { path: 'components/confirm-popup', component: ConfirmPopupDocPageComponent },
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
  { path: 'components/select-button', component: SelectButtonDocPageComponent },
  { path: 'components/progress-bar', component: ProgressBarDocPageComponent },
  { path: 'components/toolbar', component: ToolbarDocPageComponent },
  { path: 'components/tooltip', component: TooltipDocPageComponent },
  { path: 'components/toggle-button', component: ToggleButtonDocPageComponent },
  { path: 'components/file-upload', component: FileUploadDocPageComponent },
  { path: 'components/listbox', component: ListboxDocPageComponent },
  { path: 'components/split-button', component: SplitButtonDocPageComponent },
  { path: 'components/overlay-panel', component: OverlayPanelDocPageComponent },
  { path: 'components/cascade-select', component: CascadeSelectDocPageComponent },
  { path: 'components/chart', component: ChartDocPageComponent },
  { path: 'components/splitter', component: SplitterDocPageComponent },
  { path: 'components/tree', component: TreeDocPageComponent },
  { path: 'components/tree-select', component: TreeSelectDocPageComponent },
  { path: 'components/timeline', component: TimelineDocPageComponent },
  { path: 'components/float-label', component: FloatLabelDocPageComponent },
  { path: 'components/password', component: PasswordDocPageComponent },
  { path: 'components/data-view', component: DataViewDocPageComponent },
  { path: 'components/pick-list', component: PickListDocPageComponent },
  { path: 'components/order-list', component: OrderListDocPageComponent },
  { path: '**', redirectTo: '' },
];
