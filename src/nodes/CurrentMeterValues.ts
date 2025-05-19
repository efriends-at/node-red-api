import { GetCurrentMeterValueResponse } from '@app/dtos/GetCurrentMeterValueResponse';
import { AbstractEfriendsNode } from '@app/nodes/AbstractApiFetcher';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

export class CurrentMeterValues extends AbstractEfriendsNode<GetCurrentMeterValueResponse> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected getApiUrl(): string {
		return `https://${this.host}/v3/MeterDataAPI/getCurrentValue`;
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, CurrentMeterValues);
