import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { RouterTestingModule } from '@angular/router/testing';
describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar,RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct inputs', () => {
    component.username = 'testuser';
    component.logged = true;
    fixture.detectChanges();

    expect(component.username).toBe('testuser');
    expect(component.logged).toBeTrue();
  });

  it('should emit logout event when onLogout is called', () => {
    spyOn(component.logout, 'emit');
    component.onLogout();
    expect(component.logout.emit).toHaveBeenCalled();
  });

});
