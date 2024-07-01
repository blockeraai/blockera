import React from 'react';

export default function DynamicHtmlFormatter({ text, replacements }) {
	// Function to replace keys with corresponding React components
	const renderContent = () => {
		return text.split(/(\{[^}]+\})/g).map((part, index) => {
			// Check if the part matches a key in the replacements object
			const match = part.match(/\{([^}]+)\}/);

			if (match && replacements[match[1]]) {
				// If there's a replacement and it is a valid React element or component, render it
				const Component = replacements[match[1]];
				return <React.Fragment key={index}>{Component}</React.Fragment>;
			}

			// If no replacement or not a React component, return the part as is
			return part;
		});
	};

	return <>{renderContent()}</>;
}
