Thank you for contributing your time, resources and expertise to the project!  
OpenUserCSS is released under the GNU General Public License v3.0. As such, all contributions must be released under the same license.  

This file is always under construction, if you have a suggestion or find a discrepancy, please [file an issue](https://github.com/OpenUserCSS/openusercss.org/issues/new)!

----

# Submitting issues  
When submitting an issue, take a look at [the issue list](https://github.com/OpenUserCSS/openusercss.org/issues?utf8=%E2%9C%93&q=is%3Aissue) to see if your issue was already posted.  
I also recommend reading [this great writeup](https://www.chiark.greenend.org.uk/~sgtatham/bugs.html) by Simon Tatham, the author of PuTTY and [a bunch of other free software](https://www.chiark.greenend.org.uk/~sgtatham/)!

# Setting up your development environment  
1. Install the git command line client using your package manager, or from ([https://git-scm.com/downloads](https://git-scm.com/downloads))
1. Install NodeJS using your package manager, or from [https://nodejs.org/en/download/](https://nodejs.org/en/download/) (use either the latest, or the latest LTS version)
1. Make sure that Java is installed, as it's required by Selenium for browser based testing.
1. Install yarn ([https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install))
1. Fork the repository into your account
1. Clone the repo with `git clone https://github.com/<your username>/openusercss.org.git .`
1. Type `yarn` to install all the required dependencies into the node_modules directory
1. (optinally) Add `./node_modules/.bin` into your $PATH, as all required binaries are there
1. Type `npm run watch` to start the development server with live reload
1. Hack away!  

# Committing  
This project follows the `standard` commit message convention. For example:  
`feat(client): Display short revision id + branch in footer`  

If you don't want to type this format manually, you can use `npm run commit` or `git-cz` to launch Commitizen that creates the format for you.  

If you're not using Commitizen, make sure that you stash your changes beforehand, so that only committed code gets tested.  

If you're using `npm run commit` to commit your changes, stashing is taken care of automatically. If the process fails for some reason, the stash should get restored. If that doesn't happen, you can type `git stash apply` to restore them manually.
