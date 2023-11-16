import {Form} from './components/Form'

export default function Page() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-8 p-5 sm:gap-16 sm:p-16'>
			<h1 className='text-secondary'>
				screenshot any page, <span className='italic'>fast</span>
			</h1>
			<Form />
		</div>
	)
}
