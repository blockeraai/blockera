## Maintaining Changelogs

In maintaining dozens of npm packages, it can be tough to keep track of changes. To simplify the release process, each package includes a `CHANGELOG.md` file which details all published releases and the unreleased ("Unreleased") changes, if any exist.

For each pull request, you should always include relevant changes in a "Unreleased" heading at the top of the file. You should add the heading if it doesn't already exist.

_Example:_

```md
<!-- Learn how to maintain this file at https://github.com/WordPress/Publisher/tree/HEAD/packages#maintaining-changelogs. -->

## Unreleased

### Bug Fix

-   Fixed an off-by-one error with the `sum` function.
```

There are a number of common release subsections you can follow. Each is intended to align to a specific meaning in the context of the [Semantic Versioning (`semver`) specification](https://semver.org/) the project adheres to. It is important that you describe your changes accurately, since this is used in the packages release process to help determine the version of the next release.

-   "Breaking Change" - A backwards-incompatible change which requires specific attention of the impacted developers to reconcile (requires a major version bump).
-   "New Feature" - The addition of a new backwards-compatible function or feature to the existing public API (requires a minor version bump).
-   "Enhancement" - Backwards-compatible improvements to existing functionality (requires a minor version bump).
-   "Bug Fix" - Resolutions to existing buggy behavior (requires a patch version bump).
-   "Internal" - Changes which do not have an impact on the public interface or behavior of the module (requires a patch version bump).

While other section naming can be used when appropriate, it's important that are expressed clearly to avoid confusion for both the packages releaser and third-party consumers.

When in doubt, refer to [Semantic Versioning specification](https://semver.org/).

If you are publishing new versions of packages, note that there are versioning recommendations outlined in the [Publisher Release Process document](https://github.com/WordPress/Publisher/blob/HEAD/docs/contributors/release.md) which prescribe _minimum_ version bumps for specific types of releases. The chosen version should be the greater of the two between the semantic versioning and Publisher release minimum version bumps.

## TypeScript

The [TypeScript](http://www.typescriptlang.org/) language is a typed superset of JavaScript that compiles to plain JavaScript.
Publisher does not use the TypeScript language, however TypeScript has powerful tooling that can be applied to JavaScript projects.

Publisher uses TypeScript for several reasons, including:

-   Powerful editor integrations improve developer experience.
-   Type system can detect some issues and lead to more robust software.
-   Type declarations can be produced to allow other projects to benefit from these advantages as well.

### Using TypeScript

Publisher uses TypeScript by running the TypeScript compiler (`tsc`) on select packages.
These packages benefit from type checking and produced type declarations in the published packages.

To opt-in to TypeScript tooling, packages should include a `tsconfig.json` file in the package root and add an entry to the root `tsconfig.json` references.
The changes will indicate that the package has opted-in and will be included in the TypeScript build process.

A `tsconfig.json` file should look like the following (comments are not necessary):

```jsonc
{
	// Extends a base configuration common to most packages
	"extends": "../../tsconfig.base.json",

	// Options for the TypeScript compiler
	// We'll usually set our `rootDir` and `declarationDir` as follows, which is specific
	// to each project.
	"compilerOptions": {
		"rootDir": "src",
		"declarationDir": "build-types"
	},

	// Which source files should be included
	"include": [ "src/**/*" ],

	// Other WordPress package dependencies that have opted-in to TypeScript should be listed
	// here. In this case, our package depends on `@wordpress/dom-ready`.
	"references": [ { "path": "../dom-ready" } ]
}
```

Type declarations will be produced in the `build-types` which should be included in the published package.
For consumers to use the published type declarations, we'll set the `types` field in `package.json`:

```json
{
	"main": "build/index.js",
	"main-module": "build-module/index.js",
	"types": "build-types"
}
```

Ensure that the `build-types` directory will be included in the published package, for example if a `files` field is declared.

[lerna]: https://lerna.js.org/
[monorepo]: https://monorepo.tools
[npm]: https://www.npmjs.com/
