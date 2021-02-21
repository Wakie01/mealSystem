import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenutypeSettingPage } from './menutype-setting.page';

describe('MenutypeSettingPage', () => {
  let component: MenutypeSettingPage;
  let fixture: ComponentFixture<MenutypeSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenutypeSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenutypeSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
