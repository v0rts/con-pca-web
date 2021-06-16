import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Template } from 'src/app/models/template.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertComponent } from 'src/app/components/dialogs/alert/alert.component';

@Component({
  selector: 'app-template-select-dialog',
  templateUrl: './template-select-dialog.component.html',
  styleUrls: ['./template-select-dialog.component.scss'],
})
export class TemplateSelectDialogComponent {
  decep_level: '';

  selectedArray: Array<Template>;
  availableArray: Array<Template>;

  selectedList: MatTableDataSource<Template>;
  avaiableList: MatTableDataSource<Template>;
  emptyList: MatTableDataSource<Template>;
  // @ViewChild('selectedSort') selectedSort: MatSort;
  // @ViewChild('availableSort') availableSort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Object,
    public dialog: MatDialog
  ) {
    this.decep_level = data['decep_level'];
    this.selectedArray = data['selected'];
    this.availableArray = data['available'];
    this.initMatTables();
  }
  displayHTML = '';

  displayedColumnsSelected = ['name', 'deception_score', 'remove'];
  displayedColumnsAvailable = ['name', 'deception_score', 'add'];

  initMatTables() {
    this.selectedList = new MatTableDataSource<Template>(
      this.selectedArray as Template[]
    );
    // this.selectedList.sort = this.selectedSort;
    this.avaiableList = new MatTableDataSource<Template>(
      this.availableArray as Template[]
    );
    // this.selectedList.sort = this.availableSort;
  }
  ngOnInit(): void {}

  remove(template) {
    if (this.selectedArray.length > 1) {
      for (var i = 0; i < this.selectedArray.length; i++) {
        if (this.selectedArray[i]['template_uuid'] == template.template_uuid) {
          this.availableArray.push(template);
          this.selectedArray.splice(i, 1);
          i = this.selectedArray.length;
          this.initMatTables();
        }
      }
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          title: '',
          messageText: 'Can not remove all templates',
        },
      });
    }
  }

  add(template) {
    for (var i = 0; i < this.availableArray.length; i++) {
      if (this.availableArray[i]['template_uuid'] == template.template_uuid) {
        this.selectedArray.push(template);
        this.availableArray.splice(i, 1);
        i = this.availableArray.length;
        this.initMatTables();
      }
    }
  }

  test() {
    console.log(this.data);
    console.log('test from modal');
  }

  public filterList = (value: string) => {
    this.selectedList.filter = value.trim().toLocaleLowerCase();
    this.avaiableList.filter = value.trim().toLocaleLowerCase();
  };

  display(html) {
    var re = '<%URL%>';
    this.displayHTML = html.replace(re, 'javascript:void(0)');

    console.log(html);
  }
}