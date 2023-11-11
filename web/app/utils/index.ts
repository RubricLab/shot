export const copyToClipboard = (text: string) => {
	if (!('navigator' in window)) throw new Error('Could not get clipboard')
	else window.navigator.clipboard.writeText(text)
}
