  function open_add_picture_box(click_for_more_images_box_id, upload_more_images_section_id) {
      document.getElementById(click_for_more_images_box_id).style.display = 'none';
      document.getElementById(upload_more_images_section_id).style.display = '';
  }

  function show_submission_box(submission_box_id, show_hide_link_id) {
      var box = document.getElementById(submission_box_id);
      var link = document.getElementById(show_hide_link_id);

      if (box.style.display == '' && link && link.style.display == 'none') {
    	  return;
      }

      if (box) {
    	  box.style.display = '';
      }

      if (link) {
    	  link.style.display = 'none';
      }
  }

  function inv_localized_string(string_id) {
      var defaults = {
	  "submission_no_title": "Your submission must have a title.",
	  "submission_no_body": "Your submission body is empty.",
	  "submission_title_too_long": "Your submission title must be a maximum of 200 characters",
	  "submission_title_no_html": "Your submission title may not contain html",
	  "submission_body_too_long": "Your submission body must be a maximum of 10000 characters",
	  "submission_not_accepting": "Sorry, we are not accepting any new submissions at this time for this page. Please return in a few days to add your submission",
	  "submission_caption_too_long": "Your image caption must be a maximum of 200 characters",
	  "submission_caption_no_html": "Your image caption may not contain html",
	  "submission_image_file_types": "Your image must be a jpg or gif",
	  "submission_name_too_long": "Your name must be a maximum of 200 characters",
	  "submission_name_no_html": "Your name may not contain html",
	  "submission_location_too_long": "Your location must be a maximum of 200 characters",
	  "submission_cant_in_preview_mode": "This functionality not available in Preview Mode",
	  "submission_please_check_checkbox": "Please check Submission Guidelines checkbox",
	  "submission_captcha_required": "You must enter a word for the submission challenge graphic.",
      "submission_no_name": "Please enter your name.",
      "submission_bad_email": "Please enter a valid email address.",
      "submission_body_no_html": "The body cannot contain HTML.",
      "submission_location_no_html": "Your location cannot contain HTML.",
      "submission_gdpr_age_consent": "I am at least 16 years of age.",
      "submission_privacy_policy_link": "/privacy-policy.html",
      "submission_privacy_policy_label": "privacy policy", 
      "submission_gdpr_usage_consent": "I understand that you will display my submission on your website.", 
      "submission_gdpr_checked_error": "Please select all privacy and usage checkboxes."
      };
      
      defaults.submission_gdpr_privacy_policy_consent = "I understand and accept the <<PRIVACY_POLICY>>."; 
      defaults.submission_gdpr_privacy_policy_consent = defaults.submission_gdpr_privacy_policy_consent.replace(/<<PRIVACY_POLICY>>/,
              '<a href="' + defaults.submission_privacy_policy_link + '" target="_blank" style="target-new: tab;">' + 
              defaults.submission_privacy_policy_label + "</a>");  
    	  
      
      if (document.localized_string_invitation_map[string_id]) {
	  return document.localized_string_invitation_map[string_id];
      }
      else {
	  return defaults[string_id];
      }
  }

  function save_submission(form) {

      var errors = [];
      var regexp = /<(script|form)/;
      var imgregex = /(jpg|jpeg|JPEG|JPG|gif|GIF)/;

     

      var title = form.submission_title.value;
      if (title.length > 200) {
          errors.push(inv_localized_string('submission_title_too_long'));
      }
      if (title.match(/^\s*$/)) {
          errors.push(inv_localized_string('submission_no_title'));
      }
      if (title.match(regexp)) {
          errors.push(inv_localized_string('submission_title_no_html'));
      }

      var text = form.submission_text.value;
      if (text.length > 10000) {
          errors.push(inv_localized_string('submission_body_too_long'));
      }
      if (text.match(/^\s*$/)) {
          errors.push(inv_localized_string('submission_no_body'));
      }
      if (text.match(regexp)) {
          errors.push(inv_localized_string('submission_body_no_html'));
      }

      for (var i = 1; i <= 4; i++) {
          if(form["submission_image_" + i]) {
              var image = form["submission_image_" + i].value;
              if(image) {
                  if (image && !image.match(imgregex)) {
                      errors.push(inv_localized_string('submission_image_file_types'));
                  }

                  var image_text = form["submission_image_" + i + "_text"].value;
                  if (image_text && image_text.length > 200) {
                      errors.push(inv_localized_string('submission_caption_too_long'));
                  }
                  if (image_text && image_text.match(regexp)) {
                      errors.push(inv_localized_string('submission_caption_no_html'));
                  }
              }
          }
      }

      var author = form.submission_author.value;
      if (author && author.length > 200) {
          errors.push(inv_localized_string('submission_name_too_long'));
      }
      if (author && author.match(regexp)) {
          errors.push(inv_localized_string('submission_name_no_html'));
      }

      var location = form.submission_author_location.value;
      if (location && location.length>200) {
          errors.push(inv_localized_string('submission_location_too_long'));
      }
      if (location && location.match(regexp)) {
          errors.push(inv_localized_string('submission_location_no_html'));
      }

      if (!form.submission_guidelines.checked) {
          errors.push(inv_localized_string('submission_please_check_checkbox'));
      }

      if (form.submission_challenge) {
          var challenge = form.submission_challenge.value;
          if (!challenge) {
              errors.push(inv_localized_string('submission_captcha_required'));
          }
      }

      // GDPR fields
      var gdpr_all_checked = true;
      [].forEach.call( form.querySelectorAll('li.gdpr_field input[type=checkbox]'), function(el){
    	  if ( ! el.checked ) {
    		  gdpr_all_checked = false;
    	  }
      } );
      
      if ( false === gdpr_all_checked ) {
    	  errors.push( inv_localized_string('submission_gdpr_checked_error') );
      }
      
      if (errors.length > 0) {
          alert(errors.join('\n'));
      }

      return (errors.length == 0);
  }
