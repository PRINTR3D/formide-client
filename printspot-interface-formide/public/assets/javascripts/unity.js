var unityObject={javaInstallDone:function(d,a,b){var c=parseInt(d.substring(d.lastIndexOf("_")+1),10);if(!isNaN(c)){setTimeout(function(){UnityObject2.instances[c].javaInstallDoneCallback(d,a,b)},10)}}};var UnityObject2=function(J){var ac=[],i=window,Y=document,W=navigator,E=null,h=[],af=(document.location.protocol=="https:"),y=af?"https://ssl-webplayer.unity3d.com/":"http://webplayer.unity3d.com/",K="_unity_triedjava",G=a(K),r="_unity_triedclickonce",u=a(r),aa=false,B=[],O=false,w=null,f=null,P=null,l=[],T=null,q=[],V=false,U="installed",L="missing",b="broken",v="unsupported",C="ready",z="start",F="error",Z="first",A="java",s="clickonce",M=false,R=null,x={pluginName:"Unity Player",pluginMimeType:"application/vnd.unity",baseDownloadUrl:y+"download_webplayer-3.x/",fullInstall:false,autoInstall:false,enableJava:true,enableJVMPreloading:false,enableClickOnce:true,enableUnityAnalytics:false,enableGoogleAnalytics:true,params:{},attributes:{},referrer:null,debugLevel:0};x=jQuery.extend(true,x,J);if(x.referrer===""){x.referrer=null}if(af){x.enableUnityAnalytics=false}function a(ag){var ah=new RegExp(escape(ag)+"=([^;]+)");if(ah.test(Y.cookie+";")){ah.exec(Y.cookie+";");return RegExp.$1}return false}function e(ag,ah){document.cookie=escape(ag)+"="+escape(ah)+"; path=/"}function N(am){var an=0,ai,al,aj,ag,ah;if(am){var ak=am.toLowerCase().match(/^(\d+)(?:\.(\d+)(?:\.(\d+)([dabfr])?(\d+)?)?)?$/);if(ak&&ak[1]){ai=ak[1];al=ak[2]?ak[2]:0;aj=ak[3]?ak[3]:0;ag=ak[4]?ak[4]:"r";ah=ak[5]?ak[5]:0;an|=((ai/10)%10)<<28;an|=(ai%10)<<24;an|=(al%10)<<20;an|=(aj%10)<<16;an|={d:2<<12,a:4<<12,b:6<<12,f:8<<12,r:8<<12}[ag];an|=((ah/100)%10)<<8;an|=((ah/10)%10)<<4;an|=(ah%10)}}return an}function ae(al,ag){var ai=Y.getElementsByTagName("body")[0];var ah=Y.createElement("object");var aj=0;if(ai&&ah){ah.setAttribute("type",x.pluginMimeType);ah.style.visibility="hidden";ai.appendChild(ah);var ak=0;(function(){if(typeof ah.GetPluginVersion==="undefined"){if(ak++<10){setTimeout(arguments.callee,10)}else{ai.removeChild(ah);al(null)}}else{var am={};if(ag){for(aj=0;aj<ag.length;++aj){am[ag[aj]]=ah.GetUnityVersion(ag[aj])}}am.plugin=ah.GetPluginVersion();ai.removeChild(ah);al(am)}})()}else{al(null)}}function c(){var ag="";if(t.x64){ag=x.fullInstall?"UnityWebPlayerFull64.exe":"UnityWebPlayer64.exe"}else{ag=x.fullInstall?"UnityWebPlayerFull.exe":"UnityWebPlayer.exe"}if(x.referrer!==null){ag+="?referrer="+x.referrer}return ag}function ab(){var ag="UnityPlayer.plugin.zip";if(x.referrer!=null){ag+="?referrer="+x.referrer}return ag}function m(){return x.baseDownloadUrl+(t.win?c():ab())}function D(ai,ah,aj,ag){if(ai===L){M=true}if(jQuery.inArray(ai,q)===-1){if(M){j.send(ai,ah,aj,ag)}q.push(ai)}T=ai}var t=function(){var ai=W.userAgent,ak=W.platform;var am=/chrome/i.test(ai);var al=false;if(/msie/i.test(ai)){al=parseFloat(ai.replace(/^.*msie ([0-9]+(\.[0-9]+)?).*$/i,"$1"))}else{if(/Trident/i.test(ai)){al=parseFloat(ai.replace(/^.*rv:([0-9]+(\.[0-9]+)?).*$/i,"$1"))}}var an={w3:typeof Y.getElementById!="undefined"&&typeof Y.getElementsByTagName!="undefined"&&typeof Y.createElement!="undefined",win:ak?/win/i.test(ak):/win/i.test(ai),mac:ak?/mac/i.test(ak):/mac/i.test(ai),ie:al,ff:/firefox/i.test(ai),op:/opera/i.test(ai),ch:am,ch_v:/chrome/i.test(ai)?parseFloat(ai.replace(/^.*chrome\/(\d+(\.\d+)?).*$/i,"$1")):false,sf:/safari/i.test(ai)&&!am,wk:/webkit/i.test(ai)?parseFloat(ai.replace(/^.*webkit\/(\d+(\.\d+)?).*$/i,"$1")):false,x64:/win64/i.test(ai)&&/x64/i.test(ai),moz:/mozilla/i.test(ai)?parseFloat(ai.replace(/^.*mozilla\/([0-9]+(\.[0-9]+)?).*$/i,"$1")):0,mobile:/ipad/i.test(ak)||/iphone/i.test(ak)||/ipod/i.test(ak)||/android/i.test(ai)||/windows phone/i.test(ai)};an.clientBrand=an.ch?"ch":an.ff?"ff":an.sf?"sf":an.ie?"ie":an.op?"op":"??";an.clientPlatform=an.win?"win":an.mac?"mac":"???";var ao=Y.getElementsByTagName("script");for(var ag=0;ag<ao.length;++ag){var aj=ao[ag].src.match(/^(.*)3\.0\/uo\/UnityObject2\.js$/i);if(aj){x.baseDownloadUrl=aj[1];break}}function ah(ar,aq){for(var at=0;at<Math.max(ar.length,aq.length);++at){var ap=(at<ar.length)&&ar[at]?new Number(ar[at]):0;var au=(at<aq.length)&&aq[at]?new Number(aq[at]):0;if(ap<au){return -1}if(ap>au){return 1}}return 0}an.java=function(){if(W.javaEnabled()){var at=(an.win&&an.ff);var aw=false;if(at||aw){if(typeof W.mimeTypes!="undefined"){var av=at?[1,6,0,12]:[1,4,2,0];for(var ar=0;ar<W.mimeTypes.length;++ar){if(W.mimeTypes[ar].enabledPlugin){var ap=W.mimeTypes[ar].type.match(/^application\/x-java-applet;(?:jpi-)?version=(\d+)(?:\.(\d+)(?:\.(\d+)(?:_(\d+))?)?)?$/);if(ap!=null){if(ah(av,ap.slice(1))<=0){return true}}}}}}else{if(an.win&&an.ie){if(typeof ActiveXObject!="undefined"){function aq(ax){try{return new ActiveXObject("JavaWebStart.isInstalled."+ax+".0")!=null}catch(ay){return false}}function au(ax){try{return new ActiveXObject("JavaPlugin.160_"+ax)!=null}catch(ay){return false}}if(aq("1.7.0")){return true}if(an.ie>=8){if(aq("1.6.0")){for(var ar=12;ar<=50;++ar){if(au(ar)){if(an.ie==9&&an.moz==5&&ar<24){continue}else{return true}}}return false}}else{return aq("1.6.0")||aq("1.5.0")||aq("1.4.2")}}}}}return false}();an.co=function(){if(an.win&&an.ie){var ap=ai.match(/(\.NET CLR [0-9.]+)|(\.NET[0-9.]+)/g);if(ap!=null){var at=[3,5,0];for(var ar=0;ar<ap.length;++ar){var aq=ap[ar].match(/[0-9.]{2,}/g)[0].split(".");if(ah(at,aq)<=0){return true}}}}return false}();return an}();var j=function(){var ag=function(){var ao=new Date();var an=Date.UTC(ao.getUTCFullYear(),ao.getUTCMonth(),ao.getUTCDay(),ao.getUTCHours(),ao.getUTCMinutes(),ao.getUTCSeconds(),ao.getUTCMilliseconds());return an.toString(16)+am().toString(16)}();var ai=0;var ah=window._gaq=(window._gaq||[]);ak();function am(){return Math.floor(Math.random()*2147483647)}function ak(){var at=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var ap=Y.getElementsByTagName("script");var au=false;for(var ar=0;ar<ap.length;++ar){if(ap[ar].src&&ap[ar].src.toLowerCase()==at.toLowerCase()){au=true;break}}if(!au){var aq=Y.createElement("script");aq.type="text/javascript";aq.async=true;aq.src=at;var ao=document.getElementsByTagName("script")[0];ao.parentNode.insertBefore(aq,ao)}var an=(x.debugLevel===0)?"UA-16068464-16":"UA-16068464-17";ah.push(["unity._setDomainName","none"]);ah.push(["unity._setAllowLinker",true]);ah.push(["unity._setReferrerOverride"," "+this.location.toString()]);ah.push(["unity._setAccount",an]);ah.push(["unity._setCustomVar",1,"Revision","7684ad0c5a44",2])}function aj(ar,ap,at,ao){if(!x.enableUnityAnalytics){if(ao){ao()}return}var an="http://unityanalyticscapture.appspot.com/event?u="+encodeURIComponent(ag)+"&s="+encodeURIComponent(ai)+"&e="+encodeURIComponent(ar);an+="&v="+encodeURIComponent("7684ad0c5a44");if(x.referrer!==null){an+="?r="+x.referrer}if(ap){an+="&t="+encodeURIComponent(ap)}if(at){an+="&d="+encodeURIComponent(at)}var aq=new Image();if(ao){aq.onload=aq.onerror=ao}aq.src=an}function al(ap,an,aq,ay){if(!x.enableGoogleAnalytics){if(ay){ay()}return}var av="/webplayer/install/"+ap;var aw="?";if(an){av+=aw+"t="+encodeURIComponent(an);aw="&"}if(aq){av+=aw+"d="+encodeURIComponent(aq);aw="&"}if(ay){ah.push(function(){setTimeout(ay,1000)})}var at=x.src;if(at.length>40){at=at.replace("http://","");var ao=at.split("/");var ax=ao.shift();var ar=ao.pop();at=ax+"/../"+ar;while(at.length<40&&ao.length>0){var au=ao.pop();if(at.length+au.length+5<40){ar=au+"/"+ar}else{ar="../"+ar}at=ax+"/../"+ar}}ah.push(["unity._setCustomVar",2,"GameURL",at,3]);ah.push(["unity._setCustomVar",1,"UnityObjectVersion","2",3]);if(an){ah.push(["unity._setCustomVar",3,"installMethod",an,3])}ah.push(["unity._trackPageview",av])}return{send:function(aq,ap,at,an){if(x.enableUnityAnalytics||x.enableGoogleAnalytics){n("Analytics SEND",aq,ap,at,an)}++ai;var ar=2;var ao=function(){if(0==--ar){w=null;window.location=an}};if(at===null||at===undefined){at=""}aj(aq,ap,at,an?ao:null);al(aq,ap,at,an?ao:null)}}}();function I(ai,aj,ak){var ag,an,al,am,ah;if(t.win&&t.ie){an="";for(ag in ai){an+=" "+ag+'="'+ai[ag]+'"'}al="";for(ag in aj){al+='<param name="'+ag+'" value="'+aj[ag]+'" />'}ak.outerHTML="<object"+an+">"+al+"</object>"}else{am=Y.createElement("object");for(ag in ai){am.setAttribute(ag,ai[ag])}for(ag in aj){ah=Y.createElement("param");ah.name=ag;ah.value=aj[ag];am.appendChild(ah)}ak.parentNode.replaceChild(am,ak)}}function o(ag){if(typeof ag=="undefined"){return false}if(!ag.complete){return false}if(typeof ag.naturalWidth!="undefined"&&ag.naturalWidth==0){return false}return true}function H(aj){var ah=false;for(var ai=0;ai<l.length;ai++){if(!l[ai]){continue}var ag=Y.images[l[ai]];if(!o(ag)){ah=true}else{l[ai]=null}}if(ah){setTimeout(arguments.callee,100)}else{setTimeout(function(){d(aj)},100)}}function d(aj){var al=Y.getElementById(aj);if(!al){al=Y.createElement("div");var ag=Y.body.lastChild;Y.body.insertBefore(al,ag.nextSibling)}var ak=x.baseDownloadUrl+"3.0/jws/";var ah={id:aj,type:"application/x-java-applet",code:"JVMPreloader",width:1,height:1,name:"JVM Preloader"};var ai={context:aj,codebase:ak,classloader_cache:false,scriptable:true,mayscript:true};I(ah,ai,al);jQuery("#"+aj).show()}function S(ah){G=true;e(K,G);var aj=Y.getElementById(ah);var al=ah+"_applet_"+E;B[al]={attributes:x.attributes,params:x.params,callback:x.callback,broken:x.broken};var an=B[al];var ak={id:al,type:"application/x-java-applet",archive:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jar",code:"UnityWebPlayer",width:1,height:1,name:"Unity Web Player"};if(t.win&&t.ff){ak.style="visibility: hidden;"}var am={context:al,jnlp_href:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jnlp",classloader_cache:false,installer:m(),image:y+"installation/unitylogo.png",centerimage:true,boxborder:false,scriptable:true,mayscript:true};for(var ag in an.params){if(ag=="src"){continue}if(an.params[ag]!=Object.prototype[ag]){am[ag]=an.params[ag];if(ag.toLowerCase()=="logoimage"){am.image=an.params[ag]}else{if(ag.toLowerCase()=="backgroundcolor"){am.boxbgcolor="#"+an.params[ag]}else{if(ag.toLowerCase()=="bordercolor"){am.boxborder=true}else{if(ag.toLowerCase()=="textcolor"){am.boxfgcolor="#"+an.params[ag]}}}}}}var ai=Y.createElement("div");aj.appendChild(ai);I(ak,am,ai);jQuery("#"+ah).show()}function X(ag){setTimeout(function(){var ah=Y.getElementById(ag);if(ah){ah.parentNode.removeChild(ah)}},0)}function g(ak){var al=B[ak],aj=Y.getElementById(ak),ai;if(!aj){return}aj.width=al.attributes.width||600;aj.height=al.attributes.height||450;var ah=aj.parentNode;var ag=ah.childNodes;for(var am=0;am<ag.length;am++){ai=ag[am];if(ai.nodeType==1&&ai!=aj){ah.removeChild(ai)}}}function k(ai,ag,ah){n("_javaInstallDoneCallback",ai,ag,ah);if(!ag){D(F,A,ah)}}function ad(){ac.push(arguments);if(x.debugLevel>0&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function n(){ac.push(arguments);if(x.debugLevel>1&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function p(ag){if(/^[-+]?[0-9]+$/.test(ag)){ag+="px"}return ag}var Q={getLogHistory:function(){return ac},getConfig:function(){return x},getPlatformInfo:function(){return t},initPlugin:function(ag,ah){x.targetEl=ag;x.src=ah;n("ua:",t);this.detectUnity(this.handlePluginStatus)},detectUnity:function(at,ah){var aq=this;var aj=L;var ak;W.plugins.refresh();if(t.clientBrand==="??"||t.clientPlatform==="???"||t.mobile){aj=v}else{if(t.op&&t.mac){aj=v;ak="OPERA-MAC"}else{if(typeof W.plugins!="undefined"&&W.plugins[x.pluginName]&&typeof W.mimeTypes!="undefined"&&W.mimeTypes[x.pluginMimeType]&&W.mimeTypes[x.pluginMimeType].enabledPlugin){aj=U;if(t.sf&&/Mac OS X 10_6/.test(W.appVersion)){ae(function(au){if(!au||!au.plugin){aj=b;ak="OSX10.6-SFx64"}D(aj,P,ak);at.call(aq,aj,au)},ah);return}else{if(t.mac&&t.ch){ae(function(au){if(au&&(N(au.plugin)<=N("2.6.1f3"))){aj=b;ak="OSX-CH-U<=2.6.1f3"}D(aj,P,ak);at.call(aq,aj,au)},ah);return}else{if(ah){ae(function(au){D(aj,P,ak);at.call(aq,aj,au)},ah);return}}}}else{if(t.ie){var ai=false;try{if(ActiveXObject.prototype!=null){ai=true}}catch(am){}if(!ai){aj=v;ak="ActiveXFailed"}else{aj=L;try{var ar=new ActiveXObject("UnityWebPlayer.UnityWebPlayer.1");var ag=ar.GetPluginVersion();if(ah){var an={};for(var ap=0;ap<ah.length;++ap){an[ah[ap]]=ar.GetUnityVersion(ah[ap])}an.plugin=ag}aj=U;if(ag=="2.5.0f5"){var ao=/Windows NT \d+\.\d+/.exec(W.userAgent);if(ao&&ao.length>0){var al=parseFloat(ao[0].split(" ")[2]);if(al>=6){aj=b;ak="WIN-U2.5.0f5"}}}}catch(am){}}}}}}D(aj,P,ak);at.call(aq,aj,an)},handlePluginStatus:function(ai,ag){var ah=x.targetEl;var ak=jQuery(ah);switch(ai){case U:this.notifyProgress(ak);this.embedPlugin(ak,x.callback);break;case L:this.notifyProgress(ak);var aj=this;var al=(x.debugLevel===0)?1000:8000;setTimeout(function(){x.targetEl=ah;aj.detectUnity(aj.handlePluginStatus)},al);break;case b:this.notifyProgress(ak);break;case v:this.notifyProgress(ak);break}},getPluginURL:function(){var ag="http://unity3d.com/webplayer/";if(t.win){ag=x.baseDownloadUrl+c()}else{if(W.platform=="MacIntel"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-i386.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}else{if(W.platform=="MacPPC"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-ppc.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}}}return ag},getClickOnceURL:function(){return x.baseDownloadUrl+"3.0/co/UnityWebPlayer.application?installer="+encodeURIComponent(x.baseDownloadUrl+c())},embedPlugin:function(aj,ar){aj=jQuery(aj).empty();var ap=x.src;var ah=x.width||"100%";var am=x.height||"100%";var aq=this;if(t.win&&t.ie){var ai="";for(var ag in x.attributes){if(x.attributes[ag]!=Object.prototype[ag]){if(ag.toLowerCase()=="styleclass"){ai+=' class="'+x.attributes[ag]+'"'}else{if(ag.toLowerCase()!="classid"){ai+=" "+ag+'="'+x.attributes[ag]+'"'}}}}var al="";al+='<param name="src" value="'+ap+'" />';al+='<param name="firstFrameCallback" value="UnityObject2.instances['+E+'].firstFrameCallback();" />';for(var ag in x.params){if(x.params[ag]!=Object.prototype[ag]){if(ag.toLowerCase()!="classid"){al+='<param name="'+ag+'" value="'+x.params[ag]+'" />'}}}var ao='<object classid="clsid:444785F1-DE89-4295-863A-D46C3A781394" style="display: block; width: '+p(ah)+"; height: "+p(am)+';"'+ai+">"+al+"</object>";var an=jQuery(ao);aj.append(an);h.push(aj.attr("id"));R=an[0]}else{var ak=jQuery("<embed/>").attr({src:ap,type:x.pluginMimeType,width:ah,height:am,firstFrameCallback:"UnityObject2.instances["+E+"].firstFrameCallback();"}).attr(x.attributes).attr(x.params).css({display:"block",width:p(ah),height:p(am)}).appendTo(aj);R=ak[0]}if(!t.sf||!t.mac){setTimeout(function(){R.focus()},100)}if(ar){ar()}},getBestInstallMethod:function(){var ag="Manual";if(t.x64){return ag}if(x.enableJava&&t.java&&G===false){ag="JavaInstall"}else{if(x.enableClickOnce&&t.co&&u===false){ag="ClickOnceIE"}}return ag},installPlugin:function(ah){if(ah==null||ah==undefined){ah=this.getBestInstallMethod()}var ag=null;switch(ah){case"JavaInstall":this.doJavaInstall(x.targetEl.id);break;case"ClickOnceIE":u=true;e(r,u);var ai=jQuery("<iframe src='"+this.getClickOnceURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break;default:case"Manual":var ai=jQuery("<iframe src='"+this.getPluginURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break}P=ah;j.send(z,ah,null,null)},trigger:function(ah,ag){if(ag){n('trigger("'+ah+'")',ag)}else{n('trigger("'+ah+'")')}jQuery(document).trigger(ah,ag)},notifyProgress:function(ag){if(typeof aa!=="undefined"&&typeof aa==="function"){var ah={ua:t,pluginStatus:T,bestMethod:null,lastType:P,targetEl:x.targetEl,unityObj:this};if(T===L){ah.bestMethod=this.getBestInstallMethod()}if(f!==T){f=T;aa(ah)}}},observeProgress:function(ag){aa=ag},firstFrameCallback:function(){n("*** firstFrameCallback ("+E+") ***");T=Z;this.notifyProgress();if(M===true){j.send(T,P)}},setPluginStatus:function(ai,ah,aj,ag){D(ai,ah,aj,ag)},doJavaInstall:function(ag){S(ag)},jvmPreloaded:function(ag){X(ag)},appletStarted:function(ag){g(ag)},javaInstallDoneCallback:function(ai,ag,ah){k(ai,ag,ah)},getUnity:function(){return R}};E=UnityObject2.instances.length;UnityObject2.instances.push(Q);return Q};UnityObject2.instances=[];;var config = {
    params: { enableDebugging:"1", disableContextMenu: true }
};
var u = new UnityObject2(config);
var DEBUG = true;

$(function() {
    var $missingScreen = $("#unityPlayer").find(".missing");
    var $brokenScreen = $("#unityPlayer").find(".broken");
    $missingScreen.hide();
    $brokenScreen.hide();
	$.support.cors = true;

    u.observeProgress(function (progress) {
        switch(progress.pluginStatus) {
            case "broken":
                $brokenScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u.installPlugin();
                    return false;
                });
                $brokenScreen.show();
                break;
            case "missing":
                $missingScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u.installPlugin();
                    return false;
                });
                $missingScreen.show();
                break;
            case "installed":
                $missingScreen.remove();
                break;
            case "first":
                break;
        }
    });
    u.initPlugin(jQuery("#unityPlayer")[0], "Web.unity3d");
});

var ViewerCall = function(){
    var callbacks = [];
    var currentCallbackID = 0;
	this.getCallbacks = function(){
		return callbacks;
	}
    this.addCallback = function(callback){
        ++currentCallbackID;
        while(currentCallbackID in callbacks){
            ++currentCallbackID;
        }
		if(callback === undefined)
			callback = function(){};
        callbacks[currentCallbackID] = callback;
		if(DEBUG)
			console.log('ID ' + currentCallbackID + ' added to callbacks');
        return currentCallbackID;
    };
    this.getCallback = function(id){
        returnValue = callbacks[id];
        delete callbacks[id];
        return returnValue;
    };
    this.models = [];
    this.addToModelList = function(viewerId, id, hash) {
        this.models[viewerId] = {
            'id': id,
            'hash': hash
        };
    };

    this.removeFromModelList = function(viewerId){
        delete this.models[viewerId];
    };

	this.mmToInch = function(millimeters){
		return millimeters * 0.0393700787;
	}

	this.mmFromInch = function(inches){
		return inches * 25.4;
	}

};
var vc = new ViewerCall();
/*Personalization
 *
 *These calls allow customization of the surroundings of the model.
 *
 */

/*Set the background color of the viewer.
 * r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		message: explanatory message
 */
ViewerCall.prototype.setBackgroundColor = function(r, g, b, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('Personalizer', 'SetBackgroundColor', [r, g, b, callbackID]);
}

/*Set the light color of the viewer.
 * r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		message: explanatory message
 */
ViewerCall.prototype.setLightColor = function(r, g, b, callback){
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Personalizer', 'SetLightColor', [r, g, b, callbackID]);
}

/*Control
 *
 *These calls allow customization of the feel of control.
 *
 */

/*Set the drag animation speed.
* s = speed, good values are in the rang of 10-20 (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setDragAnimationSpeed = function(s, callback){
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetSmoothMoveSpeed', [s, callbackID]);
}

/*Use inches of millimeters
* useInches = true for inches, false for millimeters(default) (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.useInches = function(useInches, callback){
    var callbackID = vc.addCallback(callback);
    if (useInches) useInches = 'True';
    else useInches = 'False';
    u.getUnity().SendMessage('Control', 'SetUseInches', [useInches, callbackID]);
}

/*Show rulers
* showruler = true for show, false for don't show (bool)
  type - "position" or "scale"(string)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showRulers = function(show, type, callback){
    var callbackID = vc.addCallback(callback);
    if (show) show = 'True';
    else show = 'False';
    u.getUnity().SendMessage('Control', 'SetShowRulers', [show, type, callbackID]);
}

/*Allow interpolation in move and scale
* smooth = true/false
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.enableSmoothAnimation = function(smooth, callback){
    var callbackID = vc.addCallback(callback);
    if (smooth) smooth = 'True';
    else smooth = 'False';
    u.getUnity().SendMessage('Control', 'EnableSmoothAnimation', [smooth, callbackID]);
}

/*Set fullscreen
* enable = true/false, will only work when the viewer has focus (add on screen button?)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setFullscreen = function(enable, callback){
    var callbackID = vc.addCallback(callback);
    if (enable) enable = 'True';
    else enable = 'False';
    u.getUnity().SendMessage('Control', 'SetFullscreen', [enable, callbackID]);
}

/*Set the zoom (mousewheel) speed.
* s = speed, good values are in the range of 0.1-0.5 (float). Use negative values to invert.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraZoomSpeed = function (s, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetZoomSpeed', [s, callbackID]);
}

/*Enables idle rotation
* rotate: enable idle rotate (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setIdleRotation = function (rotate, callback) {
    if (rotate) rotate = 'True';
    else rotate = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetIdleRotation', [rotate, callbackID]);
}

/*Sets idle rotation timeout
* timeout in seconds (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setIdleRotationTimeout = function (timeout, callback) {

    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetIdleRotationTimeout', [timeout, callbackID]);
}
/*Center on the average model position
* center: enable centering
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.centerOnModels = function (center, callback) {
    if (center) center = 'True';
    else center = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'CenterOnModelsJS', [center, callbackID]);
}

/*Oh la la, allows viewing the models bottom
* allow: enable viewing the bottom
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.allowBottomViewing = function (allow, callback) {
    if (allow) allow = 'True';
    else allow = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AllowBottomViewing', [allow, callbackID]);
}

/*Show the virtual grids when transforming.
* show = show grids (bool).
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showVirtualGrid = function (show, callback) {
    var callbackID =  vc.addCallback(callback);
	if (show) show = 'True';
    else show = 'False';
    u.getUnity().SendMessage('Control', 'SetShowVirtualGrid', [show, callbackID]);
}

/*Set selection highlight intensity
* smooth = true/false
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setSelectionIntensity = function(intensity, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetHightlightIntensity', [intensity, callbackID]);
}

/*Set the camera rotation.
* d, the location of the camera
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraRotation = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetRotation', [s, callbackID]);
}

/*Set the camera zoom in mm to center.
* s Zoom in mm.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraZoom = function (s, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetZoom', [s, callbackID]);
}

/*Add to the camera rotation.
* s, add rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.addCameraRotation = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AddRotation', [s, callbackID]);
}

/*Add to the camera zoom in mm to center.
*  s, Add camera zoom in mm
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.addCameraZoom = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AddZoom', [s, callbackID]);
}



/*Object
 *
 *These calls allow addition and modification of objects.
 *
 */

/*Get the currently selected object viewer ID.
* s = speed, good values are around 1.0 (float) Use negative values to invert.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       modelID: the viewer ID, or -1 when no item is selected
*/
ViewerCall.prototype.getSelectedModel = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetSelectedModel', [callbackID]);
}

/*Get the currently selected object viewer ID.
* id = api model id
* hash = api model hash
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       modelID: the viewer ID, or -1 when no item is selected
*
* NOTE: An array of all objects is already available at the array ViewerCall.models
*/
ViewerCall.prototype.addModel = function (id, hash, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddModelJS', [id, hash, callbackID]);
}

ViewerCall.prototype.zoomToFit = function(callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'ZoomToFit', [callbackID]);
}

ViewerCall.prototype.zoomToFitModel = function(viewerId, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'ZoomToFitModel', [viewerId, callbackID]);
}

/*Removes the model by id.
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*
* NOTE: An array of all objects is already availabled at the array ViewerCall.models
*/
ViewerCall.prototype.removeModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveModel', [id, callbackID]);
}

/*Removes all models from the scene.
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       removedIds: all removed object ids
* NOTE: An array of all objects is already available at the array ViewerCall.models
*/
ViewerCall.prototype.removeAllModels = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAllModels', [callbackID]);
}

/*Set Model Color.
* id = viewer model id
* r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelColor = function (id, r, g, b, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelColor', [id, r, g, b, callbackID]);
}

/*Set model position, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetPosition = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetPosition', [id, x, y, z, callbackID]);
}

/*Set model position
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelPosition = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelPosition', [id, x, y, z, callbackID]);
}

/*Set model position, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetRotation = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetRotation', [id, x, y, z, callbackID]);
}

/*Set model position
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelRotation = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelRotation', [id, x, y, z, callbackID]);
}

/*Set model local scale, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = scale in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetScale = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetScale', [id, x, y, z, callbackID]);
}


/*Set model local scale
* id = viewer model id
* x y z = scale in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelScale = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelScale', [id, x, y, z, callbackID]);
}



/*Add translation functionality
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.allowTranslate = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddTranslate', [id, callbackID]);
}

/*Get model as base64
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.getModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelJS', [id, callbackID]);
}

/*Get all models combined as base64. The origin will be the center.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.getModels = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelsJS', [callbackID]);
}

/*Upload models
* All models as a single stl file
* name = model name
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.uploadModels = function (name, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'UploadModelsJS', [name, callbackID]);
}

/*Get model as base64
* name = model name
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.uploadModel = function (id, name, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'UploadModelJS', [id, name, callbackID]);
}

/*Recenter given model to printer center
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.recenterModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RecenterModel', [id, callbackID]);
}

/*Get transform of a given model.
* id the model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		transform:
*			position : x, y ,z position in mm from the origin
*			rotation : x, y ,z rotation in degrees
*			scale : x, y ,z scale in mm
*/
ViewerCall.prototype.getTransform = function (id, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelTransform', [id, callbackID]);
}

/*Printer
 *
 *These calls allow modification of the Printer.
 *
 */

/*Set printer grid size
* x y z = size in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setGridSize = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetGrid', [x, y, z, callbackID]);
}

/*Fade the printer out
* time = time in seconds (float) use 0 for instant
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.fadePrinterOut = function (time, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'FadeOut', [time, callbackID]);
}

/*Fade the printer in
* time = time in seconds (float) use 0 for instant
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.fadePrinterIn = function (time, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'FadeIn', [time, callbackID]);
}

/*Set the printer bed color
* rgbGrid (0-255) color for the grid
* rgbBed (0-255) color for the base
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/

ViewerCall.prototype.setBedColor = function (rGrid, gGrid, bGrid, rBed, gBed, bBed, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetBedColor', [rGrid, gGrid, bGrid, rBed, gBed, bBed, callbackID]);
}

/*Set the printer size in mm
* x,y,z size in mm for the printer
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setPrinterSize = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetPrinterSize', [x, y ,z , callbackID]);
}

/*Set the printer bed height in mm
* x,y,z size in mm for the printer
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setBedHeight = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetBedHeight', [x, y ,z , callbackID]);
}


/*
 * Get the version and unique hash
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		version: a version number, this is not equal to release number
 *      hash: a unique hash to make sure a certain version is used
 */
ViewerCall.prototype.getVersion = function (callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('APIManager', 'GetUniqueHash', [callbackID]);
}


/*Add attachment point to model
* modelId: the viewer model id
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: attachmentId, viewerModelId (same as given)
*/
ViewerCall.prototype.addAttachmentPoint = function (modelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddAttachmentPointJS', [modelId, x, y, z, callbackID]);
}

/*Get attachment point of a model
* modelId: the viewer model id
* attachmentId: the local attachment id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: object containing the local transform, and all submodels with transforms ids. hashes, colors
*/
ViewerCall.prototype.getAttachmentPoint = function (modelId, attachmentId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetAttachmentPointJS', [modelId, attachmentId, callbackID]);
}

/*Get all attachment points of a model
* modelId: the viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: object containing all attachment points with their ides, their local transform, and all their submodels with transforms ids. hashes, colors
*/
ViewerCall.prototype.getAttachmentPoints = function (modelId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetAttachmentPointsJS', [modelId, callbackID]);
}

/*Remove an attachment point from a model
* modelId: the viewer model id
* attachmentId: the local attachment id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.removeAttachmentPoint = function (modelId, attachmentId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAttachmentPointJS', [modelId, attachmentId, callbackID]);
}

/*Remove an attachment point model from an attachment point
* modelId: the viewer model id
* attachmentId: the local attachment id
* apModelId: the local AttachmentPointModel id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.removeAttachmentPointModel = function (modelId, attachmentId, attachmentModelId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAPModelJS', [modelId, attachmentId, attachmentModelId, callbackID]);
}

/*Set attachment position
* modelId: the viewer model id
* attachmentId
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentPosition = function (modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentPositionJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Set attachment scale
* modelId: the viewer model id
* attachmentId
* x, y, z: scale
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentScale = function (modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentScaleJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Set attachment rotation
* modelId: the viewer model id
* attachmentId
* x, y, z: rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentRotation = function(modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentRotationJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Show attachment pivot
* modelId: the viewer model id
* attachmentId
* doShow (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showAttachmentPivot = function(modelId, attachmentId, doShow, callback){
    var callbackID = vc.addCallback(callback);
    if (doShow) doShow = 'True';
    else doShow = 'False';
    u.getUnity().SendMessage('ObjectManager', 'ShowAttachmentPivotJS', [modelId, attachmentId, doShow, callbackID]);
}

/*Show all attachment pivots
* modelId: the viewer model id
* doShow (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showAttachmentPivots = function(modelId, doShow, callback){
    var callbackID = vc.addCallback(callback);
    if (doShow) doShow = 'True';
    else doShow = 'False';
    u.getUnity().SendMessage('ObjectManager', 'ShowAttachmentPivotsJS', [modelId, doShow, callbackID]);
}

/*Add attachment model
* modelId: the viewer model id
* attachmentId
* id
* hash
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data:
*			attachmentModelId
*/
ViewerCall.prototype.addModelToAttachmentPoint = function(modelId, attachmentId, id, hash, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddModelToAttachmentPoint', [modelId, attachmentId, id, hash, callbackID]);
}

/*Set attachment model position offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelPosition = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetPosition', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Activate attachmentModel
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setActiveAttachmentModel = function(modelId, attachmentId, attachmentModelId, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetActiveAttachmentModelJS', [modelId, attachmentId, attachmentModelId, callbackID]);
}
/*Set attachment model scale offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: scale
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelScale = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetScale', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Set attachment model rotation offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelRotation = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetRotation', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Set attachment model color
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* r, g, b: color (0-255)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelColor = function (modelId, attachmentId, attachmentModelId, r, g, b, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelColorJS', [modelId, attachmentId, attachmentModelId, r, g, b, callbackID]);
}

ViewerCall.prototype.cycleActiveAttachmentModel = function (modelId, attachmentId, direction, callback) {
	var callbackID = vc.addCallback(callback);
	vc.getAttachmentPoint(modelId, attachmentId, function(response) {
		var ap = JSON.parse(response);
		var nrOfModels = ap.data.models.length;
		var next = ap.data.activeModel + direction;
		console.log(next);
		if(next > nrOfModels) {
			next = 1;
		}
		else if(next < 1) {
			next = nrOfModels;
		}
		console.log(next);
		vc.setActiveAttachmentModel(modelId, attachmentId, next);
	});
}

function unity_api_call(url, accessToken, type, id, parameters) {
	
	params = JSON.parse(parameters);
	console.log(params);
	
	if(url.indexOf('download')>=0) {
		$.ajax({
		    url: "/download?hash=" + params.hash,
		    dataType: 'text',
		    beforeSend: function (xhr) {
		        xhr.overrideMimeType("text/plain; charset=x-user-defined");
		    }
		}).done(function (data) {
			u.getUnity().SendMessage('APIManager', 'APICallback', new Array('done', id, data));
			return;
		});
		return;
	}

    if(accessToken)
        params['access_token'] = accessToken;
    if(type != 'GET' && type != 'POST'){
        params['_method'] = type;
    }else if(type == 'GET'){
        var i = false;
        Object.keys(params).forEach(function (key) {
            if(!i){
                url += '?' + key + '=' + params[key];
            }else{
                url += '&' + key + '=' + params[key];
            }
        });
    }
    if (DEBUG)
    console.log({
        url: url,
        type: (type == 'GET') ? 'GET' : 'POST',
        data: (type != 'GET') ? params : undefined
    })
    $.ajax({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
			xhr.overrideMimeType("text/plain; charset=x-user-defined"); //FF test
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = -1 + (evt.loaded / evt.total);
                    u.getUnity().SendMessage('APIManager', 'APICallback', new Array('progress', id, percentComplete));
                }
           	}, false);

            xhr.addEventListener(progress, function(evt) {
               if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                   u.getUnity().SendMessage('APIManager', 'APICallback', new Array('progress', id, percentComplete));
             	}
            }, false);

           return xhr;
    	},
        url: url,
		type: (type=='GET')?'GET':'POST',
        dataType: 'text',
        data: (type != 'GET') ? params : undefined,
		//beforeSend: function (xhr) { //FF test woks for me (siewar) but might be problematic in jquery 1.5.1+
        //  xhr.overrideMimeType("text/plain; charse=-user-defined");
        //}
    }).done(function(data) {
        if (DEBUG)
        console.log({
           stats: 'done',
           id: id,
           data: data
        })
		u.getUnity().SendMessge('APIManager', 'APICallback', new Array('done', id, data));
    }).fail(function(data) {
      if (DEBUG)
        console.log({
          stats: 'fail',
          id: id,
        })
       u.getUnity().SendMessage('APIManager', 'APICallback', new Array('fail', id))
    });
}

function unity_api_loaded() {
    if(DEBUG) {
        u.getUnity().SendMessage('MessageLog', 'LogDeb', 'True');
        console.log("api loaded");
    }

	if(window.location.host != 'locahost') {
		u.getUnity().SendMessage('APIManager', 'Setup', ['http://formide.com/api/v1/', '3069kuHCj3vrsifRjf76TyHyzJZqXaFslzn5D']);
	}
	else {
		u.getUnity().SendMessage('APIManager', 'Setup', ['http://localhost/git/Printr/laravel-formide/formide/public/api/v1/', 'd1ulsRL4kDG08yaKgs1X7FSlOtx962bpSt9Kp8']);
	}
}

function unity_api_qualityChange(newLevel, improved) {
    console.log("qualityChanged to:" + newLevel);
}

function unity_api_selectionChange(newId) {
	if(newId = -1) { 
		console.log("nothing selected")
    } else {
		console.log("selected:" + newId);
    }
}

function unity_api_modelEvent(callback) {
    var obj = JSON.parse(callback);
    switch(obj.eventType) {
       	case "add":
       		vc.addToModelList(obj.mdlID,obj.apID, obj.apiHash);
            break;
		case "remove":
            vc.removeFromModelList(obj.modelID);
            break;
    }
}

function unity_api_errorCallback(code, message) {
    if(DEBUG) {
		console.log(code + ": " + message);
	}
}

function unity_api_warningCallback(code, message) {
   	if (DEBUG) {
		console.log(code + ": " + message);
	}
}


function unity_api_logCalback(code, message) {
    if (DEBUG) {
		console.log("Viewer log:"+code + ": " + message);
	}
}

function unity_api_callback(id, json) {
	if((id == -1 || id === undefined) && DEBUG) {
        console.warn("The viewer cold not decipher a callback!");
    }
    if(DEBUG) {
	    console.log(id +':'+ json);
	}
    var cb = vc.getCallback(id);

	if (DEBUG) {
		console.log(cb);
	}
    if (cb) {
       cb(json);
    } 
    else { 
	    if(DEBUG) {
	    	console.warn('Callback with id ' + id + ' could not be found!');
	    }
	}
}

function callPlayerFunction(initItem) {
	if (typeof window.vc[initItem.name] === "function") {
		initItem.args.push(function(response) {
			if(DEBUG) {
				console.log(JSON.parse(response));
			}
			if(initItem.callbackFunctions !== "undefined") {
				for (var callbackFunction in initItem.callbackFunctions) {
					callPlayerFunction(initItem.callbackFunctions[callbackFunction]);
				}
			}
		});
		window.vc[initItem.name].apply(window.vc[initItem.name], initItem.args);
	}
}

function callInterfacePlayerFunction(initItem) {
	console.log(initItem);
	initItem = initItem.data;
	if (typeof window.vc[initItem.name] === "function") {
		initItem.args.push(function(response) {
			if(DEBUG) {
				console.log(JSON.parse(response));
			}
			if(initItem.callbackFunctions !== "undefined") {
				for (var callbackFunction in initItem.callbackFunctions) {
					callPlayerFunction(initItem.callbackFunctions[callbackFunction]);
				}
			}
		});
		window.vc[initItem.name].apply(window.vc[initItem.name], initItem.args);
	}
}

function addInterfaceElement(interfaceItem) {
	if (typeof window.vc[interfaceItem.name] === "function") {
		if(interfaceItem.dom !== "undefined") {
			var newElement = $("<"+interfaceItem.dom.type+">", interfaceItem.dom.attributes);
			newElement.css(interfaceItem.dom.css);
			newElement.css({'position': 'absolute'});
			newElement.on(interfaceItem.dom.trigger, interfaceItem, callInterfacePlayerFunction);
			$('#unityPlayerElements').append(newElement);
		}
	}
}