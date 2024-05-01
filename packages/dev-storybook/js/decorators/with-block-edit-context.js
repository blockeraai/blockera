import { useState } from '@wordpress/element';
import { BlockEditContext } from '@blockera/editor-extensions';

export const WithBlockEditContextProvider = (story, context) => {
	const [value, setValue] = useState(
		context?.allArgs?.blockContextValue || {}
	);

	return (
		<BlockEditContext.Provider
			value={{
				attributes: value,
				setAttributes: setValue,
			}}
		>
			{story()}
		</BlockEditContext.Provider>
	);
};
