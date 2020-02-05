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

  AirPricePort() {
    var departureTime = encodeURIComponent('2020-12-31T08:25:00.000+07:00');
    var arrivalTime = encodeURIComponent('2020-12-31T11:50:00.000+08:00');
    var userData = 'supplier=' + 'travelport1g' + '&origin=' + 'CGK' + '&destination=' + 'KUL' + '&carrier=' + 'GA' + '&departureTime=' + departureTime + '&arrivalTime=' + arrivalTime + '&flightNumber=' + '820';
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post('http://localhost/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  }
}
