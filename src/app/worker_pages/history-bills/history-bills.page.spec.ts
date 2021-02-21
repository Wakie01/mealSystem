import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoryBillsPage } from './history-bills.page';

describe('HistoryBillsPage', () => {
  let component: HistoryBillsPage;
  let fixture: ComponentFixture<HistoryBillsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryBillsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryBillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
