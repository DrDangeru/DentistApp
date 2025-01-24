import { Component, Injectable, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import {MatInput} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-docs-info',
  templateUrl: './docs-info.component.html',
  styleUrls: ['./docs-info.component.css']
})

export class DocsInfoComponent implements OnInit{
  public matIcons = new MatIconModule;

  ngOnInit(): void {}

}
