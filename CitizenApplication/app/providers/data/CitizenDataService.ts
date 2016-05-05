import CitizenDataServiceInterface from './CitizenDataServiceInterface.ts';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import Bus from '../model/Bus.ts';
import Line from '../model/Line.ts';
import Stop from '../model/Stop.ts';
import Route from '../model/Route.ts';
import Point from '../model/geojson/Point.ts';
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import PersistentDataProviderInterface from "./PersistentDataProviderInterface";
import {UpdateData} from "../model/UpdateData";

@Injectable()
/**
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService implements CitizenDataServiceInterface{

	constructor(){}

	private restApi: RestApiProviderInterface /*TODO initialize*/ ;
	private storageApi : PersistentDataProviderInterface /*TODO initialize*/;
	private cache:CitizenDataCache = new CitizenDataCache;


	/*
	* Interface methods
	*/

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(filter?: Stop): Stop[]{
		//TODO
		return undefined;
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(filter?: Line): Line[] {
		//TODO
		return undefined;
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(filter?: Bus): Bus[] {
		//TODO
		return undefined;
	};

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number): { position: Point, delay: number } {
		//TODO
		return undefined;
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Route objects
	*/
	getRoutes(filter?: Route): Route[] {
		//TODO
		return undefined;
	};

	/**
	* Requests an update from the data source
	*/
	update(): void {
		//TODO
	};

	/**
	 * Fetches the data from the storage
	 * @returns CitizenDataCache with the data from the storage
     */
	private populateDataCache():CitizenDataCache{
		//TODO
		return undefined;
	};

}

/**
 * Structure to hold the cached data
 */
class CitizenDataCache{
	cached_busses : Bus[] = [];
	cached_lines : Line[]=[];
	cached_stops: Stop[]=[];
	cached_routes: Route[]=[];
	cached_timestamp : UpdateData = new UpdateData;
}