import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from '../../../core/API';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
	
  model: any;

	listPlaceFrom:any;
  listPlaceFromWrite:boolean = false;
  listPlaceTo:any;
  listPlaceToWrite:boolean = false;

  landingPageFormGroups: FormGroup;

  constructor(
  	private http: HttpClient,
  	private api: APIService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initLandingPageForm();
    this.model = {
        originplace: '',
        destinationplace: '',
        outboundpartialdate: '',
        inboundpartialdate: '',
      }
  }

  initLandingPageForm(){
    this.landingPageFormGroups = this.fb.group({
      originplace: ['', Validators.compose([Validators.required])],
      destinationplace: ['', Validators.compose([Validators.required])],
      outboundpartialdate: ['', Validators.compose([Validators.required])],
      inboundpartialdate: [''],
    })
  }

  getListPlaceFrom(value: string){
  	if(value.length >= 2){
  		this.api.APIListPlace(value).subscribe( (data:any) => {
  			this.listPlaceFrom = data.Places;
        this.listPlaceFromWrite = true;
  		});
  	} else {
        this.listPlaceFrom = '';
        this.listPlaceFromWrite = false;
    }
  }

  getListPlaceTo(value: string){
    if(value.length >= 2){
      this.api.APIListPlace(value).subscribe( (data:any) => {
        this.listPlaceTo = data.Places;
        this.listPlaceToWrite = true;
      });
    } else {
        this.listPlaceTo = '';
        this.listPlaceToWrite = false;
    }
  }

  clickPlaceFrom(value: string){
    this.listPlaceFromWrite = false;
    this.model.originplace = value;
  }

  clickPlaceTo(value: string){
    this.listPlaceToWrite = false;
    this.model.destinationplace = value;
  }

}
