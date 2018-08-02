import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//[service]
import { GlobalService } from '../service/index';
import { PostToServerService } from '../service/index';
import { CashService } from '../service/index';

//[model]
import { MusicInfo } from '../model/index';
import * as mGlobal from '../global-variables';  //전역변수

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  private score:number;
  private rank:number;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private postToServerService: PostToServerService,
    private cashService: CashService,
    private http: HttpClient,
  ) { }

  ngOnInit() {

    //랭킹에서 돌아왔을때 보이도록
    this.globalService.tempStageScore = this.globalService.stageScore;
    this.score = this.globalService.tempStageScore;

    this.postScore(this.globalService.stageScore);

    this.rank = 0; //기본값
    this.globalService.stageScore = 0; //초기화

  }

  onClick_ranking(){
    this.router.navigate(['/ranking']);
  }

  onClick_mainpage(){
    this.router.navigate(['/mainpage']);
  }

  postScore(score:number){
    let path = '/score';
    let postData = {naver_id:this.cashService.getNaverId(), score:score};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      console.log(data);
      this.rank = data.rank;

    });
  }

}
