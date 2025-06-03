import { GetTradingSummaryResponse } from '@app/dtos/TradingSummaryData';
import { AbstractEfriendsNode } from '@app/nodes/AbstractEfriendsNode';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

export class TradingSummary extends AbstractEfriendsNode<GetTradingSummaryResponse> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected get apiUrl(): string {
		return `https://${this.host}/v3/MeterDataAPI/TradingSummary`;
	}

	protected get topic(): string {
		return 'efriends.trading.summary';
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, TradingSummary);
