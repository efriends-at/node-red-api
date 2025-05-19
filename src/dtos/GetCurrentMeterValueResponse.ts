import { GridMeterData } from '@app/dtos/GridMeterData';

export interface GetCurrentMeterValueResponse {
	endTime: string;
	startTime: string;
	energyBalance: number;
	details: GridMeterData;
}

