import Link from 'next/link'

export const Footer = () => {
	return (
		<div className='text-secondary absolute bottom-0 left-0 flex h-10 w-full items-center justify-between px-10 py-5 sm:py-8'>
			<div>
				made by{' '}
				<Link
					href='https://rubriclabs.com'
					target='_blank'>
					rubric
				</Link>
			</div>
			<Link
				href='https://github.com/RubricLab/shot'
				target='_blank'>
				source
			</Link>
		</div>
	)
}
