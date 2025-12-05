module.exports = {
	apps: [
		{
			name: 'gamble',
			script: './build/index.js',
			env_production: {
				PORT: '5301',
				ORIGIN: 'http://127.0.0.1'
			}
		}
	]
};
