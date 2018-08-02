import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class CashService {

  constructor(private router: Router) { }

  setNaverId(naver_id){
    console.log("저장:" + naver_id);
    localStorage.setItem('naver_id', JSON.stringify({ naver_id: naver_id }));
  }

  getNaverId():string{
    if (localStorage.getItem('naver_id')) {
        let cash = JSON.parse(localStorage.getItem('naver_id'));
        return cash.naver_id;
    }else{
      this.router.navigate(['/splash']);
      return "empty";
    }
  }

  deleteNaverId(){
    localStorage.removeItem('naver_id');
  }

}
