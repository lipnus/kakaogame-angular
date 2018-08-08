import { Routes, RouterModule } from '@angular/router';
import {NgModule} from "@angular/core";

//[Component]
import { SplashComponent } from './component/splash/splash.component';
import { MainpageComponent } from './component/mainpage/mainpage.component';
import { RankingComponent } from './component/ranking/ranking.component';
import { InformationComponent } from './component/information/information.component';
import { QuizComponent } from './component/quiz/quiz.component';
import { AnswerComponent } from './component/answer/answer.component';
import { ResultComponent } from './component/result/result.component';
import { JoinComponent } from './component/join/join.component';
import { StageComponent } from "./component/stage/stage.component";

//[Guard]
import { AuthGuard } from './guard/index';
// , canActivate: [AuthGuard]

const routes: Routes = [

  //카카오게임
  { path: '', component: SplashComponent },
  { path: 'splash', component: SplashComponent, canActivate: [AuthGuard] },
  { path: 'stage', component: StageComponent },


  //이전것들 일단 남겨놓음
  { path: 'mainpage', component: MainpageComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent },
  { path: 'information', component: InformationComponent, canActivate: [AuthGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'answer', component: AnswerComponent, canActivate: [AuthGuard] },
  { path: 'answer/:music_pk', component: AnswerComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinComponent, canActivate: [AuthGuard] },
  { path: 'join/:state', component: JoinComponent },
  { path: 'result', component: ResultComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [ RouterModule .forRoot (routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
