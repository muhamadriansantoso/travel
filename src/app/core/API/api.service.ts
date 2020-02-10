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
    return this.http.get('http://localhost/apitravel/api/v1/airportlist', httpOptions);
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
    return this.http.get('http://localhost/apitravel/api/v1/flight/search', httpOptions);
  }

  AirBookingInsertDB(sessionID: string, data: any) {
    var userData = 'sessionID=' + sessionID + '&data=' + data;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('http://localhost/apitravel/api/internal/flight/insertSelectedBooking', userData, {headers: urlHeader});
  }

  AirBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('http://localhost/apitravel/api/internal/flight/getSelectedBooking', userData, {headers: urlHeader});
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
    return this.http.get('http://localhost/apitravel/api/v1/flight/prebooking', httpOptions);
  }

  AirCreateReservationPort(bookingTraveler: any, airPricePort: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        'bookingTravelerData': JSON.stringify(bookingTraveler),
        'airPricePortData': JSON.stringify(airPricePort),
      }
    };
    return this.http.get('http://localhost/apitravel/api/v1/flight/booking', httpOptions);
  }

  // AirPricePort(data:any) {
  //   var userData = 'data=' + data;
  //   var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  //   return this.http.post('http://localhost/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  // }
}
