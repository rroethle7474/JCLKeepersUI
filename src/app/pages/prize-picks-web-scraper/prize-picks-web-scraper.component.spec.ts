import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizePicksWebScraperComponent } from './prize-picks-web-scraper.component';

describe('PrizePicksWebScraperComponent', () => {
  let component: PrizePicksWebScraperComponent;
  let fixture: ComponentFixture<PrizePicksWebScraperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrizePicksWebScraperComponent]
    });
    fixture = TestBed.createComponent(PrizePicksWebScraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
