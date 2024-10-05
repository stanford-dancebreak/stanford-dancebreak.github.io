Quick Guide
-----------
If you are the webmaster, and you just want to pull down updates
to the Stanford webserver, follow the contents of:

     .HOW-TO/HOW-TO-Website-Updating.txt

Detailed Guide
--------------
There are guides to various processes contained under the
.HOW-TO/ subdirectory:

     *  HOW-TO-Admins-Updating.txt

        How to update admin access to the website (particularly,
        adding and removing webmasters).

     *  HOW-TO-Setup-Editing.txt

        Setting up accounts and your computer in order to perform
        edits/updates for the website.

     *  HOW-TO-Setup-Website.txt

        Duplicating this website's setup.  Useful for creating a
        similar website (on Stanford's webserver), using GitLab
        for the file repository.

     *  HOW-TO-Website-Updating.txt

        How to update the website (including initial set-up to
        authorize you to do so).

Please refer to the appropriate guide for help on performing the
specified operation.

About
-----
Everything on the site is written in plain HTML, to make setting
up and editing somewhat easier, with the exception of the event
table manager.  That is written in (relatively) simple Javascript
so that only the table file itself needs to be changed when a new
event is added or an existing one is updated, to reduce the
number of (HTML) edits.

There are uses of Apache Server Side Includes to make the code
slightly cleaner.

NOTE:  to make everyone's life easier, have only the master
branch.  Do not create or merge in new/side branches.
