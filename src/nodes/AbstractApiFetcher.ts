import {
	NodeAPI,
	NodeMessage
} from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';
import { NodeDefinition } from 'node-red-ts/api/NodeDefinition';

export abstract class AbstractEfriendsNode<T> extends AbstractNode<NodeMessage, { updateInterval: number, apiKey: string, host: string }> {
	private updateFetcherTimeout?: NodeJS.Timeout;

	protected abstract getApiUrl(): string;

	protected override initProperties(RED: NodeAPI, config: NodeDefinition, msg?: NodeMessage | undefined): void {
		super.initProperties(RED, config);

		if (this.interval > 0) {
			this.updateFetcherTimeout = setInterval(() => this.sendUpdate(), this.interval * 1000);
		} else {
			clearTimeout(this.updateFetcherTimeout);
		}
	}

	protected override async onInput(msg?: NodeMessage): Promise<Array<NodeMessage | null>> {
		const data = await this.fetchUpdate();

		return [{ payload: data }];
	}

	protected override async onClose(removed: boolean): Promise<void> {
		clearTimeout(this.updateFetcherTimeout);
	}

	private async sendUpdate(): Promise<void> {
		const data = await this.fetchUpdate();
		this.node.send({ payload: data });
	}
	private get interval(): number {
		return this.getProperty('updateInterval') ?? 0;
	}

	protected get apiKey(): string {
		return this.getProperty('apiKey') ?? '';
	}

	protected get host(): string {
		return this.getProperty('host') ?? '';
	}

	protected async fetchUpdate(): Promise<T | undefined> {
		const headers = new Headers();
		headers.append('apiKey', this.apiKey);

		const requestOptions = {
			method: 'GET',
			headers: headers
		};

		try {
			const response = await fetch(this.getApiUrl(), requestOptions);

			if (response.ok) {
				const body: T = await response.json();

				return body;
			}
		} catch (error) {
			throw new Error('Could not fetch data: ' + (error instanceof Error ? error.message : String(error)));
		}
	}
}
