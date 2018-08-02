import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map'

import * as mGlobal from '../global-variables';  //전역변수

@Injectable()
export class PostToServerService {

  constructor( private http: HttpClient) { }


  postServer(path:string, postData:object){
    var URL = mGlobal.ServerPath + path;
    return this.http.post<any>(URL, postData).map(data => { return data });
  }

  getServer(path:string, sehdData:object){

    console.log("게리깃깃");

    return this.http.get(path).map(data => { return data });
  }
}
