import { AggregatedData } from '@app/dtos/AggregatedData';
import { BatteryStateData } from '@app/dtos/BatteryStateData';
import { GridMeterData } from '@app/dtos/GridMeterData';
import { InverterData } from '@app/dtos/InverterData';

export interface GetTradingSummaryResponse {
  aggregatedData: AggregatedData
  cubeName: string
  startTime: string
  endTime: string
  energyBalance: number
  totalOrderVolume: number
  consumable: number
  remainingEnergyBalance: number
  measureSource: number
  unixTimestamp: number
  details: GridMeterData
  inverterDetails: InverterData
  batteryDetails: BatteryStateData
}
