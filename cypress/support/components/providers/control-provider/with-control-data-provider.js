/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 *  dependencies
 */
import { Flex } from '@blockera/components';
import { useValue, varExport } from '@blockera/utils';
import { useControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { ControlDataContext } from './context';

export const WithControlDataProvider = ({ children, contextValue }) => {
	const [isChanged, setChanged] = useState(false);
	const { value: _value } = useControlContext();
	const { value, setValue } = useValue({
		initialValue: contextValue ?? _value,
		defaultValue: contextValue,
		onChange: () => setChanged(true),
	});

	useEffect(() => {
		setChanged(true);
		setValue(_value);
		// eslint-disable-next-line
	}, [_value]);

	return (
		<ControlDataContext.Provider
			value={{ controlValue: value, setControlValue: setValue }}
		>
			{children}

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
							backgroundColor: isChanged ? '#d5ffd1' : '#eeeeee',
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
							backgroundColor: '#eeeeee',
							padding: '8px 10px',
							lineHeight: '1.5',
							fontSize: '13px',
							margin: 0,
						}}
					>
						{varExport(contextValue)}
					</pre>
				</Flex>
			</Flex>
		</ControlDataContext.Provider>
	);
};

