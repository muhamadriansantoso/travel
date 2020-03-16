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

  hotelGeolocation() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.http.get('https://www.gohateka.com/apitravel/api/v1/hotelgeolocation', httpOptions);
  }

  getSlider() {
    return this.http.get('https://www.gohateka.com/apitravel/api/internal/getSlider');
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

  AirLowFareSearchPortArray(d: string, a: string, date: string, r_date: string, adult: string, child: string, infant: string, cabin: string, type: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        'departure[]': d,
        'arrival[]': a,
        'departure_date[]': date,
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

  searchHotel(geo: string, start_date: string, end_date: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        'geo': geo,
        'start_date': start_date,
        'end_date': end_date,
      }
    };
    return this.http.get('https://www.gohateka.com/apitravel/api/v1/hotel/search', httpOptions);
  }

  getDetailHotel(id: string, startDate: string, endDate: string) {
    var userData = 'id=' + id + '&start_date=' + startDate + '&end_date=' + endDate;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/hotel/detail', userData, {headers: urlHeader});
  }

  checkInventoryHotel(supplier, id: string, total_price: number, currency: string, roomTypeData: any) {
    var userData = 'supplier=' + supplier + '&id=' + id + '&total_price=' + total_price + '&currency=' + currency + '&roomTypeData=' + encodeURIComponent(JSON.stringify(roomTypeData));
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/hotel/checkinventory', userData, {headers: urlHeader});
  }

  AirBookingInsertDB(sessionID: string, data: any) {
    var userData = 'sessionID=' + sessionID + '&data=' + data;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/internal/flight/insertSelectedBooking', userData, {headers: urlHeader});
  }

  HotelBookingInsertDB(sessionID: string, data: any, room_data: any) {
    var userData = 'sessionID=' + sessionID + '&data=' + encodeURIComponent(JSON.stringify(data)) + '&room_data=' + encodeURIComponent(JSON.stringify(room_data));
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/internal/hotel/insertSelectedBooking', userData, {headers: urlHeader});
  }

  AirBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/internal/flight/getSelectedBooking', userData, {headers: urlHeader});
  }

  AirPricePort(sessionID: any) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  }

  AirCreateReservationPort(sessionID, title, firstname, lastname, dob, email, phone, passengerData, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID + '&title=' + title + '&firstname=' + firstname + '&lastname=' + lastname + '&dob=' + dob + '&email=' + email + '&phone=' + phone + '&passengerData=' + JSON.stringify(passengerData) + '&supplier=' + supplier;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/booking/insertBookingData', userData, {headers: urlHeader});
  }

  paymentChannelEspay(sessionID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/payment/paymentChannelEspay', userData, {headers: urlHeader});
  }

  insertPaymentChannelEspay(bookingID, bankCode, origin, destination, departureTime, airPlane, roundType) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&bankCode=' + bankCode + '&origin=' + origin + '&destination=' + destination + '&departureTime=' + departureTime + '&airPlane=' + airPlane + '&roundType=' + roundType;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/payment/orderPaymentEspay', userData, {headers: urlHeader});
  }

  checkPaymentChannelEspay(bookingID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID;
    return this.http.post('https://gohateka.com/apitravel/api/v1/payment/checkPaymentEspay', userData, {headers: urlHeader});
  }

  retrieveBooking(emailAddress, bookingID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'emailAddress=' + emailAddress + '&bookingID=' + bookingID;
    return this.http.post('https://www.gohateka.com/apitravel/api/v1/flight/retrieveBooking', userData, {headers: urlHeader});
  }

  // AirPricePort(data:any) {
  //   var userData = 'data=' + data;
  //   var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  //   return this.http.post('http://localhost/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  // }
}
