export function iconReducer(iconData, action) {
	switch (action.type) {
		case 'UPDATE_ICON':
			return {
				...iconData,
				icon: action.icon,
				library: action.library,
				uploadSVG: '',
			};

		case 'UPDATE_SVG':
			return {
				...iconData,
				icon: null,
				library: null,
				uploadSVG: action.uploadSVG,
			};

		case 'UPDATE_SIZE':
			return {
				...iconData,
				size: action.size,
			};

		case 'DELETE_ICON':
			return {
				icon: null,
				library: null,
				size: null,
				uploadSVG: '',
			};

		default:
			return iconData;
	}
}
