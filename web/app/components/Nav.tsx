import Link from 'next/link'

export default function Nav({title}: {title: string}) {
	return (
		<div className='fixed top-0 z-20 flex w-full items-baseline justify-between p-5 px-10'>
			<Link
				className='text-xl font-bold no-underline'
				href='https://shot.api.rubric.sh?url=rubric.sh'
				target='_blank'>
				{title}
			</Link>
			<Link
				href='https://github.com/RubricLab/shot'
				target='_blank'
				className='text-secondary no-underline'>
				source
			</Link>
		</div>
	)
}
