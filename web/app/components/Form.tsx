'use client'

import Image from 'next/image'
import {useState} from 'react'
import {copyToClipboard} from '~/utils'

const placeholder = {
	img: `https://picsum.photos/seed/${Math.random()}/500/300?blur=10`,
	url: 'rubric.sh'
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const Form = () => {
	const [img, setImg] = useState<any>()
	const [time, setTime] = useState<number>()
	const [endpoint, setEndpoint] = useState(`${apiUrl}?url=${placeholder.url}`)
	const [loading, setLoading] = useState(false)

	const submit = async e => {
		e.preventDefault()
		setLoading(true)

		const start = Date.now()

		const form = new FormData(e.target)
		const upload = form.get('upload')

		const res = await fetch(endpoint)
		const file = await res[upload ? 'text' : 'blob']()
		const obj = upload ? file : URL.createObjectURL(file as Blob)

		setTime(Date.now() - start)

		setImg(obj)
		setLoading(false)
	}

	return (
		<form
			onSubmit={submit}
			onChange={({target}: any) => {
				setEndpoint(prev => {
					const curr = new URL(prev)
					const params = new URLSearchParams(curr.search)

					params.set(target.name, target.checked || target.value)

					if (target.type == 'checkbox' && !target.checked)
						params.delete(target.name)

					curr.search = params.toString()

					return curr.href
				})
			}}
			className='w-full max-w-6xl space-y-4'>
			<div className='flex gap-2'>
				<input
					name='url'
					type='text'
					defaultValue={placeholder.url}
				/>
				<button
					disabled={loading}
					type='submit'
					className={`${loading ? 'animate-pulse' : ''}`}>
					Take screenshot
				</button>
			</div>
			<div className='flex grow gap-2 pb-8'>
				<input
					name='upload'
					disabled={loading}
					type='checkbox'
				/>
				<label htmlFor='upload'>Upload & return a URL</label>
			</div>
			<div className='relative h-96 w-full'>
				<Image
					src={img || placeholder.img}
					fill
					className={`object-contain ${loading ? 'animate-pulse' : ''}`}
					alt='screenshot'
				/>
			</div>
			<div className='flex w-full items-baseline justify-between'>
				<div className={`${time ? 'opacity-100' : 'opacity-0'}`}>
					Done in <span className='font-bold'>{time / 1000} s</span>.
				</div>
				<button
					disabled={!img}
					className={`transition-opacity ${
						img?.length > 0 ? 'opacity-100' : 'opacity-0'
					}`}
					type='button'>
					<a
						download
						className='no-underline'
						href={img}>
						Download
					</a>
				</button>
			</div>
			<div className='flex w-full items-center justify-between gap-2 pt-8'>
				<code className='grow'>{endpoint}</code>
				<button
					type='button'
					onClick={() => copyToClipboard(endpoint)}>
					Copy
				</button>
			</div>
		</form>
	)
}
