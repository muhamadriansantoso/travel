import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.scss']
})
export class CheckorderComponent implements OnInit {
  retrieveForm: FormGroup;
  retrieveFormInvalid: boolean;
  invalidData: boolean;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.initRetrieveForm();
  }

  initRetrieveForm() {
    this.retrieveForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
      ])
      ],
      booking_id: ['', Validators.compose([
        Validators.required,
      ])
      ],
    });
  }

  submit() {
    const controls = this.retrieveForm.controls;
    if (this.retrieveForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.retrieveFormInvalid = true;
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    const authData = {
      email: controls['email'].value,
      booking_id: controls['booking_id'].value
    };

    this.api.retrieveBooking(authData.email, authData.booking_id).subscribe((data: any) => {
      if (data.status == 0) {
        this.invalidData = true;
      }
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.retrieveForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  closeInvalidData() {
    this.invalidData = false;
    this.retrieveFormInvalid = false;
  }

}
