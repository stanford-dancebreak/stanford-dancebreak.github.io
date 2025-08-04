# Dancebreak Website

## Setup

You will need to install [Hugo](https://gohugo.io/), which is available for all
major operating systems.

This repository uses submodules, so clone it using:
```
git clone git@github.com:stanford-dancebreak/stanford-dancebreak.github.io --recurse-submodules
```

Or clone it normally, then use this command to initialize the submodules:
```
git submodule update --init
```

When you want to pull changes to the submodules, use:
```
git pull --recurse-submodules
```

## Editing

Run the following command in your Terminal/Command Prompt to start a local server:
```
hugo server
```

You should be able to access the draft version of the site at <localhost:1313>
(or whatever the output says).

You can then edit the Markdown files which make up the site, and view your
changes live in the browser.  Announcements go in `content/posts/`,
informational pages go in `content/info/`.  We currently use the Hugo theme
[Hextra](https://imfing.github.io/hextra/), which provides some nice built-in
features.

## Building

Run this command to build the site, and copy the output to the `public` directory:

```
hugo
```

## Publishing

This repository is set up such that, when you push to GitHub, it will
automatically rebuild and deploy to `dancebreak.stanford.edu`.  If for some
reason this fails, you must log into AFS (via `myth.stanford.edu` or
`rice.stanford.edu`, probably) and modify the files there manually.
