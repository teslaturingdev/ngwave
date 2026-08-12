import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  protected readonly theme = inject(ThemeService);
  protected readonly components: NavItem[] = [
    { label: 'Button', path: '/components/button' },
    { label: 'DataTable', path: '/components/data-table' },
    { label: 'Dropdown', path: '/components/dropdown' },
    { label: 'Autocomplete', path: '/components/autocomplete' },
    { label: 'Form Inputs', path: '/components/input' },
    { label: 'Dialog', path: '/components/dialog' },
    { label: 'Toast', path: '/components/toast' },
    { label: 'Tabs', path: '/components/tabs' },
    { label: 'Checkbox & Radio', path: '/components/checkbox' },
    { label: 'Spinner & Skeleton', path: '/components/spinner' },
  ];
}
