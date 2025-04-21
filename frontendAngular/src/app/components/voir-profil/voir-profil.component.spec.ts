import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirProfilComponent } from './voir-profil.component';

describe('VoirProfilComponent', () => {
  let component: VoirProfilComponent;
  let fixture: ComponentFixture<VoirProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoirProfilComponent]
    });
    fixture = TestBed.createComponent(VoirProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
