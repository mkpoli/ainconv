import { defineConfig } from "bumpp";

export default defineConfig({
	push: false,
	tag: true,
	commit: "Bump version to v%s",
	execute:
		"bun run update-changelog && git add CHANGELOG.md && git commit -m 'Update CHANGELOG.md'",
});
