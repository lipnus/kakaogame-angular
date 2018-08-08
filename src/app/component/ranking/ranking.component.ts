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
import {Ranking, UserData} from '../../model/index';
import * as mGlobal from '../../global-variables';  //전역변수
import {Location} from '@angular/common';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  userList: Array<Ranking> = [];
  rank: number;
  userData: UserData;

  constructor(
    private router: Router,
    private _location: Location,
    private postToServerService: PostToServerService,
    private cashService: CashService,
    private http: HttpClient,) { }

  ngOnInit() {

    if (localStorage.getItem('user_pk')) {
      let auth = JSON.parse(localStorage.getItem('user_pk'));
      this.postRanking(auth);
    }

  }

  postRanking(user_pk: string){
    let path = '/ranking/all';
    let postData = {user_pk: user_pk};

    this.postToServerService.postServer(path, postData).subscribe(data => {
      this.userList = data.user;
      this.userData = data.userData;
      this.rank = data.rank;
    });
  }

  onClick_back(){
    this._location.back();
  }

}
