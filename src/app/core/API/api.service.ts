import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const APIURL = 'https://www.fixtrips.com/dev/';
// const APIURL = 'http://localhost/apitravel/';

// const APIURL = 'https://www.fixtrips.com/prod/';

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
    return this.http.get(APIURL + 'api/v1/airportlist', httpOptions);
  }

  hotelGeolocation() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.http.get(APIURL + 'api/v1/hotelgeolocation', httpOptions);
  }

  getSlider() {
    return this.http.get(APIURL + 'api/internal/getSlider');
  }


  getCountry(value) {
    return this.http.get('https://www.airalo.com/api/package/autocomplete?type=local&search=' + value);
  }

  getAirportCode(origin, destination) {
    var userData = JSON.stringify({
      'origin': origin,
      'destination': destination,
    });
    return this.http.post(APIURL + 'api/v1/flight/getAirportCode', userData);
  }

  // AirLowFareSearchPort(d: string, a: string, date: string, r_date: string, adult: string, child: string, infant: string, cabin: string, type: string, supplierData: string) {
  //   const httpOptions = {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     params: {
  //       'departure': d,
  //       'arrival': a,
  //       'departure_date': date,
  //       'return_date': r_date,
  //       'adult': adult,
  //       'child': child,
  //       'infant': infant,
  //       'cabin': cabin,
  //       'type': type,
  //       'supplier': supplierData,
  //     }
  //   };
  //   return this.http.get(APIURL + 'api/v1/flight/search', httpOptions);
  // }

  AirLowFareSearchPort(d: string, a: string, date: string, r_date: string, adult: number, child: number, infant: number, cabin: string, type: string, supplierData: string, dataBefore: any) {
    var userData = JSON.stringify({
      'departure': d,
      'arrival': a,
      'departure_date': date,
      'return_date': r_date,
      'adult': adult,
      'child': child,
      'infant': infant,
      'cabin': cabin,
      'type': type,
      'id': supplierData,
      'dataBefore': dataBefore,
    });
    return this.http.post(APIURL + 'api/v1/flight/search', userData);
  }

  getFlightSupplier() {
    return this.http.get(APIURL + 'api/v1/flight/supplier');
  }

  getEsimsSupplier() {
    return this.http.get(APIURL + 'api/v1/esims/supplier');
  }

  AirLowFareSearchPortArray(d: string, a: string, date: string, r_date: string, adult: number, child: number, infant: number, cabin: string, type: string, supplierData: string, dataBefore: any) {
    var userData = JSON.stringify({
      'departure': d,
      'arrival': a,
      'departure_date': date,
      'return_date': r_date,
      'adult': adult,
      'child': child,
      'infant': infant,
      'cabin': cabin,
      'type': type,
      'id': supplierData,
      'dataBefore': dataBefore,
    });
    return this.http.post(APIURL + 'api/v1/flight/search', userData);
  }

  getBaggageDataBabylon(babylonSeasonID: string, babylonSearchType: string, babylonSelIndex: string) {
    var userData = 'babylonSeasonID=' + babylonSeasonID + '&babylonSearchType=' + babylonSearchType + '&babylonSelIndex=' + babylonSelIndex;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/v1/flight/baggageBabylon', userData, {headers: urlHeader});
  }

  getRulesDataBabylon(babylonSeasonID: string, babylonSearchType: string, babylonSelIndex: string) {
    var userData = 'babylonSeasonID=' + babylonSeasonID + '&babylonSearchType=' + babylonSearchType + '&babylonSelIndex=' + babylonSelIndex;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/v1/flight/rulesBabylon', userData, {headers: urlHeader});
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
    return this.http.get(APIURL + 'api/v1/hotel/search', httpOptions);
  }

  getDetailHotel(id: string, startDate: string, endDate: string) {
    var userData = 'id=' + id + '&start_date=' + startDate + '&end_date=' + endDate;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/v1/hotel/detail', userData, {headers: urlHeader});
  }

  checkInventoryHotel(supplier, id: string, total_price: number, currency: string, roomTypeData: any) {
    var userData = 'supplier=' + supplier + '&id=' + id + '&total_price=' + total_price + '&currency=' + currency + '&roomTypeData=' + encodeURIComponent(JSON.stringify(roomTypeData));
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/v1/hotel/checkinventory', userData, {headers: urlHeader});
  }

  AirBookingInsertDB(sessionID: string, data: any) {
    var userData = 'sessionID=' + sessionID + '&data=' + encodeURIComponent(data);
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/internal/flight/insertSelectedBooking', userData, {headers: urlHeader});
  }

  HotelBookingInsertDB(sessionID: string, data: any, room_data: any, room_price, master_data: string, start_date: string, duration: string) {
    var userData = 'sessionID=' + sessionID + '&data=' + encodeURIComponent(JSON.stringify(data)) + '&room_data=' + encodeURIComponent(JSON.stringify(room_data)) + '&room_price=' + room_price + '&master_data=' + encodeURIComponent(JSON.stringify(master_data)) + '&start_date=' + start_date + '&duration=' + duration;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/internal/hotel/insertSelectedBooking', userData, {headers: urlHeader});
  }

  EsimsBookingInsertDB(sessionID: string, data: any) {
    var userData = JSON.stringify({
      'sessionID': sessionID,
      'data': data,
    });
    return this.http.post(APIURL + 'api/internal/esims/insertSelectedBooking', userData);
  }

  AirBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/internal/flight/getSelectedBooking', userData, {headers: urlHeader});
  }

  HotelBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/internal/hotel/getSelectedBooking', userData, {headers: urlHeader});
  }

  EsimsBookingGetDataDB(sessionID: string) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/internal/esims/getSelectedBooking', userData, {headers: urlHeader});
  }

  AirPricePort(sessionID: any) {
    var userData = 'sessionID=' + sessionID;
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(APIURL + 'api/v1/flight/prebooking', userData, {headers: urlHeader});
  }

  AirCreateReservationPort(sessionID, title, firstname, lastname, dob, email, phone, passengerData, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID + '&title=' + title + '&firstname=' + firstname + '&lastname=' + lastname + '&dob=' + dob + '&email=' + email + '&phone=' + phone + '&passengerData=' + JSON.stringify(passengerData) + '&id=' + supplier;
    return this.http.post(APIURL + 'api/v1/flight/insertBookingData', userData, {headers: urlHeader});
  }

  AirCreateSSR(bookingID, ssrData, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&ssrData=' + encodeURIComponent(JSON.stringify(ssrData)) + '&id=' + supplier;
    return this.http.post(APIURL + 'api/v1/flight/insertSSRData', userData, {headers: urlHeader});
  }

  eSIMsInsertBooking(sessionID, title, firstname, lastname, email, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID + '&title=' + title + '&firstname=' + firstname + '&lastname=' + lastname + '&email=' + email + '&id=' + supplier;
    return this.http.post(APIURL + 'api/v1/esims/insertBookingData', userData, {headers: urlHeader});
  }

  paymentChannelEspayForFlight(sessionID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID;
    return this.http.post(APIURL + 'api/v1/flight/payment/paymentChannelEspay', userData, {headers: urlHeader});
  }

  paymentChannelEspayForEsims(sessionID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID;
    return this.http.post(APIURL + 'api/v1/esims/payment/paymentChannelEspay', userData, {headers: urlHeader});
  }

  paymentChannelEspay(sessionID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'sessionID=' + sessionID;
    return this.http.post(APIURL + 'api/v1/payment/paymentChannelEspay', userData, {headers: urlHeader});
  }

  insertPaymentChannelEspayForFlight(bookingID, bankCode, origin, destination, departureTime, airPlane, roundType) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&bankCode=' + bankCode + '&origin=' + origin + '&destination=' + destination + '&departureTime=' + departureTime + '&airPlane=' + airPlane + '&roundType=' + roundType;
    return this.http.post(APIURL + 'api/v1/flight/payment/orderPaymentEspay', userData, {headers: urlHeader});
  }

  insertPaymentChannelEspayForEsims(bookingID, bankCode, type) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&bankCode=' + bankCode + '&type=' + type;
    return this.http.post(APIURL + 'api/v1/esims/payment/orderPaymentEspay', userData, {headers: urlHeader});
  }

  insertPaymentChannelEspay(bookingID, bankCode, origin, destination, departureTime, airPlane, roundType) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&bankCode=' + bankCode + '&origin=' + origin + '&destination=' + destination + '&departureTime=' + departureTime + '&airPlane=' + airPlane + '&roundType=' + roundType;
    return this.http.post(APIURL + 'api/v1/payment/orderPaymentEspay', userData, {headers: urlHeader});
  }

  checkPaymentChannelEspayForFlight(bookingID, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&supplier=' + supplier;
    return this.http.post(APIURL + 'api/v1/flight/payment/checkPaymentEspay', userData, {headers: urlHeader});
  }

  checkPaymentChannelEspayEsims(bookingID, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&supplier=' + supplier;
    return this.http.post(APIURL + 'api/v1/esims/payment/checkPaymentEspay', userData, {headers: urlHeader});
  }

  checkPaymentChannelEspay(bookingID, supplier) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'bookingID=' + bookingID + '&supplier=' + supplier;
    return this.http.post(APIURL + 'api/v1/payment/checkPaymentEspay', userData, {headers: urlHeader});
  }

  retrieveBooking(emailAddress, bookingID) {
    var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    var userData = 'emailAddress=' + emailAddress + '&bookingID=' + bookingID;
    return this.http.post(APIURL + 'api/v1/flight/retrieveBooking', userData, {headers: urlHeader});
  }

  geteSIMs(type: string, supplierData: string, dataBefore: any, country: string) {
    var userData = JSON.stringify({
      id: supplierData,
      type: type,
      dataBefore: dataBefore,
      country: country,
    });
    return this.http.post(APIURL + 'api/v1/esims/listpackage', userData);
  }

  // AirPricePort(data:any) {
  //   var userData = 'data=' + data;
  //   var urlHeader = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  //   return this.http.post('http://localhost/apitravel/api/v1/flight/prebooking', userData, {headers: urlHeader});
  // }
}
