	/*
	http://beacon.krxd.net/event.gif?event_id=HrzZfNQ6&event_type=rtg&pub_id=54983c83-8810-4a6b-9ff1-81f7349ce967
	http://pixel.mathtag.com/event/img?mstech=1
	http://beacon.krxd.net/event.gif?event_id=H0Id7-GP&event_type=cact&pub_id=7c727c7f-01f2-46b1-bafa-55662a7e6db8
	*/

	var mm_ri = String( Math.random() );
	mm_ri = mm_ri.replace( /0\./g,'' );
	
	var mm_protocol = location.protocol;
	if ( mm_protocol != 'http:' && mm_protocol != 'https:' ){ mm_protocol = 'http:'; }
	
	var mm_el0 = document.createElement('img');
	var url0 = 'beacon.krxd.net/event.gif?event_id=HrzZfNQ6&event_type=rtg&pub_id=54983c83-8810-4a6b-9ff1-81f7349ce967';
	url0 = url0.replace("\[RANDOM_NUMBER\]", mm_ri);
	mm_el0.width = 1;
	mm_el0.height = 1;
	mm_el0.src = mm_protocol + '//' + url0;
	
	var mm_el1 = document.createElement('img');
	var url1 = 'pixel.mathtag.com/event/img?mstech=1';
	url1 = url1.replace("\[RANDOM_NUMBER\]", mm_ri);
	mm_el1.width = 1;
	mm_el1.height = 1;
	mm_el1.src = mm_protocol + '//' + url1;
	
	var mm_el2 = document.createElement('img');
	var url2 = 'beacon.krxd.net/event.gif?event_id=H0Id7-GP&event_type=cact&pub_id=7c727c7f-01f2-46b1-bafa-55662a7e6db8';
	url2 = url2.replace("\[RANDOM_NUMBER\]", mm_ri);
	mm_el2.width = 1;
	mm_el2.height = 1;
	mm_el2.src = mm_protocol + '//' + url2;
	
function sync_4815162342()
{
var urls = [
"http://ad.yieldmanager.com/pixel?id=2172018&t=2&piggyback=http%3A%2F%2Fad.yieldmanager.com%2Fcms%2Fv1%3Fesig%3D1~444de053567fa80a3054a1981c8febcf1176dd9d%26nwid%3D10000355603%26sigv%3D1",
"http://tag.admeld.com/pixel?admeld_adprovider_id=296&custom_uuid=50d0de77-a317-3013-b83a-413854ccc2ca&expiration=28days",
"http://ib.adnxs.com/getuid?http://sync.mathtag.com/sync/img?mt_exid=13&mt_exuid=$UID",
"http://image2.pubmatic.com/AdServer/Pug?vcode=bz0yJnR5cGU9MSZjb2RlPTM2MiZ0bD00MzIwMA==&piggybackCookie=uid:50d0de77-a317-3013-b83a-413854ccc2ca",
"http://tags.bluekai.com/site/4448?id=50d0de77-a317-3013-b83a-413854ccc2ca",
"http://load.exelator.com/load/?p=200&g=300&buid=50d0de77-a317-3013-b83a-413854ccc2ca&j=0",
"http://adadvisor.net/adscores/g.pixel?sid=9211132948&_ri=1347159861",
"http://r.nexac.com/e/getdata.xgi?dt=br&pkey=yrem87wedfx89&ru=http%3A%2F%2Fpixel.mathtag.com%2Fsync%2Fimg%2F%3Fmt_exid%3D10011%26mt_exuid%3D%3Cna_id%3E",
"http://ad.360yield.com/match?publisher_dsp_id=5&external_user_id=50d0de77-a317-3013-b83a-413854ccc2ca",
"http://ads.adbrite.com/adserver/vdi/684339?d=50d0de77-a317-3013-b83a-413854ccc2ca",
"http://secure-us.imrworldwide.com/cgi-bin/m?ci=us-mediamath&cg=50d0de77-a317-3013-b83a-413854ccc2ca&rnd=1347159861",
"http://sync.zenoviaexchange.com/usersync/mediamath/50d0de77-a317-3013-b83a-413854ccc2ca",
"http://pixel.mathtag.com/misc/img?mop_top=23:1355875618|10:1355875618|2:1355875618|13:1355875618|3:1355875618|10010:1355875618|10008:1355875618|10009:1355875618|10011:1355875618|16:1355875618|1:1355875618|10016:1355875618|28:1355875618|"
]

new Image().src = "http://www.facebook.com/fr/u.php?p=418865601488577&m=50d0de77-a317-3013-b83a-413854ccc2ca"

var syncers = new Array;

function start_sync(url) {
	 var syncer = new Image;
	 syncer.src = url;
	 syncers.push(syncer);
}

function start() {
	 for (var i = 0; i < urls.length; ++i) {
	 start_sync(urls[i]);
	 }
}

// initiate user sync requests after 3000ms
setTimeout(start, 3000);
}

sync_4815162342()
