CloudFlare UI
=============

jQuery-based UI framework as seen on CloudFlare.com

About
-----

CloudFlare UI is a JavaScript project that was started as a UI framework for
cloudflare.com, and was originally based on jQuery UI. As the project evolved,
the jQuery UI Widget pattern no longer served as the best platform to base our
controls off of. We decided to create our own factory pattern that works in a
very similar way, but incorporates additional features that may or may never be
incorporated into jQuery UI. Ideas for features and functionality have been 
borrowed from many sources, and immense thanks goes out to the following
incredible projects, without which CloudFlare UI could not have been made:

* [jQuery](http://jquery.com)
* [jQuery UI](http://ui.jquery.com)
* [QUnit](http://docs.jquery.com/QUnit)
* [Adobe Flex SDK](http://opensource.adobe.com/wiki/display/flexsdk/)

Building release libraries
--------------------------

Compiled, production-ready versions of the JavaScript and CSS are included in
the repository. If you want to build these files yourself, you will have to
install some Ruby gems:

* [Sass](http://github.com/nex3/haml)
* [Juicer](http://github.com/cjohansen/juicer)

As well as this Nodejs module:

* [Jake](http://github.com/mde/node-jake)

Once you have installed Sass and Juicer, make sure that you have the 
yui_compressor and closure_compiler packages for Juicer installed as well.

When all dependencies are installed, you can run the commend "jake" in the root
of your cloned repository directory to build all debug and release files. If you
want to delete the generated debug files, run "jake clean," and if you want to
delete the generated release libraries, you can "jake clobber" in order to, well
you know :)

Documentation
-------------

Find CloudFlare UI documentation at:

* [The project wiki at Github](http://wiki.github.com/cloudflare/CloudFlare-UI/)

Copyright information
---------------------

CloudFlare UI 

Copyright 2010, AUTHORS.txt
Dual licensed under the MIT & GPLv2 licenses.
See MIT-LICENSE.txt & GPL-LICENSE.txt


CloudFlare UI incorporates the following independent projects:

[jQuery](http://jquery.com/) (Dual licensed under MIT & GPLv2 licenses)
Copyright 2010, John Resig

[QUnit](http://docs.jquery.com/QUnit) (Dual licensed under MIT & GPLv2 licenses)
Copyright 2009, John Resig, Jšrn Zaefferer
