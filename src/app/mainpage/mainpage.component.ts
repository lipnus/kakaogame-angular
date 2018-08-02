import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import * as mGlobal from '../global-variables';  //전역변수
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(
    private router: Router,
    private globalService: GlobalService) { }

  ngOnInit() {
  }



  onClick_start(){
    this.globalService.gameCount = 1;
    this.router.navigate(['/quiz']);
  }

  onClick_ranking(){
    this.router.navigate(['/ranking']);
  }

  onClick_information(){
    this.router.navigate(['/information']);
  }



}
