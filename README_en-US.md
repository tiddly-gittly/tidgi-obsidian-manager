# tw5-obsidian-vault

[Chinese](/README.md) | [English](/README_en-US.md)

> Obsidian Vault Publishing Tools by NodeJS TiddlyWiki
>
> TiddlyWiki plugin for NodeJS. Import Obsidian Vault administration in TW (add, update, empty) or as a publishing method 
>
> TidGi v0.8.0 Requires HTTP API enabled and credential authentication option turned off in Workspace Settings Blog and Server Settings.
>
> Updates require you to tap clear before tapping import; because of the uniqueness of entry names, it is recommended that a wiki import only one obsidian vault.

- [x] Provide clearing of write (import) files.
- [x] Provide adaptation to md and ob link and attachment syntax.
- [x] Provide import of ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'] files from ob repository based on directory.
- [x] Provide logging of write files.
- [x] Provide filter file and ignore folder function.
- [x] Provide function to rewrite the directory tree of obsidian file system.
- [x] Supports importing multiple repositories.
- [ ] Supports deleting a single repository.
- [ ] Provide the function of updating files from obsidian, and provide the option of retaining modified files. By default, it is synchronized with ob knowledge base files.

Preview link: https://tiddly-gittly.github.io/tidgi-obsidian-manager/

## Dependency plugin: tiddlywiki/markdown
Supported syntaxes include but are not limited to:

``.
**This is slanted text**
**This is bolded text***
***This is slanted bolded text***
== this is highlighted text ==
~~This is text with strikethroughs~~
<u>This is underlined text</u>
``

## How to use

> TidGi ≥ v0.8.0 requires HTTP API enabled and Credentials Authentication option turned off in Workspace Settings Blog and Server Settings.

- Click on the Sidebar - VaultTrees tab and click on the P letter link. Or click Settings (Console) - Settings tab - OBM-Panel tab.
- Enter the Obsidian Vault folder path in the text box and click the Add button.
- You can enter a regular rule in the input "Filter files" to check out only the files that match and put them in your wiki. You can choose to ignore some folders by entering an expression in the "ignore" field.
- You can use the purge button to clear your additions.
- You can see what's going on in Developer Mode - Console.

### ignore expression

Leave it empty, i.e. ignore ".git", ".obsidian", ".stfolder", ".stversions" folders by default.

Additional expression: you can type `+folder name, folder name, ... in the ignore input box. `, note that the first letter must be `+` to ignore more folders. Note the English comma.

Fully customizable: if the first letter is not `+` character, it is customized to ignore folders that need to be ignored.

### Filtering file expressions

Use regular expression to match if the file contains matching content, e.g. "def::pub", if the file contains matching content, it will be detected and written to the wiki.