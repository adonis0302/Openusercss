# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.4.4"></a>
## [1.4.4](https://github.com/OpenUserCSS/openusercss.org/compare/v1.4.3...v1.4.4) (2018-06-16)


### Bug Fixes

* **build:** Correct release script ([4cb9cce](https://github.com/OpenUserCSS/openusercss.org/commit/4cb9cce))



<a name="1.4.3"></a>
## [1.4.3](https://github.com/OpenUserCSS/openusercss.org/compare/v1.4.2...v1.4.3) (2018-06-16)


### Bug Fixes

* **db:** Skip migration if target user is not found instead of crashing ([d044544](https://github.com/OpenUserCSS/openusercss.org/commit/d044544))



<a name="1.4.2"></a>
## [1.4.2](https://github.com/OpenUserCSS/openusercss.org/compare/v1.4.1...v1.4.2) (2018-06-16)


### Bug Fixes

* **db:** Write migration script for missing rating owners ([89cb00c](https://github.com/OpenUserCSS/openusercss.org/commit/89cb00c))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/OpenUserCSS/openusercss.org/compare/v1.4.0...v1.4.1) (2018-06-16)


### Bug Fixes

* **deps:** Move tree-select to production dependencies, server needs it ([8ee182e](https://github.com/OpenUserCSS/openusercss.org/commit/8ee182e))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/OpenUserCSS/openusercss.org/compare/v1.3.1...v1.4.0) (2018-06-15)


### Bug Fixes

* **client:** Construct local API URL in network interface (fixes [#107](https://github.com/OpenUserCSS/openusercss.org/issues/107)) ([f16d5a9](https://github.com/OpenUserCSS/openusercss.org/commit/f16d5a9))
* **client:** Redirect to login after email verification if not logged in ([d7bc43a](https://github.com/OpenUserCSS/openusercss.org/commit/d7bc43a))
* **client:** Replace promise.timeout with pure function (fixes [#106](https://github.com/OpenUserCSS/openusercss.org/issues/106)) ([89c49ad](https://github.com/OpenUserCSS/openusercss.org/commit/89c49ad))
* **client:** Restore UX on the account page (1000th commit! :tada:) ([56330ec](https://github.com/OpenUserCSS/openusercss.org/commit/56330ec))


### Features

* **client:** Add the ability to specify spinner speed ([fa20430](https://github.com/OpenUserCSS/openusercss.org/commit/fa20430))


### Performance Improvements

* **client:** Cache images from possible external sources ([3dad4c3](https://github.com/OpenUserCSS/openusercss.org/commit/3dad4c3))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/OpenUserCSS/openusercss.org/compare/v1.3.0...v1.3.1) (2018-06-14)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/OpenUserCSS/openusercss.org/compare/v1.2.0...v1.3.0) (2018-06-14)


### Bug Fixes

* **client:** Implement responsive logic on homepage (fixes [#100](https://github.com/OpenUserCSS/openusercss.org/issues/100)) ([ef2e93a](https://github.com/OpenUserCSS/openusercss.org/commit/ef2e93a))
* **client:** Improve donation wording ([#98](https://github.com/OpenUserCSS/openusercss.org/issues/98)) ([62ff900](https://github.com/OpenUserCSS/openusercss.org/commit/62ff900))
* **client:** Upgrade theme deletion to use refactored store ([0cc0773](https://github.com/OpenUserCSS/openusercss.org/commit/0cc0773))


### Features

* **progressive-image:** Transpile the source into a class (fixes [#103](https://github.com/OpenUserCSS/openusercss.org/issues/103)) ([e14ebe1](https://github.com/OpenUserCSS/openusercss.org/commit/e14ebe1))


### Performance Improvements

* **release:** Move package.json to after yarn finishes install ([56a8704](https://github.com/OpenUserCSS/openusercss.org/commit/56a8704))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/OpenUserCSS/openusercss.org/compare/v1.1.0...v1.2.0) (2018-06-13)


### Bug Fixes

* **client:** Actually order latest themes based on date ([2cf5fec](https://github.com/OpenUserCSS/openusercss.org/commit/2cf5fec))
* **client:** Let the browser choose between font types (fixes [#95](https://github.com/OpenUserCSS/openusercss.org/issues/95)) ([7c79073](https://github.com/OpenUserCSS/openusercss.org/commit/7c79073))
* **client:** Make fonts and line-height smaller ([7d21920](https://github.com/OpenUserCSS/openusercss.org/commit/7d21920))
* **client:** Remove footer from error template (fixes [#96](https://github.com/OpenUserCSS/openusercss.org/issues/96)) ([84c237b](https://github.com/OpenUserCSS/openusercss.org/commit/84c237b))
* **client:** Remove the (unreleased) tag from the footer ([d912ec0](https://github.com/OpenUserCSS/openusercss.org/commit/d912ec0))
* **docs:** Correct typos ([#99](https://github.com/OpenUserCSS/openusercss.org/issues/99)) ([be3a998](https://github.com/OpenUserCSS/openusercss.org/commit/be3a998))
* Fix dependencies and analytics querying from inside the network ([dafa021](https://github.com/OpenUserCSS/openusercss.org/commit/dafa021))


### Features

* **client:** Add ability to order themes on prfile page ([934db6a](https://github.com/OpenUserCSS/openusercss.org/commit/934db6a))
* **client:** Matomo integration + driver ([2a052d7](https://github.com/OpenUserCSS/openusercss.org/commit/2a052d7))
* **client:** Show visit count on themes ([3a09f3f](https://github.com/OpenUserCSS/openusercss.org/commit/3a09f3f))


### Performance Improvements

* **client:** Omit unneeded props from query, no cross-linking in store ([a03f783](https://github.com/OpenUserCSS/openusercss.org/commit/a03f783))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.6...v1.1.0) (2018-06-10)


### Bug Fixes

* **api:** Do not send token with sessions query ([fdab04c](https://github.com/OpenUserCSS/openusercss.org/commit/fdab04c))
* **api:** Fix missing error translations - remove prefix ([209a960](https://github.com/OpenUserCSS/openusercss.org/commit/209a960))
* **api:** Invalidate length when undefined is passed ([9a091e4](https://github.com/OpenUserCSS/openusercss.org/commit/9a091e4))
* **api:** Make max-length validator return true if no value is passed ([338309c](https://github.com/OpenUserCSS/openusercss.org/commit/338309c))
* **api:** Return an empty array if no theme is found ([a28d7a1](https://github.com/OpenUserCSS/openusercss.org/commit/a28d7a1))
* **api:** Send URL from config in registration e-mail ([51bd56b](https://github.com/OpenUserCSS/openusercss.org/commit/51bd56b))
* **api:** Stop theme population in get-theme ([8d3b35e](https://github.com/OpenUserCSS/openusercss.org/commit/8d3b35e))
* **api:** Wait for user to be saved before sending e-mail ([bb5e165](https://github.com/OpenUserCSS/openusercss.org/commit/bb5e165))
* **API:** Log errors to console on registration ([450b08c](https://github.com/OpenUserCSS/openusercss.org/commit/450b08c))
* **API:** Only try to process options if they exist ([b9b69f8](https://github.com/OpenUserCSS/openusercss.org/commit/b9b69f8))
* **build:** Assign correct tasks for static files watch expressions ([f9c4bf5](https://github.com/OpenUserCSS/openusercss.org/commit/f9c4bf5))
* **build:** Better logging in start script, remove background sudo task ([d93866b](https://github.com/OpenUserCSS/openusercss.org/commit/d93866b))
* **build:** Build e-mails before building the Docker image ([af10deb](https://github.com/OpenUserCSS/openusercss.org/commit/af10deb))
* **build:** Correct static assets path ([7e9fca8](https://github.com/OpenUserCSS/openusercss.org/commit/7e9fca8))
* **build:** Create static assets while compiling client ([c942d39](https://github.com/OpenUserCSS/openusercss.org/commit/c942d39))
* **build:** Fix build issues in when running with Docker ([d3de39f](https://github.com/OpenUserCSS/openusercss.org/commit/d3de39f))
* **build:** Forgot to remove comment from start script ([fe81ab7](https://github.com/OpenUserCSS/openusercss.org/commit/fe81ab7))
* **build:** Import CSS in nuxt config instead of scss, that's deprecated ([b91fe11](https://github.com/OpenUserCSS/openusercss.org/commit/b91fe11))
* **build:** Update tasks for new versions ([1a920ac](https://github.com/OpenUserCSS/openusercss.org/commit/1a920ac))
* **ci:** Add graphql-request for tests ([22e907c](https://github.com/OpenUserCSS/openusercss.org/commit/22e907c))
* **ci:** Solve linting issues ([cfcd2c6](https://github.com/OpenUserCSS/openusercss.org/commit/cfcd2c6))
* **client:** Add autocomplete props to account page ([176e725](https://github.com/OpenUserCSS/openusercss.org/commit/176e725))
* **client:** Add autocomplete values, fix duplicate component variables ([07f4968](https://github.com/OpenUserCSS/openusercss.org/commit/07f4968))
* **client:** Add opaque background to navbar-menu on mobile ([af0c489](https://github.com/OpenUserCSS/openusercss.org/commit/af0c489))
* **client:** Add placeholder in list-creator, remove strings in obj mode ([e8c4f2b](https://github.com/OpenUserCSS/openusercss.org/commit/e8c4f2b))
* **client:** Add ua-parser-js to production dependencies ([e4f67a9](https://github.com/OpenUserCSS/openusercss.org/commit/e4f67a9))
* **client:** Adjust (increase) line-height ([f8d745a](https://github.com/OpenUserCSS/openusercss.org/commit/f8d745a))
* **client:** Apply font settings to more elements ([965204e](https://github.com/OpenUserCSS/openusercss.org/commit/965204e))
* **client:** Average rating method in a mixin + reorder Dockerfile ([4db0e07](https://github.com/OpenUserCSS/openusercss.org/commit/4db0e07))
* **client:** Better v-model reaction in image-carousel ([a8c2dd6](https://github.com/OpenUserCSS/openusercss.org/commit/a8c2dd6))
* **client:** Don't delete user object from theme - use the data later ([43ac744](https://github.com/OpenUserCSS/openusercss.org/commit/43ac744))
* **client:** Don't show NaN if no ratings are found ([4c17ff9](https://github.com/OpenUserCSS/openusercss.org/commit/4c17ff9))
* **client:** Fix 'variable is not a constructor' issue in the editor ([563d122](https://github.com/OpenUserCSS/openusercss.org/commit/563d122))
* **client:** Fix 404 error on search input ([17b2963](https://github.com/OpenUserCSS/openusercss.org/commit/17b2963))
* **client:** Fix blinking while loading images, add raw img tag ([55c7a69](https://github.com/OpenUserCSS/openusercss.org/commit/55c7a69))
* **client:** Fix cache version detection (use promise) ([cca9d11](https://github.com/OpenUserCSS/openusercss.org/commit/cca9d11))
* **client:** Fix cache version detection (use promise) ([b125b62](https://github.com/OpenUserCSS/openusercss.org/commit/b125b62))
* **client:** Fix cross-browser and device page transitions ([8de3c85](https://github.com/OpenUserCSS/openusercss.org/commit/8de3c85))
* **client:** Fix error page crashing if no state was saved beforehand ([11b94be](https://github.com/OpenUserCSS/openusercss.org/commit/11b94be))
* **client:** Fix expanded theme object saving ([a763365](https://github.com/OpenUserCSS/openusercss.org/commit/a763365))
* **client:** Fix flickering in Blink (thanks [@dsgnr](https://github.com/dsgnr) for the help) ([025896f](https://github.com/OpenUserCSS/openusercss.org/commit/025896f))
* **client:** Fix linting issues ([54fb3c7](https://github.com/OpenUserCSS/openusercss.org/commit/54fb3c7))
* **client:** Fix list-creator close buttons spacing ([c6a73a3](https://github.com/OpenUserCSS/openusercss.org/commit/c6a73a3))
* **client:** Fix Matomo reporting and Ace editor workers in helmet ([41f70ad](https://github.com/OpenUserCSS/openusercss.org/commit/41f70ad))
* **client:** Fix multiple editors per page by randomising the ID ([4a7d778](https://github.com/OpenUserCSS/openusercss.org/commit/4a7d778))
* **client:** Fix navbar height on mobile ([1463157](https://github.com/OpenUserCSS/openusercss.org/commit/1463157))
* **client:** Fix padding on theme-card ([7a7806e](https://github.com/OpenUserCSS/openusercss.org/commit/7a7806e))
* **client:** Fix positioning of progressive-image in streched parent ([7a8dc49](https://github.com/OpenUserCSS/openusercss.org/commit/7a8dc49))
* **client:** Fix SCSS linting issues ([47bcc78](https://github.com/OpenUserCSS/openusercss.org/commit/47bcc78))
* **client:** Fix small container width on mobile ([234ae82](https://github.com/OpenUserCSS/openusercss.org/commit/234ae82))
* **client:** Fix the theme install button having a bad link ([e0bc300](https://github.com/OpenUserCSS/openusercss.org/commit/e0bc300))
* **client:** Fix URL rewrite causing a navigation ([368564b](https://github.com/OpenUserCSS/openusercss.org/commit/368564b))
* **client:** Fix URL rewrite causing a navigation ([ca296ba](https://github.com/OpenUserCSS/openusercss.org/commit/ca296ba))
* **client:** Force 12px monospace font in editor ([70d6fe1](https://github.com/OpenUserCSS/openusercss.org/commit/70d6fe1))
* **client:** Force component rerender once extension is detected ([fa34cda](https://github.com/OpenUserCSS/openusercss.org/commit/fa34cda))
* **client:** Get state from versioned cache ([c7602dc](https://github.com/OpenUserCSS/openusercss.org/commit/c7602dc))
* **client:** Hide randomised install count on the front page ([b96219b](https://github.com/OpenUserCSS/openusercss.org/commit/b96219b))
* **client:** Imply dark text in footer ([07920e4](https://github.com/OpenUserCSS/openusercss.org/commit/07920e4))
* **client:** Increase cache limit to just below 2MB ([59fead8](https://github.com/OpenUserCSS/openusercss.org/commit/59fead8))
* **client:** Increase cache limit to just below 2MB ([bb15840](https://github.com/OpenUserCSS/openusercss.org/commit/bb15840))
* **client:** Make footer responsive ([be38e1c](https://github.com/OpenUserCSS/openusercss.org/commit/be38e1c))
* **client:** Make the ID non-mandatory when saving theme ([d876660](https://github.com/OpenUserCSS/openusercss.org/commit/d876660))
* **client:** Make the theme route more resilient to extension errors ([d161069](https://github.com/OpenUserCSS/openusercss.org/commit/d161069))
* **client:** Only rerender flickity when there are screenshots ([d7f7071](https://github.com/OpenUserCSS/openusercss.org/commit/d7f7071))
* **client:** Only show extension warning in client, remove unused code ([5568492](https://github.com/OpenUserCSS/openusercss.org/commit/5568492))
* **client:** Prevent crash on hydration caused by v-if ([74b0d65](https://github.com/OpenUserCSS/openusercss.org/commit/74b0d65))
* **client:** Prevent locked options from saving ([0a59a42](https://github.com/OpenUserCSS/openusercss.org/commit/0a59a42))
* **client:** Prevent unused variables from uploading ([2cc11f8](https://github.com/OpenUserCSS/openusercss.org/commit/2cc11f8))
* **client:** Primary link colours (fixes [#83](https://github.com/OpenUserCSS/openusercss.org/issues/83)) ([bc1de6f](https://github.com/OpenUserCSS/openusercss.org/commit/bc1de6f))
* **client:** Remove border radius from switch to match design ([6446332](https://github.com/OpenUserCSS/openusercss.org/commit/6446332))
* **client:** Remove duplicate trackView events ([05be2bc](https://github.com/OpenUserCSS/openusercss.org/commit/05be2bc))
* **client:** Remove inexplicable double checking from features.js ([ed0c13c](https://github.com/OpenUserCSS/openusercss.org/commit/ed0c13c))
* **client:** Remove placeholder install count ([c06d9e7](https://github.com/OpenUserCSS/openusercss.org/commit/c06d9e7))
* **client:** Remove query caching ([cd3ebb4](https://github.com/OpenUserCSS/openusercss.org/commit/cd3ebb4))
* **client:** Set a static height for switches ([0ddc5a1](https://github.com/OpenUserCSS/openusercss.org/commit/0ddc5a1))
* **client:** Slow down loading ticker ([c8b6a81](https://github.com/OpenUserCSS/openusercss.org/commit/c8b6a81))
* **client:** Tree-select dropdowns should be under the navbar ([47c6433](https://github.com/OpenUserCSS/openusercss.org/commit/47c6433))
* **client:** Use correct API URL in theme view ([3c76915](https://github.com/OpenUserCSS/openusercss.org/commit/3c76915))
* **client:** Use full screen height if no content is available ([488d067](https://github.com/OpenUserCSS/openusercss.org/commit/488d067))
* **client:** Use user object in theme ([9014f3a](https://github.com/OpenUserCSS/openusercss.org/commit/9014f3a))
* **client:** Use versioned cache for state persistence ([cc9b0a0](https://github.com/OpenUserCSS/openusercss.org/commit/cc9b0a0))
* **client:** Verify login form before submitting ([89920f9](https://github.com/OpenUserCSS/openusercss.org/commit/89920f9))
* **commitlint:** Update config for new version ([b7c6882](https://github.com/OpenUserCSS/openusercss.org/commit/b7c6882))
* **deps:** Add back git-revision ([72439fa](https://github.com/OpenUserCSS/openusercss.org/commit/72439fa))
* **deps:** Ignore specified Node version of dependencies ([d46f2f0](https://github.com/OpenUserCSS/openusercss.org/commit/d46f2f0))
* **docker:** Specify network name instead of leaving it to DC ([b259d5e](https://github.com/OpenUserCSS/openusercss.org/commit/b259d5e))
* **docs:** Correct CLA link target ([9f0aab8](https://github.com/OpenUserCSS/openusercss.org/commit/9f0aab8))
* **docs:** Fix @RaitaroH's contributor icons ([0fc68ec](https://github.com/OpenUserCSS/openusercss.org/commit/0fc68ec))
* **docs:** Fix avatars height by limiting to 6 per line ([38c0989](https://github.com/OpenUserCSS/openusercss.org/commit/38c0989))
* **docs:** Mention MongoDB setup in contributing instructions ([98e3cac](https://github.com/OpenUserCSS/openusercss.org/commit/98e3cac))
* **docs:** More concise wording, fix README typos ([b6ad466](https://github.com/OpenUserCSS/openusercss.org/commit/b6ad466))
* **docs:** Replace mistaken imgur link with CLA link [ci skip] ([0503f11](https://github.com/OpenUserCSS/openusercss.org/commit/0503f11))
* **git:** Remove ignored files ([7353705](https://github.com/OpenUserCSS/openusercss.org/commit/7353705))
* **gitignore:** Only ignore the build directory on root ([7f29cec](https://github.com/OpenUserCSS/openusercss.org/commit/7f29cec))
* **mailer:** Use test transport in dev environment ([4aa4b46](https://github.com/OpenUserCSS/openusercss.org/commit/4aa4b46))
* **server:** Refuse to start with non-standard NODE_ENV ([91edbf0](https://github.com/OpenUserCSS/openusercss.org/commit/91edbf0))
* **staging:** Get Nuxt rendering working in production mode ([d8303e0](https://github.com/OpenUserCSS/openusercss.org/commit/d8303e0))
* Fix e-mails not sending, translate API errors in client ([7aef0b9](https://github.com/OpenUserCSS/openusercss.org/commit/7aef0b9))
* Fix runtime errors ([f81debb](https://github.com/OpenUserCSS/openusercss.org/commit/f81debb))
* Leave whitespaces in in pug files ([9d3c75a](https://github.com/OpenUserCSS/openusercss.org/commit/9d3c75a))
* **startscript:** Termbin is not https :/ ([7b35f48](https://github.com/OpenUserCSS/openusercss.org/commit/7b35f48))
* **usercss-builder:** Globally replace newlines ([5ac136f](https://github.com/OpenUserCSS/openusercss.org/commit/5ac136f))
* **usercss-builder:** Use test environment variable as development ([6c22275](https://github.com/OpenUserCSS/openusercss.org/commit/6c22275))


### Features

* **api:** Add endpoint for listing active sessions ([8352b50](https://github.com/OpenUserCSS/openusercss.org/commit/8352b50))
* **api:** Show theme id in not found error message ([16af92b](https://github.com/OpenUserCSS/openusercss.org/commit/16af92b))
* **API:** Create 'themes' query ([ee70def](https://github.com/OpenUserCSS/openusercss.org/commit/ee70def))
* **build:** Don't change if the dev domain is already in the hosts file ([c903c43](https://github.com/OpenUserCSS/openusercss.org/commit/c903c43))
* **build:** Finish staging environment setup ([3518426](https://github.com/OpenUserCSS/openusercss.org/commit/3518426))
* **build:** Staging Docker setup ([9f01f8e](https://github.com/OpenUserCSS/openusercss.org/commit/9f01f8e))
* **client:** Add branding gradient to buttons ([0409e9e](https://github.com/OpenUserCSS/openusercss.org/commit/0409e9e))
* **client:** Add circular image prop to progressive-image ([6a46507](https://github.com/OpenUserCSS/openusercss.org/commit/6a46507))
* **client:** Add license field in editor ([c99ee78](https://github.com/OpenUserCSS/openusercss.org/commit/c99ee78))
* **client:** Add license viewer in theme route ([a27e19b](https://github.com/OpenUserCSS/openusercss.org/commit/a27e19b))
* **client:** Add matomo reporting ([c34b3d6](https://github.com/OpenUserCSS/openusercss.org/commit/c34b3d6))
* **client:** Add notice page for theme licenses ([f1d2077](https://github.com/OpenUserCSS/openusercss.org/commit/f1d2077))
* **client:** Add page transition testing to test page ([1caeb42](https://github.com/OpenUserCSS/openusercss.org/commit/1caeb42))
* **client:** Add shaking entry animation to error page ([f9254fc](https://github.com/OpenUserCSS/openusercss.org/commit/f9254fc))
* **client:** Add some helper classes ([6ef2e49](https://github.com/OpenUserCSS/openusercss.org/commit/6ef2e49))
* **client:** Add support for getting theme install status ([c36953a](https://github.com/OpenUserCSS/openusercss.org/commit/c36953a))
* **client:** Add user translator ([d2fc253](https://github.com/OpenUserCSS/openusercss.org/commit/d2fc253))
* **client:** Apply new design to theme page controls, display ext. icon ([ca0f263](https://github.com/OpenUserCSS/openusercss.org/commit/ca0f263))
* **client:** Brand new loading screen, remove useless progress bar ([81b6306](https://github.com/OpenUserCSS/openusercss.org/commit/81b6306))
* **client:** Create server error class ([cb161e6](https://github.com/OpenUserCSS/openusercss.org/commit/cb161e6))
* **client:** Display active sessions in /account ([cb7da98](https://github.com/OpenUserCSS/openusercss.org/commit/cb7da98))
* **client:** Display loading animation while low-res image is loading ([8bd0af0](https://github.com/OpenUserCSS/openusercss.org/commit/8bd0af0))
* **client:** Don't show screenshot on profile if viewing own profile ([9f3da54](https://github.com/OpenUserCSS/openusercss.org/commit/9f3da54))
* **client:** Enable editor modes ([15adb5e](https://github.com/OpenUserCSS/openusercss.org/commit/15adb5e))
* **client:** Error page - more debug info + ability to add comments ([5f44986](https://github.com/OpenUserCSS/openusercss.org/commit/5f44986))
* **client:** Extensions can optionally specify branding to display ([be5729c](https://github.com/OpenUserCSS/openusercss.org/commit/be5729c))
* **client:** Generate awesome gradients with scss ([0e47ab6](https://github.com/OpenUserCSS/openusercss.org/commit/0e47ab6))
* **client:** Generate debugging information on error page ([4e41cdb](https://github.com/OpenUserCSS/openusercss.org/commit/4e41cdb))
* **client:** Gradient buttons in list-creator ([9a5a9d5](https://github.com/OpenUserCSS/openusercss.org/commit/9a5a9d5))
* **client:** Require accepting TOS before registering ([c6494b8](https://github.com/OpenUserCSS/openusercss.org/commit/c6494b8))
* **client:** Retry failed network requests 10 times before failing ([85844e9](https://github.com/OpenUserCSS/openusercss.org/commit/85844e9))
* **client:** Set the user agent while SSRing ([cd077e6](https://github.com/OpenUserCSS/openusercss.org/commit/cd077e6))
* **client:** Show better theme install button messages ([401c6a6](https://github.com/OpenUserCSS/openusercss.org/commit/401c6a6))
* **client:** Show link to test page if in development ([4313647](https://github.com/OpenUserCSS/openusercss.org/commit/4313647))
* **client:** Show test page link in staging ([d437340](https://github.com/OpenUserCSS/openusercss.org/commit/d437340))
* Dockerise development environment (fixes [#22](https://github.com/OpenUserCSS/openusercss.org/issues/22)) ([219e428](https://github.com/OpenUserCSS/openusercss.org/commit/219e428))
* **client:** Transparent logo for new design 🍸 ([c1f9a55](https://github.com/OpenUserCSS/openusercss.org/commit/c1f9a55))
* **client:** Use 'themes' query in store ([c6286f1](https://github.com/OpenUserCSS/openusercss.org/commit/c6286f1))
* **client:** Use 'themes' query in the Vue app ([9c6cfbf](https://github.com/OpenUserCSS/openusercss.org/commit/9c6cfbf))
* **client:** Use backdrop-filter in navbar if there's support ([5505509](https://github.com/OpenUserCSS/openusercss.org/commit/5505509))
* Allow __typename as dangling underscore ([55270d9](https://github.com/OpenUserCSS/openusercss.org/commit/55270d9))
* **config:** Env from NODE_ENV, only encrypt in prod ([2af6378](https://github.com/OpenUserCSS/openusercss.org/commit/2af6378))
* **config:** Print patched config values on boot while in development ([1245365](https://github.com/OpenUserCSS/openusercss.org/commit/1245365))
* **deps:** Add eslint unicorn plugin + caching ([e391b59](https://github.com/OpenUserCSS/openusercss.org/commit/e391b59))
* **hooks:** Run yarn after pull, merge and commit [ci skip] ([5f9cc0a](https://github.com/OpenUserCSS/openusercss.org/commit/5f9cc0a))
* Derive API from domain, prepare for staging deployment ([481adbb](https://github.com/OpenUserCSS/openusercss.org/commit/481adbb))
* **manager:** Quit if env doesn't match config to protect data ([6b925da](https://github.com/OpenUserCSS/openusercss.org/commit/6b925da))
* **startscript:** Log info when not managing the hosts file ([476762c](https://github.com/OpenUserCSS/openusercss.org/commit/476762c))
* **startscript:** Rootless mode + better usage hints ([7fb30b7](https://github.com/OpenUserCSS/openusercss.org/commit/7fb30b7))


### Performance Improvements

* **build:** Install dependencies during build instead of runtime ([2a5c6a8](https://github.com/OpenUserCSS/openusercss.org/commit/2a5c6a8))
* **build:** Optimise production Dockerfile ordering ([b2ba4b7](https://github.com/OpenUserCSS/openusercss.org/commit/b2ba4b7))
* **CI:** Install yarn into the cache, symlink after ([88483a1](https://github.com/OpenUserCSS/openusercss.org/commit/88483a1))
* **client:** Use less intensive transition on small screens ([74d9c6e](https://github.com/OpenUserCSS/openusercss.org/commit/74d9c6e))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.5...v1.0.0) (2018-06-10)


### Bug Fixes

* **api:** Do not send token with sessions query ([fdab04c](https://github.com/OpenUserCSS/openusercss.org/commit/fdab04c))
* **api:** Fix missing error translations - remove prefix ([209a960](https://github.com/OpenUserCSS/openusercss.org/commit/209a960))
* **api:** Invalidate length when undefined is passed ([9a091e4](https://github.com/OpenUserCSS/openusercss.org/commit/9a091e4))
* **api:** Make max-length validator return true if no value is passed ([338309c](https://github.com/OpenUserCSS/openusercss.org/commit/338309c))
* **api:** Return an empty array if no theme is found ([a28d7a1](https://github.com/OpenUserCSS/openusercss.org/commit/a28d7a1))
* **api:** Send URL from config in registration e-mail ([51bd56b](https://github.com/OpenUserCSS/openusercss.org/commit/51bd56b))
* **api:** Stop theme population in get-theme ([8d3b35e](https://github.com/OpenUserCSS/openusercss.org/commit/8d3b35e))
* **api:** Wait for user to be saved before sending e-mail ([bb5e165](https://github.com/OpenUserCSS/openusercss.org/commit/bb5e165))
* **API:** Log errors to console on registration ([450b08c](https://github.com/OpenUserCSS/openusercss.org/commit/450b08c))
* **API:** Only try to process options if they exist ([b9b69f8](https://github.com/OpenUserCSS/openusercss.org/commit/b9b69f8))
* **API:** Rebalance search index weights ([9f9e504](https://github.com/OpenUserCSS/openusercss.org/commit/9f9e504))
* **build:** Assign correct tasks for static files watch expressions ([f9c4bf5](https://github.com/OpenUserCSS/openusercss.org/commit/f9c4bf5))
* **build:** Better logging in start script, remove background sudo task ([d93866b](https://github.com/OpenUserCSS/openusercss.org/commit/d93866b))
* **build:** Build e-mails before building the Docker image ([af10deb](https://github.com/OpenUserCSS/openusercss.org/commit/af10deb))
* **build:** Correct static assets path ([7e9fca8](https://github.com/OpenUserCSS/openusercss.org/commit/7e9fca8))
* **build:** Create static assets while compiling client ([c942d39](https://github.com/OpenUserCSS/openusercss.org/commit/c942d39))
* **build:** Fix build issues in when running with Docker ([d3de39f](https://github.com/OpenUserCSS/openusercss.org/commit/d3de39f))
* **build:** Forgot to remove comment from start script ([fe81ab7](https://github.com/OpenUserCSS/openusercss.org/commit/fe81ab7))
* **build:** Import CSS in nuxt config instead of scss, that's deprecated ([b91fe11](https://github.com/OpenUserCSS/openusercss.org/commit/b91fe11))
* **build:** Update tasks for new versions ([1a920ac](https://github.com/OpenUserCSS/openusercss.org/commit/1a920ac))
* **ci:** Add graphql-request for tests ([22e907c](https://github.com/OpenUserCSS/openusercss.org/commit/22e907c))
* **ci:** Solve linting issues ([cfcd2c6](https://github.com/OpenUserCSS/openusercss.org/commit/cfcd2c6))
* **client:** Add autocomplete props to account page ([176e725](https://github.com/OpenUserCSS/openusercss.org/commit/176e725))
* **client:** Add autocomplete values, fix duplicate component variables ([07f4968](https://github.com/OpenUserCSS/openusercss.org/commit/07f4968))
* **client:** Add opaque background to navbar-menu on mobile ([af0c489](https://github.com/OpenUserCSS/openusercss.org/commit/af0c489))
* **client:** Add placeholder in list-creator, remove strings in obj mode ([e8c4f2b](https://github.com/OpenUserCSS/openusercss.org/commit/e8c4f2b))
* **client:** Add ua-parser-js to production dependencies ([e4f67a9](https://github.com/OpenUserCSS/openusercss.org/commit/e4f67a9))
* **client:** Adjust (increase) line-height ([f8d745a](https://github.com/OpenUserCSS/openusercss.org/commit/f8d745a))
* **client:** Apply font settings to more elements ([965204e](https://github.com/OpenUserCSS/openusercss.org/commit/965204e))
* **client:** Average rating method in a mixin + reorder Dockerfile ([4db0e07](https://github.com/OpenUserCSS/openusercss.org/commit/4db0e07))
* **client:** Better v-model reaction in image-carousel ([a8c2dd6](https://github.com/OpenUserCSS/openusercss.org/commit/a8c2dd6))
* **client:** Don't delete user object from theme - use the data later ([43ac744](https://github.com/OpenUserCSS/openusercss.org/commit/43ac744))
* **client:** Don't show NaN if no ratings are found ([4c17ff9](https://github.com/OpenUserCSS/openusercss.org/commit/4c17ff9))
* **client:** Fix 'variable is not a constructor' issue in the editor ([563d122](https://github.com/OpenUserCSS/openusercss.org/commit/563d122))
* **client:** Fix 404 error on search input ([17b2963](https://github.com/OpenUserCSS/openusercss.org/commit/17b2963))
* **client:** Fix blinking while loading images, add raw img tag ([55c7a69](https://github.com/OpenUserCSS/openusercss.org/commit/55c7a69))
* **client:** Fix cache version detection (use promise) ([b125b62](https://github.com/OpenUserCSS/openusercss.org/commit/b125b62))
* **client:** Fix cache version detection (use promise) ([cca9d11](https://github.com/OpenUserCSS/openusercss.org/commit/cca9d11))
* **client:** Fix cross-browser and device page transitions ([8de3c85](https://github.com/OpenUserCSS/openusercss.org/commit/8de3c85))
* **client:** Fix error page crashing if no state was saved beforehand ([11b94be](https://github.com/OpenUserCSS/openusercss.org/commit/11b94be))
* **client:** Fix expanded theme object saving ([a763365](https://github.com/OpenUserCSS/openusercss.org/commit/a763365))
* **client:** Fix flickering in Blink (thanks [@dsgnr](https://github.com/dsgnr) for the help) ([025896f](https://github.com/OpenUserCSS/openusercss.org/commit/025896f))
* **client:** Fix linting issues ([54fb3c7](https://github.com/OpenUserCSS/openusercss.org/commit/54fb3c7))
* **client:** Fix list-creator close buttons spacing ([c6a73a3](https://github.com/OpenUserCSS/openusercss.org/commit/c6a73a3))
* **client:** Fix Matomo reporting and Ace editor workers in helmet ([41f70ad](https://github.com/OpenUserCSS/openusercss.org/commit/41f70ad))
* **client:** Fix multiple editors per page by randomising the ID ([4a7d778](https://github.com/OpenUserCSS/openusercss.org/commit/4a7d778))
* **client:** Fix navbar height on mobile ([1463157](https://github.com/OpenUserCSS/openusercss.org/commit/1463157))
* **client:** Fix padding on theme-card ([7a7806e](https://github.com/OpenUserCSS/openusercss.org/commit/7a7806e))
* **client:** Fix positioning of progressive-image in streched parent ([7a8dc49](https://github.com/OpenUserCSS/openusercss.org/commit/7a8dc49))
* **client:** Fix SCSS linting issues ([47bcc78](https://github.com/OpenUserCSS/openusercss.org/commit/47bcc78))
* **client:** Fix small container width on mobile ([234ae82](https://github.com/OpenUserCSS/openusercss.org/commit/234ae82))
* **client:** Fix URL rewrite causing a navigation ([368564b](https://github.com/OpenUserCSS/openusercss.org/commit/368564b))
* **client:** Fix URL rewrite causing a navigation ([ca296ba](https://github.com/OpenUserCSS/openusercss.org/commit/ca296ba))
* **client:** Force 12px monospace font in editor ([70d6fe1](https://github.com/OpenUserCSS/openusercss.org/commit/70d6fe1))
* **client:** Force component rerender once extension is detected ([fa34cda](https://github.com/OpenUserCSS/openusercss.org/commit/fa34cda))
* **client:** Get state from versioned cache ([c7602dc](https://github.com/OpenUserCSS/openusercss.org/commit/c7602dc))
* **client:** Hide randomised install count on the front page ([b96219b](https://github.com/OpenUserCSS/openusercss.org/commit/b96219b))
* **client:** Imply dark text in footer ([07920e4](https://github.com/OpenUserCSS/openusercss.org/commit/07920e4))
* **client:** Increase cache limit to just below 2MB ([bb15840](https://github.com/OpenUserCSS/openusercss.org/commit/bb15840))
* **client:** Increase cache limit to just below 2MB ([59fead8](https://github.com/OpenUserCSS/openusercss.org/commit/59fead8))
* **client:** Make footer responsive ([be38e1c](https://github.com/OpenUserCSS/openusercss.org/commit/be38e1c))
* **client:** Make the ID non-mandatory when saving theme ([d876660](https://github.com/OpenUserCSS/openusercss.org/commit/d876660))
* **client:** Make the theme route more resilient to extension errors ([d161069](https://github.com/OpenUserCSS/openusercss.org/commit/d161069))
* **client:** Only rerender flickity when there are screenshots ([d7f7071](https://github.com/OpenUserCSS/openusercss.org/commit/d7f7071))
* **client:** Only show extension warning in client, remove unused code ([5568492](https://github.com/OpenUserCSS/openusercss.org/commit/5568492))
* **client:** Prevent crash on hydration caused by v-if ([74b0d65](https://github.com/OpenUserCSS/openusercss.org/commit/74b0d65))
* **client:** Prevent locked options from saving ([0a59a42](https://github.com/OpenUserCSS/openusercss.org/commit/0a59a42))
* **client:** Prevent unused variables from uploading ([2cc11f8](https://github.com/OpenUserCSS/openusercss.org/commit/2cc11f8))
* **client:** Primary link colours (fixes [#83](https://github.com/OpenUserCSS/openusercss.org/issues/83)) ([bc1de6f](https://github.com/OpenUserCSS/openusercss.org/commit/bc1de6f))
* **client:** Remove border radius from switch to match design ([6446332](https://github.com/OpenUserCSS/openusercss.org/commit/6446332))
* **client:** Remove duplicate trackView events ([05be2bc](https://github.com/OpenUserCSS/openusercss.org/commit/05be2bc))
* **client:** Remove inexplicable double checking from features.js ([ed0c13c](https://github.com/OpenUserCSS/openusercss.org/commit/ed0c13c))
* **client:** Remove placeholder install count ([c06d9e7](https://github.com/OpenUserCSS/openusercss.org/commit/c06d9e7))
* **client:** Remove query caching ([cd3ebb4](https://github.com/OpenUserCSS/openusercss.org/commit/cd3ebb4))
* **client:** Set a static height for switches ([0ddc5a1](https://github.com/OpenUserCSS/openusercss.org/commit/0ddc5a1))
* **client:** Slow down loading ticker ([c8b6a81](https://github.com/OpenUserCSS/openusercss.org/commit/c8b6a81))
* **client:** Tree-select dropdowns should be under the navbar ([47c6433](https://github.com/OpenUserCSS/openusercss.org/commit/47c6433))
* **client:** Use correct API URL in theme view ([3c76915](https://github.com/OpenUserCSS/openusercss.org/commit/3c76915))
* **client:** Use full screen height if no content is available ([488d067](https://github.com/OpenUserCSS/openusercss.org/commit/488d067))
* **client:** Use user object in theme ([9014f3a](https://github.com/OpenUserCSS/openusercss.org/commit/9014f3a))
* **client:** Use versioned cache for state persistence ([cc9b0a0](https://github.com/OpenUserCSS/openusercss.org/commit/cc9b0a0))
* **client:** Verify login form before submitting ([89920f9](https://github.com/OpenUserCSS/openusercss.org/commit/89920f9))
* **commitlint:** Update config for new version ([b7c6882](https://github.com/OpenUserCSS/openusercss.org/commit/b7c6882))
* **deps:** Add back git-revision ([72439fa](https://github.com/OpenUserCSS/openusercss.org/commit/72439fa))
* **deps:** Ignore specified Node version of dependencies ([d46f2f0](https://github.com/OpenUserCSS/openusercss.org/commit/d46f2f0))
* **docker:** Specify network name instead of leaving it to DC ([b259d5e](https://github.com/OpenUserCSS/openusercss.org/commit/b259d5e))
* **docs:** Correct CLA link target ([9f0aab8](https://github.com/OpenUserCSS/openusercss.org/commit/9f0aab8))
* **docs:** Fix @RaitaroH's contributor icons ([0fc68ec](https://github.com/OpenUserCSS/openusercss.org/commit/0fc68ec))
* **docs:** Fix avatars height by limiting to 6 per line ([38c0989](https://github.com/OpenUserCSS/openusercss.org/commit/38c0989))
* **docs:** Mention MongoDB setup in contributing instructions ([98e3cac](https://github.com/OpenUserCSS/openusercss.org/commit/98e3cac))
* **docs:** More concise wording, fix README typos ([b6ad466](https://github.com/OpenUserCSS/openusercss.org/commit/b6ad466))
* **docs:** Replace mistaken imgur link with CLA link [ci skip] ([0503f11](https://github.com/OpenUserCSS/openusercss.org/commit/0503f11))
* **git:** Remove ignored files ([7353705](https://github.com/OpenUserCSS/openusercss.org/commit/7353705))
* Fix e-mails not sending, translate API errors in client ([7aef0b9](https://github.com/OpenUserCSS/openusercss.org/commit/7aef0b9))
* Fix runtime errors ([f81debb](https://github.com/OpenUserCSS/openusercss.org/commit/f81debb))
* Leave whitespaces in in pug files ([9d3c75a](https://github.com/OpenUserCSS/openusercss.org/commit/9d3c75a))
* **gitignore:** Only ignore the build directory on root ([7f29cec](https://github.com/OpenUserCSS/openusercss.org/commit/7f29cec))
* **mailer:** Use test transport in dev environment ([4aa4b46](https://github.com/OpenUserCSS/openusercss.org/commit/4aa4b46))
* **server:** Refuse to start with non-standard NODE_ENV ([91edbf0](https://github.com/OpenUserCSS/openusercss.org/commit/91edbf0))
* **staging:** Get Nuxt rendering working in production mode ([d8303e0](https://github.com/OpenUserCSS/openusercss.org/commit/d8303e0))
* **startscript:** Termbin is not https :/ ([7b35f48](https://github.com/OpenUserCSS/openusercss.org/commit/7b35f48))
* **usercss-builder:** Globally replace newlines ([5ac136f](https://github.com/OpenUserCSS/openusercss.org/commit/5ac136f))
* **usercss-builder:** Use test environment variable as development ([6c22275](https://github.com/OpenUserCSS/openusercss.org/commit/6c22275))


### Features

* **api:** Add endpoint for listing active sessions ([8352b50](https://github.com/OpenUserCSS/openusercss.org/commit/8352b50))
* **api:** Show theme id in not found error message ([16af92b](https://github.com/OpenUserCSS/openusercss.org/commit/16af92b))
* **API:** Create 'themes' query ([ee70def](https://github.com/OpenUserCSS/openusercss.org/commit/ee70def))
* **build:** Don't change if the dev domain is already in the hosts file ([c903c43](https://github.com/OpenUserCSS/openusercss.org/commit/c903c43))
* **build:** Finish staging environment setup ([3518426](https://github.com/OpenUserCSS/openusercss.org/commit/3518426))
* **build:** Staging Docker setup ([9f01f8e](https://github.com/OpenUserCSS/openusercss.org/commit/9f01f8e))
* **client:** Add branding gradient to buttons ([0409e9e](https://github.com/OpenUserCSS/openusercss.org/commit/0409e9e))
* **client:** Add circular image prop to progressive-image ([6a46507](https://github.com/OpenUserCSS/openusercss.org/commit/6a46507))
* **client:** Add license field in editor ([c99ee78](https://github.com/OpenUserCSS/openusercss.org/commit/c99ee78))
* **client:** Add license viewer in theme route ([a27e19b](https://github.com/OpenUserCSS/openusercss.org/commit/a27e19b))
* **client:** Add matomo reporting ([c34b3d6](https://github.com/OpenUserCSS/openusercss.org/commit/c34b3d6))
* **client:** Add notice page for theme licenses ([f1d2077](https://github.com/OpenUserCSS/openusercss.org/commit/f1d2077))
* **client:** Add page transition testing to test page ([1caeb42](https://github.com/OpenUserCSS/openusercss.org/commit/1caeb42))
* **client:** Add shaking entry animation to error page ([f9254fc](https://github.com/OpenUserCSS/openusercss.org/commit/f9254fc))
* **client:** Add some helper classes ([6ef2e49](https://github.com/OpenUserCSS/openusercss.org/commit/6ef2e49))
* **client:** Add support for getting theme install status ([c36953a](https://github.com/OpenUserCSS/openusercss.org/commit/c36953a))
* **client:** Add user translator ([d2fc253](https://github.com/OpenUserCSS/openusercss.org/commit/d2fc253))
* **client:** Apply new design to theme page controls, display ext. icon ([ca0f263](https://github.com/OpenUserCSS/openusercss.org/commit/ca0f263))
* **client:** Brand new loading screen, remove useless progress bar ([81b6306](https://github.com/OpenUserCSS/openusercss.org/commit/81b6306))
* **client:** Create server error class ([cb161e6](https://github.com/OpenUserCSS/openusercss.org/commit/cb161e6))
* **client:** Display active sessions in /account ([cb7da98](https://github.com/OpenUserCSS/openusercss.org/commit/cb7da98))
* **client:** Display loading animation while low-res image is loading ([8bd0af0](https://github.com/OpenUserCSS/openusercss.org/commit/8bd0af0))
* **client:** Don't show screenshot on profile if viewing own profile ([9f3da54](https://github.com/OpenUserCSS/openusercss.org/commit/9f3da54))
* **client:** Enable editor modes ([15adb5e](https://github.com/OpenUserCSS/openusercss.org/commit/15adb5e))
* **client:** Error page - more debug info + ability to add comments ([5f44986](https://github.com/OpenUserCSS/openusercss.org/commit/5f44986))
* **client:** Extensions can optionally specify branding to display ([be5729c](https://github.com/OpenUserCSS/openusercss.org/commit/be5729c))
* **client:** Generate awesome gradients with scss ([0e47ab6](https://github.com/OpenUserCSS/openusercss.org/commit/0e47ab6))
* **client:** Generate debugging information on error page ([4e41cdb](https://github.com/OpenUserCSS/openusercss.org/commit/4e41cdb))
* **client:** Gradient buttons in list-creator ([9a5a9d5](https://github.com/OpenUserCSS/openusercss.org/commit/9a5a9d5))
* **client:** Require accepting TOS before registering ([c6494b8](https://github.com/OpenUserCSS/openusercss.org/commit/c6494b8))
* **client:** Retry failed network requests 10 times before failing ([85844e9](https://github.com/OpenUserCSS/openusercss.org/commit/85844e9))
* **client:** Set the user agent while SSRing ([cd077e6](https://github.com/OpenUserCSS/openusercss.org/commit/cd077e6))
* **client:** Show better theme install button messages ([401c6a6](https://github.com/OpenUserCSS/openusercss.org/commit/401c6a6))
* **client:** Show link to test page if in development ([4313647](https://github.com/OpenUserCSS/openusercss.org/commit/4313647))
* **client:** Show test page link in staging ([d437340](https://github.com/OpenUserCSS/openusercss.org/commit/d437340))
* Dockerise development environment (fixes [#22](https://github.com/OpenUserCSS/openusercss.org/issues/22)) ([219e428](https://github.com/OpenUserCSS/openusercss.org/commit/219e428))
* **client:** Transparent logo for new design 🍸 ([c1f9a55](https://github.com/OpenUserCSS/openusercss.org/commit/c1f9a55))
* **client:** Use 'themes' query in store ([c6286f1](https://github.com/OpenUserCSS/openusercss.org/commit/c6286f1))
* **client:** Use 'themes' query in the Vue app ([9c6cfbf](https://github.com/OpenUserCSS/openusercss.org/commit/9c6cfbf))
* **client:** Use backdrop-filter in navbar if there's support ([5505509](https://github.com/OpenUserCSS/openusercss.org/commit/5505509))
* Allow __typename as dangling underscore ([55270d9](https://github.com/OpenUserCSS/openusercss.org/commit/55270d9))
* **config:** Env from NODE_ENV, only encrypt in prod ([2af6378](https://github.com/OpenUserCSS/openusercss.org/commit/2af6378))
* **config:** Print patched config values on boot while in development ([1245365](https://github.com/OpenUserCSS/openusercss.org/commit/1245365))
* **deps:** Add eslint unicorn plugin + caching ([e391b59](https://github.com/OpenUserCSS/openusercss.org/commit/e391b59))
* **hooks:** Run yarn after pull, merge and commit [ci skip] ([5f9cc0a](https://github.com/OpenUserCSS/openusercss.org/commit/5f9cc0a))
* Derive API from domain, prepare for staging deployment ([481adbb](https://github.com/OpenUserCSS/openusercss.org/commit/481adbb))
* **manager:** Quit if env doesn't match config to protect data ([6b925da](https://github.com/OpenUserCSS/openusercss.org/commit/6b925da))
* **startscript:** Log info when not managing the hosts file ([476762c](https://github.com/OpenUserCSS/openusercss.org/commit/476762c))
* **startscript:** Rootless mode + better usage hints ([7fb30b7](https://github.com/OpenUserCSS/openusercss.org/commit/7fb30b7))


### Performance Improvements

* **build:** Install dependencies during build instead of runtime ([2a5c6a8](https://github.com/OpenUserCSS/openusercss.org/commit/2a5c6a8))
* **build:** Optimise production Dockerfile ordering ([b2ba4b7](https://github.com/OpenUserCSS/openusercss.org/commit/b2ba4b7))
* **CI:** Install yarn into the cache, symlink after ([88483a1](https://github.com/OpenUserCSS/openusercss.org/commit/88483a1))
* **client:** Use less intensive transition on small screens ([74d9c6e](https://github.com/OpenUserCSS/openusercss.org/commit/74d9c6e))



<a name="0.9.6"></a>
## [0.9.6](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.5...v0.9.6) (2018-01-10)


### Bug Fixes

* **API:** Rebalance search index weights ([9f9e504](https://github.com/OpenUserCSS/openusercss.org/commit/9f9e504))



<a name="0.9.5"></a>
## [0.9.5](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.4...v0.9.5) (2018-01-10)


### Bug Fixes

* **API:** Work around "Cannot read property toString of undefined" ([b6d3a38](https://github.com/OpenUserCSS/openusercss.org/commit/b6d3a38))
* **client:** Fix read only object property assignment on search ([76018f4](https://github.com/OpenUserCSS/openusercss.org/commit/76018f4))



<a name="0.9.4"></a>
## [0.9.4](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.3...v0.9.4) (2018-01-09)


### Bug Fixes

* **client:** Fix screenshot position (closes [#55](https://github.com/OpenUserCSS/openusercss.org/issues/55)) ([4b3c6f5](https://github.com/OpenUserCSS/openusercss.org/commit/4b3c6f5))
* **client:** The enabled prop isn't actually useful ([d4cbfdf](https://github.com/OpenUserCSS/openusercss.org/commit/d4cbfdf))



<a name="0.9.3"></a>
## [0.9.3](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.2...v0.9.3) (2018-01-09)


### Bug Fixes

* **client:** Validate options before saving ([d5a0bf6](https://github.com/OpenUserCSS/openusercss.org/commit/d5a0bf6))



<a name="0.9.2"></a>
## [0.9.2](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.1...v0.9.2) (2018-01-09)


### Bug Fixes

* **API:** Add empty strings for option props if they're null ([b6b28f6](https://github.com/OpenUserCSS/openusercss.org/commit/b6b28f6))
* **client:** Fix list-creator not showing its buttons ([7f5aaf6](https://github.com/OpenUserCSS/openusercss.org/commit/7f5aaf6))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.9.0...v0.9.1) (2018-01-09)


### Bug Fixes

* **API:** Improve latest themes and popular themes query ([dd181f6](https://github.com/OpenUserCSS/openusercss.org/commit/dd181f6)), closes [#65](https://github.com/OpenUserCSS/openusercss.org/issues/65)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.8.1...v0.9.0) (2018-01-09)


### Bug Fixes

* Fix newlines causing errors in theme title (closes [#58](https://github.com/OpenUserCSS/openusercss.org/issues/58)) ([148f450](https://github.com/OpenUserCSS/openusercss.org/commit/148f450))


### Features

* **API:** Add [@update](https://github.com/update)URL, apparently it's a thing ([f07245a](https://github.com/OpenUserCSS/openusercss.org/commit/f07245a))
* **client:** Show version tag in the footer ([897e22f](https://github.com/OpenUserCSS/openusercss.org/commit/897e22f))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.8.0...v0.8.1) (2018-01-09)


### Bug Fixes

* **API:** Fix theme parsing with no comments ([bb22926](https://github.com/OpenUserCSS/openusercss.org/commit/bb22926))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.7.1...v0.8.0) (2018-01-09)


### Bug Fixes

* **API:** Raise request body limit to 120k (closes [#56](https://github.com/OpenUserCSS/openusercss.org/issues/56)) ([fa223bf](https://github.com/OpenUserCSS/openusercss.org/commit/fa223bf))
* **client:** Fix linting issues ([aa1ee58](https://github.com/OpenUserCSS/openusercss.org/commit/aa1ee58))


### Features

* **client:** Use usercss-builder to build install event ([546acc9](https://github.com/OpenUserCSS/openusercss.org/commit/546acc9))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.7.0...v0.7.1) (2018-01-09)


### Bug Fixes

* **API:** Add uso preprocessor to usercss renderer ([12ab8e4](https://github.com/OpenUserCSS/openusercss.org/commit/12ab8e4))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.6.3...v0.7.0) (2018-01-09)


### Bug Fixes

* **build:** Attempt to push tags right ([08c25e7](https://github.com/OpenUserCSS/openusercss.org/commit/08c25e7))


### Features

* **client:** Add theming classes (closes [#35](https://github.com/OpenUserCSS/openusercss.org/issues/35)) ([454a19e](https://github.com/OpenUserCSS/openusercss.org/commit/454a19e))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/OpenUserCSS/openusercss.org/compare/v0.6.2...v0.6.3) (2018-01-08)


### Bug Fixes

* **build:** Correctly lint vue SFCs ([3bcdc09](https://github.com/OpenUserCSS/openusercss.org/commit/3bcdc09))
* **build:** Manually commit after cutting a release ([1c79814](https://github.com/OpenUserCSS/openusercss.org/commit/1c79814))
* **build:** Only use the testing exit code ([320e294](https://github.com/OpenUserCSS/openusercss.org/commit/320e294))


### Performance Improvements

* **build:** Remove some unneeded steps ([1a4027a](https://github.com/OpenUserCSS/openusercss.org/commit/1a4027a))
* **build:** Remove unused build steps ([7b39d80](https://github.com/OpenUserCSS/openusercss.org/commit/7b39d80))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/OpenUserCSS/openusercss.org/compare/v0.6.1...v0.6.2) (2018-01-07)


### Bug Fixes

* **deps:** Move unquote to dependencies ([5ecf1f8](https://github.com/OpenUserCSS/openusercss.org/commit/5ecf1f8))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.6.0...v0.6.1) (2018-01-07)


### Bug Fixes

* **build:** Escape changelog instead on URI encoding ([efa9f5b](https://github.com/OpenUserCSS/openusercss.org/commit/efa9f5b))
* **client:** Adjust options cards for new options model ([0936f37](https://github.com/OpenUserCSS/openusercss.org/commit/0936f37))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.5.2...v0.6.0) (2018-01-07)


### Bug Fixes

* **client:** Add missin helper css and js to theme page ([ef0e7cf](https://github.com/OpenUserCSS/openusercss.org/commit/ef0e7cf))


### Features

* **API:** Add usercss parser, remove def from css on save ([9b87b3a](https://github.com/OpenUserCSS/openusercss.org/commit/9b87b3a))
* **client:** Add a commented out button depending on extension ([dcf206d](https://github.com/OpenUserCSS/openusercss.org/commit/dcf206d))
* **client:** Add help item to navbar ([8687722](https://github.com/OpenUserCSS/openusercss.org/commit/8687722))
* **client:** Add help page + show detected extension ([9f583de](https://github.com/OpenUserCSS/openusercss.org/commit/9f583de))
* **client:** Add usercss parsing, build options object ([c09b739](https://github.com/OpenUserCSS/openusercss.org/commit/c09b739))
* **client:** Don't show no-extension warning on theme page ([df881a4](https://github.com/OpenUserCSS/openusercss.org/commit/df881a4))
* **client:** Implement checking for extensions ([6b78df2](https://github.com/OpenUserCSS/openusercss.org/commit/6b78df2))
* **client:** Make the version property optional for extensions ([16159f3](https://github.com/OpenUserCSS/openusercss.org/commit/16159f3))
* **client:** Use parsed usercss to build the edited model ([5088889](https://github.com/OpenUserCSS/openusercss.org/commit/5088889))
* **list-creator:** Add the ability to create nano collections ([2bbaa8a](https://github.com/OpenUserCSS/openusercss.org/commit/2bbaa8a))


### Performance Improvements

* **client:** Remove unused lifecycle hooks from notice page ([814207e](https://github.com/OpenUserCSS/openusercss.org/commit/814207e))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/OpenUserCSS/openusercss.org/compare/v0.5.1...v0.5.2) (2018-01-05)


### Bug Fixes

* **client:** Always hide microdata (closes [#51](https://github.com/OpenUserCSS/openusercss.org/issues/51)) ([a2c2a94](https://github.com/OpenUserCSS/openusercss.org/commit/a2c2a94))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.5.0...v0.5.1) (2018-01-05)


### Bug Fixes

* **client:** Fix unsubmittable forms (closes [#53](https://github.com/OpenUserCSS/openusercss.org/issues/53)) ([3deb97a](https://github.com/OpenUserCSS/openusercss.org/commit/3deb97a))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.4.0...v0.5.0) (2018-01-05)


### Bug Fixes

* **API:** Remove markdown from theme description on render ([d9caf1d](https://github.com/OpenUserCSS/openusercss.org/commit/d9caf1d))


### Features

* **API:** Throw an error if theme parsing fails ([911f95e](https://github.com/OpenUserCSS/openusercss.org/commit/911f95e))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.3.3...v0.4.0) (2018-01-05)


### Features

* **API:** Cut usercss definitions from code ([c29555e](https://github.com/OpenUserCSS/openusercss.org/commit/c29555e))
* **client:** Parse theme source on input in editor ([572aaa9](https://github.com/OpenUserCSS/openusercss.org/commit/572aaa9))
* **shared:** Add usercss parser function ([12487fb](https://github.com/OpenUserCSS/openusercss.org/commit/12487fb))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/OpenUserCSS/openusercss.org/compare/v0.3.2...v0.3.3) (2018-01-05)


### Bug Fixes

* **API:** Fix bad import in renderer (fixes [#50](https://github.com/OpenUserCSS/openusercss.org/issues/50)) ([0d13dd3](https://github.com/OpenUserCSS/openusercss.org/commit/0d13dd3))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/OpenUserCSS/openusercss.org/compare/v0.3.1...v0.3.2) (2018-01-04)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.3.0...v0.3.1) (2018-01-04)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/OpenUserCSS/openusercss.org/compare/v0.2.1...v0.3.0) (2018-01-04)


### Features

* **client:** Show changelog + add Patreon logo to footer ([57dca6c](https://github.com/OpenUserCSS/openusercss.org/commit/57dca6c))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/OpenUserCSS/openusercss.org/compare/v0.2.0...v0.2.1) (2018-01-04)
