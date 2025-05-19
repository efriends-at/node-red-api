import { GetTradingSummaryResponse } from '@app/dtos/TradingSummaryData';
import { AbstractEfriendsNode } from '@app/nodes/AbstractApiFetcher';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

export class TradingSummary extends AbstractEfriendsNode<GetTradingSummaryResponse> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected getApiUrl(): string {
		return `https://${this.host}/v3/MeterDataAPI/TradingSummary`;
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, TradingSummary);
