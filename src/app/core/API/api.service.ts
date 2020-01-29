import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

    APIListPlace(value: string) {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            },
            params: {'query': value}
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/ID/IDR/en-GB/', httpOptions);
    }

    APIBrowseDates(originplace: string, destinationplace: string, outboundpartialdate:string) {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            }
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/ID/IDR/en-GB/' +originplace+ '/' +destinationplace+ '/' +outboundpartialdate, httpOptions);
    }

    APIBrowseDatesInboound(originplace: string, destinationplace: string, outboundpartialdate:string, inboundpartialdate:string) {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            }
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/ID/IDR/en-GB/' +originplace+ '/' +destinationplace+ '/' +outboundpartialdate+ '/' +inboundpartialdate, httpOptions);
    }

    APIBrowseRoutes(originplace: string, destinationplace: string, outboundpartialdate:string) {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            }
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/ID/IDR/en-GB/' +originplace+ '/' +destinationplace+ '/' +outboundpartialdate, httpOptions);
    }

    APIBrowseQuotesInboound(originplace: string, destinationplace: string, outboundpartialdate:string, inboundpartialdate:string) {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            }
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/ID/IDR/en-GB/' +originplace+ '/' +destinationplace+ '/' +outboundpartialdate+ '/' +inboundpartialdate, httpOptions);
    }
}
