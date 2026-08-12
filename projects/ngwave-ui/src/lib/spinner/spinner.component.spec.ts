import { TestBed } from '@angular/core/testing';
import { NwSkeletonComponent } from './skeleton.component';
import { NwSpinnerComponent } from './spinner.component';

describe('NwSpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwSpinnerComponent],
    }).compileComponents();
  });

  it('renders an animated spinner at the given size', async () => {
    const fixture = TestBed.createComponent(NwSpinnerComponent);
    fixture.componentRef.setInput('size', 40);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.classList.contains('animate-spin')).toBe(true);
    expect((svg as unknown as HTMLElement).style.width).toBe('40px');
  });
});

describe('NwSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwSkeletonComponent],
    }).compileComponents();
  });

  it('renders a placeholder with width/height and circle shape', async () => {
    const fixture = TestBed.createComponent(NwSkeletonComponent);
    fixture.componentRef.setInput('width', '3rem');
    fixture.componentRef.setInput('height', '3rem');
    fixture.componentRef.setInput('shape', 'circle');
    await fixture.whenStable();
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(div.style.width).toBe('3rem');
    expect(div.classList.contains('rounded-full')).toBe(true);
    expect(div.querySelector('.animate-nw-shimmer')).toBeTruthy();
  });
});
