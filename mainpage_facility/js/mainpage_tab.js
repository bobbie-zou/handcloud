jQuery(document).ready(function() {	
    jQuery('#announcementTab a').click(function (e) {
		e.preventDefault();
		jQuery(this).tab('show');
	});
});



