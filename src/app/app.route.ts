import { Routes, RouterModule } from '@angular/router';
import {NgModule} from "@angular/core";

//[Component]
import { SplashComponent } from './splash/splash.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RankingComponent } from './ranking/ranking.component';
import { InformationComponent } from './information/information.component';
import { QuizComponent } from './quiz/quiz.component';
import { AnswerComponent } from './answer/answer.component';
import { ResultComponent } from './result/result.component';
import { JoinComponent } from './join/join.component';

//[Guard]
import { AuthGuard } from './guard/index';
// , canActivate: [AuthGuard]

const routes: Routes = [

  { path: '', component: SplashComponent },
  { path: 'splash', component: SplashComponent },
  { path: 'mainpage', component: MainpageComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard] },
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
export class AppRoutingModule { }
