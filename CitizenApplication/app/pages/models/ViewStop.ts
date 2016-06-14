/**
 * ViewStop
 * Author: skaldo, 05.06.2016
*/

import {ViewSchedule} from './ViewSchedule';
import {Point, IStop} from '../../providers/model';
import * as moment from 'moment/moment';
import {ViewObject} from './ViewObject';

export class ViewStop extends ViewObject {
  public name: string;
  public location: Point;
  public schedule: Array<ViewSchedule> = new Array<ViewSchedule>();
  public lines: { id: number }[];
  public timestamp: number;

  constructor(stop: IStop) {
    super(stop);
    this.location = stop.location;
    this.name = stop.name;

    stop.schedule.forEach(schedule => {
      this.schedule.push({
        lineName: schedule.lineName,
        lineId: schedule.lineId,
        stopId: schedule.stopId,
        arrivingTime: moment(schedule.arrivingTime, 'HH-mm-ss')
      });
    });

    this.lines = [];
    let linesHelper = [];

    // Do the sorting & get the lines of the stop.
    this.schedule.sort((a, b) => {
      linesHelper[a.lineId] = true;
      linesHelper[b.lineId] = true;
      return a.arrivingTime.unix() - b.arrivingTime.unix();
    });

    linesHelper.forEach((value, index) => {
      if (value) {
        this.lines.push({ id: index });
      }
    });

    this.lines.sort((a, b) => {
      return b.id - a.id;
    });
  }

  public getSchedules(first: number) {
    return this.schedule.slice(0, first);
  }

  public getLines() {
    return this.lines;
  }
}