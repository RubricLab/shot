'use client'

import Image from 'next/image'
import {useState} from 'react'

function Form() {
	const [img, setImg] = useState<any>(
		`https://picsum.photos/seed/${Math.random()}/500/300?blur=10`
	)
	const [time, setTime] = useState<number>()

	const submit = async (e: any) => {
		e.preventDefault()

		const url = e.target.url.value

		const start = Date.now()

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?url=${url}`)
		const blob = await res.blob()
		const obj = URL.createObjectURL(blob)

		setTime(Date.now() - start)

		setImg(obj)
	}

	return (
		<form
			onSubmit={submit}
			className='w-full max-w-5xl space-y-5'>
			<input
				type='text'
				name='url'
				defaultValue='rubric.sh'
			/>
			<button type='submit'>Take screenshot</button>
			<div className='relative h-96 w-full'>
				<Image
					src={img}
					fill
					className='object-cover'
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

export default Form
