import Form from './components/Form'

export default function Page() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<h1>screenshot any page</h1>
			<code>
				{"> curl 'https://shot.api.rubric.sh?url=x.com' > ~/Downloads/img.png"}
			</code>
			<Form />
		</div>
	)
}
