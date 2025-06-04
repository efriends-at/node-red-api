import { GetTradingSummaryResponse } from '@app/dtos/TradingSummaryData';
import { AbstractEfriendsNode } from '@app/nodes/AbstractEfriendsNode';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

export class FloatPrices extends AbstractEfriendsNode<GetTradingSummaryResponse> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected get apiUrl(): string {
		return `https://backendsvc.prod-02.efriends.at/bpe-proxy/tarif-by-name/der%20bessere%20FLOAT`;
	}

	protected get topic(): string {
		return 'efriends.prices.float';
	}

	protected override get apiKeyHeaderField(): string {
		return "efToken";
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, FloatPrices);
