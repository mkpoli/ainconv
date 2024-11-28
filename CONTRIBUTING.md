<!-- omit in toc -->
# Contributing Guidance

Thank you for considering contributing to `ainconv`! 😘

We are happy to have you here. This document consists of some guidelines and instructions for contributing to `ainconv`.

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

Even if you don't have time, you can still support the project in other ways, such as starring the project, tweeting about it, or telling your friends about it. Every little bit helps!

<!-- omit in toc -->
## Table of Contents

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Adding Tests](#adding-tests)
- [Development](#development)
  - [Making Changes](#making-changes)
  - [Publish a new version](#publish-a-new-version)

## Reporting Bugs

We use GitHub issues to track bugs and errors. If you run into an issue with the project, please open an issue and provide as much information as possible. This will help us to understand the problem and fix it.

## Suggesting Enhancements

If you have an idea for a new feature or an enhancement to an existing feature, please open an issue and describe the feature you would like to see. We will discuss the idea and decide if it is a good fit for the project.

## Adding Tests

Tests are unified across the project's implementations in different languages. Please refer to the repository [mkpoli/ainconv-tests](https://github.com/mkpoli/ainconv-tests).

## Development

General steps to contribute to the project:

1. [Fork the repository](https://github.com/mkpoli/ainconv/fork) and clone it locally.
2. [Install Bun](https://bun.sh/docs/installation) and install dependencies by `bun install`. 
3. Make your changes and run `bun test` to run the tests.
4. Run `bun run build` to check if the build will be successful.
5. [Submit a pull request](https://github.com/mkpoli/ainconv/compare) to the main repository.

### Making Changes

When committing, please also add a line to the `CHANGELOG.md` under the `Unreleased` section, describing the changes you made. If `Unreleased` section does not exist, please create it. This will help the maintainers to write the release notes when the time comes.

Commit messages need to start with a capital letter and a verb in the present tense, describing the change. For example, `Add support for Katakana` or `Fix bug in Cyrillic to Latin conversion`.

### Publish a new version
> [!NOTE]  
> You can only publish a new version if you are a maintainer of the project and have the necessary rights to do so.

- [ ] Commit all changes in working tree.
- [ ] Check and build the package. (`bun test` and `bun run build`)
- [ ] Bump the version by `bun run bump`.
- [ ] Update `CHANGELOG.md` by running `bun run changelog`.
- [ ] Commit and tag the changes by running `bun run commit`.
- [ ] Push the changes to the remote repository. (`git push --follow-tags`)
- [ ] Create a new release on GitHub with the release notes from `CHANGELOG.md`.
- [ ] Publish the package to npm. (`bun run publish`)
