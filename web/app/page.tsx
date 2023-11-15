import {Form} from './components/Form'

export default function Page() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-16'>
			<h1>screenshot any page</h1>
			<Form />
		</div>
	)
}
