<!-- Hide script from old browsers (until "TO HERE").



/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////  NOTE to Dancebreak webmasters:  if you are just      /////
/////  trying to add new location entries, edit             /////
/////  timetableTables.js instead, and NOT THIS FILE!       /////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// NOTE:  this file is meant to be the ONLY file included in the
// HTML files.  It should be used as follows:
//
//      <script src="timetableLoader.js"></script>
//      <script>TimetableLoader.updatePageEvents();</script>
//
// The <script> tags should be placed at the bottom of the <body>
// of the files, to ensure that the <p> tags that will be
// modified have been read in by the browser.  This is based on
// the document titles.  Those files, titles, and tags are:
//
// *  index.html (title: "Dancebreak - Home")
//
//    --  <p id="home_textContent_nextEvent"></p>
//    --  <p id="home_textContent_futureEventsTable">Separator <a href="https://url.url.url/">line</a> <em>text</em></p>
//
// *  oldLocations.html (title: "Dancebreak - Old Locations")
//
//    --  <p id="oldLocations_textContent_pastEventsTable"></p>
//
//---------------------------------------------------------------
//
// For code maintainers, the Javascript code in this file
// implements these 2 features:
//
// 1.  Force the loading of new versions of all Javascript files.
//
//     Browsers typically cache Javascript files for a long time,
//     and there's no guaranteed way to force them to reduce the
//     length of the expiration date.  However, by adding a
//     random string to the URL for the Javascript files, there
//     is never a cache hit, forcing the browser to reload.
//
//     Unfortunately, a random string cannot be generated within
//     HTML, so the loading of the Javascript files must be
//     generated from within Javascript as well.
//
// 2.  Load all Javascript files required by those HTML
//     documents, ensuring that all are loaded *and* processed
//     before they are used.
//
//     MASSIVE CAVEAT:  although load requests are generated in
//     the order they are listed, loading will actually occur in
//     parallel (see paragraph below, starting with "The usual
//     solution").  Additionally, load times cannot be guaranteed
//     anyway due to outside factors such as network delay.
//     Thus, the order cannot be guaranteed.  If there are
//     dependencies between files, then those must be managed by
//     the files themselves!
//
//     There is no native way within Javascript to load another
//     file, even another Javascript one.  The usual solution,
//     especially if the files must be loaded in a certain order
//     because of dependencies, is to use <script> tags -- e.g.
//
//          <script src="file1.js"></script>
//          <script src="file2.js"></script>
//          [...]
//
//     However, the URL supplied for the "src" value must include
//     a random value (see feature #1, above), which cannot be
//     generated in an HTML file.  Thus, the loading request must
//     be generated using Javascript.
//
//     The usual solution is to inject <script> tags using
//     Javascript.  However, as these are dynamically-created
//     <script> tags, the loading and processing of the
//     Javascript files is done asynchronously.  There is no
//     guarantee that an invocation of a function from one of
//     those files will not result in a "not defined" error
//     because the file hasn't loaded or been completely
//     processed yet.
//
//          <script src="file1.js"></script>
//          <script src="file2.js"></script>
//          <script>file1.doSomething();</script>  <--- FAIL!
//
//          file1.doSomething() not defined
//
//     Various general-purpose solutions based on checking all
//     possible load/ready events (for cross-browser
//     compatibility) exist, but a much simpler one is used
//     below.  A single public "this file is loaded and ready"
//     function is provided, which all files call (exactly once),
//     optionally supplying an "ALL files loaded and ready"
//     callback function.  The loader waits until it detects that
//     all files are ready, and then invokes the callback
//     function, if one was registered.  (As a side benefit, this
//     means it doesn't need to know any of the loaded files'
//     symbols.)  In the files that are loaded, the invocation of
//     this function can be placed at the bottom of the file,
//     ensuring that that file has indeed been loaded and
//     processed.  One of the files can be designated the "main"
//     one, and it can additionally register the "all-ready"
//     callback function which is then invoked.  The only
//     requirement is that all files be processed, not any
//     particular order, and that *can* be guaranteed.
//
//     The drawback is that, typically, all files must be loaded
//     before any real action takes place.  But these files are
//     small enough and the code simple enough that that should
//     not be noticeable to the user -- load times over a network
//     should be far larger.
/////////////////////////////////////////////////////////////////

//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

/////////////////////////////////////////////////////////////////
// NOTE:  the enclosing "(function () { ... }());" bit is an
// anonymous function construct, and creates a "closure," which
// provides privacy and state (i.e. a traditional class).  This
// ensures that the variable and function names won't clash with
// any outside this file (admittedly, a very unlikely scenario).
var TimetableLoader = (function () {
   // Make "my" an internal reference to this class.
   var my = {};

   //////////////////////////////////////////////////////////////
   // Private variables.
   //
   // Note:  the variables above this section are also private.
   //////////////////////////////////////////////////////////////
   // Javascript files to load, along with the counter to keep
   // track of loading and the callback to call when all have
   // been processed (along with which file owns it).
   const scriptFileNames = [
      'timetableTables.js', 'timetableCode.js'
   ];
   var numReadyFiles = 0;
   var allReadyCallbackFunction = null;
   var callbackOwnerFilename = '';
   //------------------------------------------------------------
   // timeNow will be appended as part of a query string when
   // loading scripts to effectively randomize the request URL,
   // to ensure that any cached versions stored in the requesting
   // browser are never used -- in other words, the version on
   // the server will *always* be loaded.  Millisecond precision
   // should suffice to be "random."
   var timeNow = Date.now().toString();
   //------------------------------------------------------------
   // The start date, as specified in the HTML file that is
   // loading the Javascript files and invoke events processing.
   // It is passed as the sole parameter to the callback that is
   // invoked through callbackAllJSFilesReady() when all
   // Javascript files are loaded and processed.
   theStartDate = undefined;
   //------------------------------------------------------------


   //////////////////////////////////////////////////////////////
   // Public functions.
   //////////////////////////////////////////////////////////////

   /**
    * Load all scripts specified by the scriptFileNames array, in
    * the array order.  MASSIVE CAVEAT:  although the load
    * requests are generated in-order, loading will actually
    * occur in parallel.  Plus, load times cannot be guaranteed
    * anyway due to outside factors such as network delay.  Thus,
    * the order cannot be enforced.
    * Note:  technically, this generates and appends to the
    * document body <script> tags for each filename.  The loading
    * occurs when the end of the document body is finally
    * processed.  (The call to this function should thus occur at
    * the end of the body, for safety.)  In addition, a query
    * string containing a random number (based on the current
    * time) is appended to each filename URL, to force the
    * browser to not use a cached copy.
    * @param {string} startDate - The date the table begins.
    */
   my.updatePageEvents = function (startDate) {
      if (typeof startDate !== 'undefined') {
         theStartDate = startDate;
      }
      // This idea was based on the "Dynamic Script Loading"
      // section of this Stack Overflow answer, here:
      //      https://stackoverflow.com/a/950146
      // Since this function is assumed to be called from the
      // end of the body of the document, however, the script
      // elements are appended to that, rather than the head.
      for (ii = 0; ii < scriptFileNames.length; ++ii) {
         var fileTag = document.createElement('script');
         // Millisecond precision should suffice to create a
         // "random" query string.
         fileTag.src = scriptFileNames[ii] +
            '?forceRandomURL=' + timeNow;
         document.body.appendChild(fileTag);
      }
   };

   /**
    * Define the 'allReadyCallback' callback type, which is the
    * callback function invoked when all files have been loaded
    * and processed -- i.e. everything is ready to go.
    * @callback allReadyCallback
    * @param {string} startDate - The date the table begins.
    */

   /**
    * Notify the loader that a file has been loaded and
    * completely processed.  Optionally set the "all is ready"
    * callback function (which is called by this function).
    * Note:  it is not an error for multiple files to set the
    * callback function, but because the loader cannot guarantee
    * load order because files are loaded in parallel, plus load
    * times may be affected -- e.g. by network delays -- it is
    * undefined which callback function will ultimately be
    * registered.  However, if the callback function had been
    * previously set, then a warning message is sent to the
    * browser console indicating this replacement.
    * Note:  if no callback function has been registered, then a
    * warning is issued to the console.  This is not considered
    * an error.
    * @param {string} filename - The name of the file that has
    *    been loaded, processed, and is ready to be used.
    * @param {allReadyCallback} callbackFunction - The function
    *    invoked when all Javascript files are processed.
    */
   my.fileReady = function (filename, callbackFunction) {
      // Note:  we assume that each file calls this function
      // *exactly* once, and so don't need to keep track of which
      // files have been loaded.
      numReadyFiles++;
      if (typeof callbackFunction !== 'undefined') {
         if (allReadyCallbackFunction != null) {
            console.log(
               'Warning: all-ready function previously ' +
               'registered by file: ' + callbackOwnerFilename);
            console.log(
               'Warning: replacing all-ready function with ' +
               'one from file: ' + filename);
         }
         allReadyCallbackFunction = callbackFunction;
         callbackOwnerFilename = filename;
      }
      if (numReadyFiles == scriptFileNames.length) {
         if (allReadyCallbackFunction == null) {
            console.log(
               'Warning: no all-ready function registered ' +
               '(so nothing will be called).');
         } else {
            allReadyCallbackFunction(theStartDate);
         }
      }
   };

   //////////////////////////////////////////////////////////////
   // Export everything above within a class object.
   //////////////////////////////////////////////////////////////
   return my;
}());

// End hiding script from old browsers (TO HERE). -->
