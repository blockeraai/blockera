import { useState } from '@wordpress/element';
import { BlockEditContext } from '@publisher/extensions';

const WithMockBlockEditContext = (story, context) => {
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

export default WithMockBlockEditContext;
