import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APIService} from "../../../../core/API";
import {FormBuilder} from "@angular/forms";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-esims',
  templateUrl: './esims.component.html',
  styleUrls: ['./esims.component.scss']
})
export class EsimsComponent implements OnInit {
  eSIMsData: any;
  type: string;
  pleaseWaitLoader: boolean;
  modalRef: BsModalRef;

  private unsubscribe: Subject<any>;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.pleaseWaitLoader = true;
    this.type = 'local';
    this.api.geteSIMs(this.type)
      .pipe(
        tap((data: any) => {
          if (data.data.status == 1) {
            this.eSIMsData = data.data.data;
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.pleaseWaitLoader = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.type = $event.nextId;
    this.eSIMsData = '';
    this.pleaseWaitLoader = true;
    this.api.geteSIMs(this.type)
      .pipe(
        tap((data: any) => {
          if (data.data.status == 1) {
            this.eSIMsData = data.data.data;
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.pleaseWaitLoader = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  };

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

}
