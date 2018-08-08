import {Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input} from '@angular/core';
import * as mGlobal from "../../global-variables";
import {MusicData, UserData} from "../../model/index";
import {ModalService} from "../../service/index";
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs/Subscription";
import {GlobalService, PostToServerService} from "../../service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  // 캔버스
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public cx: CanvasRenderingContext2D;
  public screenWidth: any;
  public screenHeight: any;

  private sub: Subscription;


  answerText: String; //정답

  //이미지처리
  labelText:String;
  characterImg_Inactive: String; //캐릭터이미지(비활성)
  characterImg_Active: String; //캐릭터이미지(활성)
  numberImg: String;
  itemImg: String[] = [];
  bubbleImg: String;
  bgImg: String; //배경화면

  //모달
  modalTextImg: String; //perfect, good, bad 글씨 이미지(모달)
  modalFaceImg: String; //캐릭터 얼굴 이미지(모달)
  modalScore: String; //점수(모달)
  modalBtnImg: String; //버튼(모달)
  modalItemImg: String; //모달창에 뜰 아이템이미지(모달)

  //사운드
  audio: any;
  soundLength: number; //들려주는 음악길이

  //게임진행
  theme: number; //stage가 5개 진행될때마다 바뀜
  isPlaying: boolean; //음악이 재생되고 있는지
  modalText:string;
  userData: UserData; //사용자의 게임정보를 담고있는 객체
  musicData: MusicData; //음악정보를 담고 있는 객체
  bonus: boolean; //5초안에 맞추면 보너스
  isFirstPlayed: boolean; //처음 트는 것인지
  bubbleTalking: String; //말풍선 안의 대화

  //결과
  perfectCount:number;
  greatCount:number;
  badCount:number;
  finalScore:number;
  rank: number;

  constructor(private modalService: ModalService,
              private globalService: GlobalService,
              private postToServerService: PostToServerService,
              private router: Router,) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log( "크기: " + this.screenWidth + " / " + this.screenHeight);


    this.userData = new UserData();
    this.userData.life = 3;
    this.userData.score_stage = 0;
    this.userData.stage = 1;

    this.audio = new Audio();
    this.audioListener();
    this.isPlaying = false;
    this.soundLength = 3;

    this.labelText = "정답을 입력하세요";
    this.bubbleTalking = "저를 눌러주세요";

    this.modalBtnImg = "assets/resultpopup_next.png";
    this.theme = 1;
    this.themeControl();

    this.bonus = false;
    this.isFirstPlayed = false;
    this.numberImg = "";
    this.answerText = "";

    this.itemImg[0] = "assets/item_empty.png";
    this.itemImg[1] = "assets/item_empty.png";
    this.itemImg[2] = "assets/item_empty.png";


    if (localStorage.getItem('user_pk')) {
      let auth = JSON.parse(localStorage.getItem('user_pk'));
      this.postUser_Download(auth);
    }
  }



  initStage(){

  }

  timeControl(t: number){
    console.log("시간: " + t);
    if(t==0){
      this.numberImg = "assets/time_5.png";
    }else if(t==1){
      this.numberImg = "assets/time_4.png";
    }else if(t==2){
      this.numberImg = "assets/time_3.png";
    }else if(t==3){
      this.numberImg = "assets/time_2.png";
    }else if(t==4){
      this.numberImg = "assets/time_1.png";
    }else if(t==5){
      this.numberImg = "";
      this.bonus = false;
      this.sub.unsubscribe();
    }
  }

  themeControl(){

    //5개 스테이지마다 1개의 테마 적용
    if(this.userData.stage <= 5){
      this.theme = 1;
    }else if(5 < this.userData.stage && this.userData.stage <= 10){
      this.theme = 2;
    }else if(10 < this.userData.stage && this.userData.stage <= 15){
      this.theme = 3;
    }else if(15 < this.userData.stage && this.userData.stage <= 20){
      this.theme = 4;
    }else if(20 < this.userData.stage){
      this.theme = 5;
    }

    if(this.theme==1){
      this.bgImg="assets/apeach_bg.png"
      this.bubbleImg = "assets/apeach_bubble.png";
      this.characterImg_Active = "assets/apeach_active.gif"
      this.characterImg_Inactive = "assets/apeach_inactive.png"

    }else if(this.theme==2){
      this.bgImg="assets/ryan_bg.png"
      this.bubbleImg = "assets/ryan_bubble.png";
      this.characterImg_Active = "assets/ryan_active.gif"
      this.characterImg_Inactive = "assets/ryan_inactive.png"

    }else if(this.theme==3){
      this.bgImg="assets/muji_bg.png"
      this.bubbleImg = "assets/muji_bubble.png";
      this.characterImg_Active = "assets/muji_acitive.gif";
      this.characterImg_Inactive = "assets/muji_inactive.png"

    }else if(this.theme==4){
      this.bgImg="assets/neo_bg.png"
      this.bubbleImg = "assets/neo_bubble.png";
      this.characterImg_Active = "assets/neo_active.gif"
      this.characterImg_Inactive = "assets/neo_inactive.png"

    }else if(this.theme==5){
      this.bgImg="assets/tube_bg.png"
      this.bubbleImg = "assets/tube_bubble.png";
      this.characterImg_Active = "assets/tube_active.gif"
      this.characterImg_Inactive = "assets/tube_inactive.png"
    }
  }

  audioListener(){
    //재생중일때
    this.audio.addEventListener("timeupdate", (currentTime)=>{
      // console.log("cur: " + this.audio.currentTime);
      if( this.audio.currentTime > this.soundLength ){
        this.stopMusic();
      }
    });

    //최대길이가 변경되었을때
    this.audio.addEventListener("durationchange", (currentTime)=>{
      // console.log("Duration: " + this.audio.duration);
    });

    //재생이 끝났을때
    this.audio.addEventListener("ended", (currentTime)=>{
      // console.log("End Sound.");
      this.stopMusic();
    });
  }

  startMusic(){
    // console.log("음악시작");
    this.isPlaying = true;
    this.audio.src = mGlobal.MusicPath + this.musicData.path;
    this.audio.load();
    this.audio.play();

    //시작
    this.audio.currentTime = 0;
  }

  stopMusic(){
    this.isPlaying = false;
    this.audio.currentTime = 0;
    this.audio.pause();
  }

  onChange_Answer(){
    // console.log("정답 입력중: " + this.answerText + " / " + this.answerText.length);
    if(this.answerText == ""){
      this.labelText="정답을 입력하세요";
    }else if(this.answerText == "시발" || this.answerText == "씨발"){
      this.labelText = "너무해요..";
    }else if(this.answerText == "몰라"){
      this.labelText = "좀더 생각을 해봐요";
    }else if(this.answerText.length > 20){
      this.labelText="답은 그렇게 길지 않을거에요";
    }else if(this.answerText.length == 1){
      this.labelText = "자~"
    }else{
      this.labelText = "정답은.."
    }
  }

  //캐릭터 눌렀을 때
  onClick_PlaySound(){
    if(this.isPlaying==false && this.musicData.path != null){
      this.isPlaying=true;
      this.startMusic();

      //타이머시작
      if(this.isFirstPlayed==false){
        let timer = Observable.timer(2000,1200);
        this.sub = timer.subscribe(t=> {
          this.timeControl(t);
        });
        this.bonus=true;
        this.isFirstPlayed = true;
      }
    }
  }

  onClick_Pass(){

    this.userData.bad += 1;

    this.userData.score_stage -= 40;
    if(this.userData.score_stage < 0){
      this.userData.score_stage = 0;
    }
    this.modalItemImg = "";
    this.openModal("bad");
    this.nextStage();
  }

  onClick_Submit(){
    this.modalItemImg = "";
    this.answerCheck();
  }

  openModal(type: string){

    //5초안에 푼 경우
    if(type=="perfect"){
      this.modalScore = "300"
      this.modalTextImg = "assets/resultpopup_perfect.png";

      if(this.theme==1){
        this.modalFaceImg = "assets/apeach_perfect.png"
      }else if(this.theme==2){
        this.modalFaceImg = "assets/ryan_perfect.png"
      }else if(this.theme==3){
        this.modalFaceImg = "assets/muji_perfect.png"
      }else if(this.theme==4){
        this.modalFaceImg = "assets/neo_perfect.png"
      }else if(this.theme==5){
        this.modalFaceImg = "assets/tube_perfect.png"
      }

    //맞췄지만 5초안에는 못맞춤
    }else if(type=="great"){
      this.modalScore = "100"
      this.modalTextImg = "assets/resultpopup_great.png";

      if(this.theme==1){
        this.modalFaceImg = "assets/apeach_great.png"
      }else if(this.theme==2){
        this.modalFaceImg = "assets/ryan_great.png"
      }else if(this.theme==3){
        this.modalFaceImg = "assets/muji_great.png"
      }else if(this.theme==4){
        this.modalFaceImg = "assets/neo_great.png"
      }else if(this.theme==5){
        this.modalFaceImg = "assets/tube_great.png"
      }

    }else if(type=="bad"){
      this.modalScore = "-40"
      this.modalTextImg = "assets/resultpopup_bad.png";

      if(this.theme==1){
        this.modalFaceImg = "assets/apeach_bad.png"
      }else if(this.theme==2){
        this.modalFaceImg = "assets/ryan_bad.png"
      }else if(this.theme==3){
        this.modalFaceImg = "assets/muji_bad.png"
      }else if(this.theme==4){
        this.modalFaceImg = "assets/neo_bad.png"
      }else if(this.theme==5){
        this.modalFaceImg = "assets/tube_bad.png"
      }
    }

    this.modalText= this.musicData.singer + " - " + this.musicData.name;
    this.modalService.open('stage-modal');
  }


  closeModal(id: string){
    this.modalService.close(id);
  }


  onClick_Test(){
    this.postUser_Update();
    // this.modalService.open('gameover-modal');
  }

  onClick_Bubble(){
    this.bubbleTalking = "말풍선 말고 아래쪽을 눌러주세요~";
  }

  onClick_Item(slot: number){

    this.stopMusic();
    let item="0";

    if(slot==0 && this.userData.item1 != "0"){
      if(this.userData.item1 == "heart"){
        if(this.userData.life < 3){
          item = "heart";
        }else{
          this.bubbleTalking = "이미 하트가 가득해요♥";
        }
      }else if(this.userData.item1 == "singer"){
        item = "singer";
      }else if(this.userData.item1 == "chosung"){
        item = "chosung";
      }
    }

    if(slot==1 && this.userData.item2 != "0"){
      if(this.userData.item2 == "heart" ){
        if(this.userData.life < 3){
          item = "heart";
        }else{
          this.bubbleTalking = "이미 하트가 가득해요♥";
        }
      }else if(this.userData.item2 =="singer"){
        item = "singer";
      }else if(this.userData.item2 == "chosung"){
        item = "chosung";
      }
    }

    if(slot==2 && this.userData.item3 != "0"){
      if(this.userData.item3 == "heart"){
        if(this.userData.life < 3){
          item = "heart";
        }else{
          this.bubbleTalking = "이미 하트가 가득해요♥";
        }
      }else if(this.userData.item3 == "singer"){
        item = "singer";
      }else if(this.userData.item3 == "chosung"){
        item = "chosung";
      }
    }

    //아이템 사용처리
    if(item!="0"){

      //효과발현
      if(item == "heart"){
        this.userData.life += 1;
      }else if(item == "singer"){
        this.bubbleTalking = "'" + this.musicData.singer + "'" + "의 노래에요."
      }else if(item == "chosung"){
        this.bubbleTalking = this.musicData.initial;
      }


      this.itemImg[slot] = "assets/item_empty.png";
      if(slot==0){
        this.userData.item1 = "0";
      }else if(slot ==1){
        this.userData.item2 = "0";
      }else if(slot ==2){
        this.userData.item3 = "0";
      }
    }

    this.postUser_Update();
  }

  //다음스테이지로 이동
  nextStage(){
    this.stopMusic();
    this.isPlaying = false;

    this.userData.stage += 1;
    this.userData.m_order += 1;

    if(this.userData.m_order > 178){
      this.userData.m_order = 0;
    }

    this.postMusic();

    this.themeControl();
    this.bonus = false;
    this.isFirstPlayed = false;
    this.numberImg = "";
    this.answerText = "";
    this.labelText="정답을 입력하세요";
    this.bubbleTalking="저를 눌러주세요";

    this.sub.unsubscribe();
    this.postUser_Update();
  }

  // 정답확인
  answerCheck(){

    this.stopMusic();

    if(this.answerText==""){
      this.bubbleTalking = "정답 칸을 채워주세요";
      return;
    }

    //공백제거
    let answerChkText = this.answerText.replace( /(\s*)/g, "");
    let isCorrect: boolean = false;

    let x = this.musicData.answer.split(",");
    for(let i=0; i<x.length; i++){
      x[i] = x[i].replace( /(\s*)/g, "");
      if(answerChkText == x[i]){
        isCorrect = true;
      }
    }

    if(isCorrect==true){
      let type;
      if(this.bonus==true){
        type = "perfect"
        this.userData.perfect += 1;
        this.userData.score_stage += 300
      }else{
        type = "great"
        this.userData.great += 1;
        this.userData.score_stage += 100
      }

      this.giveItem();
      this.openModal(type);
      this.nextStage();

    }else{
      this.bubbleTalking="정답이 아니에요."
      this.userData.life -= 1;
      this.postUser_Update();

      if(this.userData.life < 1){
        this.gameOver();
      }
    }

  }




  giveItem(){

    //빈 슬롯이 있어야 아이템준다
    if( this.userData.item1=="0" || this.userData.item2=="0" || this.userData.item3=="0" ){

      let itemNum = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
      //1:하트, 2:가수알려주기, 3:초성

      // console.log("아이템: " + itemNum);

      if(itemNum==1){
        this.modalItemImg = "assets/itempopup_heart.png";
        if(this.userData.item1=="0"){
          this.itemImg[0] = "assets/item_heart.png";
          this.userData.item1 = "heart";
        }else if(this.userData.item2=="0"){
          this.itemImg[1] = "assets/item_heart.png";
          this.userData.item2 = "heart";
        }else if(this.userData.item3=="0"){
          this.itemImg[2] = "assets/item_heart.png";
          this.userData.item3 = "heart";
        }
      }//하트

      if(itemNum==2){
        this.modalItemImg = "assets/itempopup_singer.png";
        if(this.userData.item1=="0"){
          this.itemImg[0] = "assets/item_singer.png";
          this.userData.item1 = "singer";
        }else if(this.userData.item2=="0"){
          this.itemImg[1] = "assets/item_singer.png";
          this.userData.item2 = "singer";
        }else if(this.userData.item3=="0"){
          this.itemImg[2] = "assets/item_singer.png";
          this.userData.item3 = "singer";
        }
      }//가수이름

      if(itemNum==3){
        this.modalItemImg = "assets/itempopup_chosung.png";
        if(this.userData.item1=="0"){
          this.itemImg[0] = "assets/item_chosung.png";
          this.userData.item1 = "chosung";
        }else if(this.userData.item2=="0"){
          this.itemImg[1] = "assets/item_chosung.png";
          this.userData.item2 = "chosung";
        }else if(this.userData.item3=="0"){
          this.itemImg[2] = "assets/item_chosung.png";
          this.userData.item3 = "chosung";
        }
      }//초성
    }

  }



  //아이템 갱신
  itemControl(){
    if(this.userData.item1 == "heart"){
      this.itemImg[0] = "assets/item_heart.png";
    }else if(this.userData.item1 == "singer"){
      this.itemImg[0] = "assets/item_singer.png";
    }else if(this.userData.item1 == "chosung"){
      this.itemImg[0] = "assets/item_chosung.png";
    }

    if(this.userData.item2 == "heart"){
      this.itemImg[1] = "assets/item_heart.png";
    }else if(this.userData.item2 == "singer"){
      this.itemImg[1] = "assets/item_singer.png";
    }else if(this.userData.item2 == "chosung"){
      this.itemImg[1] = "assets/item_chosung.png";
    }

    if(this.userData.item3 == "heart"){
      this.itemImg[2] = "assets/item_heart.png";
    }else if(this.userData.item3 == "singer"){
      this.itemImg[2] = "assets/item_singer.png";
    }else if(this.userData.item3 == "chosung"){
      this.itemImg[2] = "assets/item_chosung.png";
    }
  }


  //서버로 유저정보 전송
  postUser_Update(){
    let path = '/user';
    let postData = {userData: this.userData};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      if(this.userData.score_stage==0){
        this.postRanking( this.userData.user_pk );
      }

    });
  }


  //서버에서 유저정보를 가져온다
  postUser_Download( user_pk:number ){
    let path = '/user/download';
    console.log("user_pk: " + user_pk);

    let postData = {user_pk: user_pk};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      console.log("userData Downlonad Done: " , data);
      this.userData = data.userData;
      this.themeControl();
      this.itemControl();
      this.postMusic();
    });
  }

  //서버에서 랭킹정보를 가져온다
  postRanking( user_pk:number ){
    let path = '/ranking';

    let postData = {user_pk: user_pk};
    this.postToServerService.postServer(path, postData).subscribe(data => {

      this.rank = data.rank;
    });
  }

  //서버에서 음악데이터를 가져온다
  postMusic(){

    let path = '/music';
    let postData = {music_order: this.userData.m_order};
    console.log("m_order: " + this.userData.m_order);
    this.postToServerService.postServer(path, postData).subscribe(data => {

      console.log("musicData Downlonad Done: " , data);
      this.musicData = data.musicData;
    });
  }

  //게임오버처리
  gameOver(){

    //최고기록이면 저장
    if(this.userData.score_best < this.userData.score_stage){
      this.userData.score_best = this.userData.score_stage;
    }

    this.perfectCount = this.userData.perfect;
    this.greatCount = this.userData.great;
    this.badCount = this.userData.bad;
    this.finalScore = this.userData.score_stage;

    console.log("aa: " +  this.userData.great);

    this.modalService.open('gameover-modal');
    this.userData.life = 3;
    this.userData.item1 = "0";
    this.userData.item2 = "0";
    this.userData.item3 = "0";
    this.userData.score_stage = 0;
    this.userData.stage = 1;

    this.userData.perfect = 0;
    this.userData.great = 0;
    this.userData.bad = 0;

    this.postUser_Update();
  }

  onClick_GameOver(){
    this.router.navigate(['/splash']);
  }
}
