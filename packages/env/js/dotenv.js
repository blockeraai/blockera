// @flow

export default class DotEnv {
	path: string;

	get(supportQuery: string): any {
		throw new Error(
			`Must override method get(supportQuery: string) with recieved ${supportQuery} param.`
		);
	}
}
