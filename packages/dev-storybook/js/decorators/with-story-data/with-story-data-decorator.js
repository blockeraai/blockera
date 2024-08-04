/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useValue, varExport } from '@blockera/utils';
import { Flex, useControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { StoryDataContext } from './context';

export const WithStoryContextProvider = (story, context) => {
	const [isChanged, setChanged] = useState(false);
	const { value: _value } = useControlContext();
	const { value, setValue } = useValue({
		initialValue: context.allArgs.value ?? _value,
		defaultValue: context.allArgs.value,
		onChange: () => setChanged(true),
	});

	useEffect(() => {
		setChanged(true);
		setValue(_value);
		// eslint-disable-next-line
	}, [_value]);

	return (
		<StoryDataContext.Provider
			value={{ storyValue: value, setStoryValue: setValue }}
		>
			{story()}

			<Flex
				direction="column"
				gap="24px"
				style={{
					fontSize: '14px',
					marginTop: '50px',
				}}
			>
				<Flex direction="column" gap="12px">
					<span
						style={{
							userSelect: 'none',
						}}
					>
						Current Value:
					</span>
					<pre
						data-testid="current-value"
						style={{
							backgroundColor: isChanged ? '#d5ffd1' : '#eee',
							padding: '8px 10px',
							lineHeight: '1.5',
							fontSize: '13px',
							margin: 0,
						}}
					>
						{varExport(value)}
					</pre>
				</Flex>

				<Flex direction="column" gap="12px">
					<span
						style={{
							userSelect: 'none',
						}}
					>
						Value:
					</span>
					<pre
						data-testid="default-value"
						style={{
							backgroundColor: '#eee',
							padding: '8px 10px',
							lineHeight: '1.5',
							fontSize: '13px',
							margin: 0,
						}}
					>
						{varExport(context?.allArgs?.value)}
					</pre>
				</Flex>
			</Flex>
		</StoryDataContext.Provider>
	);
};
