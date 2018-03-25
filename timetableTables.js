<!-- Hide script from old browsers (until "TO HERE").

/////////////////////////////////////////////////////////////////
// To add new locations, find the locations_<year> 2-dimensional
// array for the appropriate year, and add the entry based on the
// entry date.  Maintain chronological ordering, or else tables
// will be incorrectly generated.  (If necessary, create new
// here_..., notes_..., and site_... constants.)
//
// Note:  if you create a new locations_<year> 2-dimensional
// array for a new year, be sure to add an entry for it in the
// "combined" allLocations 2-dimensional array.
//
// At the start of each quarter, update thisQuarterStart to the
// first day of the current quarter.
//
//  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
//
// No other modification to this file should be necessary!
//
//  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
//
// For details on how to use this file and its contents, see the
// header comments in file timetableCode.js.
//
// NOTE:  this file is meant to be loaded via timetableLoader.js.
// Do NOT load it directly from an HTML file!
//
// In particular, it should be loaded via the updatePageEvents()
// function in that file.
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
var TimetableTables = (function () {
   // Make "my" an internal reference to this class.
   var my = {};

   //////////////////////////////////////////////////////////////
   // Private constants and variables.
   //////////////////////////////////////////////////////////////

   //////////////////////////////////////////////////////////////
   // Constants for location/map and note components of entries.
   const here_AOERCLot =
      '<a href="https://goo.gl/maps/eZ6Y9GaEZgF2" ' +
         'target="_blank">here</a>';
   const here_RobleFieldGarage =
      '<a href="https://goo.gl/maps/8o5T13upVWm" ' +
         'target="_blank">here</a>';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const notes_NONE = '';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const notes_FinalsWeek = 'Finals week';
   const notes_BreakSpring = 'Spring break';
   const notes_BreakSummer = 'Summer break';
   const notes_BreakThanksgiving = 'Thanksgiving break';
   const notes_BreakWinter = 'Winter break';
   const notes_FinalsWeekSpecial = 'Finals week special:<br>';
   const notes_HolidayMLK = 'Martin Luther King Jr. Day';
   const notes_HolidayMemorial = 'Memorial Day';
   const notes_HolidayPresidents = 'President\'s Day';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const notes_ParkingAOERC =
      'Parking: ' + here_RobleFieldGarage + ' or ' +
         here_AOERCLot;
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const notes_Warn10pmStartTime =
      '<span class="red">Later start:  10pm!</span>';
   //------------------------------------------------------------
   const site_TBD = 'TBD';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const site_AOERC =
      '<a href="https://goo.gl/maps/niFAbYdB2r82" ' +
         'target="_blank">AOERC</a>, Room 111';
   const site_RobleGymBigStudio =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, Big Studio/R113';
   const site_RobleGymNewStudio =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, New Studio/R115';
   const site_RobleGymMultiSmallThenBigStudios =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, Small Studio/R114' +
         '<br>&nbsp;&nbsp;&nbsp;<strong><em>THEN</em></strong> &nbsp;&nbsp;' +
         'Big Studio/R113';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const site_WarnSessionCancelled =
      '<span class="red"><em>Session cancelled</em></span>';
   //////////////////////////////////////////////////////////////
   // Location entries consist of arrays of 3 components (all
   // strings):  the date, the location/map, and optional notes.
   // (If there are no notes, then use notes_NONE.)  HTML may be
   // used in any and all fields -- for example, "<em>" -- but
   // constructs beyond simple markup tags may not necessarily be
   // supported in all browsers.
   var locations_2018 = [
      ['2018 Jan 1', site_WarnSessionCancelled, notes_BreakWinter],
      ['2018 Jan 8', site_RobleGymBigStudio, notes_NONE],
      [
         '2018 Jan 15',
         site_WarnSessionCancelled,
         notes_HolidayMLK
      ],
      ['2018 Jan 22', site_RobleGymBigStudio, notes_Warn10pmStartTime],
      ['2018 Jan 29', site_RobleGymBigStudio, notes_NONE],
      ['2018 Feb 5', site_AOERC, notes_ParkingAOERC],
      ['2018 Feb 12', site_RobleGymBigStudio, notes_Warn10pmStartTime],
      [
         '2018 Feb 19',
         site_WarnSessionCancelled,
         notes_HolidayPresidents
      ],
      ['2018 Feb 26', site_RobleGymNewStudio, notes_NONE],
      [
         '2018 Mar 5',
         site_RobleGymMultiSmallThenBigStudios,
         notes_NONE
      ],
      ['2018 Mar 12', site_RobleGymBigStudio, notes_NONE],
      ['2018 Mar 19', site_WarnSessionCancelled, notes_FinalsWeek],
      ['2018 Mar 26', site_WarnSessionCancelled, notes_BreakSpring],
      ['2018 Apr 2', site_RobleGymBigStudio, notes_NONE],
      ['2018 Apr 9', site_RobleGymBigStudio, notes_NONE],
      ['2018 Apr 16', site_RobleGymBigStudio, notes_NONE],
      ['2018 Apr 23', site_RobleGymBigStudio, notes_NONE],
      ['2018 Apr 30', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 7', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 14', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 21', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 28', site_WarnSessionCancelled, notes_HolidayMemorial],
      ['2018 Jun 4', site_RobleGymBigStudio, notes_NONE],
      ['2018 Jun 11', site_RobleGymBigStudio, notes_FinalsWeek]
   ];
   var locations_2017 = [
      ['2017 Sep 25', site_RobleGymBigStudio, notes_NONE],
      ['2017 Oct 2', site_RobleGymBigStudio, notes_NONE],
      ['2017 Oct 9', site_RobleGymBigStudio, notes_NONE],
      ['2017 Oct 16', site_RobleGymBigStudio, notes_NONE],
      ['2017 Oct 23', site_RobleGymBigStudio, notes_NONE],
      ['2017 Oct 30', site_RobleGymBigStudio, notes_NONE],
      ['2017 Nov 6', site_RobleGymBigStudio, notes_NONE],
      ['2017 Nov 13', site_RobleGymBigStudio, notes_NONE],
      ['2017 Nov 20', site_WarnSessionCancelled, notes_BreakThanksgiving],
      ['2017 Nov 28', site_RobleGymBigStudio, notes_NONE],
      ['2017 Dec 4', site_RobleGymBigStudio, notes_NONE],
      [
         '2017 Dec 12',
         site_RobleGymBigStudio,
         notes_FinalsWeekSpecial + '<span class="red">2-4pm</span>'
      ],
      ['2017 Dec 17', site_WarnSessionCancelled, notes_BreakWinter],
      ['2017 Dec 24', site_WarnSessionCancelled, notes_BreakWinter]
   ];

   //////////////////////////////////////////////////////////////
   // Public variables.
   //////////////////////////////////////////////////////////////

   //------------------------------------------------------------
   // The combined array of all the other location arrays.
   my.allLocations = locations_2017.concat(
      locations_2018
   );
   //------------------------------------------------------------
   // The start date for the current quarter, used as the default
   // value for TimetableCode.preprocessEventsData().
   //
   // Setting this variable to the first date of the current
   // quarter permits all normal date-related updates to occur in
   // just this file (and, in particular, *not* in index.html and
   // oldLocatios.html).
   //
   // NOTE:  for 2018 Spring Quarter, this was set to the start
   // of Spring Break, as the update occurred before then, and
   // setting it to the actual start of Spring Quarter would have
   // eliminated the entry for Spring Break ("cancelled").
   my.thisQuarterStart = '2018 Mar 26'
   //------------------------------------------------------------

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
TimetableLoader.fileReady('timetableTables.js');

// End hiding script from old browsers (TO HERE). -->
