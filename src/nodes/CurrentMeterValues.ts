import { GetCurrentMeterValueResponse } from '@app/dtos/GetCurrentMeterValueResponse';
import { AbstractEfriendsNode } from '@app/nodes/AbstractEfriendsNode';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

export class CurrentMeterValues extends AbstractEfriendsNode<GetCurrentMeterValueResponse> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected get apiUrl(): string {


		return `${this.httpProtocol}://${this.host}/v3/MeterDataAPI/getCurrentValue`;
	}

	protected get topic(): string {
		return 'efriends.gridmeter.values';
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, CurrentMeterValues);
