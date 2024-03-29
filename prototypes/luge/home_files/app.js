/*
 * All java script logic for the application.
 *
 * The code relies on the jQuery JS library to
 * be also loaded.
 */

var app = (function($){

	if (!jQuery) {
		alert(app.resources["MISSING_LIB"]);
		return null;
	}
	
	// Global dw private data goes here	

	// dw scope public
	return {
		URLs			: {}, // holds dw specific urls, check htmlhead.isml for some examples
		resources		: {},  // resource strings used in js
		constants		: {}, // platform constants, initialized in htmlhead.isml
		containerId		: "content",
		ProductCache	: null,  // app.Product object ref to the current/main product
		clearDivHtml	: "<div class=\"clear\"><!-- W3C Clearing --></div>",
		currencyCodes	: {}, // holds currency code/symbol for the site
		
		// default dialog box settings
		dialogSettings: {
				bgiframe: true, // this is required mainly for IE6 where drop downs bleed into dialogs!!! it depends on 
				autoOpen: false,
				buttons: {},
				modal: true,
				overlay: {
		    		opacity: 0.5,
		     		background: "black"
				},
		    	height: 530,
		    	width: 800,
		    	title: '',		    	
		    	hide: "normal",
		    	resizable: false,
				position: 'center',
				open : function(){
					$(document).bind('click', app.dialog.clickOutsideHandler)	
				},
				close: function(){
					$(document).unbind('click', app.dialog.clickOutsideHandler);	
				}
		},
		
		

		// default tooltip settings
		tooltipSettings: {
				delay: 0,
				showURL: false,
				extraClass: "tooltipshadow tooltipshadow02",
				top: 15,
				left: 5
		},

		// global form validator settings
		validatorSettings: {
			errorClass : 'errorclient',
			errorElement: 'span',
			
		    onfocusout: function(element) {
				if ( !this.checkable(element) ) {
					this.element(element);
				}				
			}
		},

		// app initializations called from jQuery(document).ready at the end of the file
		init: function() {
			// register initializations here
			
			// quick view dialog div
			jQuery("<div/>").attr("id", "QuickViewDialog").html(" ").appendTo(document.body);
			
			// channel intelligence dialog div
			jQuery("<div/>").attr("id", "StoreLocatorDialog").html(" ").appendTo(document.body);
			
			// bonus product dialog div
			jQuery("<div/>").attr("id", "BonusProductDialog").html(" ").appendTo(document.body);
			
			// buy-it product dialog div
			jQuery("<div/>").attr("id", "BuyItDialog").html(" ").appendTo(document.body);
			
			// buy-it product dialog div
			jQuery("<div/>").attr("id", "RecommendationsDialog").html(" ").appendTo(document.body);
			
			// pre-emptively create the generic dialogcontainer div
			$('<div>', {
				'id': 'dialogcontainer'
			}).appendTo(document.body);
			
			var buyItOptions = {
				buttonLinkSelector: "#buy-product"
			};
			
			app.BuyItView.bindEvents(buyItOptions);
			
			// micicart object initialization
			this.minicart.init();
			
			//Shipping and Tax Estimation
			this.CartEstimator.bindEvents();
			
			//Video Player
			this.VideoPlayer.bindEvents();
			
			// execute unobtrusive js code
			this.execUjs();
			
			
			// check if the plugin is actually available for usage
			if (jQuery().scrollable) {
				jQuery('.scrollable').scrollable({					
				});
				// there is also a scroller on the 
				// homepage but we can't activate it with the scrollable class
				// because it has other requirments so we're using an ID
				// also if the div is not send out by the back-end 
				// don't even show it and expand the other div 
				// so the scrollbar plugin knows the width in advance				
				if ( jQuery('.promo-slider').length !== 0 ) {
					//Home
					jQuery('#home-promotions').scrollable({
						circular : true
					})
					.navigator()
					.autoscroll({
						interval : 5000,
						steps: 1
					});
					
					//Store 
					jQuery('#store-promotions').scrollable({
						circular : true
					})
					.navigator()
					.autoscroll({
						interval : 5000,
						steps: 1
					});
				} else {
					// make the product scroller wider
					jQuery('#product-finder').addClass('wide');
				}
				
				
				// also run the slider for the PDP
				if ($('.hero-promotions .items > div').length > 1) {
				
					jQuery('.hero-promotions').scrollable({
						circular: true
					}).navigator().autoscroll({
						interval: 8000,
						steps: 1
					});
					
				}
			}
			
			
			// now that the product finder has been properly scaled
			// we can apply the productFinder custom plugin which calls 
			// jScrollPane internally
			if (jQuery().productFinder) {
				jQuery('#product-finder').productFinder();
			}
			
			// run the accordion on the homepage
			if (jQuery().liteAccordion) {
				var accDiv = $('#brand-stories'),
					slideNr = accDiv.attr('data-slide-number'),
					numberObj = {
						slides2: 285,
						slides3: 144,
						slides4: 96,
						slides5: 75
					}; // this eliminates the need for an expensive switch or lots of ifs, see below on how to call it

				jQuery('#brand-stories').liteAccordion({
					easing: 'easeOutCirc',
	                containerWidth : 1004,
	                containerHeight: 720,
	                headerWidth : numberObj['slides' + slideNr], // IMPORTANT: because the headerWidth is actually also the handle width in the plug-in, use this to dictate the handle width 
	                activateOn : 'mouseover',
	                autoPlay : true,
	                theme : 'motorola',
	                slideSpeed : 500,
	                cycleSpeed : 3000,
	                pauseOnHover : true,
	                onTriggerSlide : function(){
	                    // this points to the main only DIV inside each li which act as slides
	                    // set the slected id as soon as the animation runs
	                    this.children('.slide-handle')
	                        .fadeOut(400)
	                        .end()
	                        .parent()
	                        .siblings()
	                        .find('.slide-handle')
	                        .stop(false, true)
	                        .fadeIn(400);
	                    // jQuery runs animations async so at the same time hide the label
	                    // it goes down fast
	                    this.children('.slide-label')
	                        .animate({
	                            bottom : '-51px'
	                        }, 100);
	                },
	                onSlideAnimComplete : function(){
	                    // when an animation is complete make sure there are no more animated
	                    // slide handles so it doesn't look bad
//	                    this.parent()
//	                        .siblings()
//	                        .find('.slide-handle:animated')
////	                        .stop(false, true) // stop any other animation for sibling slides
////	                        .css({  // set display to block, and opacity to 0 (in case the animation has stopped while going to opaque)
////	                            'display' : 'block',
////	                            'opacity' : 1
////	                        });
//	                        .fadeIn(400);
	                    
	                    // after the slide animation is done we can show the label
	                    this.parent()
	                        .siblings()
	                        .find('.slide-label')
	                        .animate({
	                            bottom : '0'
	                        }, 100);
	                }
	            });
			}
			
				
		},
	
		// sub namespace app.ajax.* contains application specific ajax components
		ajax: {
			Success: "success",
			currentRequests: {}, // request cache

			// ajax request to get json response
			// @param - reqName - String - name of the request
			// @param - async - boolean - asynchronous or not
			// @param - url - String - uri for the request
			// @param - data - name/value pair data request
			// @param - callback - function - callback function to be called
			getJson: function(options) {
				var thisAjax = this;

				// do not bother if the request is already in progress
				// and let go null reqName
				if (!options.reqName || !this.currentRequests[options.reqName]) {
					this.currentRequests[options.reqName] = true;
					if(options.async == "undefined") options.async = true;
					// make the server call
					jQuery.ajax({
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						url		: options.url,
						cache	: true,
						async	: options.async,
						data	: options.data,

						success: function(response, textStatus) {
							thisAjax.currentRequests[options.reqName] = false;

							if (!response.Success) {
								// handle failure
							}

							options.callback(response, textStatus);
						},

						error: function(request, textStatus, error) {
							if (textStatus === "parsererror") {								
								alert(app.resources["BAD_RESPONSE"]);
							}
							
							options.callback({Success: false, data:{}});
						}
					});
				}
			},
			
			
			// ajax request to set session custom var
			// @param - varName - String - var name
			// @param - varValue - String - var value
			setVar: function(options){
				
				jQuery.ajax({
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					url		: app.URLs.setSessionVar,
					cache	: false,
					async	: true,
					data	: options.data,

					success: function(response, textStatus) {
						

						if (!response.Success) {
							// handle failure
						}
						//alert(response);
						//options.callback(response, textStatus);
					},

					error: function(request, textStatus, error) {
						//alert(error);
						
						//options.callback({Success: false, data:{}});
					}
				});
			},
				// ajax request to set session custom var
				// @param - varName - String - var name
				getVar: function(options){
					
					jQuery.ajax({
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						url		: app.URLs.setSessionVar,
						cache	: false,
						async	: true,
						data	: options.data,

						success: function(response, textStatus) {
							

							if (!response.Success) {
								// handle failure
							}
							//alert(response.value);
							options.callback(response);
						},

						error: function(request, textStatus, error) {
							//alert(error);
							
							//options.callback({Success: false, data:{}});
						}
					});
			},
				
			
			
			
			// ajax request to load html response in a given container
			// @param - reqName - String - name of the request
			// @param - url - String - uri for the request
			// @param - data - name/value pair data request
			// @param - callback - function - callback function to be called
			// @param - selector - string - id of the container div/span (#mycontainer) - it must start with '#'
			load: function(options) {

				var thisAjax = this;

				// do not bother if the request is already in progress
				// and let go null reqname
				if (!options.reqName || !this.currentRequests[options.reqName]) {
					this.currentRequests[options.reqName] = true;
					// make the server call
					jQuery.ajax({
						dataType: "html",
						url		: options.url,
						cache	: true,
						data	: options.data,

						success: function(response, textStatus) {
							thisAjax.currentRequests[options.reqName] = false;
							
							if (options.selector) {
								jQuery(options.selector).html(response);
							}

							(options.callback != undefined ? options.callback(response, textStatus): null)
						},

						error: function(request, textStatus, error) {
							if (textStatus === "parsererror") {								
								alert(app.resources["BAD_RESPONSE"]);
							}

							options.callback(null, textStatus);
						}
					});
				}
			}
		},

		// loads a product into a given container div
		// params
		// 		containerId - id of the container div, if empty then global app.containerId is used
		//		source - source string e.g. search, cart etc.
		//		label - label for the add to cart button, default is Add to Cart
		//		url - url to get the product
		//		id - id of the product to get, is optional only used when url is empty
		getProduct: function(options, callback) { // id, source, start
			var cId 		= options.containerId || app.containerId;
			var source 		= options.source || "";
			var a2cBtnLabel = options.label || null;

			// show small loading image
			jQuery("#"+cId).html(app.showProgress("productloader"));

			var productUrl = options.url ? options.url : app.util.appendParamToURL(app.URLs.getProductUrl, "pid", options.id);
						
			productUrl = app.util.appendParamToURL(productUrl, "source", source);

			app.ajax.load({selector: "#"+cId, url: productUrl,  callback: function(responseText, textStatus){
				// update the Add to cart button label if one provided
				(a2cBtnLabel != null ? jQuery("#"+cId+" .addtocartbutton:last").html('<span>'+a2cBtnLabel+'</span>') : '');
		
				if (cId=="BuyItDialog"){
					var parentRow=jQuery('.selectProductRadio:checked').parent().parent().parent().parent();
					parentRow.css('background','#DFEAED');
					jQuery('#buyit-hiddennumber').val(jQuery.trim(parentRow.find('.buyit-number .td-container').html()));
				}
				// provide a callback for best practices
				callback();
			}});
		},

		// sub name space app.minicart.* provides functionality around the mini cart
		minicart: {
			url   : '',  // during page loading, the Demandware URL is stored here
			timer : null, // timer for automatic close of cart item view

			// initializations
			init: function() {
				// reset all the existing event bindings
				app.minicart.reset();

				// bind hover event to the cart total link at the top right corner
				jQuery(".minicarttotal").hover(function(e){(app.minicart.isShow() ? '': app.minicart.slide());});
			
				jQuery('.minicartcontent')
				.mouseenter(function(e) {
					clearTimeout(app.minicart.timer);
					app.minicart.timer = null;
				})
				.mouseleave(function(e) {
					clearTimeout(app.minicart.timer);
					app.minicart.timer = null;
					// after a time out automatically close it
					app.minicart.timer = setTimeout( 'app.minicart.close()', 30 );
				});

				// register close button event
				jQuery('.minicartcontent .minicartclose').click(function() {
					// reset all the events bindings
					app.minicart.reset();
					app.minicart.close(0);
				});
				
				//initialize the minicart defined in cart.js
				cart.initialize();
			},
			
			// returns a boolean if a minicart is visible/shown or hidden
			isShow: function() {
				return jQuery('.minicartcontent').css('display') == 'none' ? false : true;
			},
			
			// reset minicart
			reset: function() {
				jQuery(".minicarttotal").unbind("hover");
				jQuery('.minicartcontent').unbind("mouseenter").unbind("mouseleave");
				jQuery('.minicartcontent .minicartclose').unbind("click");
			},

			// shows the given content in the mini cart
			show: function(html) {
				jQuery('#minicart').html(html);
				
				// bind all the events
				app.minicart.init();
				
				if(app.minicart.suppressSlideDown && app.minicart.suppressSlideDown()) {
					// do nothing
					// the hook 'MiniCart.suppressSlideDown()' should have done the refresh
				}
				else {
					// there are no animations for motorola
					app.minicart.slide();
					jQuery('.minicartcontent').show();
				}
			},
			
			// slide down and show the contents of the mini cart
			slide: function() {
				if(app.minicart.suppressSlideDown && app.minicart.suppressSlideDown()) {
					return;
				}
					
				// show the item
				// there are no animations on motorola
				// jQuery('.minicartcontent').slideDown('slow');//show("slide", { direction: "up" }, 1000);
				jQuery('.minicartcontent').show();//show("slide", { direction: "up" }, 1000);

				clearTimeout(app.minicart.timer);
				app.minicart.timer = null;
					
				// after a time out automatically close it
				app.minicart.timer = setTimeout( 'app.minicart.close()', 6000 );
			},

			// adds a product to the mini cart
			// @params
			// progressImageSrc - source/url of the image to show when the item is being added to the cart
			// postdata - form data containing the product information to be added to mini-cart
			// callback - call back function/handler
			add: function(progressImageSrc, postdata, callback)	{
				// get the data of the form as serialized string
				var postdata = postdata;

				// get button reference
				var addButtons = [];

				// the button to update
				var addButton = null;
				
				// it is an array of buttons, but we need only one all
				// other combinations are strange so far
				if (addButtons.length == 1)	{
					addButton = addButtons[0];
				}

				var previousImageSrc = null;

				// show progress indicator
				if (addButton != null) {
					previousImageSrc = addButton.src;
					addButton.src = progressImageSrc;
				}

				// handles successful add to cart
				var handlerFunc = function(req)	{
					// hide progress indicator
					if (addButton != null) {
						addButton.src = previousImageSrc;
					}

					// replace the content
					jQuery('#minicart').html(req);

					// bind all the events
					app.minicart.init();

					//show the minicart
					$('.shopCartDrop').trigger('mouseenter');
					
					if(app.minicart.suppressSlideDown && app.minicart.suppressSlideDown()) {
						// do nothing
						// the hook 'MiniCart.suppressSlideDown()' should have done the refresh
					}
					else {
						app.minicart.slide();

						if (callback) callback();
					}
					
					if(jQuery('.'+postdata.pid).length>0){
						// check if we should add bonus discount products
						if(jQuery('.'+postdata.pid).is(':checked')){
							// fire the BonusDiscountLineItemCheck event so we can check if there is a bonus discount line item
							//jQuery(document).trigger(jQuery.Event("BonusDiscountLineItemCheck"));
							
							var bliuuid="";
							var i=0;
							jQuery('.discountlineitem div.uuid').each(function(index) {
								if(i==0){
									bliuuid+=jQuery(this).html();
								}else{
									bliuuid+="|^|"+jQuery(this).html();
								}
								i++;
							});
							
							params = [{name:"bonusDiscountLineItemUUID",value:bliuuid}]
							bonusProductsURL = app.URLs.bonusProductsURL + "?" + jQuery.param(params);
					        app.bonusProductsView.show({url: bonusProductsURL, source: "cart", label: "Update"});
				      }
					}else{
						var bliuuid="";
						var i=0;
						jQuery('.discountlineitem div.uuid').each(function(index) {
							if(i==0){
								bliuuid+=jQuery(this).html();
							}else{
								bliuuid+="|^|"+jQuery(this).html();
							}
							i++;
						});
						
						params = [{name:"bonusDiscountLineItemUUID",value:bliuuid}]
						bonusProductsURL = app.URLs.bonusProductsURL + "?" + jQuery.param(params);
			            app.bonusProductsView.show({url: bonusProductsURL, source: "cart", label: "Update"});
					}
				}

				// handles add to cart error
				var errFunc = function(req) {
					// hide progress indicator
					if (addButton != null) {
						addButton.src = previousImageSrc;
					}				}

				// closes a previous mini cart
				app.minicart.close();

				// add the product
				jQuery.ajax({
								type	: "POST",
								url		: app.minicart.url,
								cache	: true,
								data	: postdata,
								success	: handlerFunc,
								error	: errFunc
							});
			},

			// closes the mini cart with given delay
			close: function(delay) {
				if ( app.minicart.timer != null || delay == 0) {
					clearTimeout( app.minicart.timer );
					app.minicart.timer = null;		
					// there are no cart animations for motorola
					$('.shopCartDrop').hide();
					//jQuery('.minicartcontent').fadeOut(); // hide with "slide" causes to fire mouse enter/leave events sometimes infinitely thus changed it to fadeOut
				}
			},

			// hook which can be replaced by individual pages/page types (e.g. cart)
			suppressSlideDown: function() {
				return false;
			}
		},

		// close quick view dialog if open and refresh the page
		refreshCart: function() {
			app.quickView.close();

			// refresh without posting
			location.href = location.href;
		},

		// Product quick view object
		quickView: {
			// bind browser events
			// options
			// buttonSelector - css selector for the quickview button
			// imageSelector - css selector for product image
			// buttonLinkSelector - css selector for quickview button link (a tag)
			// productNameLinkSelector - css selector for product name link (a tag)
			
			
			
			bindEvents: function(options) {
				// hide quickview buttons
				jQuery(options.buttonSelector).hide();

				// hovering
				jQuery(options.imageSelector).hover(
					function(e) {
						jQuery(this).children(options.buttonSelector).show();
						return false;
					},
					function(e) {
						jQuery(this).children(options.buttonSelector).hide();
						return false;
					}
				);

				// click binding for quick view
				jQuery(options.buttonLinkSelector).unbind('click');
				
				jQuery(options.buttonLinkSelector).click(function(e) {
					var linkUrl=this.href;
					if(jQuery(".recommendations-dialog:visible").length>0){
						app.RecommendationsView.close();
						window.setTimeout(function () { app.quickView.show({url: linkUrl, source: "quickview"}); }, 500);
					}else{
						app.RecommendationsView.close();
						app.ajax.setVar({data:{varName:"recommendationURL", varValue:''}});
						app.quickView.show({url: linkUrl, source: "quickview"});
					}
					
					return false;
				});

				/*
				To make bookmarking and browser back-button work correctly the browser URL needs 
				to change. To force that change we do a full-page load (not AJAX) when going from 
				search result page to product detail page.
				The implementation supports loading the product detail content with AJAX: just 
				uncomment this code block to bind the event handler.
				
				// click binding for name link
				if(options.productNameLinkSelector) {
					jQuery(options.productNameLinkSelector).click(function(e) {
						app.getProduct({url: this.href, source: "search"});
						return false;
					});
				}
				*/
			},

			// show quick view dialog and send request to the server to get the product
			// options.source - source of the dialog i.e. search/cart
			// options.url - product url
			show: function(options) {
				app.createDialog({id: 'QuickViewDialog', options: {
			    	height: 530,
			    	width: 961,
			    	dialogClass: 'quickview',
			    	title: '',
			    	resizable: false
				}});

			    jQuery('#QuickViewDialog').dialog('open');
			    app.getProduct({containerId: "QuickViewDialog", source: options.source, url: options.url, label: options.label}, function(){
					jQuery('#QuickViewDialog').dialog('option', 'position', 'center');	
				});
			},
			// close the quick view dialog
			close: function() {
				jQuery('#QuickViewDialog').dialog('close');
				
			}
		},
		
		// Product buy dialog object
		BuyItView: {
			// bind browser events
			// options
			// buttonSelector - css selector for the quickview button
			// imageSelector - css selector for product image
			// buttonLinkSelector - css selector for quickview button link (a tag)
			// productNameLinkSelector - css selector for product name link (a tag)
			bindEvents: function(options) {
			
				// click binding for quick view
				jQuery(options.buttonLinkSelector).click(function(e) {
					
					app.BuyItView.show({url: this.value});
					return false;
				});
			},

			// show quick view dialog and send request to the server to get the product
			// options.source - source of the dialog i.e. search/cart
			// options.url - product url
			show: function(options) {				
				app.createDialog({id: 'BuyItDialog', options: {
			    	dialogClass: 'buy-it-dialog',
			    	title: '',
			    	width:920,
			    	resizable: false
			    	
				}});				
			    jQuery('#BuyItDialog').dialog('open');	
				
				app.getProduct({containerId: "BuyItDialog", source: options.source, url: options.url, label: options.label}, function(){
					$('#BuyItDialog').dialog('option', 'position', 'center');		
				});		    
			},
			// close the quick view dialog
			close: function() {
				jQuery('#BuyItDialog').dialog('close');
			}
		},
		
		// Shipping and Tax Estimator 
		CartEstimator : {
			
			URLs : {},
			MSGs : {},
			
			bindEvents : function() {
				jQuery("#estimateShippingAndTaxes").click(function(e) {
					e.preventDefault();
										
					var pZipCode   = jQuery("#zipCode").val();
					var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(pZipCode);
					if ( isValidZip ) {
						jQuery("#zipCodeErrorMsg").empty();
						jQuery("#cartOrderTotals").html(app.showProgress());

						app.ajax.load({
							reqName  : "GetEstimatedOrderTotals_Zip",
							url      : app.CartEstimator.URLs.GetEstimatedOrderTotals, 
							data     : {zipCode: pZipCode},
							callback : app.CartEstimator.HandleResponseCallback
						});
					}
					else {
						jQuery("#zipCodeErrorMsg").html(
							jQuery("<span>")
								.addClass("zipcode")
								.html(app.CartEstimator.MSGs.ErrorInvalidZipCode)
						);
					}
				});
				
                jQuery(".estimationShippingMethod").live('click', function(e) {
                    
                    var pShippingMethodId = jQuery(this).val();
                    
                    jQuery("#cartOrderTotals").html(app.showProgress());

                    app.ajax.load({
						reqName  : "GetEstimatedOrderTotals_ShippingMethod",
						url      : app.CartEstimator.URLs.GetEstimatedOrderTotals, 
						data     : {shippingMethodId: pShippingMethodId,zipCode:jQuery('.estimateCartOrderTotals #zipCode').val()},
						callback : app.CartEstimator.HandleResponseCallback
    				});
    				
                });
			},
			
			HandleResponseCallback : function(data) {
    	        jQuery.ajax({
					url		:  app.CartEstimator.URLs.SetShippingMethodToNull,
					success: function(response, textStatus) {
    	        	 	var $data                    = jQuery(data);
    	                var $cartOrderTotals         = jQuery("#cartOrderTotals");
    	                var $estimateShippingMethods = jQuery("#estimateShippingMethods");
    	                
    	                $cartOrderTotals
    	                    .html( $data.filter("span#rqPartCartOrderTotals").contents() );
    	                
    	                $estimateShippingMethods
    	                    .html( $data.filter("span#rqPartShippingMethods").contents() );
    	                
    	                if(jQuery(".carttable .rowcoupons").length>0){
    	               		var footer_coupons=$(data).find(".footer-coupons");
    	                	$(footer_coupons).children(".discount").each(function(index) {
    	               			var that=jQuery(this);
    	                		jQuery(".carttable .rowcoupons .discount").each(function(index) {
    	               				if(jQuery(this).attr("class")==jQuery(that).attr("class")){
    	               					jQuery(this).html(jQuery(that).html());
    	               				}
    	               			});	
    	                	});
    	                } 
    	    	               
    	                
    	                if ( ! $estimateShippingMethods.hasClass('isVisible') ) {
    	                    $estimateShippingMethods
    	                    	.addClass('isVisible')
    	                    	.slideDown('fast');
    	                }
    	                
    	                     
    	                if(jQuery("#cartOrderTotals .ordersalestax").length==0){
    	                	jQuery("#zipCodeErrorMsg").html(
    							jQuery("<span>")
    								.addClass("zipcode")
    								.html(app.CartEstimator.MSGs.ErrorInvalidZipCode)
    						);
    	                }
					},
					error: function(request, textStatus, error) {
					}
				});
      	}
			
		},
		
		VideoPlayer : {
		
			URLs : {},
			
			bindEvents : function() {
				jQuery('.category-hero a').unbind('click');
				jQuery('.sideblock a').unbind('click');
				
				jQuery(".doPlayVideo").unbind("click").click(function(e) {
					e.preventDefault();
					
					var dataObject  = jQuery(this).data("data");
					var $dlgElement = jQuery('<div></div>');
						
                	var w = parseInt(dataObject.w, 10);
                	var h = parseInt(dataObject.h, 10);

                	if(!dataObject){
  						dataObject = JSON.parse( jQuery(this).next().html() );
  					}
                	
    				$dlgElement.dialog({
                        bgiframe  : true,
            			autoOpen  : false,
                        modal     : true,
                        overlay   : { opacity : 0.5, background : "black" },
                        resizable : false,
                        width     : w,
                        close     : function(event, ui) { 
                        	jQuery(document).unbind('click', app.dialog.clickOutsideHandler);	
                        	jQuery(this).remove();                         	
                        },
                        open      : function(event, ui) {
                        	jQuery(document).unbind('click').bind('click', app.dialog.clickOutsideHandler);	
                        }
                	}); 
    			
    				app.ajax.load({
						url      : app.VideoPlayer.URLs.VideoPlayerStart, 
						selector : $dlgElement,
						data     : {
						    title   : dataObject.title,
						    poster  : dataObject.poster,
						    width   : dataObject.w,
						    height  : dataObject.h,
						    mp4Path : dataObject.mp4Path,
						    webmPath: dataObject.webmPath,
						    ogvPath : dataObject.ogvPath,
						    page    : dataObject.page,
						    productName : app.ProductCache ? app.ProductCache.customWebtrends.WT_ProductName : ""
						},
						callback:function(){
							$dlgElement.dialog("open");
						}
    				});
    				
    				
				});
				
				//category browse page hero links
				jQuery('.category-hero a').click(function(){
					var title = jQuery(this).attr('title');
					var href = jQuery(this).attr('href');
					var category = '';
					
					$('meta').each(function() {
						if($(this).attr('name') == 'WT.cg_n') {
							category = $(this).attr('content');
							if(category.indexOf('Accessories') > 0) {
								category = 'Accessories';
							}
							return;
						}
					});

					if(jQuery(this).attr('class') == 'doPlayVideo') {
						var dataObject  = jQuery(this).data("data");
						title = dataObject.title;
						href = dataObject.mp4Path;
					}
					
					dcsMultiTrack('WT.ti', 'Click Action', 'DCS.dcsuri', '/vpv.click', 'WT.dl', '40', 'WT.pn.id', '', 'WT.pn', '', 'WT.z_browse_selection', '', 'DCS.dcsqry', '', 'WT.z_filter_attribute_name', '', 'WT.z_filter_attribute_heading', '', 'WT.cg_n', '', 'WT.cg_s', '', 'DCSext.action', category + ' Browse Page;Promotional CTA;' + title + ';' + href, 'DCSext.action_2', category + ' Browse Page|Promotional CTA|' + title + '|' + href, 'WT.z_filter_attribute_product_id', '', 'WT.z_filter_attribute_content_group', '', 'WT.clip_n', '', 'DCSext.clip_url', '', 'DCSext.clip_template', '', 'DCSext.clip_product', '', 'WT.clip_ev', '');
				});
				
				//category browse page feature image links
				jQuery('.sideblock a').click(function(){
					var title = jQuery(this).attr('title');
					var href = jQuery(this).attr('href');
					var category = '';

					$('meta').each(function() {
						if($(this).attr('name') == 'WT.cg_n') {
							category = $(this).attr('content');
							if(category.indexOf('Accessories') > 0) {
								category = 'Accessories';
							}
							return;
						}
					});
					
					if(jQuery(this).attr('class') == 'doPlayVideo') {
						var dataObject  = jQuery(this).data("data");
						title = dataObject.title;
						href = dataObject.mp4Path;
					}

					dcsMultiTrack('WT.ti', 'Click Action', 'DCS.dcsuri', '/vpv.click', 'WT.dl', '40', 'WT.pn.id', '', 'WT.pn', '', 'WT.z_browse_selection', '', 'DCS.dcsqry', '', 'WT.z_filter_attribute_name', '', 'WT.z_filter_attribute_heading', '', 'WT.cg_n', '', 'WT.cg_s','', 'DCSext.action', category + ' Browse Page;Lifestyle Image;' + title + ';' + href, 'DCSext.action_2', category + ' Browse Page|Lifestyle Image|' + title + '|' + href, 'WT.z_filter_attribute_product_id', '', 'WT.z_filter_attribute_content_group', '', 'WT.clip_n', '', 'DCSext.clip_url', '', 'DCSext.clip_template', '', 'DCSext.clip_product', '', 'WT.clip_ev', '');
				});
			}
		},
		
		// Channel Intelligence
		StoreLocatorDialog: {	
			
			// bind browser events
			// options
			// buttonSelector - css selector for the ChannelIntelligence button
			// imageSelector - css selector for product image
			// buttonLinkSelector - css selector for ChannelIntelligence button link (a tag)
			// productNameLinkSelector - css selector for product name link (a tag)
			bindEvents: function(options) {
				// click binding for quick view
				jQuery('.find-a-store-link').click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					app.StoreLocatorDialog.show(options);
				});
			},

			// show ChannelIntelligence dialog and send request to the server to get the product
			// options.source - source of the dialog i.e. search/cart
			// options.url - product url
			show: function(options) {
				var slUrl = app.util.appendParamToURL(app.URLs.showTemplate, 'template', 'storelocator/storelocatordialog');
				app.createDialog({id: 'StoreLocatorDialog', options: {
			    	dialogClass: 'store-locator-dialog',
			    	title: '',
			    	width:565,
			    	height:348,
			    	modal: true,
			    	resizable: false
				}});
			    jQuery('#StoreLocatorDialog').dialog('open');
			    //app.getProduct({containerId: "StoreLocatorDialog", source: options.source, url: options.url, label: ""});
			    app.ajax.load({selector: "#StoreLocatorDialog", url: slUrl, data:options});
			},
			
			init: function(options){
				app.StoreLocatorDialog.bindEvents(options);
			},
			
			// close the ChannelIntelligence dialog
			close: function() {
				jQuery('#StoreLocatorDialog').dialog('close');
			}
		},
		
		// Product recommendations dialog object
		RecommendationsView: {
			// bind browser events
			// options
			// buttonSelector - css selector for the quickview button
			// imageSelector - css selector for product image
			// buttonLinkSelector - css selector for quickview button link (a tag)
			// productNameLinkSelector - css selector for product name link (a tag)
	
			// show quick view dialog and send request to the server to get the product
			// options.source - source of the dialog i.e. search/cart
			// options.url - product url
			show: function(options) {
				app.createDialog({id: 'RecommendationsDialog', options: {
			    	dialogClass: 'recommendations-dialog',
			    	title: '',
			    	resizable: false
				}});
				
				app.ajax.setVar({data:{varName:"recommendationURL", varValue:options.url}});
				
			    jQuery('#RecommendationsDialog').dialog('open');
			    app.getProduct({containerId: "RecommendationsDialog", source: options.source, url: options.url, label: options.label}, function(){
					jQuery('#RecommendationsDialog').dialog('option', 'position', 'center');
				});
			},
			// close the quick view dialog
			close: function() {
				jQuery('#RecommendationsDialog').dialog('close');
			}
		},
		
		
		// Bonus product view object
		bonusProductsView: {
			// show bonus product view dialog and send request to the server to get the 
			// bonus products
			// options.url - bonus product url
			show: function(options) {
				/*
				app.createDialog({id: 'BonusProductDialog', options: {
			    	height: 530,
			    	width: 800,
			    	dialogClass: 'quickview',
			    	title: 'Select Bonus Products',
			    	resizable: false
				}});
				
			    jQuery('#BonusProductDialog').dialog('open');	
			    jQuery("#" + "productresultarea").hide();
			    */
			
				jQuery("#BonusProductDialog").empty();
				app.ajax.load({
					selector: "#BonusProductDialog",
					url: options.url, 
					callback: function(responseText, textStatus){
					
					}
				});				
			},
			// close the quick view dialog
			close: function() {
				jQuery('#BonusProductDialog').dialog('close');
			}
		},

		// helper method to create a dialog with the given options
		// options - dialog box options along with id of the container
		createDialog: function(options) {
			jQuery('#'+options.id).dialog(jQuery.extend({}, app.dialogSettings, options.options));
		},

		// shows tooltip popup
		// options
		// id - id of the container
		// options - tooltip popup options
		tooltip: function(options) {
			if (options.id.charAt(0) !== '#') {
				options.id = "#"+options.id;
			}
			jQuery(options.id).tooltip(jQuery.extend({}, app.tooltipSettings, options.options));
		},
		
		/**
		 * Unobtrusively build tooltips on the page.
		 * it looks for a tooltip class anchor which contains a div with tooltip-body class as the body container.
		 */
		tooltipDefault: function () {	 
			 jQuery(document).ready(function() {
				 try {
					jQuery(".tooltip").tooltip(jQuery.extend({}, app.tooltipSettings, {	
							bodyHandler: function() {
								return jQuery(this).children(".tooltip-body").html();
							}
						}
					));
				 }
				 catch(e){}
			 });			
		},

		// renders a progress indicator on the page; this function can be used
		// to indicate an ongoing progress to the user; the optional parameter "className"
		// can be used to attach an additional CSS class to the container
		showProgress : function(className) {
			var clazz = "loading";
			if (className) clazz += " " + className;
			return jQuery("<div class=\"" + clazz + "\"/>").append(jQuery("<img/>").attr("src", app.URLs.loadingSmallImg));
		},

		// validation plugin intialization
		validator: function() {
			if(!jQuery.validator) return;
			
			// override default required field message
			jQuery.validator.messages.required = function($1, ele, $3) {
				return "";
			};
			
			/**
			 * Add phone validation method to jQuery validation plugin.
			 * Text fields must have 'phone' css class to be validated as phone
			 * phoneUS is copied from http://docs.jquery.com/Plugins/Validation/CustomMethods/phoneUS
			 */
			jQuery.validator.addMethod("phone", function(phone_number, element) {
				// find out the country code
				var data 	= jQuery(element).data("data");
				// default to US phone validation
				var country = (data && data.country && data.country != "") ? data.country : "US"; 
				
				// preserve this instance
				var that = this;
    
				// country specific phone validation handlers
				var phoneUS = function() {
					phone_number = phone_number.replace(/\s+/g, ""); 					
					return that.optional(element) || (phone_number.length > 9 && /^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(phone_number));
				}
				
				var phoneCA = phoneUS;
				
				eval("var phoneHandler = (typeof phone" + country + " != 'undefined') ? phone"+country+": null;");
								
				// call the country specific phone validation handler
				return ( (phoneHandler && typeof phoneHandler == "function") ? phoneHandler() : true);
				
			}, app.resources["INVALID_PHONE"]);

			/**
			 * Add positive number validation method to jQuery validation plugin.
			 * Text fields must have 'positivenumber' css class to be validated as positivenumber
			 * it validates a number and throws error if it is below 0 or if it is not a number.
			 */
			jQuery.validator.addMethod("positivenumber", function(value, element) {
				if (value == '') return true;				
				return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value) && Number(value) > 0;
			}, ""); // "" should be replaced with error message if needed
			
			// poboxes validation
			jQuery.validator.addMethod("pobox", function(value, element) {
				//return !  /\b[P|p]*(OST|ost)*\.*\s*[O|o|0]*(ffice|FFICE)*\.*\s*[B|b][O|o|0][X|x]\b/gi.test(value);	
				return ! /(((\bP *\.? *O *\.? *)(box)?)\b)|(POB)/i.test(value);
			}, ""); // "" should be replaced with error message if needed
			
			// edit profile password validation
			jQuery.validator.addMethod("profilepassword", function(value,element){
				return /(^\S+$)/.test(value);
			},"");
			
			// register form validator for form elements
			// except for those which are marked "suppress"
			jQuery.each(jQuery("form:not(.suppress)"), function() {
				jQuery(this).validate(app.validatorSettings);
			});
		},

		/**
		 * grab anything inside a hidden dom element and append it to its immediate previous sibling
		 * as data attribute i.e. jQuery().data("data", hiddenStr)
		 * if the hidden data specifies json in the class then this routine would attempt to 
		 * convert the hidden data into json object before adding it as data attribute.
		 * after adding the data, the hidden span/element is removed from the DOM.
		 */
		hiddenData : function() {
			jQuery.each(jQuery(".hidden"), function() {
				var hiddenStr = jQuery(this).html();
				
				if (hiddenStr === "") {
					return;
				}
				
				// see if its a json string
				if (jQuery(this).hasClass("json")) {
					// try to parse it as a json
					try {
						hiddenStr = window["eval"]("(" + hiddenStr + ")");
					}
					catch(e) {}				
				}
				
				jQuery(this).prev().data("data", hiddenStr);
				
				jQuery(this).remove();
			});
		},
		
		
		/**
		 * code for switching the [+] image in the footer
		 * for opinion labs
		 */
		bindOOHoverHandler : function(){
			var img = jQuery("#site-feedbackGlobal img"),
		    	myLink = jQuery("#site-feedbackGlobal a"),
		    	src = img.attr('src');
		    if (!src) return;
		    var extension = src.substring(src.lastIndexOf("."),src.length)

		    jQuery(myLink).hover(
		      function () {
		    	  jQuery(img).attr("src",src.replace(extension,"-over.gif"));
		      }, 
		      function () {
		    	  jQuery(img).attr("src",src);
		      }
		    );
		},
		
		/**
		 * code for opening the footer pop-up on clicking on 
		 * life m powered
		 */
		bindLifeMPoweredDialog : function(){
		
			app.createDialog({id: 'footer-popup', options: {
				height: 520,
		    	width: 900,
		    	title: '',
			}});
			
			jQuery('#lmp').click(function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				jQuery('#footer-popup').dialog('open');
			});
		},
		
		/**
		 *  Binds hover actions for the top category links
		 *  as these are made with Cufon they need to be manually
		 *  refreshed because Cufon doesn't fire mouse out events properly 
		 *  sometimes. unfortunately this means separate Cufon and fonts 
		 *  calls here
		 *  
		 */
		bindCufonCategoryMenu : function(){
			var $topCatLis = $('.top-cat').parent();
			
			
			$topCatLis.hover(function(){
				var anchor = $(this).children('.top-cat');

				if (!anchor.hasClass('current')) {				
					anchor.attr('id', 'cufonHoverCatMenu');
					Cufon('#cufonHoverCatMenu', {
						fontFamily: 'Univers LT Std',
						fontWeight: 400,
						color: '#FFF'
					});
				}
			},
			function(){
				Cufon('#cufonHoverCatMenu',{
					fontFamily: 'Univers LT Std',
					fontWeight: 400,
					color: '#ffffff' // elevation edit color for new header 6/21/12
				});
				
				$('#cufonHoverCatMenu').removeAttr('id');
			});
		},
		
		/**
		 * Process country drop downs and attach a change listener so that phone field 
		 * can be validated properly based on the currently selected country.
		 */
		addCountryListener: function() {
			var countryHandler = function(e) {
				var selectedCountry = this.options[this.selectedIndex].value;
				// for each field of type phone in the current form, set its country as a data attribute
				// to be used while doing phone field validatiaon see app.validator addMethod.
				jQuery(this).parents("form:first").find("input.phone").each(function() {
					var data = jQuery(this).data("data");
					var currentData = (data && typeof data == 'object') ? data : {};
					currentData.country = selectedCountry;
					jQuery(this).data("data", currentData);
				});						
			}
			jQuery("select.country").change(countryHandler).each(countryHandler);
		},
		
		/**
		 * Unobtrusive js api calls go here.
		 */
		 execUjs: function() {
			// make global nav drop downs with superfish jquery plugin
			// jQuery('.categorymenu ul').addClass('sf-menu');			
			// jQuery('ul.sf-menu').superfish({autoArrows	: false, dropShadows : false}).find('ul').bgIframe();
			
			// process hidden data in the html markup and cnnvert it into data object(s)
			this.hiddenData();
			
			// initialize form validator plugin
			this.validator();
			
			// process country form fields and attach listeners
			this.addCountryListener();
			
			// process tooltips on the page
			this.tooltipDefault();
			
			// call the handler for [+]
			this.bindOOHoverHandler();
			
			// bind the mpowered dialog
			//this.bindLifeMPoweredDialog();
			
			// bind the cufon hover action for the category menu
			this.bindCufonCategoryMenu();
		},
		
		// capture recommendation of each product when it becomes visible in the carousel
		captureCarouselRecommendations : function(c, li, index, state) {
			jQuery(li).find(".captureproductid").each(function() {
				dw.ac.capture({id:this.innerHTML, type:dw.ac.EV_PRD_RECOMMENDATION});
			});
		},
		
		// sub namespace app.producttile.* contains utility functions for product tiles
		producttile : {
			// initializes all product tiles contained in the current page
			initAll: function() {
				// bind quick view button toggling and click
				var quickViewOptions = {
					buttonSelector: "div.producttile div.quickviewbutton",
					imageSelector: "div.producttile div.image",
					buttonLinkSelector: "div.producttile div.quickviewbutton a"
				};
				app.quickView.bindEvents(quickViewOptions);
				
				// prepare swatch palettes and thumbnails
				jQuery("div.producttile div.swatches div.invisible").hide();
				jQuery("div.producttile div.swatches a.swatch img.hiddenthumbnail").hide();
				
				// show the palette
				jQuery("div.producttile div.swatches > a").click(function(e) {
					var cont = jQuery(this).parent().find("div.palette");
					cont.show().focus();
					return false;
				});
				
				// hide the palette
				jQuery("div.producttile div.swatches div.invisible").mouseout(function(e) {
					// fix for event bubbling (http://www.quirksmode.org/js/events_mouse.html)
					if(!e) var e = window.event;
					var tg = (window.event) ? e.srcElement : e.target;
					if(tg.nodeName != 'DIV') return;
					var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
					while(reltg != tg && reltg.nodeName != 'BODY')
						reltg = reltg.parentNode
					if (reltg == tg) return;
					
					// mouseout took place when mouse actually left layer
					// handle event now
					jQuery(this).hide();
					return false;
				});
				
				// thumb nail toggling
				jQuery("div.producttile div.swatches div.palette a.swatch").bind("mouseover mouseout", function(e) {
					var swatch = jQuery(this);
					app.producttile.toggleVariationThumbnail(swatch);
				});
				
				// color swatch selection
				jQuery("div.producttile div.swatches div.palette a.swatch").click(function(e) {
					var swatch = jQuery(this);
					app.producttile.selectVariation(swatch);
					// omit following the swatch link
					return false;
				});
			},

			// selects a certain variation in a product tile, replaces the current image with
			// the correct variation image, changes the link to the detail
			// page and the quick view
			selectVariation : function(swatch) {
				// get the new and the original image
				var currentImg = jQuery(swatch.parents()[3]).find(".productimage img");
				var newImg = swatch.children("img.hiddenthumbnail");
				if(!currentImg || !newImg) return;
				
				// get the anchors
				var nameAnchor = swatch.parents(".producttile").find(".name a");
				var quickViewAnchor = swatch.parents(".producttile").find(".quickviewbutton a");
				var imageAnchor = swatch.parents(".producttile").find(".productimage a");
				
				// change the link url to the detail page and quick view
				var newUrl = swatch.attr("href");
				nameAnchor.attr("href", newUrl);
				quickViewAnchor.attr("href", newUrl);
				imageAnchor.attr("href", newUrl);
				
				// remove all current markers
				jQuery(swatch.parents()[0]).find("a.swatch").removeClass("selected");
				
				// mark swatch as selected
				swatch.addClass("selected");
				// we just remove the markers at the images; the actual elements
				// are correct, since they were already swapped by mouse over
				currentImg.removeClass("temp original");
				newImg.removeClass("temp original");
			},

			// shows the thumb nail of a product; this function is used to
			// temporally display a new image and restore the original one
			toggleVariationThumbnail : function(swatch) {
				// get the new and the original image
				var currentImg = jQuery(swatch.parents()[3]).find(".productimage img");
				var newImg = swatch.children("img.hiddenthumbnail");
				if(!newImg || !currentImg) return;
				
				var selectedSwatch = jQuery(swatch.parents()[0]).find("a.selected");
				var selectedImg = selectedSwatch.children("img.hiddenthumbnail");

				// we do nothing in case the swatch is already selected
				if(swatch.hasClass("selected")) return;
				
				if(currentImg.hasClass("temp")) {
					// current image is just a temp image, restore original
					var newCopy = selectedImg.clone().show().removeClass("original hiddenthumbnail");
					currentImg.replaceWith(newCopy[0]);
				} else {
					// we create a copy of the swatch image, replace
					// the current and mark it with classes
					var newCopy = newImg.clone().show().addClass("temp").removeClass("hiddenthumbnail");
					currentImg.replaceWith(newCopy[0]);
				}
			}
		},

		// sub namespace app.util.* contains utility functions
		util : {
			// disables browser auto completion for the given element
			disableAutoComplete : function(elemId) {
				jQuery("#"+elemId).attr("autocomplete", "off");
			},

			// trims a prefix from a given string, this can be used to trim
			// a certain prefix from DOM element IDs for further processing on the ID
			trimPrefix : function(str, prefix) {
				return str.substring(prefix.length);
			},

			// appends the parameter with the given name and
			// value to the given url and returns the changed url
			appendParamToURL : function(url, name, value) {
				var c = "?";
				if(url.indexOf(c) != -1) {
					c = "&";
				}
				return url + c + name + "=" + encodeURIComponent(value);
			},

			// dynamically loads a CSS file
			loadCSSFile : function(url) {
				var elem = document.createElement("link");
				elem.setAttribute("rel", "stylesheet");
				elem.setAttribute("type", "text/css");
				elem.setAttribute("href", url);

				if(typeof elem != "undefined") {
					document.getElementsByTagName("head")[0].appendChild(elem);
					app.util.loadedCSSFiles.push(url);
				}
			},

			// array to keep track of the dynamically loaded CSS files
			loadedCSSFiles : [],

			// removes all dynamically loaded CSS files
			clearDynamicCSS : function() {
				for(var i=0; i<app.util.loadedCSSFiles.length; i++) {
					app.util.unloadCSSFile(app.util.loadedCSSFiles[i]);
				}
			},

			// dynamically unloads a CSS file
			unloadCSSFile : function(url) {
				var candidates = document.getElementsByTagName("link");
				for(var i=candidates.length; i>=0; i--) {
					if(candidates[i] && candidates[i].getAttribute("href") != null && candidates[i].getAttribute("href").indexOf(url) != -1) {
						candidates[i].parentNode.removeChild(candidates[i]);
					}
				}
			},

			// checks if cookies are enabled
			cookiesEnabled : function() {
				
				var test_cookie_name = "dwTestCookie";
				document.cookie = test_cookie_name + "=OK";
				
				// first we'll split this cookie up into name/value pairs
				// note: document.cookie only returns name=value, not the other components
				var all_cookies = document.cookie.split( ';' );
				var temp_cookie = '';
				var cookie_name = '';
				var cookie_value = '';
				var cookie_found = false; // set boolean t/f default f

				for ( i = 0; i < all_cookies.length; i++ )
				{
					// now we'll split apart each name=value pair
					temp_cookie = all_cookies[i].split( '=' );

					// and trim left/right whitespace while we're at it
					cookie_name = temp_cookie[0].replace(/^\s+|\s+$/g, '');

					// if the extracted name matches the session cookie name 
					if ( cookie_name == test_cookie_name )
					{
						// we need to handle case where cookie has no value but exists (no = sign, that is):
						if ( temp_cookie.length > 1 )
						{
							cookie_value = unescape( temp_cookie[1].replace(/^\s+|\s+$/g, '') );
						}

						if (cookie_value.length > 0)
						{
							cookie_found = true;
							document.cookie = test_cookie_name +"=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
							break;
						}
					}
					temp_cookie = null;
					cookie_name = '';
				}
				return cookie_found;
			},
			
			/**
			 * IE 6 multiple button submit issue work around.
			 * when a form has multiple buttons of submit type, then IE 6 submits all of them
			 * whenever form is submitted. e.g. Remove on cart page would remove the wrong item
			 * (always first item in the cart) because IE 6 submits all form data which includes all 
			 * remove links!!!
			 * the workaorund is to disable all buttons except the one which is being clicked.
			 * it should only be called for IE 6 (check out htmlhead.isml for usage)
			 */
			ie6ButtonFix: function() {
				jQuery('button').click(function(){
		        	// disable all buttons
		        	jQuery(this.form).find('button').attr("disabled", true);
		        	// enable the one being clicked
		            jQuery(this).attr("disabled", false);
			    });
			}
		},

		// sub namespace app.dialog.* provides convenient functions to handle dialogs
		// note, that this code relies on single dialog modals (multi dialog, e.g. modal in modal is not supported)
		dialog : {
			// opens a dialog using the given url
			open : function(url, title, dialogClass, options) {
				// create the dialog container if not present already
				var $genericDialog = $('#dialogcontainer');
				
				// set a default title
				title = title || "Dialog";
				
				app.createDialog({id: 'dialogcontainer', options: options});
				$genericDialog.addClass(dialogClass)
					.html(app.showProgress("productloader"))
					.dialog("open");
				
				// finally load the dialog, set the dialog title
				app.ajax.load({
					selector: "#dialogcontainer",
					url: url,
					callback: function() {
						app.dialog.setTitle(title);
					}
				});
			},

			// initializes the dialog with common dialog actions, like closing upon canceling
			// use this function in the dialog rendering template to re-bind common actions
			// upon dialog reload
			init : function() {
				jQuery(document).ready(function() {
					// binds the action to all buttons defining an action through the "name" attribute
					jQuery("#dialogcontainer button").each(function() {
						jQuery(this).click(function() {
							var action = jQuery(this).attr("name");
							if(action) {
								app.dialog.submit(action);
							}
							return false;
						});
					});

					// cancel button binding
					jQuery("#dialogCancelBtn").click(function() {
						app.dialog.close();
						return false;
					});
				});
			},

			// sets the title of the dialog
			setTitle : function(title) {
				jQuery("#dialogcontainer").dialog("option", "title", title);
			},

			// checks, if the dialog is in the state "open" and sets the state if not presently set
			// this function is implicitly called by app.dialog.open(url, title) in order to initialize
			// the dialog properly; use this function to recover the "open" state of a dialog
			checkOpen : function() {
				if(!jQuery("#dialogcontainer").dialog("isOpen")){
					jQuery("#dialogcontainer").dialog({
						bgiframe: true,
						autoOpen: false,
						modal: true,
						overlay: {
				    		opacity: 0.5,
				     		background: "black"
						},
				    	height: 425,
				    	width: 460,
				    	resizable: false
					});
					jQuery("#dialogcontainer").dialog("open");
				}
			},

			// closes the dialog and triggers the "close" event for the dialog
			close : function() {
				jQuery("#dialogcontainer").dialog("close");
				jQuery(document.body).trigger("dialogClosed");
			},

			// attaches the given callback function upon dialog "close" event
			onClose : function(callback) {
				if(callback != undefined) {
					jQuery(document.body).bind("dialogClosed", callback);
				}
			},

			// triggers the "apply" event for the dialog
			triggerApply : function() {
				jQuery(document.body).trigger("dialogApplied");
			},

			// attaches the given callback function upon dialog "apply" event
			onApply : function(callback) {
				if(callback != undefined) {
					jQuery(document.body).bind("dialogApplied", callback);
				}
			},

			// triggers the "delete" event for the dialog
			triggerDelete : function() {
				jQuery(document.body).trigger("dialogDeleted");
			},

			// attaches the given callback function upon dialog "delete" event
			onDelete : function(callback) {
				if(callback != undefined) {
					jQuery(document.body).bind("dialogDeleted", callback);
				}
			},

			// submits the dialog form with the given action
			submit : function(action) {
				// set the action
				jQuery("#dialogcontainer form").append("<input name=\"" + action + "\" type=\"hidden\" />");

				// serialize the form and get the post url
				var post = jQuery("#dialogcontainer form").serialize();
				var url = jQuery("#dialogcontainer form").attr("action");

				// post the data and replace current content with response content
		  		jQuery.ajax({
				   type: "POST",
				   url: url,
				   data: post,
				   dataType: "html",
				   success: function(data){
		  				jQuery("#dialogcontainer").empty().html(data);
				   },
				   failure: function(data) {
					   alert(app.resources["SERVER_ERROR"]);
				   }
				});
			},
			
			clickOutsideHandler: function(y){
				// warning! this is an extra member (not part of jQuery UI)
				// neccessary for closing dialogs when clicking outside the dialog
				var $tgt = $(y.target);
				if (!$tgt.parents().is('.ui-dialog')) {
					$('.ui-dialog-content').dialog('close');                     
				}
			}
		}
	}
})(jQuery);

// application initialization on dom ready
jQuery(document).ready(function(){
	app.init();
});
