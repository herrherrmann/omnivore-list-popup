/**
 * @returns {boolean} true if the current operating system is macOS, otherwise false
 */
export function isMacOS() {
	if (navigator.platform) {
		return /mac/i.test(navigator.platform)
	}
	// @ts-expect-error It’s a thing: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
	if (navigator.userAgentData?.platform) {
		// @ts-expect-error It’s a thing: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
		return /mac/i.test(navigator.userAgentData.platform)
	}
	return false
}
