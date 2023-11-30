export const runtime = 'edge'

export const POST = async (req: Request) => {
	const {endpoint, upload} = await req.json()

	const res = await fetch(endpoint, {
		headers: {
			Authorization: `Bearer ${process.env.SHOT_KEY}`
		},
		cache: 'no-cache'
	})

	if (!res.ok) {
		const body = await res.text()
		return new Response(body, {
			status: res.status
		})
	}

	const file = await res[upload ? 'text' : 'blob']()

	return new Response(file, {
		status: 200,
		headers: {
			'Content-Type': upload ? 'text/plain' : 'image/png'
		}
	})
}
