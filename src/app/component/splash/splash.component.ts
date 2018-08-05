import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//[service]
import { GlobalService } from '../../service/index';
import { PostToServerService } from '../../service/index';
import * as mGlobal from '../../global-variables';  //전역변수

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit, AfterViewInit {

  // 캔버스
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;


  constructor(
    private router: Router,
    private globalService: GlobalService,
    private postToServerService: PostToServerService,
    private http: HttpClient,) { }

  ngOnInit(){
  }

  ngAfterViewInit(): void {
    // this.context = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    // this.draw();
  }

  draw() {
    this.context.beginPath();
    this.context.moveTo(0,0);
    this.context.lineTo(300,150);
    this.context.stroke();

    var image="";
    var drawX = 30; // 이미지 그릴 X좌표
    var drawY = 20; // 이미지 그릴 Y좌표

    // this.context.drawImage(image, drawX, drawY);
  }


  onClick_login(){
    this.router.navigate(['/mainpage']);
  }


  onClick_naverLogin(){
      // this.router.navigate(['/mainpage']);
      // this.router.navigate(['/join']);

      var state = Math.floor(Math.random()*10000000);
       // location.replace("https://nid.naver.com/oauth2.0/authorize?client_id=0Pechfht9BVKa7WombfB&response_type=code&redirect_uri=" + mGlobal.ServerPath + "/auth_naver&state=" + state);

      location.replace("https://nid.naver.com/oauth2.0/authorize?client_id=9OJNhWuG6yafwYhzTuE2&response_type=code&redirect_uri=" + mGlobal.ServerPath + "/auth_naver" + "&state=" + state);
  }


  onClick_deleteCash(){
    console.log("캐쉬삭제");
    localStorage.removeItem('naver_id');
  }


  onClick_kakao(){
    console.log("로그인처리");
    this.router.navigate(['/stage']);
  }



}
