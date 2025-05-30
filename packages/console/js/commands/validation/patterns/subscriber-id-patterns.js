const subscriberIdPatterns = [
	`if (
		!/^1-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(
			subscriberId
		)
	)
		return false;`,
	`if(/^1-\w{10}-\w{6}-\w{6}-\w{5}$/.test(subscriberId))return false;`,
	``,
];

module.exports = subscriberIdPatterns;
