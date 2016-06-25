import {Component, ElementRef} from '@angular/core';
import {Page, NavController, Toast, Modal} from 'ionic-angular';
import {StopListPage} from '../stop-list/stop-list';
import {BusDetailPage} from '../bus-detail/bus-detail';
import {RequestStopPage} from '../request-stop/request-stop';
import {ConfigurationService} from '../../providers/config';
import {Logger, LoggerFactory} from '../../providers/logger';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private ip: string;
  private reqNumber: number;
  private logger: Logger;
  constructor(private element: ElementRef, public nav: NavController, private config: ConfigurationService) {
    this.reqNumber = 0;
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'HomePage', config.misc.log_pretty_print);
  }

  requestStop() {
    let requestStopModal = Modal.create(RequestStopPage);
    this.element.nativeElement.setAttribute('hidden', '');
    this.nav.present(requestStopModal);
    requestStopModal.onDismiss(() => {
      this.element.nativeElement.removeAttribute('hidden');
    });
  }

  goToBusDetail() {
    this.nav.push(BusDetailPage, { lineId: 1, time: new Date() });
  }

  // hide nav bar when we enter the page
  ionViewWillEnter() {
    this.element.nativeElement.removeAttribute('hidden');
  }

  // show nav bar when we leave the page
  ionViewDidLeave() {
    this.element.nativeElement.setAttribute('hidden', '');
  }
}
