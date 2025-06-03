import {
	NodeAPI,
	NodeMessage
} from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';
import { NodeDefinition } from 'node-red-ts/api/NodeDefinition';

export class EfriendsConfig extends AbstractNode<NodeMessage, {apiKey: string, host: string }> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected override initProperties(RED: NodeAPI, config: NodeDefinition, msg?: NodeMessage | undefined): void {
		super.initProperties(RED, config, msg);
	}

}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, EfriendsConfig);
