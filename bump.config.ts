import { defineConfig } from "bumpp";

export default defineConfig({
	push: false,
	tag: false,
	commit: false,
	// execute:
	// 	'bun run update-changelog && git add CHANGELOG.md && git commit -m "Update CHANGELOG.md"',
});
