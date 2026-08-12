import { TestBed } from '@angular/core/testing';
import { NwConfirmationService } from './confirmation.service';

describe('NwConfirmationService', () => {
  let svc: NwConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(NwConfirmationService);
  });

  it('holds no confirmation initially', () => {
    expect(svc.current()).toBeNull();
  });

  it('exposes the pending confirmation after confirm()', () => {
    svc.confirm({ message: 'Delete?' });
    expect(svc.current()?.message).toBe('Delete?');
  });

  it('runs accept() and clears the confirmation', () => {
    let accepted = false;
    svc.confirm({ message: 'x', accept: () => (accepted = true) });
    svc.accept();
    expect(accepted).toBe(true);
    expect(svc.current()).toBeNull();
  });

  it('runs reject() and clears the confirmation', () => {
    let rejected = false;
    svc.confirm({ message: 'x', reject: () => (rejected = true) });
    svc.reject();
    expect(rejected).toBe(true);
    expect(svc.current()).toBeNull();
  });

  it('close() clears without invoking callbacks', () => {
    let touched = false;
    svc.confirm({
      message: 'x',
      accept: () => (touched = true),
      reject: () => (touched = true),
    });
    svc.close();
    expect(touched).toBe(false);
    expect(svc.current()).toBeNull();
  });
});
