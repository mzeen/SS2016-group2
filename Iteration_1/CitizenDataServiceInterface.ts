// Currently no idea where this files can be found
import Bus from 'somewhere';
import Line from 'somewhere';
import Stop from 'somewhere';
import Route from 'somewhere';
import Point from 'GeoJSON';

export default CitizenDataServiceInterface;

/**
* Interface of the data logic for the Citizen App
*/
interface CitizenDataServiceInterface {

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(filter?:Stop): Stop[];

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(filter?:Line): Line[];

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(filter?:Bus): Bus[];

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number): { position: Point, delay: number };

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Route objects
	*/
	getRoutes(filter?: Route): Route[];

	/**
	* Requests an update from the data source
	*/
	update(): void;
}