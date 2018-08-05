import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

//[service]
import { GlobalService } from '../../service/index';
import { PostToServerService } from '../../service/index';
import { CashService } from '../../service/index';

//[model]
import { Ranking } from '../../model/index';
import * as mGlobal from '../../global-variables';  //전역변수
import {Location} from '@angular/common';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  userList: Array<Ranking> = [];

  constructor(
    private router: Router,
    private _location: Location,
    private postToServerService: PostToServerService,
    private cashService: CashService,
    private http: HttpClient,) { }

  ngOnInit() {
    this.postRanking();
  }

  postRanking(){
    let path = '/ranking';
    let postData = {naver_id:this.cashService.getNaverId()};

    this.postToServerService.postServer(path, postData).subscribe(data => {
      this.userList = data;
    });
  }

  onClick_back(){
    this._location.back();
  }

}
