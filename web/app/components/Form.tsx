'use client'

import {useEffect, useRef, useState} from 'react'
import {toast} from 'sonner'
import {copyToClipboard} from '~/utils'

const placeholder = {
	img: 'https://github.com/RubricLab/shot/assets/36117635/682a6eac-bacd-4473-9e58-deca1a96f694',
	url: 'rubric.sh'
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const Form = () => {
	const [img, setImg] = useState<any>(placeholder.img)
	const [endpoint, setEndpoint] = useState(`${apiUrl}?url=${placeholder.url}`)
	const [loading, setLoading] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)

	const submit = async e => {
		e.preventDefault()
		setLoading(true)

		const start = Date.now()

		const form = new FormData(e.target)
		const upload = form.get('upload')

		try {
			const res = await fetch('/screenshot', {
				method: 'POST',
				body: JSON.stringify({endpoint, upload})
			})

			if (!res.ok) {
				const err = await res.text()
				throw new Error(err)
			}

			const file = await res[upload ? 'text' : 'blob']()
			const obj = upload ? file : URL.createObjectURL(file as Blob)

			const end = Date.now() - start

			setImg(obj)

			toast.success(`Done in ${end / 1000} s`)
		} catch (error) {
			toast.error(error.message || 'Something went wrong')
		}

		setLoading(false)
	}

	useEffect(() => {
		inputRef?.current?.focus?.()
	}, [inputRef])

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
			className='flex w-full max-w-6xl flex-col space-y-2 sm:space-y-4'>
			<div className='flex gap-2'>
				<input
					ref={inputRef}
					name='url'
					type='text'
					placeholder={placeholder.url}
				/>
				<button
					disabled={loading}
					type='submit'
					className={`${loading ? 'animate-pulse' : ''}`}>
					Take screenshot
				</button>
			</div>
			<div className='flex grow justify-end gap-2 pb-8'>
				<input
					id='upload'
					name='upload'
					disabled={loading}
					type='checkbox'
				/>
				<label htmlFor='upload'>Upload & return a URL</label>
			</div>
			<div className='relative'>
				<div className='group max-h-[26rem] w-full grow overflow-y-scroll rounded-md border-2 bg-gray-100 shadow-sm'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={img}
						className={`w-full rounded-sm object-cover object-top ${
							loading ? 'animate-pulse' : ''
						}`}
						alt='screenshot'
					/>
					<button
						disabled={!img}
						className={`absolute right-2 top-2 ml-auto opacity-40 transition-opacity group-hover:opacity-100`}
						type='button'>
						<a
							download
							className='no-underline'
							href={img}>
							↓
						</a>
					</button>
				</div>
			</div>
			<div className='flex w-full flex-wrap items-center justify-between gap-2'>
				<code className='grow'>{endpoint}</code>
				<button
					type='button'
					onClick={() => {
						toast.success('Copied. DM us for an API key.')
						copyToClipboard(endpoint)
					}}>
					Copy
				</button>
			</div>
		</form>
	)
}
