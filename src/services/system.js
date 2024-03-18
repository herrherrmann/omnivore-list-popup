/**
 * @returns {boolean} true if the current operating system is macOS, otherwise false
 */
export function isMacOS() {
	if (navigator.platform) {
		return /mac/i.test(navigator.platform)
	}
	if (navigator.userAgentData?.platform) {
		return /mac/i.test(navigator.userAgentData.platform)
	}
	return false
}
