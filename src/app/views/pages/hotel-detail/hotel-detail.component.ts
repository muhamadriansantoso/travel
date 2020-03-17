import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import * as moment from 'moment';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  sessionID: string;
  supplier: string;
  id: string;
  start_date: string;
  end_date: string;
  duration: string;
  loadingPage: boolean;
  detailHotel: any;
  plusMinusShow: boolean;
  qty: any = [];
  qtyNum: number;
  roomTypeLength: number;
  roomPrice: number;
  maxGuest: number;
  roomLeft: any = [];
  rooms: any = [];

  public hotelDetailsCollapsed: boolean[] = [];
  private unsubscribe: Subject<any>;
  @ViewChild('scrollToMe', {static: false}) scrollToMe: ElementRef;

  constructor(
    private _router: ActivatedRoute,
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.loadingPage = true;
    this.plusMinusShow = false;
    this.id = this._router.snapshot.params['hotelID'];
    this.start_date = this._router.snapshot.params['startDate'];
    this.duration = this._router.snapshot.params['duration'];
    this.end_date = moment(this.start_date).add(this.duration, 'days').format('YYYY-MM-DD');

    this.qtyNum = 0;
    this.roomPrice = 0;
    this.maxGuest = 0;

    this.api.getDetailHotel(this.id, this.start_date, this.end_date)
      .pipe(
        tap((data: any) => {
          this.sessionID = data.sessionID;
          this.supplier = data.supplier;
          this.detailHotel = data;
          this.roomTypeLength = data.room_types.length;
          for (var startRoomType = 0; startRoomType < this.roomTypeLength; startRoomType++) {
            this.qty[startRoomType] = 0;
            this.roomLeft[startRoomType] = data.room_types[startRoomType].available_allotments;

            this.rooms.push({
              room_type_id: data.room_types[startRoomType].room_type_id,
              key: data.room_types[startRoomType].rates[0].key,
            });
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loadingPage = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  hotelDetailsAllCollapsed(value) {
    if (!this.hotelDetailsCollapsed[value]) {
      this.hotelDetailsCollapsed = [false];
      this.hotelDetailsCollapsed[value] = false;
    } else {
      this.hotelDetailsCollapsed = [false];
      this.hotelDetailsCollapsed[value] = true;
    }
  }

  scroll() {
    setTimeout(() => {
      this.scrollToMe.nativeElement.scrollIntoView({behavior: 'smooth'});
    }, 200);
  }

  plusMinus(index, roomPrice, maxGuest) {
    this.plusMinusShow = true;
    this.qty[index] = 1;
    this.qtyNum = this.qty.reduce((a, b) => a + b, 0);
    this.roomPrice = this.roomPrice + roomPrice;
    this.maxGuest = this.maxGuest + maxGuest;
  }

  plusMinusToMinus(index, roomPrice, maxGuest) {
    this.qty[index] = this.qty[index] - 1;
    this.roomPrice = this.roomPrice - roomPrice;
    this.maxGuest = this.maxGuest - maxGuest;
    this.qtyNum = this.qty.reduce((a, b) => a + b, 0);
  }

  plusMinusToPlus(index, roomPrice, maxGuest) {
    if (this.qty[index] < this.roomLeft[index]) {
      this.qty[index] = this.qty[index] + 1;
      this.roomPrice = this.roomPrice + roomPrice;
      this.maxGuest = this.maxGuest + maxGuest;
      this.qtyNum = this.qty.reduce((a, b) => a + b, 0);
    }
  }

  orderHotel() {
    for (var startRoomType = 0; startRoomType < this.roomTypeLength; startRoomType++) {
      this.rooms[startRoomType] = Object.assign(this.rooms[startRoomType], {
        quantity: this.qty[startRoomType],
      });
    }

    this.api.checkInventoryHotel(this.supplier, this.id, this.roomPrice, 'IDR', this.rooms).pipe(
      tap((data: any) => {
        if (data.status == 'MATCH') {
          this.api.HotelBookingInsertDB(this.sessionID, this.rooms, data.room_types, this.roomPrice, this.detailHotel, this.start_date, this.duration).subscribe((data: any) => {
            if (data.status == 1) {
              this.router.navigate(['hotel-booking', this.sessionID]);
            }
          });
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    )
      .subscribe();
  }

}
