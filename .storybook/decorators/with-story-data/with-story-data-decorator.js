import { useState } from '@wordpress/element';

import { StoryDataContext } from './context';

const StoryDataDecorator = (story, context) => {
	const [value, setValue] = useState(context.allArgs.value);

	return (
		<StoryDataContext.Provider
			value={{ storyValue: value, setStoryValue: setValue }}
		>
			{story()}

			<p style={{ marginTop: '20px' }}>value is {value}</p>
		</StoryDataContext.Provider>
	);
};

export default StoryDataDecorator;
