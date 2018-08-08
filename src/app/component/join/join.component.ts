import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//[service]
import { GlobalService } from '../../service/index';
import { CashService } from '../../service/index';
import { PostToServerService } from '../../service/index';

//[model]
import { MusicInfo } from '../../model/index';
import * as mGlobal from '../../global-variables';  //전역변수

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css', ]
//  '/join.component-input.css'
})
export class JoinComponent implements OnInit {

  nicknameStr:string;
  contactStr:string;
  state:any;

  naverData:any; //귀찮아서 걍 이렇게..


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private cashService: CashService,
    private postToServerService: PostToServerService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.nicknameStr="";
    this.contactStr="";

    this.state = this.route.snapshot.paramMap.get('state');
    console.log("받은값: " + this.state);

    this.getNaver();
  }

  //유저정보 등록
  public postUser(){
    let path = '/user';

    //데이터를 받지 못한 경우 기본값 할당
    if(this.naverData.userinfo.name==null)
    {this.naverData.userinfo.name = "0"}
    if(this.naverData.userinfo.age==null)
    {this.naverData.userinfo.age = "0"}
    if(this.naverData.userinfo.profile_image==null)
    {this.naverData.userinfo.profile_image = "0"}
    if(this.naverData.userinfo.gender==null)
    {this.naverData.userinfo.gender = "0"}

    let postData = {
      naver_id:this.naverData.userinfo.id,
      name:this.naverData.userinfo.name,
      nickname:this.nicknameStr,
      contact:this.contactStr,
      age:this.naverData.userinfo.age,
      profile:this.naverData.userinfo.profile_image,
      gender:this.naverData.userinfo.gender
    };

    this.postToServerService.postServer(path, postData).subscribe(data => {
      this.cashService.setNaverId(this.naverData.userinfo.id);
      this.router.navigate(['/mainpage']);
    });
  }


  //유저기본정보 받기
  public getNaver(){
    let path = '/auth_naver/userinfo';
    let postData = {state:this.state};

    this.postToServerService.postServer(path, postData).subscribe(data => {
      console.log("네이버: ", data);
      this.naverData = data;

      if(data.result=="no_token"){//뭔 일이 생겨 temp에 토큰이 없는 상태
        this.router.navigate(['/spalsh']);

      }else if(data.result=="joined"){//이미 가입
        this.cashService.setNaverId(this.naverData.userinfo.id);
        this.router.navigate(['/mainpage']);

      }else{ //result=newuser 신규가입
        //캐시에 naver_id는 유저정보를 입력하고 mainpage로 넘어가는 시점에 저장
      }

    });
  }


  public onClick_join(){
    if(this.nicknameStr.length == 0){
      alert("닉네임을 입력해주세요");
    }else if(this.nicknameStr.length > 8){
      alert("닉네임은 8자 이내로 작성해주세요");
    }else if(this.contactStr.length == 0){
      alert("연락처를 입력해주세요");
    }else{

      if(this.naverData == null){
        this.router.navigate(['/spalsh']);
      }else{
        this.postUser();
      }

    }
  }




}
