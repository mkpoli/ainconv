import { $ } from "bun";

const npmPackageVersion = (await Bun.file("package.json").json()).version;

await $`git commit -am "Bump version to v${npmPackageVersion}"`;
await $`git tag -a v${npmPackageVersion} -m "Bump version to v${npmPackageVersion}"`;

process.exit(0);
