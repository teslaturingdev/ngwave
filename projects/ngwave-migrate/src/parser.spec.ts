import { describe, expect, it } from 'vitest';
import {
  findElements,
  findMatchingClose,
  parseAttributes,
  serializeAttr,
} from './parser';

describe('parseAttributes', () => {
  it('classifies every binding kind', () => {
    const attrs = parseAttributes(
      `label="Save" [value]="rows" (onClick)="go()" [(selection)]="sel" *ngIf="show" #ref disabled`,
    );
    expect(attrs.map((a) => [a.kind, a.name, a.value])).toEqual([
      ['plain', 'label', 'Save'],
      ['input', 'value', 'rows'],
      ['output', 'onClick', 'go()'],
      ['twoway', 'selection', 'sel'],
      ['structural', 'ngIf', 'show'],
      ['ref', 'ref', undefined],
      ['plain', 'disabled', undefined],
    ]);
  });

  it('keeps > inside quoted values', () => {
    const attrs = parseAttributes(`[disabled]="a > b"`);
    expect(attrs[0].value).toBe('a > b');
  });
});

describe('serializeAttr', () => {
  it('round-trips kinds', () => {
    expect(serializeAttr('input', 'data', 'rows')).toBe('[data]="rows"');
    expect(serializeAttr('output', 'click', 'go()')).toBe('(click)="go()"');
    expect(serializeAttr('twoway', 'selectedRows', 'sel')).toBe(
      '[(selectedRows)]="sel"',
    );
    expect(serializeAttr('plain', 'label', 'Save')).toBe('label="Save"');
    expect(serializeAttr('plain', 'disabled', undefined)).toBe('disabled');
  });

  it('switches quotes when value contains double quote', () => {
    expect(serializeAttr('plain', 'x', `a"b`)).toBe(`x='a"b'`);
  });
});

describe('findElements / findMatchingClose', () => {
  it('finds tags and honors self-closing', () => {
    const src = `<p-button label="a" /><p-button>x</p-button>`;
    const els = findElements(src, 'p-button');
    expect(els.length).toBe(2);
    expect(els[0].selfClosing).toBe(true);
    expect(els[1].selfClosing).toBe(false);
  });

  it('does not match p-button when searching for button', () => {
    expect(findElements(`<p-button></p-button>`, 'button').length).toBe(0);
  });

  it('matches nested closing tags at the right depth', () => {
    const src = `<p-table><p-table></p-table></p-table>`;
    const firstOpenEnd = src.indexOf('>') + 1;
    const close = findMatchingClose(src, 'p-table', firstOpenEnd);
    expect(close).toBe(src.lastIndexOf('</p-table>'));
  });
});
