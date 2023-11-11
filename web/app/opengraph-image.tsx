import {ImageResponse} from 'next/og'
import BackgroundGrid from '~/components/BackgroundGrid'

export const runtime = 'edge'

export const alt = 'Shot: built with Rubric.'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

type Props = {
	params: object
}

export default async function Image({params}: Props) {
	// TODO: return screenshot using params

	return new ImageResponse(
		(
			<div
				style={{
					alignItems: 'center',
					background: 'white',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					justifyContent: 'center',
					overflowY: 'hidden',
					position: 'relative',
					width: '100%'
				}}>
				<BackgroundGrid
					style={{
						position: 'absolute',
						width: size.width
					}}
				/>
				<div style={{color: 'black', fontSize: 128}}>Shot</div>
				<div style={{color: 'black', fontSize: 48}}>Built with Rubric.</div>
			</div>
		),
		{
			...size
		}
	)
}
