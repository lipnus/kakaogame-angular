import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

//[service]
import { GlobalService } from '../../service/index';
import { PostToServerService } from '../../service/index';

//[model]
import { MusicInfo } from '../../model/index';
import * as mGlobal from '../../global-variables';  //전역변수

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {

  youtubePath;

  countImgPath: string;
  albumPath:string;
  music_pk:any; //quiz.ts에서 받아온 값
  musicInfo:MusicInfo;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private domSanitizer : DomSanitizer,
    private globalService: GlobalService,
    private postToServerService: PostToServerService,
    private http: HttpClient, ) { }

  ngOnInit() {

    //주소뒤에 붙은 숫자 가져오기
    this.music_pk = this.activeRoute.snapshot.paramMap.get('music_pk');
    this.setcountButton();
    this.postMusic(this.music_pk);
  }

  setcountButton(){
    let count = 1; //혹시 값이 유실되었을 때를 대비
    count = this.globalService.gameCount;

    if(count==1){this.countImgPath="assets/2ndnextquiz.png";}
    else if(count==2){this.countImgPath="assets/3rdnextquiz.png";}
    else if(count==3){this.countImgPath="assets/4thnextquiz.png";}
    else if(count==4){this.countImgPath="assets/5thnextquiz.png";}
    else if(count>4){this.countImgPath="assets/result.png"}
    else{
      this.countImgPath="assets/nextquiz.png";
    }//if
  }

  postMusic(music_pk:number){
    let path = '/music';
    let postData = {user_pk:1, music_pk:music_pk};

    this.postToServerService.postServer(path, postData).subscribe(data => {
      this.musicInfo = data;

      //앨범자켓 경로설정
      this.setAlbumPath(this.musicInfo.album);

      //유튜브 경로설정
      this.setYoutubePath(this.musicInfo.youtube);
    });
  }

  setAlbumPath(fileName:string){
    this.albumPath = mGlobal.AlbumPath + fileName;
  }

  //경로 지정
  setYoutubePath(fullPath){
    let pathArray;

    if(fullPath.indexOf('=') > 0){
      // console.log("=");
      pathArray = fullPath.split('=');
      // pathArray = fullPath.split("/");
    }else{
      // console.log("/");
      pathArray = fullPath.split('/');
    }

    // console.log("아이디: " +  pathArray[pathArray.length-1]);
    this.youtubePath = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + pathArray[pathArray.length-1] + '?autoplay=1');

  }

  //카운트를 조율하며 다음 버튼 컨트롤
  onClick_next(){
    if(this.globalService.gameCount > 4){
        this.globalService.gameCount = 1;
        this.router.navigate(['/result']);
    }else{
      this.router.navigate(['/quiz']);
      this.globalService.gameCount++;
    }
  }


}
