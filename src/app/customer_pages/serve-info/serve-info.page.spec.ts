import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServeInfoPage } from './serve-info.page';

describe('ServeInfoPage', () => {
  let component: ServeInfoPage;
  let fixture: ComponentFixture<ServeInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServeInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
