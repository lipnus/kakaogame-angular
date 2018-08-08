import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//[service]
import { GlobalService } from '../../service/index';
import { PostToServerService } from '../../service/index';
import * as mGlobal from '../../global-variables';
import {ModalService} from "../../service";  //전역변수

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  nicknameText: string;
  nicknameOk: boolean;
  isOverlap: boolean;

  score:number;
  rank:number;

  isJoined:boolean;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private globalService: GlobalService,
    private postToServerService: PostToServerService,) { }


  ngOnInit(){
    this.nicknameOk = false;
    this.isOverlap = false;

    this.score = 0;
    this.rank = 0;

    this.isJoined = false;
    if (localStorage.getItem('user_pk')) {
      this.isJoined = true;
      let user_pk = localStorage.getItem('user_pk');
      this.postRanking( parseInt(user_pk) );
    }


  }



  onClick_kakao(){
    if (localStorage.getItem('user_pk')) {
      this.router.navigate(['/stage']);
    }else{
      this.modalService.open('nickname-modal');
    }
  }

  onChange_Nickname(){
    this.isOverlap = false;

    if(this.nicknameText.length > 1){
      this.nicknameOk = true;
    }else{
      this.nicknameOk = false;
    }
  }

  onClick_Join(){
    this.postOverlap();
  }

  onClick_Test(){
    localStorage.removeItem('user_pk');
    this.modalService.open('nickname-modal');
  }


  //유저등록
  postJoin(){
    let path = '/join';
    let postData = {nickname: this.nicknameText};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      if(data.pk != null){
        localStorage.setItem('user_pk', data.pk);
        this.router.navigate(['stage']);
      }
    });
  }


  //닉네임중복체크
  postOverlap(){
    let path = '/join/overlap';
    console.log("보낸닉네임: " + this.nicknameText);
    let postData = {nickname: this.nicknameText};
    this.postToServerService.postServer(path, postData).subscribe(data => {
      console.log(data);
      if(data.overlap == "ok"){
        this.isOverlap = true;
        this.nicknameOk = false;
      }else{
        this.postJoin();
      }
    });
  }


  //서버에서 유저정보를 가져온다
  postRanking( user_pk:number ){
    let path = '/ranking';

    let postData = {user_pk: user_pk};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      this.score = data.userData.score_best;
      this.rank = data.rank;
    });
  }



}
