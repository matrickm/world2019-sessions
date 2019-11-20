<!-- JQuery -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jquery.cookie/jquery.cookie.js"></script>

<!-- JPLIST CORE -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.core.min.js"></script>

<!-- SORTING -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.sort-bundle.min.js"></script>

<!-- JPLIST PAGINATION -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.pagination-bundle.min.js"></script>

<!-- JPLIST FILTERING  -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.filter-dropdown-bundle.min.js"></script>
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.filter-toggle-bundle.min.js"></script>
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.textbox-filter.min.js"></script>
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.checkbox-dropdown.min.js"></script>
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.radio-buttons-dropdown.min.js"></script>

<!-- JPLIST HISTORY -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.history-bundle.min.js"></script>

<!-- JPLIST COUNTER -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.counter-control.min.js"></script>

<!-- JPLIST LIST, GRID VIEW -->
<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jplist/dist/js/jplist.list-grid-view.min.js"></script>

<!-- LUXON DATE and TIME Script -->
<script type="text/javascript" src="https://moment.github.io/luxon/global/luxon.min.js"></script>

<script type="text/javascript">
var allSessions = [];

function getQueryStringParamValue(key) {
	var url = document.location.href;
	var value = "";

	if (url.indexOf('?') !== -1) {
		var queryStrings = url.substr(url.indexOf('?') + 1);

		if (queryStrings.toLowerCase().indexOf(key.toLowerCase() + "=") !== -1) {
			var queryString = queryStrings.split("&").find(function (element) {
				return element.toLowerCase().split("=")[0] === key.toLowerCase();
			});
			if (typeof queryString !== "undefined")
				value = queryString.substr(queryString.indexOf('=') + 1);
		}
	}
	return value;
}

function classifyText(text) {
	var returnValue = "";
	if ($.isArray(text)) {
		$.each($.unique(text), function (key, value) {
			returnValue += " " + value.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
		});
	} else {
		returnValue = text.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
	}
	return returnValue;
}

function dynamicSort(firstProperty, secondProperty) {
	var firstSortOrder = 1;
	if (firstProperty[0] === "-") {
		firstSortOrder = -1;
		firstProperty = firstProperty.substr(1);
	}

	var secondSortOrder = 1;
	if (secondProperty[0] === "-") {
		secondSortOrder = -1;
		secondProperty = secondProperty.substr(1);
	}

	return function (a, b) {
		var returnValue = 0;
		returnValue = sortComparision(a[firstProperty], b[firstProperty], firstSortOrder);

		if (returnValue === 0) {
			returnValue = sortComparision(a[secondProperty], b[secondProperty], secondSortOrder);
		}

		return returnValue;
	};
}

function sortComparision(aProperty, bProperty, sortOrder) {
	if (aProperty != null && bProperty != null) {
		if (sortOrder === -1) {
			return bProperty.localeCompare(aProperty, undefined, {
				numeric: true,
				sensitivity: 'base'
			});
		} else {
			return aProperty.localeCompare(bProperty, undefined, {
				numeric: true,
				sensitivity: 'base'
			});
		}
	} else if (aProperty != null && bProperty == null) {
		return sortOrder * -1;
	} else if (aProperty == null && bProperty != null) {
		return sortOrder;
	} else
		return 0;
}

Date.prototype.getFormattedTime = function ()
{
	var hours = this.getHours() === 0 ? "12" : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
	var minutes = (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
	var ampm = this.getHours() < 12 ? "AM" : "PM";
	var formattedTime = hours + ":" + minutes + " " + ampm;
	return formattedTime;
}

$('document').ready(function ()
{
	var DateTime = luxon.DateTime;
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data) {
		allSessions = data;
		allSessions.sort(dynamicSort("StartDateTime", "Title"));
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		//Creating empty array variables for each of the filtering options
		var sessionType = [];
		var date = [];
		var time = [];
		$.each(allSessions, function (key, value) {
			if (value.Title != null && value.Publish && value.SessionType === "Workshop") {
				var tags = "";
				var luxonStartDateTime;
				var luxonEndDateTime;
				//end first snippet

				//start second snippet
				value.SessionType;
				if (value.StartDateTime != null) {
					var startDateTime = new Date(value.StartDateTime);
					tags += "<span class=\"text-label startDate-tag " + classifyText(days[startDateTime.getDay()]) + "\">" + days[startDateTime.getDay()] + "</span>";

					luxonStartDateTime = DateTime.fromISO(value.StartDateTime);
					tags += "<span class=\"text-label startTime-tag " + luxonStartDateTime.hour + luxonStartDateTime.minute + "\">" + luxonStartDateTime.toFormat('t').replace(/[^a-zA-Z0-9: ]+/g, '') + "</span>";
				}

				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 2000) ? (value.MarCommReviewAbstract.substring(0, 2000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br />');

				var startTime = "TBD";
				if (value.StartDateTime != null)
				{
					startTime = luxonStartDateTime.weekdayShort + " " + luxonStartDateTime.monthShort + " " + luxonStartDateTime.day + " " + luxonStartDateTime.year + "<br/>" + luxonStartDateTime.toFormat('t') ;
				}
				var endTime = "TBD";
				if (value.EndDateTime != null)
				{
					luxonEndDateTime = DateTime.fromISO(value.EndDateTime);
					endTime = luxonEndDateTime.toFormat('t');
				}
/* End of First Section */

//start second snippet

				$("#agendaCards").append("" +
					"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<p class=\"session-start-time\">" + startTime + " - " + endTime + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + description + "</p>" +
					"</div>" +
					"<div class=\"text-label-group tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");
			}
		});

		//Sorting items
		time.sort();
		sessionType.sort();


		var distinctTimes = [];
		$.each(time, function (key, value) {
			distinctTimes.push({
				ampm: value.split(" ")[1],
				hrmin: value.split(" ")[0]
			});
		});
		distinctTimes.sort(dynamicSort("ampm", "hrmin"));
		// End of second snippet

		// Third snippet starts here
	}); //end of api pull

	$(document).on('click', '.grid-item', function () {
		$(this).find('.session-details').slideToggle('fast');
		$(this).find('.session-details').toggleClass('hide');
		$(this).find('.session-speaker').toggleClass('hide');
		$(this).find('.session-type').toggleClass('hide');
		var details = $(this).find('.details-expand').text();
		$(this).find('.details-expand').text(details === 'See Details' ? 'Hide Details' : 'See Details');
	});
}); //end document.ready
</script>
