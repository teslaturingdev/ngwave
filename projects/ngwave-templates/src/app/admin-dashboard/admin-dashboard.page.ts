import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NwAvatarComponent,
  NwButtonComponent,
  NwCardComponent,
  NwColumn,
  NwDataTableComponent,
  NwTabComponent,
  NwTabsComponent,
  NwTagComponent,
} from '@ngwave/ui';
import { AdminShellComponent } from './admin-shell.component';

interface Order extends Record<string, unknown> {
  id: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  date: string;
}

interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  sparkline: number[];
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

interface Task {
  label: string;
  due: string;
  done: boolean;
}

@Component({
  selector: 'app-admin-dashboard-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AdminShellComponent,
    NwCardComponent,
    NwTagComponent,
    NwAvatarComponent,
    NwButtonComponent,
    NwDataTableComponent,
    NwTabsComponent,
    NwTabComponent,
  ],
  template: `
    <app-admin-shell pageTitle="Dashboard" pageSubtitle="Welcome back, here's what's happening.">
      <div class="space-y-6">
        <!-- Quick actions -->
        <div class="flex flex-wrap items-center gap-2">
          <nw-button variant="primary" size="small" label="+ New order" />
          <nw-button variant="secondary" size="small" label="Invite teammate" />
          <nw-button variant="secondary" size="small" label="Export report" />
        </div>

        <!-- Stat cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (s of stats; track s.label) {
            <nw-card>
              <p class="text-xs font-medium text-surface-500 uppercase tracking-wide">{{ s.label }}</p>
              <div class="mt-2 flex items-end justify-between">
                <span class="text-2xl font-bold text-surface-900">{{ s.value }}</span>
                <nw-tag [value]="s.delta" [severity]="s.trend === 'up' ? 'success' : 'danger'" />
              </div>
              <div class="mt-3 flex items-end gap-0.5 h-8">
                @for (v of s.sparkline; track $index) {
                  <span
                    class="flex-1 rounded-sm"
                    [class]="s.trend === 'up' ? 'bg-nw-200' : 'bg-red-200'"
                    [style.height.%]="v"
                  ></span>
                }
              </div>
            </nw-card>
          }
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Orders table -->
          <div class="lg:col-span-2">
            <nw-card header="Recent orders" subheader="Last 24 hours">
              <nw-data-table
                [data]="orders"
                [columns]="columns"
                [rowHover]="true"
                [striped]="true"
                [paginator]="true"
                [pageSize]="5"
              >
                <ng-template nwColumn="customer" let-row>
                  <div class="flex items-center gap-2">
                    <nw-avatar [label]="row.initials" size="normal" />
                    {{ row.customer }}
                  </div>
                </ng-template>
                <ng-template nwColumn="status" let-row>
                  <nw-tag [value]="row.status" [severity]="statusSeverity(row.status)" />
                </ng-template>
              </nw-data-table>
            </nw-card>
          </div>

          <!-- Side column -->
          <div class="space-y-6">
            <nw-card header="Team">
              <nw-tabs>
                <nw-tab header="Members">
                  <ul class="space-y-3">
                    @for (m of team; track m.name) {
                      <li class="flex items-center gap-3">
                        <nw-avatar [label]="m.initials" size="normal" />
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-surface-900 truncate">{{ m.name }}</p>
                          <p class="text-xs text-surface-500 truncate">{{ m.role }}</p>
                        </div>
                      </li>
                    }
                  </ul>
                </nw-tab>
                <nw-tab header="Activity">
                  <ul class="space-y-3 text-sm text-surface-600">
                    <li>Maya updated the Q3 roadmap.</li>
                    <li>Daniel closed 3 support tickets.</li>
                    <li>New signup: acme-corp.com.</li>
                  </ul>
                </nw-tab>
              </nw-tabs>
            </nw-card>

            <nw-card header="Upcoming tasks">
              <ul class="space-y-3">
                @for (t of tasks; track t.label) {
                  <li class="flex items-center gap-2.5">
                    <span
                      class="h-4 w-4 rounded-nw border flex items-center justify-center text-[10px] shrink-0"
                      [class]="t.done ? 'bg-nw-600 border-nw-600 text-white' : 'border-surface-300'"
                    >
                      @if (t.done) {
                        ✓
                      }
                    </span>
                    <span class="text-sm flex-1" [class.line-through]="t.done" [class.text-surface-400]="t.done">
                      {{ t.label }}
                    </span>
                    <span class="text-xs text-surface-400 shrink-0">{{ t.due }}</span>
                  </li>
                }
              </ul>
            </nw-card>

            <nw-card header="Storage">
              <div class="flex items-center justify-between text-sm">
                <span class="text-surface-600">62.4 GB of 100 GB used</span>
                <span class="text-surface-500">62%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-surface-100 overflow-hidden">
                <div class="h-full w-[62%] bg-nw-500 rounded-full"></div>
              </div>
            </nw-card>
          </div>
        </div>
      </div>
    </app-admin-shell>
  `,
})
export class AdminDashboardTemplateComponent {
  protected readonly stats: StatCard[] = [
    { label: 'Revenue', value: '$48,240', delta: '+12.4%', trend: 'up', sparkline: [40, 55, 45, 60, 50, 70, 65, 90] },
    { label: 'Orders', value: '1,284', delta: '+4.1%', trend: 'up', sparkline: [50, 45, 60, 55, 65, 60, 75, 80] },
    { label: 'New customers', value: '312', delta: '-2.3%', trend: 'down', sparkline: [70, 65, 60, 62, 55, 50, 48, 45] },
    { label: 'Refund rate', value: '1.2%', delta: '+0.4%', trend: 'down', sparkline: [30, 32, 35, 33, 38, 40, 42, 45] },
  ];

  protected readonly columns: NwColumn<Order>[] = [
    { field: 'id', header: 'Order', sortable: true },
    { field: 'customer', header: 'Customer', sortable: true },
    { field: 'amount', header: 'Amount', sortable: true },
    { field: 'status', header: 'Status' },
    { field: 'date', header: 'Date', sortable: true },
  ];

  protected readonly orders: (Order & { initials: string })[] = [
    { id: '#3081', customer: 'Fenwick Ltd.', initials: 'FL', amount: '$1,240', status: 'Paid', date: 'Sep 2' },
    { id: '#3080', customer: 'Arclight Inc.', initials: 'AI', amount: '$860', status: 'Pending', date: 'Sep 2' },
    { id: '#3079', customer: 'Northwind Co.', initials: 'NC', amount: '$2,110', status: 'Paid', date: 'Sep 1' },
    { id: '#3078', customer: 'Acme Corp.', initials: 'AC', amount: '$430', status: 'Refunded', date: 'Sep 1' },
    { id: '#3077', customer: 'Globex LLC', initials: 'GL', amount: '$980', status: 'Paid', date: 'Aug 31' },
    { id: '#3076', customer: 'Initech', initials: 'IT', amount: '$1,510', status: 'Paid', date: 'Aug 31' },
    { id: '#3075', customer: 'Hooli', initials: 'HL', amount: '$275', status: 'Pending', date: 'Aug 30' },
  ];

  protected readonly team: TeamMember[] = [
    { name: 'Priya Nair', role: 'Product', initials: 'PN' },
    { name: 'Daniel Osei', role: 'Engineering', initials: 'DO' },
    { name: 'Maya Chen', role: 'Operations', initials: 'MC' },
  ];

  protected readonly tasks: Task[] = [
    { label: 'Review Q3 budget draft', due: 'Today', done: false },
    { label: 'Approve design handoff', due: 'Today', done: true },
    { label: 'Sync with finance team', due: 'Tomorrow', done: false },
    { label: 'Ship dashboard v2', due: 'Fri', done: false },
  ];

  protected statusSeverity(status: Order['status']): 'success' | 'warn' | 'secondary' {
    if (status === 'Paid') return 'success';
    if (status === 'Pending') return 'warn';
    return 'secondary';
  }
}
