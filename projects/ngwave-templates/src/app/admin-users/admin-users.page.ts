import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  NW_NUMERIC_MATCH_MODES,
  NW_TEXT_MATCH_MODES,
  NwAvatarComponent,
  NwButtonComponent,
  NwCardComponent,
  NwCheckboxComponent,
  NwColumn,
  NwColumnTemplateDirective,
  NwContextMenuSelectEvent,
  NwDataTableComponent,
  NwDialogComponent,
  NwDropdownComponent,
  NwFilterMeta,
  NwInputTextComponent,
  NwMenuItem,
  NwRowExpansionDirective,
  NwTabComponent,
  NwTableLazyLoadEvent,
  NwTabsComponent,
  NwTagComponent,
} from '@ngwave/ui';
import { AdminShellComponent } from '../admin-dashboard/admin-shell.component';

interface User extends Record<string, unknown> {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  department: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Invited' | 'Suspended';
  location: string;
  salary: number;
  joinDate: string;
  lastActive: string;
  bio: string;
}

type TableMode = 'full' | 'lazy' | 'virtual';

interface ModeOption {
  label: string;
  value: TableMode;
}

@Component({
  selector: 'app-admin-users-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AdminShellComponent,
    NwButtonComponent,
    NwTagComponent,
    NwAvatarComponent,
    NwDataTableComponent,
    NwColumnTemplateDirective,
    NwRowExpansionDirective,
    NwDialogComponent,
    NwDropdownComponent,
    NwInputTextComponent,
    NwCheckboxComponent,
    NwCardComponent,
    NwTabsComponent,
    NwTabComponent,
  ],
  template: `
    <app-admin-shell pageTitle="Users" pageSubtitle="Manage who has access to Northwind.">
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <nw-input-text placeholder="Search members…" [iconLeft]="'⌕'" class="w-64" />
            <nw-dropdown [options]="roleOptions" placeholder="All roles" [clearable]="true" class="w-40" />
          </div>
          <nw-button variant="primary" label="+ Invite member" (click)="inviteOpen.set(true)" />
        </div>

        <nw-tabs>
          <nw-tab header="Members">
            <div class="space-y-4">
              <!-- Mode + feature toggles -->
              <nw-card>
                <div class="flex flex-wrap items-center gap-6">
                  <div>
                    <label class="block text-xs font-medium text-surface-500 mb-1">Table mode</label>
                    <nw-dropdown [options]="modeOptions" [(value)]="modeValue" class="w-64" />
                  </div>
                  <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <nw-checkbox
                      [(checked)]="showSelection"
                      label="Selection + CSV export"
                    />
                    <nw-checkbox [(checked)]="showResizeReorder" label="Resizable & reorderable columns" />
                    <nw-checkbox [(checked)]="freezeColumns" label="Freeze ID & Name" />
                    <nw-checkbox
                      [(checked)]="groupByDept"
                      [disabled]="mode() !== 'full'"
                      label="Group by department"
                    />
                    <nw-checkbox
                      [(checked)]="enableRowReorder"
                      [disabled]="mode() !== 'full'"
                      label="Manual row reorder"
                    />
                    <nw-checkbox [(checked)]="persistState" label="Remember layout" />
                  </div>
                </div>
                <p class="mt-3 text-xs text-surface-500">
                  100 records total · sorting, filtering, inline editing, expandable rows, and
                  right-click context menu are always on. Row {{ mode() === 'lazy' ? 'data is fetched per page from a simulated server' : mode() === 'virtual' ? 'set is expanded to 200 for virtual scrolling' : 'data is all client-side' }}.
                </p>
              </nw-card>

              @if (mode() === 'lazy' && lazyLoading()) {
                <div class="flex items-center gap-2 rounded-nw bg-nw-50 px-4 py-2 text-sm text-nw-700">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"></path>
                  </svg>
                  Fetching page {{ lazyPageLabel() }} from the server…
                </div>
              }

              @if (showSelection() && selected().length) {
                <div class="flex items-center justify-between rounded-nw bg-nw-50 px-4 py-2 text-sm text-nw-700">
                  <span>{{ selected().length }} selected</span>
                  <nw-button size="small" variant="outlined" label="Export CSV" (click)="table.exportCSV()" />
                </div>
              }

              @if (actionLog()) {
                <p class="text-sm text-surface-500">{{ actionLog() }}</p>
              }

              <nw-card>
                <nw-data-table
                  #table
                  [data]="tableData()"
                  [columns]="columns"
                  rowKey="id"
                  [multiSort]="true"
                  [searchFields]="searchFields"
                  [paginator]="showPaginator()"
                  [pageSize]="pageSize()"
                  [pageSizeOptions]="[10, 25, 50, 100]"
                  [rowHover]="true"
                  [striped]="true"
                  [selectable]="showSelection()"
                  [(selectedRows)]="selected"
                  [resizableColumns]="showResizeReorder()"
                  [reorderableColumns]="showResizeReorder()"
                  [reorderableRows]="enableRowReorder() && mode() === 'full'"
                  [frozenColumns]="freezeColumns() ? 2 : 0"
                  [groupBy]="groupBy()"
                  [stateKey]="stateKey()"
                  [lazy]="mode() === 'lazy'"
                  [totalRecords]="mode() === 'lazy' ? lazyTotal() : 0"
                  [loading]="mode() === 'lazy' ? lazyLoading() : false"
                  [virtualScroll]="mode() === 'virtual'"
                  [scrollHeight]="420"
                  [rowHeight]="46"
                  [contextMenuItems]="menuItems"
                  (lazyLoad)="onLazyLoad($event)"
                  (cellEdit)="onCellEdit($event)"
                  (contextMenuSelect)="onContextSelect($event)"
                >
                  <ng-template nwColumn="name" let-row>
                    <div class="flex items-center gap-2.5">
                      <nw-avatar [label]="$any(row).initials" size="normal" />
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-surface-900 truncate">{{ $any(row).name }}</p>
                        <p class="text-xs text-surface-500 truncate">{{ $any(row).email }}</p>
                      </div>
                    </div>
                  </ng-template>
                  <ng-template nwColumn="role" let-row>
                    <nw-tag [value]="$any(row).role" severity="secondary" />
                  </ng-template>
                  <ng-template nwColumn="status" let-row>
                    <nw-tag [value]="$any(row).status" [severity]="statusSeverity($any(row).status)" />
                  </ng-template>
                  <ng-template nwColumn="salary" let-row>
                    <span class="tabular-nums">{{ formatSalary($any(row).salary) }}</span>
                  </ng-template>
                  <ng-template nwRowExpansion let-row>
                    <div class="grid gap-4 sm:grid-cols-2 text-sm">
                      <div>
                        <p class="text-surface-500">Phone</p>
                        <p class="text-surface-900">{{ $any(row).phone }}</p>
                      </div>
                      <div>
                        <p class="text-surface-500">Location</p>
                        <p class="text-surface-900">{{ $any(row).location }}</p>
                      </div>
                      <div class="sm:col-span-2">
                        <p class="text-surface-500">Bio</p>
                        <p class="text-surface-900">{{ $any(row).bio }}</p>
                      </div>
                    </div>
                  </ng-template>
                </nw-data-table>
              </nw-card>
            </div>
          </nw-tab>

          <nw-tab header="Pending invites" [badge]="pendingCount">
            <ul class="divide-y divide-surface-100">
              @for (m of pending; track m.email) {
                <li class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-surface-900">{{ m.email }}</p>
                    <p class="text-xs text-surface-500">Invited as {{ m.role }} · {{ m.sentAt }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <nw-button variant="text" size="small" label="Resend" />
                    <nw-button variant="text" size="small" label="Revoke" />
                  </div>
                </li>
              }
            </ul>
          </nw-tab>

          <nw-tab header="Roles">
            <div class="grid gap-4 sm:grid-cols-3">
              @for (r of rolePermissions; track r.name) {
                <div class="rounded-nw border border-surface-200 p-4">
                  <h3 class="font-semibold text-surface-900">{{ r.name }}</h3>
                  <ul class="mt-3 space-y-2 text-sm text-surface-600">
                    @for (p of r.permissions; track p) {
                      <li class="flex items-center gap-2">
                        <span class="text-nw-600">✓</span>
                        {{ p }}
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          </nw-tab>
        </nw-tabs>
      </div>

      <!-- Invite dialog -->
      <nw-dialog header="Invite a member" [(visible)]="inviteOpen" width="26rem">
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Email address</label>
            <nw-input-text placeholder="teammate@company.com" [fluid]="true" />
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Role</label>
            <nw-dropdown [options]="roleOptions" placeholder="Select a role" class="w-full" />
          </div>
        </div>
        <ng-template nwDialogFooter>
          <div class="flex justify-end gap-2">
            <nw-button variant="secondary" label="Cancel" (click)="inviteOpen.set(false)" />
            <nw-button variant="primary" label="Send invite" (click)="inviteOpen.set(false)" />
          </div>
        </ng-template>
      </nw-dialog>
    </app-admin-shell>
  `,
})
export class AdminUsersTemplateComponent {
  private readonly http = inject(HttpClient);

  protected readonly inviteOpen = signal(false);
  protected readonly selected = signal<User[]>([]);
  protected readonly actionLog = signal('');

  // --- dataset ---
  protected readonly allUsers = signal<User[]>([]);

  protected readonly virtualUsers = computed<User[]>(() => {
    const base = this.allUsers();
    if (!base.length) return [];
    const doubled = [...base, ...base].map((u, i) => ({ ...u, id: i + 1 }));
    return doubled;
  });

  // --- mode + toggles ---
  protected readonly mode = signal<TableMode>('full');
  protected readonly modeOptions: ModeOption[] = [
    { label: 'Full-featured (client-side)', value: 'full' },
    { label: 'Server-side lazy loading', value: 'lazy' },
    { label: 'Virtual scroll (200 rows)', value: 'virtual' },
  ];
  protected get modeValue() {
    return this.mode();
  }
  protected set modeValue(v: unknown) {
    this.mode.set(v as TableMode);
  }

  protected readonly showSelection = signal(true);
  protected readonly showResizeReorder = signal(true);
  protected readonly freezeColumns = signal(false);
  protected readonly groupByDept = signal(false);
  protected readonly enableRowReorder = signal(false);
  protected readonly persistState = signal(true);

  protected readonly showPaginator = computed(
    () => this.mode() !== 'virtual' && !(this.mode() === 'full' && this.groupByDept()),
  );
  protected readonly pageSize = computed(() => (this.mode() === 'lazy' ? 10 : 25));
  protected readonly groupBy = computed(() =>
    this.mode() === 'full' && this.groupByDept() ? 'department' : '',
  );
  protected readonly stateKey = computed(() =>
    this.persistState() ? `ngwave-admin-users-${this.mode()}` : '',
  );

  protected readonly tableData = computed<User[]>(() => {
    if (this.mode() === 'lazy') return this.lazyRows();
    if (this.mode() === 'virtual') return this.virtualUsers();
    return this.allUsers();
  });

  constructor() {
    this.http.get<User[]>('/data/users.json').subscribe((data) => this.allUsers.set(data));
  }

  // --- columns ---
  protected readonly columns: NwColumn<User>[] = [
    { field: 'id', header: 'ID', sortable: true, width: 70 },
    { field: 'name', header: 'Name', sortable: true, filter: true, width: 220 },
    { field: 'department', header: 'Department', sortable: true, filter: true, editable: true, width: 160 },
    { field: 'role', header: 'Role', sortable: true, width: 110 },
    { field: 'status', header: 'Status', sortable: true, width: 110 },
    { field: 'location', header: 'Location', sortable: true, filter: true, editable: true, width: 170 },
    { field: 'salary', header: 'Salary', sortable: true, filter: true, filterType: 'numeric', editable: true, width: 130 },
    { field: 'joinDate', header: 'Joined', sortable: true, width: 120 },
    { field: 'lastActive', header: 'Last active', sortable: true, width: 120 },
  ];
  protected readonly searchFields = ['name', 'email', 'department', 'location'];

  protected readonly roleOptions = [
    { label: 'Owner', value: 'owner' },
    { label: 'Admin', value: 'admin' },
    { label: 'Member', value: 'member' },
  ];

  protected readonly menuItems: NwMenuItem[] = [
    { label: 'View profile', value: 'view' },
    { label: 'Edit member', value: 'edit' },
    { label: 'Suspend', value: 'suspend' },
    { label: 'Remove', value: 'remove' },
  ];

  // --- lazy loading simulation ---
  protected readonly lazyRows = signal<User[]>([]);
  protected readonly lazyTotal = signal(0);
  protected readonly lazyLoading = signal(false);
  protected readonly lazyPageLabel = computed(() =>
    String(Math.floor(this.lazyRequestedFirst() / Math.max(this.lazyRequestedRows(), 1)) + 1),
  );
  private readonly lazyRequestedFirst = signal(0);
  private readonly lazyRequestedRows = signal(10);

  protected onLazyLoad(event: NwTableLazyLoadEvent): void {
    this.lazyLoading.set(true);
    this.lazyRequestedFirst.set(event.first);
    this.lazyRequestedRows.set(event.rows);
    // Simulated network latency — kept long enough to make the loading state
    // clearly visible rather than a barely-perceptible flash.
    setTimeout(() => {
      let data = [...this.allUsers()];

      // per-column filters
      for (const [field, meta] of Object.entries(event.filters)) {
        if (meta.value === null || meta.value === '') continue;
        data = data.filter((row) => this.matchesFilter(row[field], meta));
      }

      // global search
      const q = event.globalFilter.trim().toLowerCase();
      if (q) {
        data = data.filter((row) =>
          this.searchFields.some((f) => String(row[f] ?? '').toLowerCase().includes(q)),
        );
      }

      // sort (first sort key — simulated server applies primary sort)
      const sort = event.multiSortMeta[0];
      if (sort) {
        data.sort((a, b) => {
          const av = a[sort.field];
          const bv = b[sort.field];
          const cmp =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av).localeCompare(String(bv));
          return cmp * sort.order;
        });
      }

      this.lazyTotal.set(data.length);
      this.lazyRows.set(data.slice(event.first, event.first + event.rows));
      this.lazyLoading.set(false);
    }, 900);
  }

  private matchesFilter(value: unknown, meta: NwFilterMeta): boolean {
    if (typeof value === 'number' || NW_NUMERIC_MATCH_MODES.includes(meta.matchMode)) {
      const num = Number(value);
      const target = Number(meta.value);
      switch (meta.matchMode) {
        case 'equals':
          return num === target;
        case 'notEquals':
          return num !== target;
        case 'lt':
          return num < target;
        case 'lte':
          return num <= target;
        case 'gt':
          return num > target;
        case 'gte':
          return num >= target;
        default:
          return true;
      }
    }
    if (NW_TEXT_MATCH_MODES.includes(meta.matchMode)) {
      const str = String(value ?? '').toLowerCase();
      const target = String(meta.value ?? '').toLowerCase();
      switch (meta.matchMode) {
        case 'startsWith':
          return str.startsWith(target);
        case 'contains':
          return str.includes(target);
        case 'notContains':
          return !str.includes(target);
        case 'endsWith':
          return str.endsWith(target);
        case 'equals':
          return str === target;
        case 'notEquals':
          return str !== target;
        default:
          return true;
      }
    }
    return true;
  }

  protected onCellEdit(event: { row: User; field: string; value: unknown }): void {
    this.allUsers.update((rows) =>
      rows.map((r) => (r.id === event.row.id ? { ...r, [event.field]: event.value } : r)),
    );
  }

  protected onContextSelect(event: NwContextMenuSelectEvent<User>): void {
    this.actionLog.set(`${event.item.label} → ${event.row.name}`);
  }

  protected statusSeverity(status: User['status']): 'success' | 'warn' | 'secondary' {
    if (status === 'Active') return 'success';
    if (status === 'Invited') return 'warn';
    return 'secondary';
  }

  protected formatSalary(n: number): string {
    return `$${n.toLocaleString()}`;
  }

  protected readonly pending = [
    { email: 'jordan@partner.com', role: 'Member', sentAt: '2 days ago' },
    { email: 'kai@vendor.io', role: 'Admin', sentAt: '5 hours ago' },
  ];
  protected readonly pendingCount = String(this.pending.length);

  protected readonly rolePermissions = [
    { name: 'Owner', permissions: ['Full account access', 'Billing management', 'Delete workspace'] },
    { name: 'Admin', permissions: ['Manage members', 'Manage projects', 'View billing'] },
    { name: 'Member', permissions: ['View & edit projects', 'Comment on tasks'] },
  ];
}
