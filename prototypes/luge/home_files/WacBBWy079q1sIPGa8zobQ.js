
try{Bootstrapper.setCurrentRuleId(41026);Bootstrapper._delivered=Bootstrapper._delivered||[];Bootstrapper._delivered.push("_GAHomePageEvents");Bootstrapper.bindDOMParsed(function()
{try
{Bootstrapper.dataObj.locale=Bootstrapper.getMetaContents('DCSext.locale');var _GA_e=Bootstrapper.dataObj._GA_e={};var _GA_e_d=Bootstrapper.dataObj._GA_e_detected=[];_GA_e['1']={s:function()
{return'#brand-stories > ol > li > div a, .slide-content area';},c:function()
{return'engagement';},a:function()
{return'brandstory click';},l:function(elem)
{var brandstoryLabel=$.trim($(elem).parents('.slide-content').siblings('.slide-label').text());var position=-1;var targetUrl=$(elem).attr('href');$('.slide').each(function(index,elem2)
{if(elem2==$(elem).parents('.slide')[0])
{position=index+1;}});return(brandstoryLabel+': '+position+': '+targetUrl);},o:function()
{return false;},w:function()
{return true;}};_GA_e['2']={s:function()
{return'div.items > div[class!="cloned"] a';},c:function()
{return'engagement';},a:function()
{return'promotion badge click';},l:function(elem)
{var altText=$(elem).children().attr('alt');var position=-1;var targetUrl=$(elem).attr('href');$('.items > div[class!="cloned"]').each(function(index,elem2)
{if(elem2==$(elem).parents('div')[0])
{position=index+1;}});return('small promotion: '+position+': '+altText+': '+targetUrl);},o:function()
{return false;},w:function()
{return true;}};_GA_e['3']={s:function()
{return'.img-container';},c:function()
{return'engagement';},a:function()
{return'home page: view product details';},l:function(elem)
{var productName=$.trim($(elem).prev().val());return productName;},o:function()
{return false;},w:function()
{return true;}};_GA_e['4']={s:function()
{return'#brand-stories > ol > li > div [class="doPlayVideo"]';},c:function()
{return'';},a:function()
{return'';},l:function(elem)
{var brandstoryLabel=$.trim($(elem).parents('.slide-content').siblings('.slide-label').text());return brandstoryLabel;},o:function()
{return false;},w:function()
{return false;}};for(var key in _GA_e)
{var node=_GA_e[key].s;var category=_GA_e[key].c();var action=_GA_e[key].a();var label=_GA_e[key].l;var nonInteraction=_GA_e[key].o();var wait=_GA_e[key].w();(function(n,c,a,l,o,w,key)
{setInterval(function()
{try
{var _n=$(n());if(_GA_e_d[key]==undefined)
{_GA_e_d[key]=[];}
for(var x=0;x<_n.length;x++)
{for(var y=0;y<_GA_e_d[key].length;y++)
{if(_n[x]===_GA_e_d[key][y])
{_n.splice(x,1);}}}
for(var z=0;z<_n.length;_GA_e_d[key].push(_n[z++]));if(_n.length>0)
{var addEvent=true;if((n()!='#buy-product')&&(a=='register'||a=='buy it'))
{var found=false;if(_n.data('events')!=null)
{for(var ev=0;ev<_n.data('events').click.length;ev++)
{if(_n.data('events').click[ev].handler.toString().indexOf('webtrendsBuyItVariations')>0)
{found=true;break;}}}
if((!found&&a=='buy it')||(found&&a=='register'))
{addEvent=false;}}
if(addEvent)
{if(w)
{_n.attr('wait',key)}
_n.click(function(e)
{try
{if(w&&(((this.target==""||this.target=="_self")&&(this.href&&(this.href.indexOf('window.open(')===-1)))||e.isDefaultPrevented())&&$(this).attr('wait')==key)
{e.preventDefault();var href=this.href;Bootstrapper.GAController.trackEvent(c,a,l(this),o,w,href);}
else
{if(($(this).attr('class')!=undefined)&&($(this).attr('class').indexOf('addtocartbtn')!=-1))
{if((($(this).attr('title')==='Add to Cart')&&(a==='add to cart'))||(($(this).attr('title')==='Buy With Plan')&&(a==='buy with plan')))
{Bootstrapper.GAController.trackEvent(c,a,l(this),o);}}
else
{if(key==='4')
{var brandstories=$('#brand-stories > ol > li');for(var i=0;i<brandstories.length;i++)
{if($(this).parents('li.slide')[0]===brandstories[i])
{Bootstrapper.dataObj.brandstoryIndex=i+1;break;}}
Bootstrapper.dataObj.brandstoryLabel=l(this);}
else
{Bootstrapper.GAController.trackEvent(c,a,l(this),o);}}}}
catch(e)
{Bootstrapper.reportException(e);}});}}}
catch(e)
{Bootstrapper.reportException(e);}},500);})(node,category,action,label,nonInteraction,wait,key);}
try
{var settings=jQuery('#brand-stories').liteAccordion('debug').settings;var onTriggerSlide=settings.onTriggerSlide;settings.onTriggerSlide=function()
{var currentSlide=jQuery('#brand-stories').liteAccordion('debug').core.currentSlide;onTriggerSlide.call(jQuery('#brand-stories > ol > li > div:eq('+currentSlide+')'));};var onSlideAnimComplete=settings.onSlideAnimComplete;settings.onSlideAnimComplete=function()
{var currentSlide=jQuery('#brand-stories').liteAccordion('debug').core.currentSlide;onSlideAnimComplete.call(jQuery('#brand-stories > ol > li > div:eq('+currentSlide+')'));if(jQuery('#brand-stories > ol > li > div[viewed='+currentSlide+']').length==0)
{Bootstrapper.GAController.trackEvent('non-interaction','brandstory rotation',(currentSlide+1).toString(),true);jQuery('#brand-stories > ol > li > div:eq('+currentSlide+')').attr('viewed',''+currentSlide);}};settings.firstSlide=jQuery('#brand-stories').liteAccordion('debug').core.currentSlide+1;jQuery('#brand-stories').liteAccordion('destroy');jQuery('#brand-stories').liteAccordion(settings);jQuery('#brand-stories > ol > li > div:eq(0)').attr('viewed','0');}
catch(e0)
{Bootstrapper.reportException(e);}
try
{if($('#home-promotions').data('scrollable')!=undefined)
{var GAhpi=Bootstrapper.dataObj._GA_homepage_promotion_index=[];GAhpi.push(0);$('#home-promotions').data('scrollable').onSeek(function(e,index)
{var activated=false;for(var a in GAhpi)
{if(index===GAhpi[a])
{activated=true;break;}}
if(!activated)
{GAhpi.push(index);Bootstrapper.GAController.trackEvent('non-interaction','promotion badge rotation',(index+1).toString(),true);}});}}
catch(e)
{Bootstrapper.reportException(e);}
Bootstrapper.dataObj.videoId='';setInterval(function()
{try
{if(window.myPlayer!=undefined)
{if(Bootstrapper.dataObj.videoId!=myPlayer.id)
{Bootstrapper.GAController.trackEvent('engagement','brandstory video start',(Bootstrapper.dataObj.brandstoryLabel+': '+Bootstrapper.dataObj.brandstoryIndex+': '+myPlayer.values.src.substring(myPlayer.values.src.lastIndexOf('/')+1)));myPlayer.addEvent("ended",function()
{try
{Bootstrapper.GAController.trackEvent('engagement','brandstory video complete',(Bootstrapper.dataObj.brandstoryLabel+': '+Bootstrapper.dataObj.brandstoryIndex+': '+myPlayer.values.src.substring(myPlayer.values.src.lastIndexOf('/')+1)));}
catch(e)
{Bootstrapper.reportException(e);}});Bootstrapper.dataObj.videoId=myPlayer.id;}}}
catch(e)
{Bootstrapper.reportException(e);}},500);var updateWtPhoneFinder=setInterval(function()
{if(window.webtrendsPhoneFinder)
{window.webtrendsPhoneFinder=function webtrendsPhoneFinder(productName,targetURL)
{dcsMultiTrack('WT.ti','Click Action','DCS.dcsuri','/vpv.click','WT.dl','40','DCSext.action','Home Page;Product Carousel;View Detail','DCSext.action_2','Home Page|Product Carousel|View Detail','WT.pn',productName,'WT.pn.id',productName,'DCS.dcsqry','','WT.pc','','WT.pn_sc','','WT.pn_id','','WT.pn_sku','','DCSext.brandstory','','WT.z_ac_destination_url','','WT.clip_n','','DCSext.clip_url','','DCSext.clip_template','','DCSext.clip_product','','WT.clip_ev','');}
clearInterval(updateWtPhoneFinder);}},100);}
catch(e)
{Bootstrapper.reportException(e);}});;}catch(e){Bootstrapper.reportException(e);};