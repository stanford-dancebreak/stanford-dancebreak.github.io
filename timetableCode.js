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
// NOTE:  this file is meant to be loaded via timetableLoader.js.
// Do NOT load it directly from an HTML file!
//
// In particular, it should be loaded via the updatePageEvents()
// function in that file.
//
//---------------------------------------------------------------
//
// For code maintainers, the Javascript code in this file
// implements these 2 features:
//
// 1.  Future events.  There are 2 functions provided:
//
//     --  appendNextEventSite()
//
//         Appends details regarding the chronologically next
//         event into the <p> element whose ID is
//         "home_textContent_nextEvent" (normally this <p>
//         element is empty in the HTML file).
//
//     --  appendFutureEventsTable()
//
//         Places a <table> of future events where the <p>
//         element with ID "home_textContent_futureEventsTable"
//         is located.  The <p> element is then used in the
//         separator section of the table.
//
// 2.  Past events.  The following function is provided:
//
//     --  appendPastEventsTable()
//
//         Replaces a <p> element whose ID is
//         "oldLocations_textContent_pastEventsTable" with a
//         <table> of past events.
//
// (See the header comments in timetableLoader.js for examples of
// the above <p> tags.)
//
// A preparatory function, to preprocess a table of events (in
// timetableTables.js -- see below), preprocessEventsData(), is
// invoked prior to the above.  That and the above functions are,
// in turn, invoked by processDocument(), the sole public
// function.  This last function determines which of the above 2
// features are to be used, based on the document's title.  See
// the header comments in timetableLoader.js for further details.
//
// The above depend upon a public class, TimetableTables, which
// contains a public 2-dimensional array, allLocations.  These
// are provided by timetableTables.js.
//
// See the bottom of this file for how loading and complete
// processing of this and all dependent Javascript script files
// is accomplished.
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
var TimetableCode = (function () {
   // Make "my" an internal reference to this class.
   var my = {};

   //////////////////////////////////////////////////////////////
   // Private variables.
   //
   // Note:  the variables above this section are also private.
   //////////////////////////////////////////////////////////////
   const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'
   ];
   const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November',
      'December'
   ];
   const noFuturesMessage =
      '<em>No (upcoming) sessions yet. Check back again!</em>';
   const separatorStyle = '1pt solid #fff';
   // subtractionDays is used by generateEntryDateString() to
   // subtract a number of days to reach the prior Friday by
   // which the room reservation is normally confirmed.
   const subtractionDays = [9, 3, 4, 5, 6, 7, 8];
   // dateToday will be used for comparisons with dates in the
   // locations table while generating the table.  The time
   // component is set to midnight, so that effectively only
   // dates are compared.
   var dateToday = new Date();
   dateToday.setHours(0,0,0,0);

   //////////////////////////////////////////////////////////////
   // These variables support the generation of events
   // information.  There are 3:  the next upcoming event, a
   // "future events" table, and a "past events" table.  The
   // first is the earliest chronological event occurring on or
   // after today.  The "future events" table consists of all
   // events ocurring on or after the start date provided to the
   // data preprocessor function, preprocessEventsData().  The
   // "past events" table consists of all events occuring
   // strictly before the aforementioned start date.
   //
   // The following 3 variables are set by the date preprocessor
   // function, preprocessEventsData().  The first two determine
   // the following subsets of events:
   // - 0...pastStartIdx-1 : "past events"
   // - pastStartIdx...pastEndIdx-1 : "future events" recent past
   // - pastEndIdx : next upcoming event
   // - pastEndIdx... : "future events" upcoming
   var pastStartIdx = -1;
   var pastEndIdx = -1;
   var indicesAreValid = false;

   //////////////////////////////////////////////////////////////
   // Private functions -- top-level.
   //////////////////////////////////////////////////////////////
   /**
    * Create a "future events" table, and place it in the current
    * location of the paragraph element whose ID is provided.
    * That paragraph element becomes the "separator" part of the
    * table, which consists of 4 parts:  a header (column
    * labels), upcoming events (starting from today), a separator
    * row (consisting of the replaced paragraph), and events of
    * the recent past.  (See header comments for my.past*Idx for
    * what specific events are used.)
    * @param {string} paraID - ID of the <p> element where the
    *    generated table will be inserted.
    */
   function appendFutureEventsTable(paraId) {
      // The indices must already be set.
      if (!indicesAreValid) {
         console.log(
            'preprocessEventsData() was not run before ' +
            'appendFutureEventsTable() was called.');
         return;
      }

      // Locate the <p> element that will become the separator.
      var thePara = document.getElementById(paraId);
      var paraParent = thePara.parentNode;

      // Create the table object, and replace the paragraph.
      var table = document.createElement('table');
      paraParent.replaceChild(table, thePara);
      table.style.borderCollapse = 'collapse';

      // Now work on the table.  Create the table's body first.
      var tableBody = document.createElement('tbody');
      table.appendChild(tableBody);
      tableBody.appendChild(generateHeader());

      // Generate table rows.
      if (pastEndIdx == TimetableTables.allLocations.length) {
         tableBody.appendChild(generateEmptyTableRow(
            '<p>' + noFuturesMessage + '</p>'));
      } else {
         for (var jj = pastEndIdx;
              jj < TimetableTables.allLocations.length;
              ++jj) {
            tableBody.appendChild(
               generateEntryRow(
                  TimetableTables.allLocations[jj]));
         }
      }

      // Generate middle/separator rows.
      if (!TimetableTables.isSummerQuarter) {
         // Warn that (some) future dates are unconfirmed -- if
         // it is not the summer quarter.
         //
         // During the regular school year, Dancebreak sessions
         // occur in Roble Gym, and studio reservations must be
         // made on a weekly basis -- and are not confirmed until
         // Friday of the week prior.
         //
         // During summer, this doesn't apply:  sessions occur
         // outside Roble Gym, and reservations are confirmed
         // prior to being added to the locations_* table.
         tableBody.appendChild(generateFutureDatesWarning());
      }
      tableBody.appendChild(generateSeparatorRow(thePara));

      // Note:  strikeout is applied to all (recent) past events
      // in the future events table.
      if (pastStartIdx < pastEndIdx) {
         // The last row has a different style from the rest.
         var kkLast = pastEndIdx - 1;
         for (var kk = pastStartIdx; kk < kkLast; ++kk) {
            tableBody.appendChild(
               generateEntryRow(TimetableTables.allLocations[kk],
                  true));
         }
         // The bottom row is underlined.
         var bottomRow =
            generateEntryRow(
               TimetableTables.allLocations[kkLast],
               true);
         bottomRow.style.borderBottom = separatorStyle;
         tableBody.appendChild(bottomRow);
      }
   };

   /**
    * Create an "upcoming event" string, and append it as the
    * final child element to the paragraph element whose ID is
    * provided.  The string will consist of the location and the
    * date (in parentheses).
    * @param {string} paraId - ID of the <p> element to which the
    *    generated string will be appended as a child element.
    */
   function appendNextEventSite(paraId) {
      // The indices must already be set.
      if (!indicesAreValid) {
         console.log(
            'preprocessEventsData() was not run before ' +
            'appendNextEventSite() was called.');
         return;
      }

      var nextSite = 'Where: ';
      if (pastEndIdx == TimetableTables.allLocations.length) {
         nextSite += noFuturesMessage;
      } else {
         nextSite += TimetableTables.allLocations[pastEndIdx][1];
         var nextDate = createDateObjCrossBrowser(
            TimetableTables.allLocations[pastEndIdx][0]);
         nextSite +=
            ' (<em>' + nextDate.getFullYear() + ' ' +
            monthNames[nextDate.getMonth()] + ' ' +
            nextDate.getDate() + ', ' +
            dayNames[nextDate.getDay()] + '</em>)';
         if (dateObjectCompare(nextDate, dateToday) == 0) {
            nextSite += createTonightText();
         }
      }

      var upcomingEventElem = createSafeCellContent(nextSite);

      // Append the string to the <p> object.
      var thePara = document.getElementById(paraId);
      thePara.appendChild(upcomingEventElem);
   };

   /**
    * Create a "future events" table, and place it in the current
    * location of the paragraph element whose ID is provided.
    * The table will consist of 2 parts:  a header (column
    * labels), and past events.  (See header comments for
    * my.past*Idx for what specific events are used.)
    * @param {string} paraID - ID of the <p> element to be
    *    replaced by the generated table.
    */
   function appendPastEventsTable(paraId) {
      // The indices must already be set.
      if (!indicesAreValid) {
         console.log(
            'preprocessEventsData() was not run before ' +
            'appendPastEventsTable() was called.');
         return;
      }

      // Locate the <p> element to be replaced.
      var thePara = document.getElementById(paraId);
      var paraParent = thePara.parentNode;

      // Create the table object, and replace the paragraph.
      var table = document.createElement('table');
      paraParent.replaceChild(table, thePara);
      table.style.borderCollapse = 'collapse';

      // Now work on the table.  Create the table's body first.
      var tableBody = document.createElement('tbody');
      table.appendChild(tableBody);
      tableBody.appendChild(generateHeader());

      const emptyTableText =
         '<p><em>No past sessions.</em></p>';
      if (pastStartIdx == 0) {
         tableBody.appendChild(generateEmptyTableRow(
             emptyTableText));
      } else {
         // The last row has a different style from the rest.
         for (var jj = pastStartIdx - 1; jj > 0; --jj) {
            tableBody.appendChild(
               generateEntryRow(
                  TimetableTables.allLocations[jj]));
         }
         // The bottom row is underlined.
         var bottomRow =
            generateEntryRow(TimetableTables.allLocations[0]);
         bottomRow.style.borderBottom = separatorStyle;
         tableBody.appendChild(bottomRow);
      }
   };

   /**
    * Returns the string "[TONIGHT!]" in strong, emphasized red
    * text, to empahsize that an event is this evening.
    * @return {string} Highlighted "TONIGHT" text.
    */
   function createTonightText() {
      return ('&nbsp;&nbsp;' + '<span class="red"><strong><em>' +
         '[TONIGHT!]' + '</strong></em></span>');
   };

   /**
    * Process the events in the allLocations array so that
    * information regarding it can be subsequently generated.
    * Only events starting on or after the provided start date
    * will be used.
    * @param {string} [startDate=TimetableTables.thisQuarterStart] -
    *    The date the table begins.
    */
   function preprocessEventsData(
         startDate = TimetableTables.thisQuarterStart) {
      var startDateObj = createDateObjCrossBrowser(startDate);
      // Determine past (before startDate) events first.  This
      // sets pastStartIdx.
      for (pastStartIdx = 0;
              pastStartIdx < TimetableTables.allLocations.length;
              ++pastStartIdx) {
         var pastDate = createDateObjCrossBrowser(
            TimetableTables.allLocations[pastStartIdx][0]);
         if (dateObjectCompare(pastDate, startDateObj) >= 0) {
            break;
         }
      }
      // Now determine the upcoming events (which also determines
      // the recent-past events).  This sets pastEndIdx.
      for (pastEndIdx = pastStartIdx;
           pastEndIdx < TimetableTables.allLocations.length;
           ++pastEndIdx) {
         var recentDate = createDateObjCrossBrowser(
            TimetableTables.allLocations[pastEndIdx][0]);
         if (dateObjectCompare(recentDate, dateToday) >= 0) {
            break;
         }
      }

      // Make it okay to obtain future-events information.
      indicesAreValid = true;
   };

   //////////////////////////////////////////////////////////////
   // Private functions -- utilities.
   //////////////////////////////////////////////////////////////
   /**
    * Return a date object created from the supplied date
    * string, which is modified to work under Safari (which
    * does not understand "<year> <month> <date>" but does
    * understand the reverse.  (Problem and solution verified
    * under Safari 11.0 [OS 10.12.6] and iOS 10.3.3.)  The Date
    * object contructor works under other browsers, for both
    * formats.  For various reasons "<year> <month> <date>" is
    * preferred in the location arrays (e.g. easier to visually
    * check entry sorting).
    * @param {string} dateString - The "Y M D" date string.
    * @return {Date} Date object based on the passed date string.
    */
   function createDateObjCrossBrowser(dateString) {
      // NOTE:  assume dateString consists of 3 space-separated
      // substrings, the year, month, and date.
      //
      // Reverse the ordering of the 3 substrings for Safari.
      reversedOrder = dateString.split(' ').reverse().join(' ');
      return new Date(reversedOrder);
   };

   /**
    * Return an element containing the provided content, which
    * can be either text or HTML, and which is parsed into
    * appropriate element(s).  This element should allow all
    * browsers to safely handle the contents.  This is a solution
    * primarily for Internet Explorer, for which this has been a
    * perennial problem:
    *      https://www.google.com/search?q=javascript+innerhtml+not+working+internet+explorer
    * @param {string} htmlText - The cell's contents.
    * @return {Element} The generated element object containing
    *    the provided content.
    */
   function createSafeCellContent(htmlText) {
      // Create a <div> to hold the parsed/generated elements
      // from htmlText.  Internet Explorer can barf if a <td>
      // element's innerHTML is directly updated.  But it
      // *should* be fine when doing so to <div>s.
      var cellDiv = document.createElement('div');
      cellDiv.innerHTML = htmlText;
      return cellDiv;
   };

   /**
    * Return a table body cell object ("td") containing the
    * provided content, which can be either text or HTML, and
    * which is parsed into appropriate element(s).  The contents
    * are subject to "strikeout" if requested.
    * @param {string} htmlText - The cell's contents.
    * @param {boolean} [doStrikeOut=false] - Whether to apply
    *    strikeout to the cell's contents.
    * @return {Element} The generated table cell ("td") object
    *    containing the provided content.
    */
   function createSafeCellElement(
         htmlText, doStrikeOut = false) {
      var cellContent = createSafeCellContent(htmlText);
      if (doStrikeOut) {
         // Strikeout the cell's contents.
         var strikeoutElem = document.createElement('s');
         strikeoutElem.appendChild(cellContent);
         cellContent = strikeoutElem;
      }

      var cellElem = document.createElement('td');
      cellElem.appendChild(cellContent)
      return cellElem;
   };

   /**
    * Return an integer reflecting a comparison between the
    * passed date objects in the manner of strcmp(3), namely:
    *  - <0 if dateX < dateY
    *  - ==0 if dateX == dateY
    *  - >0 if dateX > dateY
    * @param {Date} dateObjX - The lefthand side operand.
    * @param {Date} dateObjY - The righthand side operand.
    * @return {number} The comparison between the 2 date objects.
    */
   function dateObjectCompare(dateObjX, dateObjY) {
      return dateObjX.valueOf() - dateObjY.valueOf()
   };

   /**
    * Return a 3-column row intended to be a table's header, and
    * which will contain a horizontal line underneath.
    * @param {Element} tableBody - Object which is a table's body
    *    ("tbody") element object.
    * @return {Element} The generated table row ("tr") object
    *    that is the table's header.
    */
   function generateHeader() {
      var tableHeader = document.createElement('tr');
      tableHeader.style.borderBottom = separatorStyle;

      var col1 = document.createElement('td');
      col1.appendChild(document.createTextNode('Date'));
      var col2 = document.createElement('td');
      col2.appendChild(document.createTextNode('Location (Map)'));
      var col3 = document.createElement('td');
      col3.appendChild(document.createTextNode('Notes'));
      tableHeader.appendChild(col1);
      tableHeader.appendChild(col2);
      tableHeader.appendChild(col3);

      return tableHeader;
   };

   /**
    * Returns a table body row object ("tr") consisting of a
    * single cell containing the provided "empty table" content
    * (which can be plain text or HTML).
    * @param {string} emptyCellContents - The text/HTML that is
    *    to be the cell contents of the generated row.
    * @return {Element} The generated table row ("tr") object
    *    that is the "empty table" row.
    */
   function generateEmptyTableRow(emptyCellContents) {
      var emptyTableCell = createSafeCellElement(
         emptyCellContents);
      emptyTableCell.colSpan = 3;
      emptyTableCell.style = 'text-align:left';

      var emptyTableRow = document.createElement('tr');
      emptyTableRow.appendChild(emptyTableCell);
      return emptyTableRow;
   };

   /**
    * Returns a string consisting of the date in the format,
    * "<year> <short-month> <date> (<day>)."  If the date is
    * considered "tentative," then emphasis ("<em>") tags are
    * added and an asterisk is appended to so indicate it.  Dates
    * are assumed reserved for a given week's Monday through
    * Sunday days on the Thursday prior.  Before that Thursday,
    * dates are defined to be tentative.
    * @param {Date} dateObj - The date object from which to
    *    generate the string.
    * @return {string} The generated date string.
    */
   function generateEntryDateString(dateObj) {
      var dateStringBase =
         dateObj.getFullYear() + ' ' +
            getShortName(monthNames[dateObj.getMonth()]) + ' ' +
            dateObj.getDate() + ' ' +
            '(' + getShortName(dayNames[dateObj.getDay()]) + ')';

      // A given date is considered tentative until the Friday
      // of the prior week.  If today (dateToday) is prior to
      // that Friday, then the date is defined to be tentative.
      //
      // For Monday through Friday, use the previous week's
      // Friday.  For Saturday and Sunday, use the second
      // previous week's Friday.
      var subtractionMilliseconds =
         subtractionDays[dateObj.getDay()] * 24 * 60 * 60 * 1000;
      var useFriday = new Date(dateObj);
      useFriday.setTime(
         useFriday.getTime() - subtractionMilliseconds);
      // Snap to midnight for midnight-to-midnight comparison, to
      // handle leap-seconds and Daylight Saving Time.
      useFriday.setHours(0,0,0,0);

      var dateStringFull;
      if ((dateToday >= useFriday) ||
            TimetableTables.isSummerQuarter) {
         // Indicate that this is a confirmed date.
         //
         // During the regular school year, Dancebreak sessions
         // occur in Roble Gym, and studio reservations must be
         // made on a weekly basis -- and are not confirmed until
         // Friday of the week prior.
         //
         // During summer, this doesn't apply:  sessions occur
         // outside Roble Gym, and reservations are confirmed
         // prior to being added to the locations_* table.
         //
         // (Rarely, a regular school year session will take
         // place outside Roble Gym.  Their reservations are
         // always confirmed prior to addition to the table.
         // However, for simplicity they will be treated like
         // Roble Gym reservations.)
         dateStringFull = dateStringBase;
      } else {
         // Indicate that this is an unconfirmed date.
         //
         // This is done using emphasized font and a footnote
         // mark, which references the text generated by
         // generateFutureDatesWarning().
         dateStringFull = '<em>' + dateStringBase + '*</em>';
      }
      return dateStringFull;
   };

   /**
    * Returns a table body row object ("tr") created from the
    * passed row data, an array of 3 strings consisting of:
    *  - date (no time, or time is set to midnight)
    *  - location
    *  - notes
    * All 3 strings must be present.  They should be empty ('')
    * if the generated cell is to be empty.  They may include
    * HTML markup tags, though these should be simple ones (font,
    * links); otherwise, the table may not be properly rendered
    * on certain browsers (mainly, older Internet Explorers).
    * @param {string[]} rowData - The row's data.
    * @param {boolean} [strikeoutRow=false] - Whether to apply
    *    strikeout to all cells in the row.
    * @return {Element} The generated row ("tr") element object.
    */
   function generateEntryRow(rowData, strikeoutRow = false) {
      var rowElem = document.createElement('tr');

      var dateRow = createDateObjCrossBrowser(rowData[0]);
      rowElem.appendChild(createSafeCellElement(
         generateEntryDateString(dateRow), strikeoutRow));
      rowElem.appendChild(createSafeCellElement(
         rowData[1], strikeoutRow));
      rowElem.appendChild(createSafeCellElement(
         rowData[2], strikeoutRow));

      return rowElem;
   };

   /**
    * Returns a table body row object ("tr") consisting of a
    * single cell containing a warning that future dates are
    * tentative until confirmed.  (See generateEntryDateString()
    * header for more details.)
    * @return {Element} The generated table row ("tr") object
    *    that is the future-dates warning row.
    */
   function generateFutureDatesWarning() {
      var warningRow = document.createElement('tr');

      var warningCell = createSafeCellElement(
         '<p><em>*Tentative &mdash; dates are not confirmed until Friday of the week prior.</em></p>');
      warningCell.colSpan = 3;
      warningCell.style = 'text-align:left';
      warningRow.appendChild(warningCell);

      return warningRow;
   };

   /**
    * Returns a table body row object ("tr") consisting of a
    * single cell containing the provided separator content,
    * enclosed in a box.
    * @param {Node} separatorContent - The separator row content.
    * @return {Element} The generated table row ("tr") object
    *    that is the separator row.
    */
   function generateSeparatorRow(separatorContent) {
      var separatorRow = document.createElement('tr');
      separatorRow.style.borderBottom = separatorStyle;
      separatorRow.style.borderLeft = separatorStyle;
      separatorRow.style.borderRight = separatorStyle;
      separatorRow.style.borderTop = separatorStyle;

      var separatorCell = document.createElement('td');
      separatorCell.colSpan = 3;
      separatorCell.style = 'text-align:left';
      separatorCell.appendChild(separatorContent);
      separatorRow.appendChild(separatorCell);

      return separatorRow;
   };

   /**
    * Return the 3-letter prefix "short" version of the provided
    * name, which is assumed to be either a month or weekday name
    * (for which 3-letter prefix is the short version).
    * @param {string} longName - The month/weekday name.
    * @return {string} The 3-letter prefix "short" name.
    */
   function getShortName(longName) {
      return longName.substring(0,3);
   };

   //////////////////////////////////////////////////////////////
   // Public functions.
   //////////////////////////////////////////////////////////////

   /**
    * Top-level function to process the document (based on its
    * title -- see below).
    * @param {string} startDate - the start date passed to
    *    function preprocessEventsData().
    */
   my.processDocument = function (startDate) {
      // All documents start by preprocessing the events data.
      preprocessEventsData(startDate);

      // Determine which function(s) to call based on the
      // document's title, which update particular <div>s.
      //
      // *  Dancebreak - Home
      //    --  home_textContent_nextEvent
      //    --  home_textContent_futureEventsTable
      // *  Dancebreak - Old Locations
      //    --  oldLocations_textContent_pastEventsTable
      docTitle = document.title;
      if (docTitle == 'Dancebreak - Home') {
         appendNextEventSite('home_textContent_nextEvent');
         appendFutureEventsTable(
            'home_textContent_futureEventsTable');
      } else if (docTitle == 'Dancebreak - Old Locations') {
         appendPastEventsTable(
            'oldLocations_textContent_pastEventsTable');
      } else {
         console.log(
            'processDocument() invoked from unkown document, ' +
            'title: "' + docTitle + '"');
      }
   };

   //////////////////////////////////////////////////////////////
   // Export everything above within a class object.
   //////////////////////////////////////////////////////////////
   return my;
}());

//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

/////////////////////////////////////////////////////////////////
// NOTE:  TimetableLoader, which is used to load this (and other)
// Javascript files, needs to be told when this file has been
// loaded and processed.  (It is assumed that the various files
// are loaded and processed asynchronously.)  If the browser has
// reached this point, then the rest of the file has been
// processed, and so this file is ready to go.
TimetableLoader.fileReady(
   'timetableCode.js', TimetableCode.processDocument);

// End hiding script from old browsers (TO HERE). -->
