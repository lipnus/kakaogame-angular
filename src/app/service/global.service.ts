import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {

  public gameCount: number = 0;

  //한 스테이지의 점수를 담고 있는 변수
  public stageScore: number = 0;

  //결과창에서 뒤로가기 했을 때 점수가 그대로 보이도록 함
  public tempStageScore: number = 0;

  constructor() {}

}
