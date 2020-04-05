import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {APIService} from '../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.scss']
})
export class CheckorderComponent implements OnInit {
  retrieveForm: FormGroup;
  retrieveFormInvalid: boolean;
  retrieveData: any;
  invalidData: boolean;
  loading: boolean;
  submitClicked: boolean;

  @ViewChild('scrollToMe') scrollToMe: ElementRef;
  private unsubscribe: Subject<any>;
  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initRetrieveForm();
    this.retrieveForm.valueChanges.subscribe(value => {
      this.submitClicked = false;
    });
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

    this.loading = true;
    this.submitClicked = true;

    const authData = {
      email: controls['email'].value,
      booking_id: controls['booking_id'].value
    };

    this.api.retrieveBooking(authData.email, authData.booking_id)
      .pipe(
        tap((data: any) => {
          if (data.status == 0) {
            this.invalidData = true;
            this.submitClicked = false;
          } else if (data.status == 1) {
            this.retrieveData = data.data;
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.scroll();
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  scroll() {
    setTimeout(() => {
      this.scrollToMe.nativeElement.scrollIntoView({behavior: 'smooth'});
    }, 200);
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
