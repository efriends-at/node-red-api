import { TradingSummaryData } from '@app/dtos/TradingSummaryData';
import {
	NodeAPI,
	NodeMessage
} from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';
import { NodeDefinition } from 'node-red-ts/api/NodeDefinition';

export class TradingSummary extends AbstractNode<NodeMessage, { updateInterval: number, apiKey: string, host: string }> {
	private updateFetcherTimeout?: NodeJS.Timeout;

	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected override initProperties(RED: NodeAPI, config: NodeDefinition, msg?: NodeMessage | undefined): void {
		super.initProperties(RED, config);

		if (this.interval > 0) {
			this.updateFetcherTimeout = setInterval(() => this.sendUpdate(), this.interval * 1000);
		} else {
			clearTimeout(this.updateFetcherTimeout);
		}
	}

	protected override async onInput(msg?: any): Promise<Array<NodeMessage | null>> {
		const data = await this.fetchUpdate();

		return [{ payload: data }];
	}

	private async fetchUpdate(): Promise<TradingSummaryData | undefined> {
		const headers = new Headers();
		headers.append('apiKey', this.apiKey);

		const requestOptions = {
			method: 'GET',
			headers: headers
		};

		try {
			const response = await fetch(`https://${this.host}/v3/MeterDataAPI/TradingSummary`, requestOptions);

			if (response.ok) {
				const body: TradingSummaryData = await response.json();

				return body;
			}
		} catch (error) {
			console.error('Could not fetch trading summary', error);
			throw error;
		}
	}

	private async sendUpdate(): Promise<void> {
		const data = await this.fetchUpdate();

		this.node.send({ payload: data });
	}

	private get interval(): number {
		return this.getProperty('updateInterval') ?? 0;
	}

	private get apiKey(): string {
		return this.getProperty('apiKey') ?? '';
	}

	private get host(): string {
		return this.getProperty('host') ?? '';
	}
}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, TradingSummary);
