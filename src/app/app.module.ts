// [Module]
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app.route';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ModalModule } from "angular-custom-modal";


// [Service]
import { GlobalService } from './service/index';
import { PostToServerService } from './service/index';
import { CashService } from './service/index';
import { ModalService } from "./service/index";


// [Component]
import { AppComponent } from './app.component';
import { SplashComponent } from './component/splash/splash.component';
import { MainpageComponent } from './component/mainpage/mainpage.component';
import { RankingComponent } from './component/ranking/ranking.component';
import { InformationComponent } from './component/information/information.component';
import { QuizComponent } from './component/quiz/quiz.component';
import { AnswerComponent } from './component/answer/answer.component';
import { ResultComponent } from './component/result/result.component';
import { JoinComponent } from './component/join/join.component';
import { ModalComponent } from './directive/index';

//[Guard]
import { AuthGuard } from './guard/index';
import { StageComponent } from './component/stage/stage.component';



@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    MainpageComponent,
    RankingComponent,
    InformationComponent,
    QuizComponent,
    AnswerComponent,
    ResultComponent,
    JoinComponent,
    StageComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule,
    // ModalModule,
  ],
  providers: [
    GlobalService,
    PostToServerService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthGuard,
    CashService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
