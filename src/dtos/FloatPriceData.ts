export interface FloatPriceData {
	bezug: {
		id: number,
        name: string,
        currentPrice_centPerKWh_exclVAT: number
    };
	einspeisung: {
        id: number,
        name: string,
        currentPrice_centPerKWh_exclVAT: number
    },
    apiVersion: {
        version: string
    }
}
