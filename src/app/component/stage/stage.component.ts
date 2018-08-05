import {Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input} from '@angular/core';
import * as mGlobal from "../../global-variables";
import {UserData} from "../../model/index";
import {ModalService} from "../../service/index";
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, AfterViewInit {

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

  //사운드
  audio: any;
  soundLength: number; //들려주는 음악길이

  //게임진행
  theme: number; //stage가 5개 진행될때마다 바뀜
  isPlaying: boolean; //음악이 재생되고 있는지
  modalText:string;
  userData: UserData; //사용자의 게임정보를 담고있는 객체
  bonus: boolean; //5초안에 맞추면 보너스
  bubbleTalking: String; //말풍선 안의 대화

  constructor(private modalService: ModalService,) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log( "크기: " + this.screenWidth + " / " + this.screenHeight);


    //초시작
    let timer = Observable.timer(2000,1200);
    this.sub = timer.subscribe(t=> {
      this.timeControl(t);
    });
    this.bonus = true;


    this.userData = new UserData();
    this.userData.life = 1;
    this.userData.score_stage = 100;
    this.userData.stage = 1;

    this.audio = new Audio();
    this.audioListener();
    this.isPlaying = false;
    this.soundLength = 3;

    this.bubbleImg = "assets/apeach_bubble.png";
    this.labelText = "정답을 입력하세요";
    this.answerText = "";
    this.bubbleTalking = "나를 눌러주세요";

    this.modalTextImg = "assets/resultpopup_bad.png";
    this.modalFaceImg = "assets/apeach_bad.png";
    this.modalBtnImg = "assets/resultpopup_next.png";
    this.modalScore = "100";
    this.modalText="아이유 - 좋은날";

    this.numberImg = "";
    this.itemImg[0] = "assets/item_empty.png";
    this.itemImg[1] = "assets/item_empty.png";
    this.itemImg[2] = "assets/item_empty.png";

    this.theme = 1;
    if(this.theme==1){
      this.characterImg_Inactive = "assets/apeach_inactive.png";
      this.characterImg_Active = "assets/apeach_active.gif";
    }
  }



  initStage(){

  }


  ngAfterViewInit(): void {
    // const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    // this.cx = canvasEl.getContext('2d')!;
    //
    // canvasEl.width = this.screenWidth;
    // canvasEl.height = this.screenHeight;
    // this.draw();
  }

  draw(){
    let image = new Image();

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    image.onload = ()=> {
      this.cx.drawImage(image, 0, 0, this.screenWidth, this.screenHeight);
    }

    image.src = "assets/apeach_bg.png";
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
      this.sub.unsubscribe();
      this.bonus = false;
    }
  }

  themeControl(){

    if(this.theme==1){
      this.modalFaceImg = "assets/apeach_bad.png";
      this.modalBtnImg = "assets/resultpopup_next.png";

    }else if(this.theme==2){
      this.modalFaceImg = "assets/apeach_bad.png";
      this.modalBtnImg = "assets/resultpopup_next.png";

    }else if(this.theme==3){
      this.modalFaceImg = "assets/apeach_bad.png";
      this.modalBtnImg = "assets/resultpopup_next.png";

    }else if(this.theme==4){

    }else if(this.theme==5){

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
      console.log("Duration: " + this.audio.duration);
    });

    //재생이 끝났을때
    this.audio.addEventListener("ended", (currentTime)=>{
      console.log("End Sound.");
      this.stopMusic();
    });
  }

  startMusic(){
    console.log("음악시작");
    this.isPlaying = true;
    this.audio.src = "assets/test.mp3";
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
    }else if(this.answerText.length > 12){
      this.labelText="답은 그렇게 길지 않을거에요";
    }else if(this.answerText.length == 1){
      this.labelText = "자~"
    }else{
      this.labelText = "정답은"
    }
  }

  onClick_PlaySound(){
    if(this.isPlaying==false){
      this.isPlaying=true;
      this.startMusic();
    }
  }

  onClick_Pass(){

  }

  onClick_Submit(){

  }

  openUrlModal(){
    this.modalService.open('stage-modal');
  }

  closeModal(id: string){
    this.modalService.close(id);
  }

  onClick_Test(){
    this.openUrlModal()
  }
}
