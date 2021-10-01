import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';
import {
  SubscriptionModel,
  SubscriptionNotificationModel,
} from 'src/app/models/subscription.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/components/dialogs/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { CycleService } from 'src/app/services/cycle.service';
import { CycleSelectReports } from 'src/app/components/dialogs/cycle-select-reports/cycle-select-reports.component';

@Component({
  selector: 'subscription-report-tab',
  templateUrl: './subscription-report-tab.component.html',
  styleUrls: ['./subscription-report-tab.component.scss'],
})
export class SubscriptionReportTab implements OnInit {
  subscription: SubscriptionModel;
  selectedCycle: any;
  emailsSent = new MatTableDataSource<SubscriptionNotificationModel>();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['report', 'sent', 'to', 'from'];
  loading = false;
  includeNonhuman = false;

  constructor(
    private subscriptionSvc: SubscriptionService,
    private cycleSvc: CycleService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.subscription = new SubscriptionModel();
  }

  ngOnInit() {
    this.subscriptionSvc.subBehaviorSubject.subscribe(
      (data: SubscriptionModel) => {
        if ('subscription_uuid' in data && data.cycles) {
          this.subscription = data;
          this.emailsSent.sort = this.sort;
          const selectedCycleIndex = 0;
          this.selectedCycle = this.subscription.cycles[selectedCycleIndex];
          console.log(this.subscription.notification_history);
          this.emailsSent.data = this.subscription.notification_history;
        }
      }
    );
  }

  refresh() {}

  downloadObject(filename, blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  cycleChange(event) {}

  viewReport(reportType: string) {
    this.router.navigate([
      `/reports/${reportType}/${this.selectedCycle.cycle_uuid}`,
    ]);
  }

  downloadReport(reportType: string) {
    this.loading = true;
    this.subscriptionSvc
      .downloadReport(
        [this.selectedCycle.cycle_uuid],
        reportType,
        this.includeNonhuman
      )
      .subscribe(
        (blob) => {
          this.downloadObject(`subscription_${reportType}_report.pdf`, blob);
          this.loading = false;
        },
        (error) => {
          this.popupReportError(error, 'downloading', reportType);
        }
      );
  }

  sendReport(reportType: string) {
    this.loading = true;
    this.subscriptionSvc
      .sendReport(
        [this.selectedCycle.cycle_uuid],
        reportType,
        this.includeNonhuman
      )
      .subscribe(
        () => {
          this.loading = false;
          this.updateReportList();
        },
        (error) => {
          this.popupReportError(error, 'sending', reportType);
        }
      );
  }

  popupReportError(error: any, action: string, type: string) {
    this.loading = false;
    this.dialog.open(AlertComponent, {
      data: {
        title: 'Error',
        messageText: `An error occured ${action} the ${type} report. Check logs for more detail.`,
      },
    });
  }

  updateReportList() {
    this.emailsSent.data = this.subscription.notification_history;
  }

  downloadCycleData() {
    this.cycleSvc.getCycle(this.selectedCycle.cycle_uuid).subscribe((cycle) => {
      this.subscriptionSvc
        .getSubscription(cycle.subscription_uuid)
        .subscribe((subscription) => {
          const data = { cycle, subscription };
          const filename = `${subscription.name}_cycle_data.json`;
          const blob = new Blob([JSON.stringify(data)]);
          this.downloadObject(filename, blob);
        });
    });
  }
  openCycleSelectionDialog() {
    let dialogOptions = {
      cycles: this.subscription.cycles,
      sub_name: this.subscription.name,
    };

    let dialogRef = this.dialog.open(CycleSelectReports, {
      data: dialogOptions,
    });

    let cycle_uuids = [];
    dialogRef.afterClosed().subscribe((val) => {
      cycle_uuids = val.cycles;
      var reportType = val.reportType;
      if (cycle_uuids.length > 0) {
        this.subscriptionSvc.downloadReport(cycle_uuids, reportType).subscribe(
          (success) => {
            this.downloadObject(`subscription_cycleset_report.pdf`, success);
          },
          (failure) => {
            console.log(failure);
          }
        );
      } else {
        this.dialog.open(AlertComponent, {
          data: {
            title: 'Error',
            messageText: ``,
          },
        });
      }
    });
  }
}
