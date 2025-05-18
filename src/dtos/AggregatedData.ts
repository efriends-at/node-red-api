import { ProductionData } from '@app/dtos/ProductionData';

export interface AggregatedData {
	producer: boolean;
	consumer: boolean;
	pv: number;
	water: number;
	biogas: number;
	wind: number;
	eFriendsEnergy: number;
	toCommunity: number;
	toSupplier: number;
	toGrid: number;
	communityShareable: number;
	fromCommunity: number;
	fromSupplier: number;
	fromGrid: number;
	communityConsumable: number;
	balance: number;
	measureSource: number;
	productionDetails: ProductionData;
}
