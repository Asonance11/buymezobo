/** @type {import('next').NextConfig} */

import nextBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
	webpack: (config) => {
		config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
		return config;
	},
	env: {
		NEXT_PUBLIC_ENV: 'PRODUCTION', //your next configs goes here
	},
	async headers() {
		return [
			{
				// matching all API routes
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
					{ key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		];
	},
};

const withBundleAnalyzer = nextBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
