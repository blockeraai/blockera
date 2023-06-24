import { useState } from '@wordpress/element';

import { StoryDataContext } from './context';

const StoryDataDecorator = (story, context) => {
	const [value, setValue] = useState(context.allArgs.value);

	return (
		<StoryDataContext.Provider
			value={{ storyValue: value, setStoryValue: setValue }}
		>
			{story()}

			<p style={{ marginTop: '20px' }}>
				Default Value:
				<pre
					data-testid="default-value"
					style={{ backgroundColor: '#eee', padding: '8px 10px' }}
				>
					{context.allArgs.value}
				</pre>
				Current Value:
				<pre
					data-testid="current-value"
					style={{ backgroundColor: '#eee', padding: '8px 10px' }}
				>
					{value}
				</pre>
			</p>
		</StoryDataContext.Provider>
	);
};

export default StoryDataDecorator;
