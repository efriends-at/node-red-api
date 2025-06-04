import { HttpErrorData } from '@app/dtos/HttpErrorData';
import {
	Node,
	NodeAPI,
	NodeMessage
} from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';
import { NodeDefinition } from 'node-red-ts/api/NodeDefinition';

export abstract class AbstractEfriendsNode<T> extends AbstractNode<NodeMessage, { updateInterval: number, apiKey: string, host: string, networkTimeout: number }> {
	private updateFetcherTimeout?: NodeJS.Timeout;

	protected abstract get apiUrl(): string;
	protected abstract get topic(): string;

	protected override initProperties(RED: NodeAPI, config: NodeDefinition, msg?: NodeMessage | undefined): void {
		super.initProperties(RED, config);

		try {
			if (this.interval > 0) {
				this.updateFetcherTimeout = setInterval(() => this.sendUpdate(), this.interval * 1000);
			} else {
				clearTimeout(this.updateFetcherTimeout);
			}
		} catch (error) {
			this.log.error(`Could not initialize properties: ${(error as any).message}`);
		}
	}

	protected override async onInput(msg?: NodeMessage): Promise<Array<NodeMessage | null>> {
		const data = await this.fetchUpdate();

		return [{ payload: data, topic: this.topic }];
	}

	protected override async onClose(removed: boolean): Promise<void> {
		clearTimeout(this.updateFetcherTimeout);
	}

	private async sendUpdate(): Promise<void> {
		const data = await this.fetchUpdate();

		this.node.send({ payload: data });
	}

	protected get configuration(): Node {
		return this.RED.nodes.getNode(this.config.config);
	}

	private get interval(): number {
		return this.getProperty('updateInterval') ?? 0;
	}

	protected get apiKey(): string {
		const config = this.configuration;

		return (config.context().get("apiKey") as string) ?? '';
	}

	protected get host(): string {
		const config = this.configuration;

		return (config.context().get("host") as string) ?? '';
	}

	protected get networkTimeout(): number {
		const config = this.configuration;

		return (config.context().get("networkTimeout") as number) ?? 5000;
	}

	protected async fetchUpdate(): Promise<T | HttpErrorData | undefined> {
		const headers = new Headers();
		headers.append('apiKey', this.apiKey);

		const timeout = AbortSignal.timeout(this.networkTimeout);

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: headers,
			signal: timeout
		};

		try {
			const response = await fetch(this.apiUrl, requestOptions);

			if (response.ok) {
				const body: T = await response.json();

				return body;
			}
		} catch (error) {
			const errorMessage = error instanceof Error
				? error.message
				: String(error);

			return { message: errorMessage } as HttpErrorData;
			// throw new Error('Could not fetch data: ' + (error instanceof Error ? error.message : String(error)));
		}
	}
}
