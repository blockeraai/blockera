// @flow

export const useFilterAttributes = (): Object => {
	return {
		toWpCompat: (
			featureId: string,
			newValue: any,
			nextState: Object
		): Object => {
			console.log(nextState);
			if ('publisherWidth' === featureId) {
				return {
					...nextState,
					width: newValue,
				};
			}

			return nextState;
		},
	};
};
