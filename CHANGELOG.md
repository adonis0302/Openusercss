# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
