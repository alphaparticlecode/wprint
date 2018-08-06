// WP -> InDesign - Import posts from WordPress into InDesign
// Author: Keanan Koppenhaver
#include "JSInterface.jsx"
#targetengine JSEngine

var postList;
var posts;

// Call our code
Main();

function postsHandler(data) {
  posts = eval(data);
  
  for (var i = 0; i < posts.length; i++){
    var postString = decodeHTMLEntities(posts[i].title.rendered) + " @ " + posts[i].date.split("T")[0];
    postList.add("item", postString);
  }
}

function Main(){ 
    var postContent;
    
    var doc = app.properties.activeDocument;
     
    var myWindow = new Window ("dialog", "WordPress Importer");
    var urlInputGroup = myWindow.add("group");
    
    urlInputGroup.add ("statictext", undefined, "WordPress Site URL:");

    var siteUrl = urlInputGroup.add ("edittext", undefined, "");
    siteUrl.characters = 50;
    
    var existingUrl = app.activeDocument.extractLabel('wpRestURL');
    
    if(existingUrl != ''){
      siteUrl.text = existingUrl;  
    }
    
    urlUpdateButton = urlInputGroup.add ("button", undefined, "Update");
    
    var searchGroup = myWindow.add("group");
    
    searchGroup.add ("statictext", undefined, "Search:");
    
    searchGroup.alignment = "right";
    
    var postSearch = searchGroup.add ("edittext", undefined, "");
    postSearch.characters = 50;
    
    var searchButton = searchGroup.add ("button", undefined, "Search");
    
    var postListGroup = myWindow.add("group");
    postList = postListGroup.add ("listbox", undefined, ["Set your WordPress URL above to see posts here"]);
    postList.minimumSize = [500,200]
    postListGroup.alignment = "right";
    
    var actionButtonGroup = myWindow.add("group");
    actionButtonGroup.alignment = "right";
    
    var cancelButton = actionButtonGroup.add ("button", undefined, "Cancel");
    var insertButton = actionButtonGroup.add ("button", undefined, "Insert");
    
    urlUpdateButton.onClick = function(){
        populatePosts(postList, siteUrl, false);
    }
 
    searchButton.onClick = function(){
        populatePosts(postList, siteUrl, true, postSearch);
    }
 
    insertButton.onClick = function(){
        var postIndex = postList.selection.index;
        
        postContent = posts[postIndex].content.rendered;
        
        postContent = sanitizePostContent(postContent);
        
        myWindow.close(1);
    }

    if(siteUrl.text != ''){
      populatePosts(postList, siteUrl, false);
    }

    // If there is no text frame selected, alert the user and make them go back and select one
    if( !app.selection[0] ) {
      alert('Please select a text frame first.');  
    }
    else {
        var result = myWindow.show();
    }
    
    if (result == 1) {
        app.selection[0].parentStory.contents = postContent;
        
        //Tagging all headers
        var head1 = doc.characterStyles.itemByName('Head1');  
        var head2 = doc.characterStyles.itemByName('Head2');  
        var head3 = doc.characterStyles.itemByName('Head3');  
        var head4 = doc.characterStyles.itemByName('Head4');
        var head5 = doc.characterStyles.itemByName('Head5');  
        var head6 = doc.characterStyles.itemByName('Head6');
        var bold = doc.characterStyles.itemByName('Bold');
        var italic = doc.characterStyles.itemByName('Italic');
        var blockquote = doc.characterStyles.itemByName('BlockQuote');
        
        stripTagsAndStyle('h1', head1, doc);
        stripTagsAndStyle('h2', head2, doc);
        stripTagsAndStyle('h3', head3, doc);
        stripTagsAndStyle('h4', head4, doc);
        stripTagsAndStyle('h5', head5, doc);
        stripTagsAndStyle('h6', head6, doc);

        stripTagsAndStyle('strong', bold, doc);
        stripTagsAndStyle('em', italic, doc);
        stripTagsAndStyle('blockquote', blockquote, doc);
        
        // Storing the latest URL
        app.activeDocument.insertLabel('wpRestURL', siteUrl.text);
    }
    else {
      app.activeDocument.insertLabel('wpRestURL', siteUrl.text);
    }
}

function populatePosts(postList, siteUrl,isSearch, postSearch) {
  postList.removeAll();
        
  if(siteUrl.text[siteUrl.text.length-1] != '/'){
    siteUrl.text = siteUrl.text + '/';
  }
 
  if(isSearch){
      var url = siteUrl.text + "wp-json/wp/v2/posts?search=" + encodeURIComponent(postSearch.text);
  }
  else {
      var url = siteUrl.text + "wp-json/wp/v2/posts";
  }

  JSInterface.evalScript("JSInterface.plugins.getURL(JSInterface.getData())", url, postsHandler);
}

function sanitizePostContent(content){

    //Strip all opening <p> tags,  Replace all closing </p> tags with new lines
    content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\r');

    //Strip links for v0.1
    content = content.replace(/<a\b[^>]*>/ig,"").replace(/<\/a>/ig, "");
    content = content.replace(/<br[^>]*>/g, '').replace(/<hr[^>]*>/g, '\r');
    content = content.replace(/<ul[^>]*>/g, '').replace(/<\/ul>/g, "");
    content = content.replace(/<ol[^>]*>/g, '').replace(/<\/ol>/g, "");
    content = content.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, "");
    content = content.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, "");

    image_regex = /<img .*src="(.*?)".*\/>/g;
    while ( ( image_matches = image_regex.exec( content ) ) !== null) {
      image_url = image_matches[1];

      image_name = image_url.split('/');
      image_name = image_name[image_name.length - 1];

      image_placeholder = '[image ' + image_name + ']';
      content = content.replace(image_matches[0], image_placeholder);
    }

    content = decodeHTMLEntities(content);

    return content;
}

function stripTagsAndStyle(tag, characterStyle, document){
  app.findGrepPreferences = app.changeGrepPreferences = null;
  app.findGrepPreferences.findWhat = "<" + tag + ".*>(.*)<\/" + tag + ">";
  
  if(tag == 'blockquote'){
      app.findGrepPreferences.findWhat = "(?s)<blockquote>(.*)<\/blockquote>";
  }

  app.changeGrepPreferences.properties = {  
      changeTo: '$1',  
      appliedCharacterStyle: characterStyle,  
  };  

  document.changeGrep();
}

function decodeHTMLEntities(input_string){
  input_string = input_string.replace('&nbsp;', ' ');
  
  return (input_string+"").replace(/&#\d+;/gm,function(s) {
    return String.fromCharCode(s.match(/\d+/gm)[0]);
  });
}