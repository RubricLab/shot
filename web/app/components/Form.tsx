'use client'

import Image from 'next/image'
import {FormEvent, useState} from 'react'
import {copyToClipboard} from '~/utils'

const placeholder = {
	img: `https://picsum.photos/seed/${Math.random()}/500/300?blur=10`,
	url: 'rubric.sh'
}

export const Form = () => {
	const [img, setImg] = useState<any>(placeholder.img)
	const [time, setTime] = useState<number>()
	const [endpoint, setEndpoint] = useState(
		`${process.env.NEXT_PUBLIC_API_URL}?url=${placeholder.url}`
	)

	const submit = async (e: FormEvent) => {
		e.preventDefault()

		const start = Date.now()

		const blob = await fetch(endpoint).then(res => res.blob())
		const obj = URL.createObjectURL(blob)

		setTime(Date.now() - start)

		setImg(obj)
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
			className='w-full max-w-6xl space-y-5'>
			<input
				name='url'
				type='text'
				defaultValue={placeholder.url}
			/>
			<div className='flex gap-2'>
				<input
					name='upload'
					type='checkbox'
				/>
				<label htmlFor='upload'>Return URL</label>
			</div>
			<button type='submit'>Take screenshot</button>
			<div className='flex items-center gap-2'>
				<code>{endpoint}</code>
				<button
					type='button'
					onClick={() => copyToClipboard(endpoint)}>
					Copy
				</button>
			</div>
			<div className='relative h-96 w-full'>
				<Image
					src={img}
					fill
					className='object-contain'
					alt='screenshot'
				/>
			</div>
			{time && (
				<div>
					Done in <span className='font-bold'>{time} ms</span>.
				</div>
			)}
		</form>
	)
}
