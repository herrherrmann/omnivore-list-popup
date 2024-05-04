/**
 * @returns {boolean} true if the current operating system is macOS, otherwise false
 */
export function isMacOS() {
	if (navigator.platform) {
		return /mac/i.test(navigator.platform)
	}
	// @ts-ignore
	if (navigator.userAgentData?.platform) {
		// @ts-ignore
		return /mac/i.test(navigator.userAgentData.platform)
	}
	return false
}
