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
function classifyText(text)
{
	var returnValue = "";
	if ($.isArray(text))
	{
		$.each($.unique(text), function (key, value)
		{
			returnValue += " " + value.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
		});
	} else
	{
		returnValue = text.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
	}
	return returnValue;
}

function getQueryStringParamValue(key)
{
	var url = document.location.href;
	var value = "";

	if (url.indexOf('?') !== -1)
	{
		var queryStrings = url.substr(url.indexOf('?') + 1);

		if (queryStrings.toLowerCase().indexOf(key.toLowerCase() + "=") !== -1)
		{
			var queryString = queryStrings.split("&").find(function (element)
			{
				return element.toLowerCase().split("=")[0] === key.toLowerCase();
			});
			if (typeof queryString !== "undefined")
				value = queryString.substr(queryString.indexOf('=') + 1);
		}
	}
	return value;
}

function tagCheckboxDropdownFilter($filter, $tag, dataPathId)
{
	var dataPath = dataPathId + classifyText($tag.text());
	// update value and trigger change in field
	$filter.find('#' + dataPath).trigger('click');
	$filter.find('.jplist-dd-panel').addClass('changed');
	// move window to focus on field changed
	$('html, body').animate({
		scrollTop: $('#role-filter-box').offset().top // - $(window).height() / 2
	}, 50);
	// select first pagination page
	$('.pagination').find('button[data-number="0"]').trigger('click');
	// remove changed style after a second
	setTimeout(function ()
	{
		$filter.find('.jplist-dd-panel').removeClass('changed');
	}, 1000);
}

function tagFilterInit()
{
	$('.role-tag').click(function ()
	{
		tagCheckboxDropdownFilter($('#role-filter'), $(this), '');
	});
}

$('document').ready(function ()
{
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data)
	{
		//Creating empty array variables for each of the filtering options
		var role = [];
		//Looping through each data point from airtable and creating the cards
		$.each(data, function (key, value)
		{
			var tags = "";
			if (value.RolePersona != null)
			{
				$.each(value.RolePersona.toString().split(","), function (i, rolePersona)
				{
					var classRole = '';
					if (rolePersona.toLowerCase().indexOf('architect') >= 0)
						classRole = 'architect';
					else
						classRole = classifyText(rolePersona);
					tags += "<span class=\"text-block role-tag " + classRole + "\">" + rolePersona + "</span>";
				});
			}

			if (value.Title != null && value.Publish && value.Featured)
			{
				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br/>');

				$(".session-browse .row").append("" +
				"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
				"<h3 class=\"session-title\">" + value.Title + "</h3>" +
				"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
				"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
				"<div class=\"session-details hide\">" +
				"<p class=\"session-description\">" + description + "</p>" +
				"</div>" +
				"<div class=\"text-label-group tags\">" +
				"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
				"<span class=\"details-expand\">" + 'See Details' + "</span>" +
				"</article>");

				if (value.RolePersona != null)
				{
					$.each(value.RolePersona,
						function (k, v)
						{
							if (v.toLowerCase().indexOf('architect') >= 0)
								v = 'Architect';
							if (role.indexOf(v) === -1)
								role.push(v);
						});
				}
			}
		});//end snippet
    
    // Second snippet starts here
		//Sorting items
		role.sort();

		//Adding text dynamically from airtable to each of filter slots
		var r = $('#role-filter');
		$.each(role, function (key, value)
		{
			r.append($("<option></option>").attr("value", classifyText(value)).attr("data-path", "." + classifyText(value)).html(value));
		});

		$('#agenda-page').jplist({
			itemsBox: '#agendaCards',
			itemPath: '.grid-item',
			panelPath: '#role-filter-box',
			effect: 'fade',
			redrawCallback: function (collection, $dataview, statuses)
			{
				tagFilterInit();
				$("#currentRoleTxt").html(($("#role-filter option:selected").text() + "s").replace("All Roless","All Roles"));
			}
		});

		var roleQS = getQueryStringParamValue('role');
		if (roleQS != '')
		{
			roleQS = classifyText(roleQS);
			$("#role-filter option").filter(function ()
			{
				return $(this).val() == roleQS;
			}).prop('selected', true);

			$("#role-filter").change();
		}
	}); //end of api pull

	$('#list-view-btn').click(function (e)
	{
		e.preventDefault();
		$.each($('.session-browse .grid-item'), function (key, value)
		{
			$(value).removeClass('agenda-card col lg-6 xl-4').addClass('agenda-list');
		});
		$(this).toggleClass('current');
		$('#grid-view-btn').removeClass('current');
	});
	$('#grid-view-btn').click(function (e)
	{
		e.preventDefault();
		$.each($('.session-browse .agenda-list'), function (key, value)
		{
			$(value).removeClass('agenda-list').addClass('agenda-card col lg-6 xl-4');
		});
		$(this).toggleClass('current');
		$('#list-view-btn').removeClass('current');
	});

	$(document).on('click', '.details-expand', function ()
	{
		var details = $('.session-details');
		$(this).parent('.grid-item').find(details).slideToggle('fast');
		$(this).parent('.grid-item').find(details).toggleClass('hide');
		$(this).parent('.grid-item').find('.session-speaker').toggleClass('hide');
		$(this).parent('.grid-item').find('.session-type').toggleClass('hide');
		$(this).text($(this).text() === 'See Details' ? 'Hide Details' : 'See Details');
	});
}); //end document.ready
</script>
