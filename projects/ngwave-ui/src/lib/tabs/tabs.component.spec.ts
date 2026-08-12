import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NwTabComponent, NwTabsComponent } from './tabs.component';

@Component({
  imports: [NwTabsComponent, NwTabComponent],
  template: `
    <nw-tabs [(activeIndex)]="idx">
      <nw-tab header="One">First content</nw-tab>
      <nw-tab header="Two">Second content</nw-tab>
    </nw-tabs>
  `,
})
class Host {
  idx = signal(0);
}

describe('NwTabs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  async function create() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  const panes = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('nw-tab > div')) as HTMLElement[];

  it('renders a button per tab header', async () => {
    const { el } = await create();
    const buttons = el.querySelectorAll('[role="tab"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('One');
    expect(buttons[1].textContent).toContain('Two');
  });

  it('shows the active pane and hides the rest', async () => {
    const { el } = await create();
    expect(panes(el)[0].hidden).toBe(false);
    expect(panes(el)[1].hidden).toBe(true);
  });

  it('switches tabs on click', async () => {
    const { fixture, el } = await create();
    (el.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(1);
    expect(panes(el)[0].hidden).toBe(true);
    expect(panes(el)[1].hidden).toBe(false);
  });
});

@Component({
  imports: [NwTabsComponent, NwTabComponent],
  template: `
    <nw-tabs [lazy]="true">
      <nw-tab header="One">First</nw-tab>
      <nw-tab header="Two">Second</nw-tab>
    </nw-tabs>
  `,
})
class LazyHost {}

describe('NwTabs — lazy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyHost],
    }).compileComponents();
  });

  it('only renders the active pane, caching once activated', async () => {
    const fixture = TestBed.createComponent(LazyHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[role="tabpanel"]').length).toBe(1);
    (el.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await fixture.whenStable();
    expect(el.querySelectorAll('[role="tabpanel"]').length).toBe(2);
  });
});

@Component({
  imports: [NwTabsComponent, NwTabComponent],
  template: `
    <nw-tabs>
      <nw-tab header="One" [closable]="true">First</nw-tab>
      <nw-tab header="Two">Second</nw-tab>
    </nw-tabs>
  `,
})
class ClosableHost {}

describe('NwTabs — closable', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosableHost],
    }).compileComponents();
  });

  it('closes a tab via its ✕', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[role="tab"]').length).toBe(2);
    (el.querySelector('[aria-label="Close tab"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(el.querySelectorAll('[role="tab"]').length).toBe(1);
  });
});
