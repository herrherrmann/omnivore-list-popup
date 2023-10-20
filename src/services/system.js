export function isMacOS() {
	if (navigator.platform) {
		return /mac/i.test(navigator.platform)
	}
	if (navigator.userAgentData?.platform) {
		return /mac/i.test(navigator.userAgentData.platform)
	}
	return false
}
