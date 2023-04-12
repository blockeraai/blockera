export function iconReducer(iconInfo, action) {
	switch (action.type) {
		case 'UPDATE_ICON':
			return {
				...iconInfo,
				name: action.name,
				type: action.iconType,
			};

		case 'UPDATE_SVG':
			return {
				...iconInfo,
				uploadSVG: action.uploadSVG,
			};

		case 'UPDATE_SIZE':
			return {
				...iconInfo,
				size: action.size,
			};

		case 'DELETE_ICON':
			return {
				size: null,
				name: null,
				type: null,
				uploadSVG: '',
			};

		default:
			return iconInfo;
	}
}
