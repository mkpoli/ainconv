import { $ } from "bun";

await $`git commit -am "Bump version to v${Bun.env.npm_package_version}"`;
await $`git tag -a v${Bun.env.npm_package_version} -m "Bump version to v${Bun.env.npm_package_version}"`;
