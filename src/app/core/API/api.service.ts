import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) {
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

    APIBrowseDates() {
        const httpOptions = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'f436a302cfmsh25e5e69bca11548p13862ejsna36226254c59'
            }
        };
        return this.http.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/ID/IDR/en-GB/CGK-sky/DPS-sky/2019-12-27?inboundpartialdate=2019-12-26', httpOptions);
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
}
