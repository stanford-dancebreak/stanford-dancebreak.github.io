Setup
-----

There's not much to do to setup, but here we go:

1. Pull the repository to your local machine with
	git clone git@gitlab.com:stanford-dancebreak/website.git

That's it! Everything is set up for you to edit the repository and pages and
everything...


Offsite Testing
---------------

HTML files will not properly render outside the Stanford web server due to the
presence of SSIs.  They look like the following:

	<!--#include virtual="includes/stdhead.ssi"-->

To properly view these files, use the "OffsiteMake.sh" script, which creates a
copy elsewhere (default is "/tmp/dancebreak_website_<username>") with the HTML
file modified to render correctly.  Then view those files in your browser.

Updating the Website
--------------------

That is, unless you're the webmaster -- you get the privilege of being able to
push to the site. This doesn't require any additional setup, so here's the
procedure:

1. SSH onto corn or myth.
	> ssh [your-sunet-id]@corn.stanford.edu

2. Go to the website directory.
	> cd /afs/ir/group/dancebreak/WWW

3. Go into the staging directory.
	> cd staging

4. Pull the changes into staging (you'll need your GitLab credentials).
	> git pull

5. Check the staging site to make sure everything looks good.
	Browser -> dancebreak.stanford.edu/staging

6. Go to the main directory, and pull into the main site:
	> cd ..
	> git pull staging

7. Check the main site to make sure everything looks good.
	Browswer -> dancebreak.stanford.edu/

8. Done!


About
-----
Everything on the site is written in plain HTML to make setting up and editing
somewhat easier. There are uses of Apache Server Side Includes to make the code
slightly cleaner.

Oh, and even if Bob insists against this, it will make everyone's life easier if
there's only the master branch.


Setup
-----
If you are reading this file because you are trying to duplicate the setup at
both GitLab and on the Stanford webserver, this should get you started.

PREREQUISITES NOTES:

     1.  It is assumed that you already have an account on GitLab and that you
         have already set up your GitLab credentials.  That process is not
         detailed here, but is well-documented at https://gitlab.com/.

     2.  It is assumed that you already have an account and directory on the
         Stanford webserver.  The process (as of 2018 January) is detailed at:

              https://uit.stanford.edu/service/web/centralhosting/howto_group

         Note:  this only provides you the long and unwieldly URL,
         https://web.stanford.edu/group/<group>.  Once you have been granted
         this, you can then obtain the more compact ("vanity" or "reserved")
         URL, https://<group>.stanford.edu/, by filing a "proxy" request at:

              https://uit.stanford.edu/service/vhost

A.  GitLab setup.

    1. Go to https://gitlab.com/ and sign in.

    2. Create a new group, with a unique name (e.g. "stanford-dancebreak").
       You'll probably want to make the group "Private" (so that projects can
       only be viewed by group members).

    3. Create a new project under the new group ("website").  Use the "Blank
       project" tab.  (Note:  by default, the new project will be "Private" if
       the group was set to "Private," above.)

    4. GitLab provides instructions for populating the new (empty) repository.
       Follow the set that matches your situation.  (Most likely, you have a
       directory of files not already controlled by git, so use the "Existing
       folder" instructions.)

B.  Stanford webserver setup.

    1. SSH onto corn or myth.
	> ssh [your-sunet-id]@corn.stanford.edu

    2. Create the website directory (if necessary) and go to it.
	> mkdir -m 0755 /afs/ir/group/dancebreak/WWW
	> cd /afs/ir/group/dancebreak/WWW

    3. Create the staging and main clones (you'll need your GitLab credentials).
	> git clone git@gitlab.com:stanford-dancebreak/website.git
	> mv website staging
	> git clone git@gitlab.com:stanford-dancebreak/website.git
	> mv staging website
	> mv website/* website/.* .
	> rmdir website

    4. Verify that "Updating the Website" (above) flow works.

    5. Done!
