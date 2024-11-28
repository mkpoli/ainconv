import chalk from "chalk";
import { diffLines } from "diff";

const currentVersion = Bun.env.npm_package_version;
if (!currentVersion) {
	console.error("No version found");
	process.exit(1);
}

console.info(
	`[update-changelog] Updating ${chalk.bold("CHANGELOG.md")} to version ${chalk.green(
		currentVersion,
	)}`,
);

let changelog: string;
try {
	changelog = await Bun.file("CHANGELOG.md").text();
	console.info("[update-changelog] Found changelog");
} catch (err) {
	console.error("[update-changelog] No changelog found");
	process.exit(1);
}

if (!changelog.includes("Unreleased")) {
	console.error("[update-changelog] No 'Unreleased' section found");
	process.exit(1);
}

const replaced = changelog.replace(
	/## *\[Unreleased\].*/g,
	`## [${currentVersion}] - ${new Date().toISOString().split("T")[0]}`,
);

if (replaced === changelog) {
	console.info("[update-changelog] No required changes found");
	process.exit(0);
}

const diffs = diffLines(changelog, replaced);
if (diffs.length === 0) {
	console.info("[update-changelog] No required changes found");
	process.exit(0);
}
console.log();
for (const part of diffs) {
	if (part.added) {
		console.log(`    ${chalk.green(`+ ${part.value}`).trim()}`);
	} else if (part.removed) {
		console.log(`    ${chalk.red(`- ${part.value}`).trim()}`);
	}
}

Bun.write("CHANGELOG.md", replaced);

console.info(
	`[update-changelog] Updated ${chalk.yellow("CHANGELOG.md")} with ${chalk.bold(
		"Unreleased",
	)} replaced by version ${chalk.green(currentVersion)}`,
);

process.exit(0);
