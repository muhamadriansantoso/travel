import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class APIService {
  constructor(private http: HttpClient) {
  }

  airportList() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.http.get('https://www.gohateka.com/apitravel/api/v1/airportlist', httpOptions);
  }

  AirLowFareSearchPort(d: string, a: string, date: string, r_date: string, adult: string, child: string, infant: string, cabin: string, type: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        'departure': d,
        'arrival': a,
        'departure_date': date,
        'return_date': r_date,
        'adult': adult,
        'child': child,
        'infant': infant,
        'cabin': cabin,
        'type': type,
      }
    };
    return this.http.get('https://www.gohateka.com/apitravel/api/v1/flight/search', httpOptions);
  }

  AirBookingInsertDB(sessionID: string, data: any) {
    var userData = 'sessionID=' + sessionID + '&data=' + data;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/internal/flight/insertSelectedBooking', userData, {headers: urlHeader});
  }

  AirBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/internal/flight/getSelectedBooking', userData, {headers: urlHeader});
  }

  AirPricePort(data: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        'data': JSON.stringify(data)
      }
    };
    return this.http.get('https://www.gohateka.com/apitravel/api/v1/flight/prebooking', httpOptions);
  }

  AirCreateReservationPort(sessionID, title, firstname, lastname, dob, email, phone) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID + '&title=' + title + '&firstname=' + firstname + '&lastname=' + lastname + '&dob=' + dob + '&email=' + email + '&phone=' + phone;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/booking/insertBookingData', userData, {headers: urlHeader});
  }

  paymentChannelEspay(sessionID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/payment/paymentChannelEspay', userData, {headers: urlHeader});
  }

  insertPaymentChannelEspay(bookingID, bankCode) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&bankCode=' + bankCode;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/payment/orderPaymentEspay', userData, {headers: urlHeader});
  }

  checkPaymentChannelEspay(bookingID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID;
    return this.http.post('https://gohateka.com/apitravel/api/v1/payment/checkPaymentEspay', userData, {headers: urlHeader});
  }

  // AirPricePort(data:any) {
  //   var userData = 'data=' + data;
  //   var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  //   return this.http.post('http://localhost/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  // }
}
