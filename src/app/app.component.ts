import {Component, AfterViewInit, Input, ViewChild, ElementRef} from '@angular/core';
import { GetDataService } from './getdata.service';
import { fromEvent, of } from 'rxjs';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GetDataService]
})


export class AppComponent implements AfterViewInit {
  @ViewChild('inputKeyRef') inputKeyRef: ElementRef;
  mapped = [];
  dataView = [];
  dataGet = [];
  storedProject = [];
  filterLanguage = new Set();
  constructor( private dataService: GetDataService ) { }
  // make request by keyword
  onSearchChange(searchValue: string ) {
    this.dataService.getData(searchValue)
      .subscribe(val => {
      this.mapped = Object.keys(val).map(key => ({type: key, value: val[key]}));
      this.dataGet = this.mapped[2]['value'];
      for (let data of this.dataGet) {
        this.filterLanguage.add(data['language']);
      }
      // set view elements as all we get
      this.dataView = this.dataGet;
      console.log(this.dataView);
      console.log(this.filterLanguage);
    });
  }
  // save new element of 'favorite' to storage
  saveElement(element) {
    console.log(element);
    // add only unique elements using 'SET'
    let set = new Set (this.storedProject);
    set.add(element);
    this.storedProject = Array.from(set);
    localStorage.setItem('favoriteProjects', JSON.stringify(this.storedProject));
  }
  // sort view elements
  selectOption(filter) {
    if (filter !== 'Language') {
      console.log(filter);
      this.dataView = [];
      for (let item of this.dataGet) {
        if (item['language'] === filter) {
          this.dataView.push(item);
        }
      }
    } else {
      this.dataView = this.dataGet;
    }
  }

  ngAfterViewInit() {
    // set input field
    fromEvent(this.inputKeyRef.nativeElement, 'keyup')
      // get value
      .pipe(map((evt: any) => evt.target.value))
      // emit after 1s of silence
      .pipe(debounceTime(1000))
      // emit only if data changes since the last emit
      .pipe(distinctUntilChanged())
      // subscription
      .subscribe((text: string) => this.onSearchChange(text));
    // get data from local storage
    let temp = JSON.parse(localStorage.getItem('favoriteProjects'));
    for (let item of temp) {
      this.storedProject.push(item);
    }
    console.log(this.storedProject);
  }
}
