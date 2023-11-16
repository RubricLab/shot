/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'github.com',
				port: '',
				pathname: '/RubricLab/**'
			},
			{
				protocol: 'https',
				hostname: 's3nxvo8djqamvzft.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**.png'
			}
		]
	}
}

export default nextConfig
