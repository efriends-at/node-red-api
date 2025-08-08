import { FlexPriceData } from '@app/dtos/FlexPriceData';
import { AbstractEfriendsNode } from '@app/nodes/AbstractEfriendsNode';
import { NodeAPI } from 'node-red';
import { AbstractNode } from 'node-red-ts/api/AbstractNode';

interface ResponseDataEntry {
	startt: string,
	endt:string,
	gen: number,
	cons: number
};

interface ResponseData {
	data: ResponseDataEntry[],
	error: string,
	message: string,
	bSuccess: boolean,
	errorDetail: Record<string, unknown>,
	errorCode: string,
	apiVersion: {
		version: string
	}
}


class CurrentFlexPrice extends AbstractEfriendsNode<FlexPriceData> {
	public constructor(RED: NodeAPI) {
		super(RED);
	}

	protected get apiUrl(): string {
		const now = new Date();
		const today = now.toISOString().substring(0, 10);

		now.setUTCDate(now.getUTCDate() + 1);

		const tomorrow = now.toISOString().substring(0, 10);

		return `https://backendsvc.prod-02.efriends.at/rest/v2.3/app/Prices/${this.tarifName}/${today}/${tomorrow}`;
	}

	protected override parseResponse(rawData?: unknown): FlexPriceData {
		const data = rawData as ResponseData;
		const currentEntry = data?.data
				?.filter(entry => this.checkIfIsCurrentlyValid(entry))
				?.[0];

		const parsedData: FlexPriceData = {
			consumptionPrice: currentEntry.cons,
			productionPrice: currentEntry.gen,
			validFrom: currentEntry.startt,
			validTo: currentEntry.endt,
		};

		return parsedData;
	}

	private checkIfIsCurrentlyValid(entry: ResponseDataEntry): boolean {
		const now = new Date();
		const entryStart = new Date(entry.startt);
		const entryEnd = new Date(entry.endt);

		return (entryStart <= now) && (now <= entryEnd);
	}

	protected get topic(): string {
		return 'efriends.price.flex';
	}

	protected override get apiKeyHeaderField(): string {
		return "efToken";
	}

	protected get tarifName(): string {
		return 'Der bessere Flex Tarif';
	}
}

module.exports = (RED: NodeAPI) => AbstractNode.createNode(RED, CurrentFlexPrice);
