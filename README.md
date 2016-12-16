# WP -> InDesign Bridge

An InDesign Script to pull WordPress posts directly into your layouts. This script uses the WP REST API to expose your WordPress posts to InDesign.  It allows you to search through your posts or browse them chronologically before picking one and dropping it into the currently selected text area in InDesign.  All your markup will be transformed into character styles and once these character styles are set up, 80% of your formatting work can be done, all without ever copy and pasting.

Part of doejo's [Publishing Playbook](http://thepublishingplaybook.com)

##Getting Started

###InDesign Setup

Before you're able to run the import script, you'll need to make sure you have all the requisite character styles set up. The character styles (and the HTML tags they map to) are:

	Head1      (for <h1>)
	Head2      (for <h2>)
	Head3      (for <h3>)
	Head4      (for <h4>)
	Head5      (for <h5>)
	Head6      (for <h6>)
	Bold       (for <strong>)
	Italic     (for <em>)
	BlockQuote (for <blockquote>)

####IMPORTANT: The following character styles must exist in InDesign before you run the import script for them to be mapped properly.

###Installing and Running the Script
	
	- Open the Scripts Pane in InDesign (Window -> Utilities -> Scripts)
	- Right click on the User folder and select 'Reveal in Finder'
	- Drop main.jsx into that User scripts folder

To run the script

	- Select the text frame you want your content to import into by clicking it once
	- Double click 'WP Import' in the Scripts Pane to run the script
	- When the WP Import dialog pops up, enter the base URL (http://example.com) of your site (if not already present)
	- Click 'Update' and you will see a list of posts populate the post list
	- If you want to search for a specific post, enter a keyword in the search field and click 'Search'. The post list will update with only posts relevant to that keyword
	- When you find the post you want to insert, select that post from the list and it will be inserted into the currently select text frame

###FAQ

FAQs to come

###Reporting Issues

This script is very new and may have bugs.  As we continue to test and develop it, please help us out by reporting any bugs you come across on on our [issue tracker](https://github.com/kkoppenhaver/wp-indesign-bridge/issues). Be sure to include any steps that you can take to reproduce the issue and other important information such as which version of InDesign you're running, which operating system and OS version you are running.

###Contributing
Since this script is very new and still under active development, one of the best ways to contribute is by testing and reporting issues (see above).  If after you've opened an issue, you would like to contribute a patch, that's great! Create a pull request and reference the issue you've created and we'll work on getting it merged.

In addition to testing and contributing code, you see a place where the documentation is unclear or incorrect, please submit a pull request with that change as well.  We want more than just developers helping us to make this better and easier to use for everyone.

###Questions?
Email - [keanan@doejo.com](mailto:keanan@doejo.com)
Twitter - [@kkoppenhaver](http://twitter.com/kkoppenhaver)

