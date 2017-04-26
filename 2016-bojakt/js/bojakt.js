var bojakt = (function () {

	/* global $ */
	var privateVar = "Ben Cherry";
	var backendURL = "http://bojakt-be-mhallberg.c9users.io";
	var publicVar = "Hey there!";


	//
	//
	function _init()
	{
		_bindClick();
		_init_jQueryUI();
		_populeraKommuner();
	}

	//
	//
	function _getTaxtable()
	{
		$.get( backendURL, function( data ) {
			$( "#result" ).html( data );
			alert( "Load was performed." );
		});
	}

	//
	//
	function _bindClick()
	{
		$("#button").click(function() {
			_getTaxtable();
		});

	    $("#button_sok").click(function(){
	        _sok();
	    }); 
	}

	//
	//
	function _init_jQueryUI()
	{
		$( "#sokfilter" ).accordion({
			collapsible: false
		});

		// Kommunväljare
		$( "input" ).checkboxradio({
			icon: false
		});

		// Skattesatsväljare
		$( "#komskatt_slider" ).slider({
			range:true,
			min: 25,
			max: 40,
			step: 1,
			values: [ 29, 30 ],
			slide: function( event, ui ) {
				var myText = document.getElementById('komskatt_text');
				myText.textContent = ui.values[ 0 ] + " - " + ui.values[ 1 ];
			}
		});
	}

	//
	//
	function _populeraKommuner()
	{
		$.ajax({
		    url:		backendURL + '/municipalities',
		    type:		"GET",
		    dataType:	"json",
		    success:	function( json ) {

    			var kommuner = [];
		        $.each(json, function(i, value) {
		        	kommuner.push(value.name);
		        });
		        kommuner.sort();
				$.each(kommuner, function(i, kom) {
		        	_append_kommun(i, kom);					
				});
		    },
		    error:		function() {
		    	/* global jQuery */
		    	var kommunlista = jQuery.parseJSON('['			+      
		    		'{"id":"01 14","name":"UPPLANDS VÄSBY"},'	+
			    	'{"id":"14 81","name":"MÖLNDAL"},'			+
			    	'{"id":"22 82","name":"KRAMFORS"},'			+
			    	'{"id":"25 84","name":"KIRUNA"}]');

		        $.each(kommunlista, function(i, value) {
		        	_append_kommun(i, value);
		        });
		    }
		});
	}

	//
	//
	function _append_kommun(i, value) {
    	var myId = "checkbox-" + i;
    	var myName = value;
    	var myLabel = '<label for="' + myId + '">' + myName + '</label>';
		var myInput = '<input type="checkbox" checked="checked" name="' + myId + '" id="' + myId + '">&nbsp;&nbsp;&nbsp;';

    	$('#kommuner').append(myLabel + myInput);

	}



	//
	// Tryck på SÖK!
	//
	function _sok()
	{
		var url = backendURL + ':8080/query';
		var komskatt_values = $( "#komskatt_slider" ).slider( "values" );

		//Add parameters
		url = url + '?taxrateMin=' + komskatt_values[0];
		url = url + '&taxrateMax=' + komskatt_values[1];

		// Loopa igenom valda kommuner
		var kommuner = [];
		$('#kommuner :input').each(function()
		{
			var id = $(this).attr("id");
			if (this.checked)
			{
				var $label = $("label[for='" + id +"']");
				kommuner.push($label.text());
			}
		});

		url = url + '&municipalities=' + encodeURIComponent(kommuner);

//		$( "#indata" ).empty().append( "Anropar <a href='" + url + "'>" + url + "</a>");

		$.ajax({
			url:		url,
			type:		"GET",
		    dataType:	"json",
			success: function(sokresultat) {
				/*
				$.each(sokresultat, function(i, elem) {
					console.log("id:" + elem.id + " | name:" + elem.name + "lat/long:" + elem.location );
				});
				*/
//				$( "#sokresultat" ).empty().append("Success: " + sokresultat );
				//console.log(JSON.stringify(sokresultat));
				
				_hanteraResultat(sokresultat);
			},
			error: function(fel) {
				$( "#sokresultat" ).empty().append("Error: " + fel);
			}
		});
	}
	
	function _hanteraResultat(sokresultat){

		var location_point = sokresultat;
		
		var map = new google.maps.Map(document.getElementById('sokresultat'), {
				zoom : 9,
				center : location_point[0].location
			});
			/*
			var infowindow = new google.maps.InfoWindow({
				content : ''
			});
			*/
			
			for (var i = 0; i < location_point.length; i++) {
				add_marker(location_point[i]);
			}

			function add_marker(location_point) {
				console.log('location_point: '+ JSON.stringify( location_point));
				var marker = new google.maps.Marker({
					map : map,
					position : location_point.location,
					clickable : true
				});
				var infowindow = new google.maps.InfoWindow({
					content : location_point.info
				});
				console.log('location_point.info: '+location_point.info);
				//marker.note = location_point.info;
				/*
				google.maps.event.addListener(marker, 'click', function() {
					console.log('pos3.3');
					console.log('location_point.info:'+location_point.info);
					infowindow.content = location_point.info;
					infowindow.open(map, marker);
				});
				*/
				marker.addListener('click', function(){
					//infowindow.content = location_point.info;
					infowindow.open(map, marker);
				})
				console.log('pos4');
				return marker;
			}
		
	}
	
	
	;



	return {

		getTaxtable: _getTaxtable,
		init: _init
	};

})();