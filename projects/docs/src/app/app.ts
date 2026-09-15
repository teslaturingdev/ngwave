import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
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
  protected readonly auth = inject(AuthService);
  protected readonly components: NavItem[] = [
    { label: 'Button', path: '/components/button' },
    { label: 'DataTable', path: '/components/data-table' },
    { label: 'Dropdown', path: '/components/dropdown' },
    { label: 'Autocomplete', path: '/components/autocomplete' },
    { label: 'Form Inputs', path: '/components/input' },
    { label: 'Dialog', path: '/components/dialog' },
    { label: 'Toast', path: '/components/toast' },
    { label: 'Message', path: '/components/message' },
    { label: 'Tabs', path: '/components/tabs' },
    { label: 'Checkbox & Radio', path: '/components/checkbox' },
    { label: 'Spinner & Skeleton', path: '/components/spinner' },
    { label: 'Card', path: '/components/card' },
    { label: 'Panel', path: '/components/panel' },
    { label: 'Fieldset', path: '/components/fieldset' },
    { label: 'Tag', path: '/components/tag' },
    { label: 'Chip', path: '/components/chip' },
    { label: 'Avatar', path: '/components/avatar' },
    { label: 'Badge', path: '/components/badge' },
    { label: 'Divider', path: '/components/divider' },
    { label: 'Accordion', path: '/components/accordion' },
    { label: 'Steps', path: '/components/steps' },
    { label: 'Slider', path: '/components/slider' },
    { label: 'Rating', path: '/components/rating' },
    { label: 'File Upload', path: '/components/file-upload' },
    { label: 'Listbox', path: '/components/listbox' },
    { label: 'Split Button', path: '/components/split-button' },
    { label: 'Overlay Panel', path: '/components/overlay-panel' },
    { label: 'Cascade Select', path: '/components/cascade-select' },
    { label: 'Chart', path: '/components/chart' },
    { label: 'Splitter', path: '/components/splitter' },
    { label: 'Tree', path: '/components/tree' },
    { label: 'Tree Select', path: '/components/tree-select' },
    { label: 'Timeline', path: '/components/timeline' },
    { label: 'Float Label', path: '/components/float-label' },
    { label: 'Password', path: '/components/password' },
  ];
}
