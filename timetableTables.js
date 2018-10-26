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
// At the start of each quarter, update thisQuarterStart (to the
// first day of the current quarter) and isSummerQuarter (to
// either "true" or "false").
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
   const here_EscondidoRoad =
      '<a href="https://goo.gl/maps/uhCFi56bBbS2" ' +
         'target="_blank">here</a>';
   const here_HaciendaCommonsLot =
      '<a href="http://g.co/maps/ehfkw"' +
         'target="_blank">here</a>';
   const here_RainsNorthLot =
      '<a href="https://goo.gl/maps/o3kgyzRkkv32" ' +
         'target="_blank">here</a>';
   const here_RobleFieldGarage =
      '<a href="https://goo.gl/maps/8o5T13upVWm" ' +
         'target="_blank">here</a>';
   const here_RunningFarmLaneLot =
      '<a href="https://goo.gl/maps/uRW5zBBRPcM2" ' +
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
   const notes_ParkingGCCHavanaRoom =
      'Parking: ' + here_RunningFarmLaneLot + ' or ' +
         here_HaciendaCommonsLot;
   const notes_ParkingKennedyCommons =
      'Parking: ' + here_RainsNorthLot + ' or ' +
         here_EscondidoRoad;
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const notes_Warn1900To2100 =
      '<span class="red">7-9pm!</span>';
   const notes_Warn2000To2300 =
      '<span class="red">8-11pm!</span>';
   const Notes_Warn2200StartTime =
      '<span class="red">Later start:  10pm!</span>';
   //------------------------------------------------------------
   const site_TBD = 'TBD';
   //  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
   const site_AOERC =
      '<a href="https://goo.gl/maps/niFAbYdB2r82" ' +
         'target="_blank">AOERC</a>, Room 111';
   const site_GCCHavanaRoom =
      '<a href="https://goo.gl/maps/HuBbgLk1uVy" ' +
         'target="_blank">GCC</a> Havana Room';
   const site_KennedyCommons =
      '<a href="https://goo.gl/maps/vRGsECU8Q8w" ' +
         'target="_blank">Kennedy Commons</a> Great Room';
   const site_RobleGymBigStudio =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, Big Studio/R113';
   const site_RobleGymMultiSmallThenBigStudios =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, Small Studio/R114' +
         '<br>&nbsp;&nbsp;&nbsp;<strong><em>THEN</em></strong> &nbsp;&nbsp;' +
         'Big Studio/R113';
   const site_RobleGymNewStudio =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, New Studio/R115';
   const site_RobleGymSmallStudio =
      '<a href="http://goo.gl/YelGJQ" ' +
         'target="_blank">Roble Gym</a>, Small Studio/R114';
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
      ['2018 Jan 22', site_RobleGymBigStudio, Notes_Warn2200StartTime],
      ['2018 Jan 29', site_RobleGymBigStudio, notes_NONE],
      ['2018 Feb 5', site_AOERC, notes_ParkingAOERC],
      ['2018 Feb 12', site_RobleGymBigStudio, Notes_Warn2200StartTime],
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
      ['2018 Apr 30', site_RobleGymSmallStudio, notes_NONE],
      ['2018 May 7', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 14', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 21', site_RobleGymBigStudio, notes_NONE],
      ['2018 May 28', site_WarnSessionCancelled, notes_HolidayMemorial],
      ['2018 Jun 4', site_RobleGymBigStudio, notes_NONE],
      ['2018 Jun 11', site_WarnSessionCancelled, notes_FinalsWeek],
      [
         '2018 Jun 25',
         site_KennedyCommons,
         notes_Warn2000To2300 + '<br>' + notes_ParkingKennedyCommons
      ],
      [
         '2018 Jul 10',
         site_GCCHavanaRoom,
         notes_Warn1900To2100 + '<br>' + notes_ParkingGCCHavanaRoom
      ],
      [
         '2018 Jul 21',
         site_GCCHavanaRoom,
         notes_Warn1900To2100 + '<br>' + notes_ParkingGCCHavanaRoom
      ],
      [
         '2018 Aug 13',
         site_GCCHavanaRoom,
         notes_Warn1900To2100 + '<br>' + notes_ParkingGCCHavanaRoom
      ],
      [
         '2018 Aug 27',
         site_KennedyCommons,
         notes_Warn2000To2300 + '<br>' + notes_ParkingKennedyCommons
      ],
      [
         '2018 Sep 10',
         site_GCCHavanaRoom,
         notes_Warn1900To2100 + '<br>' + notes_ParkingGCCHavanaRoom
      ],
      ['2018 Sep 24', site_RobleGymBigStudio, notes_NONE],
      ['2018 Oct 1', site_RobleGymBigStudio, notes_NONE],
      ['2018 Oct 8', site_RobleGymBigStudio, notes_NONE],
      ['2018 Oct 15', site_RobleGymBigStudio, notes_NONE],
      ['2018 Oct 22', site_RobleGymBigStudio, notes_NONE],
      ['2018 Oct 29', site_RobleGymSmallStudio, notes_NONE],
      ['2018 Nov 5', site_RobleGymBigStudio, notes_NONE],
      ['2018 Nov 12', site_RobleGymBigStudio, notes_NONE],
      ['2018 Nov 19', site_WarnSessionCancelled, notes_BreakThanksgiving],
      ['2018 Nov 26', site_RobleGymBigStudio, notes_NONE],
      ['2018 Dec 3', site_RobleGymBigStudio, notes_NONE],
      [
         '2018 Dec 10',
         site_RobleGymBigStudio,
         notes_FinalsWeekSpecial +
            '<span class="red">(Stay tuned!)</span>'
      ],
      ['2018 Dec 17', site_WarnSessionCancelled, notes_BreakWinter],
      ['2018 Dec 24', site_WarnSessionCancelled, notes_BreakWinter],
      ['2018 Dec 31', site_WarnSessionCancelled, notes_BreakWinter]
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
      ['2017 Nov 27', site_RobleGymBigStudio, notes_NONE],
      ['2017 Dec 4', site_RobleGymBigStudio, notes_NONE],
      [
         '2017 Dec 12',
         site_RobleGymBigStudio,
         notes_FinalsWeekSpecial + '<span class="red">2-4pm</span>'
      ],
      ['2017 Dec 18', site_WarnSessionCancelled, notes_BreakWinter],
      ['2017 Dec 25', site_WarnSessionCancelled, notes_BreakWinter]
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
   my.thisQuarterStart = '2018 Sep 24'
   //------------------------------------------------------------
   // Whether it is currently the summer quarter.
   //
   // During the regular school year, Dancebreak sessions occur
   // in Roble Gym, and studio reservations must be made on a
   // weekly basis -- and are not confirmed until Friday of the
   // week prior.
   //
   // During summer, this doesn't apply:  sessions occur outside
   // Roble Gym, and reservations are confirmed prior to being
   // added to the locations_* table.
   my.isSummerQuarter = true;
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
