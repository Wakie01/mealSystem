import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuSettingPage } from './menu-setting.page';

describe('MenuSettingPage', () => {
  let component: MenuSettingPage;
  let fixture: ComponentFixture<MenuSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
