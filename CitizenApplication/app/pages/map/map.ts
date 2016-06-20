/**
 * Created by mmueller on the XX.05.2016.
 * Edited by skaldo on 09.05.2016.
 * Added i18n support by tim284 on the 28.05.2016
 * Reviewed by skaldo on the 29.05.2016 - inject pipe application-wide, restructured a bit.
 * Added native google maps support.
 */
import {Page, NavController} from 'ionic-angular';
import {Component, ViewChild} from  '@angular/core';
import {NativeMap} from '../../components/native-map/native-map';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';

@Component({
  templateUrl: 'build/pages/map/map.html',
  directives: [NativeMap]
})
export class MapPage {

  private logger: Logger;

  @ViewChild(NativeMap) nativeMap: NativeMap;
  constructor(public nav: NavController, private config: ConfigurationService) {
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'MapPage', config.misc.log_pretty_print);
  }
}
