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
  {
    path: 'ui-blocks',
    loadComponent: () =>
      import('./ui-blocks/ui-blocks-gallery.page').then((m) => m.UiBlocksGalleryPageComponent),
  },
  {
    path: 'ui-blocks/login',
    loadComponent: () => import('./ui-blocks/auth/login.page').then((m) => m.LoginBlockPageComponent),
  },
  {
    path: 'ui-blocks/signup',
    loadComponent: () => import('./ui-blocks/auth/signup.page').then((m) => m.SignupBlockPageComponent),
  },
  {
    path: 'ui-blocks/forgot-password',
    loadComponent: () =>
      import('./ui-blocks/auth/forgot-password.page').then((m) => m.ForgotPasswordBlockPageComponent),
  },
  {
    path: 'ui-blocks/reset-password',
    loadComponent: () =>
      import('./ui-blocks/auth/reset-password.page').then((m) => m.ResetPasswordBlockPageComponent),
  },
  {
    path: 'ui-blocks/otp-verification',
    loadComponent: () =>
      import('./ui-blocks/auth/otp-verification.page').then((m) => m.OtpVerificationBlockPageComponent),
  },
  {
    path: 'ui-blocks/404',
    loadComponent: () => import('./ui-blocks/errors/not-found.page').then((m) => m.NotFoundBlockPageComponent),
  },
  {
    path: 'ui-blocks/maintenance',
    loadComponent: () =>
      import('./ui-blocks/errors/maintenance.page').then((m) => m.MaintenanceBlockPageComponent),
  },
  {
    path: 'ui-blocks/empty-state',
    loadComponent: () =>
      import('./ui-blocks/errors/empty-state.page').then((m) => m.EmptyStateBlockPageComponent),
  },
  {
    path: 'ui-blocks/stat-cards',
    loadComponent: () => import('./ui-blocks/widgets/stat-cards.page').then((m) => m.StatCardsBlockPageComponent),
  },
  {
    path: 'ui-blocks/notification-panel',
    loadComponent: () =>
      import('./ui-blocks/widgets/notification-panel.page').then((m) => m.NotificationPanelBlockPageComponent),
  },
  {
    path: 'ui-blocks/activity-timeline',
    loadComponent: () =>
      import('./ui-blocks/widgets/activity-timeline.page').then((m) => m.ActivityTimelineBlockPageComponent),
  },
  {
    path: 'ui-blocks/onboarding-checklist',
    loadComponent: () =>
      import('./ui-blocks/widgets/onboarding-checklist.page').then(
        (m) => m.OnboardingChecklistBlockPageComponent,
      ),
  },
  {
    path: 'ui-blocks/team-members-grid',
    loadComponent: () =>
      import('./ui-blocks/widgets/team-members-grid.page').then((m) => m.TeamMembersGridBlockPageComponent),
  },
  {
    path: 'ui-blocks/search-autocomplete',
    loadComponent: () =>
      import('./ui-blocks/search/search-autocomplete.page').then(
        (m) => m.SearchAutocompleteBlockPageComponent,
      ),
  },
  {
    path: 'ui-blocks/search-results',
    loadComponent: () =>
      import('./ui-blocks/search/search-results.page').then((m) => m.SearchResultsBlockPageComponent),
  },
  {
    path: 'ui-blocks/profile-dropdown',
    loadComponent: () =>
      import('./ui-blocks/navigation/profile-dropdown.page').then((m) => m.ProfileDropdownBlockPageComponent),
  },
  {
    path: 'ui-blocks/collapsible-sidebar',
    loadComponent: () =>
      import('./ui-blocks/navigation/collapsible-sidebar.page').then(
        (m) => m.CollapsibleSidebarBlockPageComponent,
      ),
  },
  {
    path: 'ui-blocks/command-palette',
    loadComponent: () =>
      import('./ui-blocks/navigation/command-palette.page').then((m) => m.CommandPaletteBlockPageComponent),
  },
  {
    path: 'ui-blocks/table-toolbar',
    loadComponent: () =>
      import('./ui-blocks/navigation/table-toolbar.page').then((m) => m.TableToolbarBlockPageComponent),
  },
  {
    path: 'ui-blocks/pricing-section',
    loadComponent: () =>
      import('./ui-blocks/pricing/pricing-section.page').then((m) => m.PricingSectionBlockPageComponent),
  },
  {
    path: 'ui-blocks/invite-member-modal',
    loadComponent: () =>
      import('./ui-blocks/modals/invite-member-modal.page').then(
        (m) => m.InviteMemberModalBlockPageComponent,
      ),
  },
  {
    path: 'ui-blocks/delete-confirmation',
    loadComponent: () =>
      import('./ui-blocks/modals/delete-confirmation-modal.page').then(
        (m) => m.DeleteConfirmationModalBlockPageComponent,
      ),
  },
  {
    path: 'ui-blocks/settings-page',
    loadComponent: () =>
      import('./ui-blocks/settings/settings-page.page').then((m) => m.SettingsPageBlockPageComponent),
  },
  { path: '**', redirectTo: '' },
];
