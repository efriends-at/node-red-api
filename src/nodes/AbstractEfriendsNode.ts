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
		const data = await this.fetchData();

		return [{ payload: data, topic: this.topic }];
	}

	protected override async onClose(removed: boolean): Promise<void> {
		clearTimeout(this.updateFetcherTimeout);
	}

	private async sendUpdate(): Promise<void> {
		const data = await this.fetchData();

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

	protected get httpProtocol(): string {
		return this.useSsl
				? "https"
				: "http";
	}

	protected get networkTimeout(): number {
		const config = this.configuration;

		return (config.context().get("networkTimeout") as number) ?? 5000;
	}

	protected get useSsl(): boolean {
		const config = this.configuration;

		return (config.context().get("ssl") as boolean) ?? false;
	}

	protected get apiKeyHeaderField(): string {
		return "apiKey";
	}

	protected parseResponse(data?: unknown): T | undefined {
		return data as T;
	}

	protected async fetchData(): Promise<T | HttpErrorData | undefined> {
		const data = await this.fetch();
		const parsedData = this.parseResponse(data);

		return parsedData;
	}

	private async fetch(): Promise<unknown | HttpErrorData | undefined> {
		const headers = new Headers();
		headers.append(this.apiKeyHeaderField, this.apiKey);

		const timeout = AbortSignal.timeout(this.networkTimeout);

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: headers,
			signal: timeout
		};

		try {
			const response = await fetch(this.apiUrl, requestOptions);
			const data = await response.text();

			if (response.ok && !!data) {
				const body = JSON.parse(data);

				return body;
			} else {
				this.log.debug(`Error during parsing of response: ${data}`);
			}
		} catch (error) {
			const errorMessage = error instanceof Error
				? error.message
				: String(error);

			return { message: errorMessage } as HttpErrorData;
		}
	}
}
