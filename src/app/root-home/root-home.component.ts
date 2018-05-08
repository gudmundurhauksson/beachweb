import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root-home',
  templateUrl: './root-home.component.html',
  styleUrls: ['./root-home.component.scss']
})
export class RootHomeComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigate(['/home']);
   }

  ngOnInit() {
  }

}
