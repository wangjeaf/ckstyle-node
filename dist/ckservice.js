/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
    navigator = window.navigator,
    location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        return new jQuery.fn.init( selector, context, rootjQuery );
    },

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
    _$ = window.$,

    // A central reference to the root jQuery(document)
    rootjQuery,

    // A simple way to check for HTML strings or ID strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

    // Check if a string has a non-whitespace character in it
    rnotwhite = /\S/,

    // Used for trimming whitespace
    trimLeft = /^\s+/,
    trimRight = /\s+$/,

    // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

    // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

    // Useragent RegExp
    rwebkit = /(webkit)[ \/]([\w.]+)/,
    ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
    rmsie = /(msie) ([\w.]+)/,
    rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

    // Matches dashed string for camelizing
    rdashAlpha = /-([a-z]|[0-9])/ig,
    rmsPrefix = /^-ms-/,

    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function( all, letter ) {
        return ( letter + "" ).toUpperCase();
    },

    // Keep a UserAgent string for use with jQuery.browser
    userAgent = navigator.userAgent,

    // For matching the engine and version of the browser
    browserMatch,

    // The deferred used on DOM ready
    readyList,

    // The ready event handler
    DOMContentLoaded,

    // Save a reference to some core methods
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,

    // [[Class]] -> type pairs
    class2type = {};

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
        var match, elem, ret, doc;

        // Handle $(""), $(null), or $(undefined)
        if ( !selector ) {
            return this;
        }

        // Handle $(DOMElement)
        if ( selector.nodeType ) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;
        }

        // The body element only exists once, optimize finding it
        if ( selector === "body" && !context && document.body ) {
            this.context = document;
            this[0] = document.body;
            this.selector = selector;
            this.length = 1;
            return this;
        }

        // Handle HTML strings
        if ( typeof selector === "string" ) {
            // Are we dealing with HTML string or an ID?
            if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [ null, selector, null ];

            } else {
                match = quickExpr.exec( selector );
            }

            // Verify a match, and that no context was specified for #id
            if ( match && (match[1] || !context) ) {

                // HANDLE: $(html) -> $(array)
                if ( match[1] ) {
                    context = context instanceof jQuery ? context[0] : context;
                    doc = ( context ? context.ownerDocument || context : document );

                    // If a single string is passed in and it's a single tag
                    // just do a createElement and skip the rest
                    ret = rsingleTag.exec( selector );

                    if ( ret ) {
                        if ( jQuery.isPlainObject( context ) ) {
                            selector = [ document.createElement( ret[1] ) ];
                            jQuery.fn.attr.call( selector, context, true );

                        } else {
                            selector = [ doc.createElement( ret[1] ) ];
                        }

                    } else {
                        ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                        selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
                    }

                    return jQuery.merge( this, selector );

                // HANDLE: $("#id")
                } else {
                    elem = document.getElementById( match[2] );

                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    if ( elem && elem.parentNode ) {
                        // Handle the case where IE and Opera return items
                        // by name instead of ID
                        if ( elem.id !== match[2] ) {
                            return rootjQuery.find( selector );
                        }

                        // Otherwise, we inject the element directly into the jQuery object
                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            // HANDLE: $(expr, $(...))
            } else if ( !context || context.jquery ) {
                return ( context || rootjQuery ).find( selector );

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor( context ).find( selector );
            }

        // HANDLE: $(function)
        // Shortcut for document ready
        } else if ( jQuery.isFunction( selector ) ) {
            return rootjQuery.ready( selector );
        }

        if ( selector.selector !== undefined ) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
    },

    // Start with an empty selector
    selector: "",

    // The current version of jQuery being used
    jquery: "1.7.1",

    // The default length of a jQuery object is 0
    length: 0,

    // The number of elements contained in the matched element set
    size: function() {
        return this.length;
    },

    toArray: function() {
        return slice.call( this, 0 );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
        return num == null ?

            // Return a 'clean' array
            this.toArray() :

            // Return just the object
            ( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function( elems, name, selector ) {
        // Build a new jQuery matched element set
        var ret = this.constructor();

        if ( jQuery.isArray( elems ) ) {
            push.apply( ret, elems );

        } else {
            jQuery.merge( ret, elems );
        }

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        ret.context = this.context;

        if ( name === "find" ) {
            ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
        } else if ( name ) {
            ret.selector = this.selector + "." + name + "(" + selector + ")";
        }

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function( callback, args ) {
        return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
        // Attach the listeners
        jQuery.bindReady();

        // Add the callback
        readyList.add( fn );

        return this;
    },

    eq: function( i ) {
        i = +i;
        return i === -1 ?
            this.slice( i ) :
            this.slice( i, i + 1 );
    },

    first: function() {
        return this.eq( 0 );
    },

    last: function() {
        return this.eq( -1 );
    },

    slice: function() {
        return this.pushStack( slice.apply( this, arguments ),
            "slice", slice.call(arguments).join(",") );
    },

    map: function( callback ) {
        return this.pushStack( jQuery.map(this, function( elem, i ) {
            return callback.call( elem, i, elem );
        }));
    },

    end: function() {
        return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: [].sort,
    splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend({
    noConflict: function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    },

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },

    // Handle when the DOM is ready
    ready: function( wait ) {
        // Either a released hold or an DOMready/load event and not yet ready
        if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready, 1 );
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.fireWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger( "ready" ).off( "ready" );
            }
        }
    },

    bindReady: function() {
        if ( readyList ) {
            return;
        }

        readyList = jQuery.Callbacks( "once memory" );

        // Catch cases where $(document).ready() is called after the
        // browser event has already occurred.
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            return setTimeout( jQuery.ready, 1 );
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", jQuery.ready, false );

        // If IE event model is used
        } else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", DOMContentLoaded );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", jQuery.ready );

            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;

            try {
                toplevel = window.frameElement == null;
            } catch(e) {}

            if ( document.documentElement.doScroll && toplevel ) {
                doScrollCheck();
            }
        }
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function( obj ) {
        return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray || function( obj ) {
        return jQuery.type(obj) === "array";
    },

    // A crude way of determining if an object is a window
    isWindow: function( obj ) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    },

    isNumeric: function( obj ) {
        return !isNaN( parseFloat(obj) ) && isFinite( obj );
    },

    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            class2type[ toString.call(obj) ] || "object";
    },

    isPlainObject: function( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for ( key in obj ) {}

        return key === undefined || hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    },

    error: function( msg ) {
        throw new Error( msg );
    },

    parseJSON: function( data ) {
        if ( typeof data !== "string" || !data ) {
            return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim( data );

        // Attempt to parse using the native JSON parser first
        if ( window.JSON && window.JSON.parse ) {
            return window.JSON.parse( data );
        }

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {

            return ( new Function( "return " + data ) )();

        }
        jQuery.error( "Invalid JSON: " + data );
    },

    // Cross-browser xml parsing
    parseXML: function( data ) {
        var xml, tmp;
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            jQuery.error( "Invalid XML: " + data );
        }
        return xml;
    },

    noop: function() {},

    // Evaluates a script in a global context
    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function( data ) {
        if ( data && rnotwhite.test( data ) ) {
            // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
    },

    // args is for internal usage only
    each: function( object, callback, args ) {
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || jQuery.isFunction( object );

        if ( args ) {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.apply( object[ name ], args ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.apply( object[ i++ ], args ) === false ) {
                        break;
                    }
                }
            }

        // A special, fast, case for the most common use of each
        } else {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                        break;
                    }
                }
            }
        }

        return object;
    },

    // Use native String.trim function wherever possible
    trim: trim ?
        function( text ) {
            return text == null ?
                "" :
                trim.call( text );
        } :

        // Otherwise use our own trimming functionality
        function( text ) {
            return text == null ?
                "" :
                text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
        },

    // results is for internal usage only
    makeArray: function( array, results ) {
        var ret = results || [];

        if ( array != null ) {
            // The window, strings (and functions) also have 'length'
            // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
            var type = jQuery.type( array );

            if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                push.call( ret, array );
            } else {
                jQuery.merge( ret, array );
            }
        }

        return ret;
    },

    inArray: function( elem, array, i ) {
        var len;

        if ( array ) {
            if ( indexOf ) {
                return indexOf.call( array, elem, i );
            }

            len = array.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

            for ( ; i < len; i++ ) {
                // Skip accessing in sparse arrays
                if ( i in array && array[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    },

    merge: function( first, second ) {
        var i = first.length,
            j = 0;

        if ( typeof second.length === "number" ) {
            for ( var l = second.length; j < l; j++ ) {
                first[ i++ ] = second[ j ];
            }

        } else {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    },

    grep: function( elems, callback, inv ) {
        var ret = [], retVal;
        inv = !!inv;

        // Go through the array, only saving the items
        // that pass the validator function
        for ( var i = 0, length = elems.length; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }

        return ret;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
        var value, key, ret = [],
            i = 0,
            length = elems.length,
            // jquery objects are treated as arrays
            isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

        // Go through the array, translating each of the items to their
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }

        // Go through every key on the object,
        } else {
            for ( key in elems ) {
                value = callback( elems[ key ], key, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }
        }

        // Flatten any nested arrays
        return ret.concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
        if ( typeof context === "string" ) {
            var tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) {
            return undefined;
        }

        // Simulated bind
        var args = slice.call( arguments, 2 ),
            proxy = function() {
                return fn.apply( context, args.concat( slice.call( arguments ) ) );
            };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

        return proxy;
    },

    // Mutifunctional method to get and set values to a collection
    // The value/s can optionally be executed if it's a function
    access: function( elems, key, value, exec, fn, pass ) {
        var length = elems.length;

        // Setting many attributes
        if ( typeof key === "object" ) {
            for ( var k in key ) {
                jQuery.access( elems, k, key[k], exec, fn, value );
            }
            return elems;
        }

        // Setting one attribute
        if ( value !== undefined ) {
            // Optionally, function values get executed if exec is true
            exec = !pass && exec && jQuery.isFunction(value);

            for ( var i = 0; i < length; i++ ) {
                fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
            }

            return elems;
        }

        // Getting an attribute
        return length ? fn( elems[0], key ) : undefined;
    },

    now: function() {
        return ( new Date() ).getTime();
    },

    // Use of jQuery.browser is frowned upon.
    // More details: http://docs.jquery.com/Utilities/jQuery.browser
    uaMatch: function( ua ) {
        ua = ua.toLowerCase();

        var match = rwebkit.exec( ua ) ||
            ropera.exec( ua ) ||
            rmsie.exec( ua ) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
            [];

        return { browser: match[1] || "", version: match[2] || "0" };
    },

    sub: function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    },

    browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
    jQuery.browser[ browserMatch.browser ] = true;
    jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
    jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
    trimLeft = /^[\s\xA0]+/;
    trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
    DOMContentLoaded = function() {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        jQuery.ready();
    };

} else if ( document.attachEvent ) {
    DOMContentLoaded = function() {
        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if ( document.readyState === "complete" ) {
            document.detachEvent( "onreadystatechange", DOMContentLoaded );
            jQuery.ready();
        }
    };
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
    if ( jQuery.isReady ) {
        return;
    }

    try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
    } catch(e) {
        setTimeout( doScrollCheck, 1 );
        return;
    }

    // and execute any waiting functions
    jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
    var object = flagsCache[ flags ] = {},
        i, length;
    flags = flags.split( /\s+/ );
    for ( i = 0, length = flags.length; i < length; i++ ) {
        object[ flags[i] ] = true;
    }
    return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  flags:  an optional list of space-separated flags that will change how
 *          the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *  once:           will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:         will keep track of previous values and will call any callback added
 *                  after the list has been fired right away with the latest "memorized"
 *                  values (like a Deferred)
 *
 *  unique:         will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:    interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

    // Convert flags from String-formatted to Object-formatted
    // (we check in cache first)
    flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

    var // Actual callback list
        list = [],
        // Stack of fire calls for repeatable lists
        stack = [],
        // Last fire value (for non-forgettable lists)
        memory,
        // Flag to know if list is currently firing
        firing,
        // First callback to fire (used internally by add and fireWith)
        firingStart,
        // End of the loop when firing
        firingLength,
        // Index of currently firing callback (modified by remove if needed)
        firingIndex,
        // Add one or several callbacks to the list
        add = function( args ) {
            var i,
                length,
                elem,
                type,
                actual;
            for ( i = 0, length = args.length; i < length; i++ ) {
                elem = args[ i ];
                type = jQuery.type( elem );
                if ( type === "array" ) {
                    // Inspect recursively
                    add( elem );
                } else if ( type === "function" ) {
                    // Add if not in unique mode and callback is not in
                    if ( !flags.unique || !self.has( elem ) ) {
                        list.push( elem );
                    }
                }
            }
        },
        // Fire callbacks
        fire = function( context, args ) {
            args = args || [];
            memory = !flags.memory || [ context, args ];
            firing = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
                    memory = true; // Mark as halted
                    break;
                }
            }
            firing = false;
            if ( list ) {
                if ( !flags.once ) {
                    if ( stack && stack.length ) {
                        memory = stack.shift();
                        self.fireWith( memory[ 0 ], memory[ 1 ] );
                    }
                } else if ( memory === true ) {
                    self.disable();
                } else {
                    list = [];
                }
            }
        },
        // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
                if ( list ) {
                    var length = list.length;
                    add( arguments );
                    // Do we need to add the callbacks to the
                    // current firing batch?
                    if ( firing ) {
                        firingLength = list.length;
                    // With memory, if we're not firing then
                    // we should call right away, unless previous
                    // firing was halted (stopOnFalse)
                    } else if ( memory && memory !== true ) {
                        firingStart = length;
                        fire( memory[ 0 ], memory[ 1 ] );
                    }
                }
                return this;
            },
            // Remove a callback from the list
            remove: function() {
                if ( list ) {
                    var args = arguments,
                        argIndex = 0,
                        argLength = args.length;
                    for ( ; argIndex < argLength ; argIndex++ ) {
                        for ( var i = 0; i < list.length; i++ ) {
                            if ( args[ argIndex ] === list[ i ] ) {
                                // Handle firingIndex and firingLength
                                if ( firing ) {
                                    if ( i <= firingLength ) {
                                        firingLength--;
                                        if ( i <= firingIndex ) {
                                            firingIndex--;
                                        }
                                    }
                                }
                                // Remove the element
                                list.splice( i--, 1 );
                                // If we have some unicity property then
                                // we only need to do this once
                                if ( flags.unique ) {
                                    break;
                                }
                            }
                        }
                    }
                }
                return this;
            },
            // Control if a given callback is in the list
            has: function( fn ) {
                if ( list ) {
                    var i = 0,
                        length = list.length;
                    for ( ; i < length; i++ ) {
                        if ( fn === list[ i ] ) {
                            return true;
                        }
                    }
                }
                return false;
            },
            // Remove all callbacks from the list
            empty: function() {
                list = [];
                return this;
            },
            // Have the list do nothing anymore
            disable: function() {
                list = stack = memory = undefined;
                return this;
            },
            // Is it disabled?
            disabled: function() {
                return !list;
            },
            // Lock the list in its current state
            lock: function() {
                stack = undefined;
                if ( !memory || memory === true ) {
                    self.disable();
                }
                return this;
            },
            // Is it locked?
            locked: function() {
                return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function( context, args ) {
                if ( stack ) {
                    if ( firing ) {
                        if ( !flags.once ) {
                            stack.push( [ context, args ] );
                        }
                    } else if ( !( flags.once && memory ) ) {
                        fire( context, args );
                    }
                }
                return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!memory;
            }
        };

    return self;
};




var // Static reference to slice
    sliceDeferred = [].slice;

jQuery.extend({

    Deferred: function( func ) {
        var doneList = jQuery.Callbacks( "once memory" ),
            failList = jQuery.Callbacks( "once memory" ),
            progressList = jQuery.Callbacks( "memory" ),
            state = "pending",
            lists = {
                resolve: doneList,
                reject: failList,
                notify: progressList
            },
            promise = {
                done: doneList.add,
                fail: failList.add,
                progress: progressList.add,

                state: function() {
                    return state;
                },

                // Deprecated
                isResolved: doneList.fired,
                isRejected: failList.fired,

                then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
                    deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
                    return this;
                },
                always: function() {
                    deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
                    return this;
                },
                pipe: function( fnDone, fnFail, fnProgress ) {
                    return jQuery.Deferred(function( newDefer ) {
                        jQuery.each( {
                            done: [ fnDone, "resolve" ],
                            fail: [ fnFail, "reject" ],
                            progress: [ fnProgress, "notify" ]
                        }, function( handler, data ) {
                            var fn = data[ 0 ],
                                action = data[ 1 ],
                                returned;
                            if ( jQuery.isFunction( fn ) ) {
                                deferred[ handler ](function() {
                                    returned = fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                    }
                                });
                            } else {
                                deferred[ handler ]( newDefer[ action ] );
                            }
                        });
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    if ( obj == null ) {
                        obj = promise;
                    } else {
                        for ( var key in promise ) {
                            obj[ key ] = promise[ key ];
                        }
                    }
                    return obj;
                }
            },
            deferred = promise.promise({}),
            key;

        for ( key in lists ) {
            deferred[ key ] = lists[ key ].fire;
            deferred[ key + "With" ] = lists[ key ].fireWith;
        }

        // Handle state
        deferred.done( function() {
            state = "resolved";
        }, failList.disable, progressList.lock ).fail( function() {
            state = "rejected";
        }, doneList.disable, progressList.lock );

        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }

        // All done!
        return deferred;
    },

    // Deferred helper
    when: function( firstParam ) {
        var args = sliceDeferred.call( arguments, 0 ),
            i = 0,
            length = args.length,
            pValues = new Array( length ),
            count = length,
            pCount = length,
            deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
                firstParam :
                jQuery.Deferred(),
            promise = deferred.promise();
        function resolveFunc( i ) {
            return function( value ) {
                args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                if ( !( --count ) ) {
                    deferred.resolveWith( deferred, args );
                }
            };
        }
        function progressFunc( i ) {
            return function( value ) {
                pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                deferred.notifyWith( promise, pValues );
            };
        }
        if ( length > 1 ) {
            for ( ; i < length; i++ ) {
                if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
                    args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
                } else {
                    --count;
                }
            }
            if ( !count ) {
                deferred.resolveWith( deferred, args );
            }
        } else if ( deferred !== firstParam ) {
            deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
        }
        return promise;
    }
});




jQuery.support = (function() {

    var support,
        all,
        a,
        select,
        opt,
        input,
        marginDiv,
        fragment,
        tds,
        events,
        eventName,
        i,
        isSupported,
        div = document.createElement( "div" ),
        documentElement = document.documentElement;

    // Preliminary tests
    div.setAttribute("className", "t");
    div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

    all = div.getElementsByTagName( "*" );
    a = div.getElementsByTagName( "a" )[ 0 ];

    // Can't get basic test support
    if ( !all || !all.length || !a ) {
        return {};
    }

    // First batch of supports tests
    select = document.createElement( "select" );
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName( "input" )[ 0 ];

    support = {
        // IE strips leading whitespace when .innerHTML is used
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName("tbody").length,

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName("link").length,

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        style: /top/.test( a.getAttribute("style") ),

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        hrefNormalized: ( a.getAttribute("href") === "/a" ),

        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        opacity: /^0.55/.test( a.style.opacity ),

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        cssFloat: !!a.style.cssFloat,

        // Make sure that if no value is specified for a checkbox
        // that it defaults to "on".
        // (WebKit defaults to "" instead)
        checkOn: ( input.value === "on" ),

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        optSelected: opt.selected,

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        getSetAttribute: div.className !== "t",

        // Tests for enctype support on a form(#6743)
        enctype: !!document.createElement("form").enctype,

        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

        // Will be defined later
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true
    };

    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
        delete div.test;
    } catch( e ) {
        support.deleteExpando = false;
    }

    if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", function() {
            // Cloning a node shouldn't copy over any
            // bound event handlers (IE does this)
            support.noCloneEvent = false;
        });
        div.cloneNode( true ).fireEvent( "onclick" );
    }

    // Check if a radio maintains its value
    // after being appended to the DOM
    input = document.createElement("input");
    input.value = "t";
    input.setAttribute("type", "radio");
    support.radioValue = input.value === "t";

    input.setAttribute("checked", "checked");
    div.appendChild( input );
    fragment = document.createDocumentFragment();
    fragment.appendChild( div.lastChild );

    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;

    fragment.removeChild( input );
    fragment.appendChild( div );

    div.innerHTML = "";

    // Check if div with explicit width and no margin-right incorrectly
    // gets computed margin-right based on width of container. For more
    // info see bug #3333
    // Fails in WebKit before Feb 2011 nightlies
    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    if ( window.getComputedStyle ) {
        marginDiv = document.createElement( "div" );
        marginDiv.style.width = "0";
        marginDiv.style.marginRight = "0";
        div.style.width = "2px";
        div.appendChild( marginDiv );
        support.reliableMarginRight =
            ( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
    }

    // Technique from Juriy Zaytsev
    // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
    // We only care about the case where non-standard event systems
    // are used, namely in IE. Short-circuiting here helps us to
    // avoid an eval call (in setAttribute) which can cause CSP
    // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
    if ( div.attachEvent ) {
        for( i in {
            submit: 1,
            change: 1,
            focusin: 1
        }) {
            eventName = "on" + i;
            isSupported = ( eventName in div );
            if ( !isSupported ) {
                div.setAttribute( eventName, "return;" );
                isSupported = ( typeof div[ eventName ] === "function" );
            }
            support[ i + "Bubbles" ] = isSupported;
        }
    }

    fragment.removeChild( div );

    // Null elements to avoid leaks in IE
    fragment = select = opt = marginDiv = div = input = null;

    // Run tests that need a body at doc ready
    jQuery(function() {
        var container, outer, inner, table, td, offsetSupport,
            conMarginTop, ptlm, vb, style, html,
            body = document.getElementsByTagName("body")[0];

        if ( !body ) {
            // Return for frameset docs that don't have a body
            return;
        }

        conMarginTop = 1;
        ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
        vb = "visibility:hidden;border:0;";
        style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
        html = "<div " + style + "><div></div></div>" +
            "<table " + style + " cellpadding='0' cellspacing='0'>" +
            "<tr><td></td></tr></table>";

        container = document.createElement("div");
        container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
        body.insertBefore( container, body.firstChild );

        // Construct the test element
        div = document.createElement("div");
        container.appendChild( div );

        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        // (only IE 8 fails this test)
        div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName( "td" );
        isSupported = ( tds[ 0 ].offsetHeight === 0 );

        tds[ 0 ].style.display = "";
        tds[ 1 ].style.display = "none";

        // Check if empty table cells still have offsetWidth/Height
        // (IE <= 8 fail this test)
        support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

        // Figure out if the W3C box model works as expected
        div.innerHTML = "";
        div.style.width = div.style.paddingLeft = "1px";
        jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

        if ( typeof div.style.zoom !== "undefined" ) {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
        }

        div.style.cssText = ptlm + vb;
        div.innerHTML = html;

        outer = div.firstChild;
        inner = outer.firstChild;
        td = outer.nextSibling.firstChild.firstChild;

        offsetSupport = {
            doesNotAddBorder: ( inner.offsetTop !== 5 ),
            doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
        };

        inner.style.position = "fixed";
        inner.style.top = "20px";

        // safari subtracts parent border width here which is 5px
        offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
        inner.style.position = inner.style.top = "";

        outer.style.overflow = "hidden";
        outer.style.position = "relative";

        offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
        offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

        body.removeChild( container );
        div  = container = null;

        jQuery.extend( support, offsetSupport );
    });

    return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
    rmultiDash = /([A-Z])/g;

jQuery.extend({
    cache: {},

    // Please use with caution
    uuid: 0,

    // Unique for each copy of jQuery on the page
    // Non-digits removed to match rinlinejQuery
    expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
        "embed": true,
        // Ban all objects except for Flash (which handle expandos)
        "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        "applet": true
    },

    hasData: function( elem ) {
        elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
        return !!elem && !isEmptyDataObject( elem );
    },

    data: function( elem, name, data, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var privateCache, thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
            isEvents = name === "events";

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                elem[ internalKey ] = id = ++jQuery.uuid;
            } else {
                id = internalKey;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            // Avoids exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }

        privateCache = thisCache = cache[ id ];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        // Users should not attempt to inspect the internal events object using jQuery.data,
        // it is undocumented and subject to change. But does anyone listen? No.
        if ( isEvents && !thisCache[ name ] ) {
            return privateCache.events;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( getByName ) {

            // First Try to find as-is property data
            ret = thisCache[ name ];

            // Test for null|undefined property data
            if ( ret == null ) {

                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    },

    removeData: function( elem, name, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, i, l,

            // Reference to internal data cache key
            internalKey = jQuery.expando,

            isNode = elem.nodeType,

            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
            id = isNode ? elem[ internalKey ] : internalKey;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ] : cache[ id ].data;

            if ( thisCache ) {

                // Support array or space separated string names for data keys
                if ( !jQuery.isArray( name ) ) {

                    // try the string as a key before any manipulation
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {

                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split( " " );
                        }
                    }
                }

                for ( i = 0, l = name.length; i < l; i++ ) {
                    delete thisCache[ name[i] ];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if ( !pvt ) {
            delete cache[ id ].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject(cache[ id ]) ) {
                return;
            }
        }

        // Browsers that fail expando deletion also refuse to delete expandos on
        // the window, but it will allow it on all other JS objects; other browsers
        // don't care
        // Ensure that `cache` is not a window object #10080
        if ( jQuery.support.deleteExpando || !cache.setInterval ) {
            delete cache[ id ];
        } else {
            cache[ id ] = null;
        }

        // We destroyed the cache and need to eliminate the expando on the node to avoid
        // false lookups in the cache for entries that no longer exist
        if ( isNode ) {
            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( jQuery.support.deleteExpando ) {
                delete elem[ internalKey ];
            } else if ( elem.removeAttribute ) {
                elem.removeAttribute( internalKey );
            } else {
                elem[ internalKey ] = null;
            }
        }
    },

    // For internal use only.
    _data: function( elem, name, data ) {
        return jQuery.data( elem, name, data, true );
    },

    // A method for determining if a DOM node can handle the data expando
    acceptData: function( elem ) {
        if ( elem.nodeName ) {
            var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

            if ( match ) {
                return !(match === true || elem.getAttribute("classid") !== match);
            }
        }

        return true;
    }
});

jQuery.fn.extend({
    data: function( key, value ) {
        var parts, attr, name,
            data = null;

        if ( typeof key === "undefined" ) {
            if ( this.length ) {
                data = jQuery.data( this[0] );

                if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
                    attr = this[0].attributes;
                    for ( var i = 0, l = attr.length; i < l; i++ ) {
                        name = attr[i].name;

                        if ( name.indexOf( "data-" ) === 0 ) {
                            name = jQuery.camelCase( name.substring(5) );

                            dataAttr( this[0], name, data[ name ] );
                        }
                    }
                    jQuery._data( this[0], "parsedAttrs", true );
                }
            }

            return data;

        } else if ( typeof key === "object" ) {
            return this.each(function() {
                jQuery.data( this, key );
            });
        }

        parts = key.split(".");
        parts[1] = parts[1] ? "." + parts[1] : "";

        if ( value === undefined ) {
            data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

            // Try to fetch any internally stored data first
            if ( data === undefined && this.length ) {
                data = jQuery.data( this[0], key );
                data = dataAttr( this[0], key, data );
            }

            return data === undefined && parts[1] ?
                this.data( parts[0] ) :
                data;

        } else {
            return this.each(function() {
                var self = jQuery( this ),
                    args = [ parts[0], value ];

                self.triggerHandler( "setData" + parts[1] + "!", args );
                jQuery.data( this, key, value );
                self.triggerHandler( "changeData" + parts[1] + "!", args );
            });
        }
    },

    removeData: function( key ) {
        return this.each(function() {
            jQuery.removeData( this, key );
        });
    }
});

function dataAttr( elem, key, data ) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if ( data === undefined && elem.nodeType === 1 ) {

        var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                jQuery.isNumeric( data ) ? parseFloat( data ) :
                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch( e ) {}

            // Make sure we set the data so it isn't changed later
            jQuery.data( elem, key, data );

        } else {
            data = undefined;
        }
    }

    return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
    for ( var name in obj ) {

        // if the public data object is empty, the private is still empty
        if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
            continue;
        }
        if ( name !== "toJSON" ) {
            return false;
        }
    }

    return true;
}




function handleQueueMarkDefer( elem, type, src ) {
    var deferDataKey = type + "defer",
        queueDataKey = type + "queue",
        markDataKey = type + "mark",
        defer = jQuery._data( elem, deferDataKey );
    if ( defer &&
        ( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
        ( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
        // Give room for hard-coded callbacks to fire first
        // and eventually mark/queue something else on the element
        setTimeout( function() {
            if ( !jQuery._data( elem, queueDataKey ) &&
                !jQuery._data( elem, markDataKey ) ) {
                jQuery.removeData( elem, deferDataKey, true );
                defer.fire();
            }
        }, 0 );
    }
}

jQuery.extend({

    _mark: function( elem, type ) {
        if ( elem ) {
            type = ( type || "fx" ) + "mark";
            jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
        }
    },

    _unmark: function( force, elem, type ) {
        if ( force !== true ) {
            type = elem;
            elem = force;
            force = false;
        }
        if ( elem ) {
            type = type || "fx";
            var key = type + "mark",
                count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
            if ( count ) {
                jQuery._data( elem, key, count );
            } else {
                jQuery.removeData( elem, key, true );
                handleQueueMarkDefer( elem, type, "mark" );
            }
        }
    },

    queue: function( elem, type, data ) {
        var q;
        if ( elem ) {
            type = ( type || "fx" ) + "queue";
            q = jQuery._data( elem, type );

            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( data ) {
                if ( !q || jQuery.isArray(data) ) {
                    q = jQuery._data( elem, type, jQuery.makeArray(data) );
                } else {
                    q.push( data );
                }
            }
            return q || [];
        }
    },

    dequeue: function( elem, type ) {
        type = type || "fx";

        var queue = jQuery.queue( elem, type ),
            fn = queue.shift(),
            hooks = {};

        // If the fx queue is dequeued, always remove the progress sentinel
        if ( fn === "inprogress" ) {
            fn = queue.shift();
        }

        if ( fn ) {
            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if ( type === "fx" ) {
                queue.unshift( "inprogress" );
            }

            jQuery._data( elem, type + ".run", hooks );
            fn.call( elem, function() {
                jQuery.dequeue( elem, type );
            }, hooks );
        }

        if ( !queue.length ) {
            jQuery.removeData( elem, type + "queue " + type + ".run", true );
            handleQueueMarkDefer( elem, type, "queue" );
        }
    }
});

jQuery.fn.extend({
    queue: function( type, data ) {
        if ( typeof type !== "string" ) {
            data = type;
            type = "fx";
        }

        if ( data === undefined ) {
            return jQuery.queue( this[0], type );
        }
        return this.each(function() {
            var queue = jQuery.queue( this, type, data );

            if ( type === "fx" && queue[0] !== "inprogress" ) {
                jQuery.dequeue( this, type );
            }
        });
    },
    dequeue: function( type ) {
        return this.each(function() {
            jQuery.dequeue( this, type );
        });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay: function( time, type ) {
        time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
        type = type || "fx";

        return this.queue( type, function( next, hooks ) {
            var timeout = setTimeout( next, time );
            hooks.stop = function() {
                clearTimeout( timeout );
            };
        });
    },
    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, object ) {
        if ( typeof type !== "string" ) {
            object = type;
            type = undefined;
        }
        type = type || "fx";
        var defer = jQuery.Deferred(),
            elements = this,
            i = elements.length,
            count = 1,
            deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            tmp;
        function resolve() {
            if ( !( --count ) ) {
                defer.resolveWith( elements, [ elements ] );
            }
        }
        while( i-- ) {
            if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
                    ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
                        jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
                    jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
                count++;
                tmp.add( resolve );
            }
        }
        resolve();
        return defer.promise();
    }
});




var rclass = /[\n\t\r]/g,
    rspace = /\s+/,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea)?$/i,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute,
    nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
    attr: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.attr );
    },

    removeAttr: function( name ) {
        return this.each(function() {
            jQuery.removeAttr( this, name );
        });
    },

    prop: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.prop );
    },

    removeProp: function( name ) {
        name = jQuery.propFix[ name ] || name;
        return this.each(function() {
            // try/catch handles cases where IE balks (such as removing a property on window)
            try {
                this[ name ] = undefined;
                delete this[ name ];
            } catch( e ) {}
        });
    },

    addClass: function( value ) {
        var classNames, i, l, elem,
            setClass, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).addClass( value.call(this, j, this.className) );
            });
        }

        if ( value && typeof value === "string" ) {
            classNames = value.split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 ) {
                    if ( !elem.className && classNames.length === 1 ) {
                        elem.className = value;

                    } else {
                        setClass = " " + elem.className + " ";

                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                                setClass += classNames[ c ] + " ";
                            }
                        }
                        elem.className = jQuery.trim( setClass );
                    }
                }
            }
        }

        return this;
    },

    removeClass: function( value ) {
        var classNames, i, l, elem, className, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).removeClass( value.call(this, j, this.className) );
            });
        }

        if ( (value && typeof value === "string") || value === undefined ) {
            classNames = ( value || "" ).split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 && elem.className ) {
                    if ( value ) {
                        className = (" " + elem.className + " ").replace( rclass, " " );
                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            className = className.replace(" " + classNames[ c ] + " ", " ");
                        }
                        elem.className = jQuery.trim( className );

                    } else {
                        elem.className = "";
                    }
                }
            }
        }

        return this;
    },

    toggleClass: function( value, stateVal ) {
        var type = typeof value,
            isBool = typeof stateVal === "boolean";

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( i ) {
                jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
            });
        }

        return this.each(function() {
            if ( type === "string" ) {
                // toggle individual class names
                var className,
                    i = 0,
                    self = jQuery( this ),
                    state = stateVal,
                    classNames = value.split( rspace );

                while ( (className = classNames[ i++ ]) ) {
                    // check each className given, space seperated list
                    state = isBool ? state : !self.hasClass( className );
                    self[ state ? "addClass" : "removeClass" ]( className );
                }

            } else if ( type === "undefined" || type === "boolean" ) {
                if ( this.className ) {
                    // store className if set
                    jQuery._data( this, "__className__", this.className );
                }

                // toggle whole className
                this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
            }
        });
    },

    hasClass: function( selector ) {
        var className = " " + selector + " ",
            i = 0,
            l = this.length;
        for ( ; i < l; i++ ) {
            if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                return true;
            }
        }

        return false;
    },

    val: function( value ) {
        var hooks, ret, isFunction,
            elem = this[0];

        if ( !arguments.length ) {
            if ( elem ) {
                hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

                if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?
                    // handle most common string cases
                    ret.replace(rreturn, "") :
                    // handle cases where value is null/undef or number
                    ret == null ? "" : ret;
            }

            return;
        }

        isFunction = jQuery.isFunction( value );

        return this.each(function( i ) {
            var self = jQuery(this), val;

            if ( this.nodeType !== 1 ) {
                return;
            }

            if ( isFunction ) {
                val = value.call( this, i, self.val() );
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if ( val == null ) {
                val = "";
            } else if ( typeof val === "number" ) {
                val += "";
            } else if ( jQuery.isArray( val ) ) {
                val = jQuery.map(val, function ( value ) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

            // If set returns undefined, fall back to normal setting
            if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                this.value = val;
            }
        });
    }
});

jQuery.extend({
    valHooks: {
        option: {
            get: function( elem ) {
                // attributes.value is undefined in Blackberry 4.7 but
                // uses .value. See #6932
                var val = elem.attributes.value;
                return !val || val.specified ? elem.value : elem.text;
            }
        },
        select: {
            get: function( elem ) {
                var value, i, max, option,
                    index = elem.selectedIndex,
                    values = [],
                    options = elem.options,
                    one = elem.type === "select-one";

                // Nothing was selected
                if ( index < 0 ) {
                    return null;
                }

                // Loop through all the selected options
                i = one ? index : 0;
                max = one ? index + 1 : options.length;
                for ( ; i < max; i++ ) {
                    option = options[ i ];

                    // Don't return options that are disabled or in a disabled optgroup
                    if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                        // Get the specific value for the option
                        value = jQuery( option ).val();

                        // We don't need an array for one selects
                        if ( one ) {
                            return value;
                        }

                        // Multi-Selects return an array
                        values.push( value );
                    }
                }

                // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                if ( one && !values.length && options.length ) {
                    return jQuery( options[ index ] ).val();
                }

                return values;
            },

            set: function( elem, value ) {
                var values = jQuery.makeArray( value );

                jQuery(elem).find("option").each(function() {
                    this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                });

                if ( !values.length ) {
                    elem.selectedIndex = -1;
                }
                return values;
            }
        }
    },

    attrFn: {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true
    },

    attr: function( elem, name, value, pass ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        // don't get/set attributes on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        if ( pass && name in jQuery.attrFn ) {
            return jQuery( elem )[ name ]( value );
        }

        // Fallback to prop when attributes are not supported
        if ( typeof elem.getAttribute === "undefined" ) {
            return jQuery.prop( elem, name, value );
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        // All attributes are lowercase
        // Grab necessary hook if one is defined
        if ( notxml ) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
        }

        if ( value !== undefined ) {

            if ( value === null ) {
                jQuery.removeAttr( elem, name );
                return;

            } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                elem.setAttribute( name, "" + value );
                return value;
            }

        } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
            return ret;

        } else {

            ret = elem.getAttribute( name );

            // Non-existent attributes return null, we normalize to undefined
            return ret === null ?
                undefined :
                ret;
        }
    },

    removeAttr: function( elem, value ) {
        var propName, attrNames, name, l,
            i = 0;

        if ( value && elem.nodeType === 1 ) {
            attrNames = value.toLowerCase().split( rspace );
            l = attrNames.length;

            for ( ; i < l; i++ ) {
                name = attrNames[ i ];

                if ( name ) {
                    propName = jQuery.propFix[ name ] || name;

                    // See #9699 for explanation of this approach (setting first, then removal)
                    jQuery.attr( elem, name, "" );
                    elem.removeAttribute( getSetAttribute ? name : propName );

                    // Set corresponding property to false for boolean attributes
                    if ( rboolean.test( name ) && propName in elem ) {
                        elem[ propName ] = false;
                    }
                }
            }
        }
    },

    attrHooks: {
        type: {
            set: function( elem, value ) {
                // We can't allow the type property to be changed (since it causes problems in IE)
                if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                    jQuery.error( "type property can't be changed" );
                } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                    // Setting the type on a radio button after the value resets the value in IE6-9
                    // Reset value to it's default in case type is set after value
                    // This is for element creation
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        },
        // Use the value property for back compat
        // Use the nodeHook for button elements in IE6/7 (#1954)
        value: {
            get: function( elem, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.get( elem, name );
                }
                return name in elem ?
                    elem.value :
                    null;
            },
            set: function( elem, value, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.set( elem, value, name );
                }
                // Does not return so that setAttribute is also used
                elem.value = value;
            }
        }
    },

    propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    },

    prop: function( elem, name, value ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        // don't get/set properties on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        if ( notxml ) {
            // Fix name and attach hooks
            name = jQuery.propFix[ name ] || name;
            hooks = jQuery.propHooks[ name ];
        }

        if ( value !== undefined ) {
            if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                return ( elem[ name ] = value );
            }

        } else {
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {
                return elem[ name ];
            }
        }
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {
                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                var attributeNode = elem.getAttributeNode("tabindex");

                return attributeNode && attributeNode.specified ?
                    parseInt( attributeNode.value, 10 ) :
                    rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                        0 :
                        undefined;
            }
        }
    }
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
    get: function( elem, name ) {
        // Align boolean attributes with corresponding properties
        // Fall back to attribute presence where some booleans are not supported
        var attrNode,
            property = jQuery.prop( elem, name );
        return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
            name.toLowerCase() :
            undefined;
    },
    set: function( elem, value, name ) {
        var propName;
        if ( value === false ) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr( elem, name );
        } else {
            // value is true since we know at this point it's type boolean and not false
            // Set boolean attributes to the same name and set the DOM property
            propName = jQuery.propFix[ name ] || name;
            if ( propName in elem ) {
                // Only set the IDL specifically if it already exists on the element
                elem[ propName ] = true;
            }

            elem.setAttribute( name, name.toLowerCase() );
        }
        return name;
    }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

    fixSpecified = {
        name: true,
        id: true
    };

    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
        get: function( elem, name ) {
            var ret;
            ret = elem.getAttributeNode( name );
            return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
                ret.nodeValue :
                undefined;
        },
        set: function( elem, value, name ) {
            // Set the existing or create a new attribute node
            var ret = elem.getAttributeNode( name );
            if ( !ret ) {
                ret = document.createAttribute( name );
                elem.setAttributeNode( ret );
            }
            return ( ret.nodeValue = value + "" );
        }
    };

    // Apply the nodeHook to tabindex
    jQuery.attrHooks.tabindex.set = nodeHook.set;

    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([ "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            set: function( elem, value ) {
                if ( value === "" ) {
                    elem.setAttribute( name, "auto" );
                    return value;
                }
            }
        });
    });

    // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
        get: nodeHook.get,
        set: function( elem, value, name ) {
            if ( value === "" ) {
                value = "false";
            }
            nodeHook.set( elem, value, name );
        }
    };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
    jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            get: function( elem ) {
                var ret = elem.getAttribute( name, 2 );
                return ret === null ? undefined : ret;
            }
        });
    });
}

if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
        get: function( elem ) {
            // Return undefined in the case of empty string
            // Normalize to lowercase since IE uppercases css property names
            return elem.style.cssText.toLowerCase() || undefined;
        },
        set: function( elem, value ) {
            return ( elem.style.cssText = "" + value );
        }
    };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
        get: function( elem ) {
            var parent = elem.parentNode;

            if ( parent ) {
                parent.selectedIndex;

                // Make sure that it also works with optgroups, see #5701
                if ( parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
            }
            return null;
        }
    });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
    jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            get: function( elem ) {
                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            }
        };
    });
}
jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
        set: function( elem, value ) {
            if ( jQuery.isArray( value ) ) {
                return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
            }
        }
    });
});




var rformElems = /^(?:textarea|input|select)$/i,
    rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
    rhoverHack = /\bhover(\.\S+)?\b/,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    quickParse = function( selector ) {
        var quick = rquickIs.exec( selector );
        if ( quick ) {
            //   0  1    2   3
            // [ _, tag, id, class ]
            quick[1] = ( quick[1] || "" ).toLowerCase();
            quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
        }
        return quick;
    },
    quickIs = function( elem, m ) {
        var attrs = elem.attributes || {};
        return (
            (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
            (!m[2] || (attrs.id || {}).value === m[2]) &&
            (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
        );
    },
    hoverHack = function( events ) {
        return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
    };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

    add: function( elem, types, handler, data, selector ) {

        var elemData, eventHandle, events,
            t, tns, type, namespaces, handleObj,
            handleObjIn, quick, handlers, special;

        // Don't attach events to noData or text/comment nodes (allow plain objects tho)
        if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
            return;
        }

        // Caller can pass in an object of custom data in lieu of the handler
        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
        }

        // Make sure that the handler has a unique ID, used to find/remove it later
        if ( !handler.guid ) {
            handler.guid = jQuery.guid++;
        }

        // Init the element's event structure and main handler, if this is the first
        events = elemData.events;
        if ( !events ) {
            elemData.events = events = {};
        }
        eventHandle = elemData.handle;
        if ( !eventHandle ) {
            elemData.handle = eventHandle = function( e ) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                    jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                    undefined;
            };
            // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
            eventHandle.elem = elem;
        }

        // Handle multiple events separated by a space
        // jQuery(...).bind("mouseover mouseout", fn);
        types = jQuery.trim( hoverHack(types) ).split( " " );
        for ( t = 0; t < types.length; t++ ) {

            tns = rtypenamespace.exec( types[t] ) || [];
            type = tns[1];
            namespaces = ( tns[2] || "" ).split( "." ).sort();

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[ type ] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = ( selector ? special.delegateType : special.bindType ) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[ type ] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend({
                type: type,
                origType: tns[1],
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                quick: quickParse( selector ),
                namespace: namespaces.join(".")
            }, handleObjIn );

            // Init the event handler queue if we're the first
            handlers = events[ type ];
            if ( !handlers ) {
                handlers = events[ type ] = [];
                handlers.delegateCount = 0;

                // Only use addEventListener/attachEvent if the special events handler returns false
                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                    // Bind the global event handler to the element
                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle, false );

                    } else if ( elem.attachEvent ) {
                        elem.attachEvent( "on" + type, eventHandle );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            // Add to the element's handler list, delegates in front
            if ( selector ) {
                handlers.splice( handlers.delegateCount++, 0, handleObj );
            } else {
                handlers.push( handleObj );
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[ type ] = true;
        }

        // Nullify elem to prevent memory leaks in IE
        elem = null;
    },

    global: {},

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, selector, mappedTypes ) {

        var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
            t, tns, type, origType, namespaces, origCount,
            j, events, special, handle, eventType, handleObj;

        if ( !elemData || !(events = elemData.events) ) {
            return;
        }

        // Once for each type.namespace in types; type may be omitted
        types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
        for ( t = 0; t < types.length; t++ ) {
            tns = rtypenamespace.exec( types[t] ) || [];
            type = origType = tns[1];
            namespaces = tns[2];

            // Unbind all events (on this namespace, if provided) for the element
            if ( !type ) {
                for ( type in events ) {
                    jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                }
                continue;
            }

            special = jQuery.event.special[ type ] || {};
            type = ( selector? special.delegateType : special.bindType ) || type;
            eventType = events[ type ] || [];
            origCount = eventType.length;
            namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

            // Remove matching events
            for ( j = 0; j < eventType.length; j++ ) {
                handleObj = eventType[ j ];

                if ( ( mappedTypes || origType === handleObj.origType ) &&
                     ( !handler || handler.guid === handleObj.guid ) &&
                     ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                     ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                    eventType.splice( j--, 1 );

                    if ( handleObj.selector ) {
                        eventType.delegateCount--;
                    }
                    if ( special.remove ) {
                        special.remove.call( elem, handleObj );
                    }
                }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if ( eventType.length === 0 && origCount !== eventType.length ) {
                if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                    jQuery.removeEvent( elem, type, elemData.handle );
                }

                delete events[ type ];
            }
        }

        // Remove the expando if it's no longer used
        if ( jQuery.isEmptyObject( events ) ) {
            handle = elemData.handle;
            if ( handle ) {
                handle.elem = null;
            }

            // removeData also checks for emptiness and clears the expando if empty
            // so use it instead of delete
            jQuery.removeData( elem, [ "events", "handle" ], true );
        }
    },

    // Events that are safe to short-circuit if no handlers are attached.
    // Native DOM events should not be added, they may have inline handlers.
    customEvent: {
        "getData": true,
        "setData": true,
        "changeData": true
    },

    trigger: function( event, data, elem, onlyHandlers ) {
        // Don't do events on text and comment nodes
        if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
            return;
        }

        // Event object or event type
        var type = event.type || event,
            namespaces = [],
            cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

        // focus/blur morphs to focusin/out; ensure we're not firing them right now
        if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
            return;
        }

        if ( type.indexOf( "!" ) >= 0 ) {
            // Exclusive events trigger only for the exact event (no namespaces)
            type = type.slice(0, -1);
            exclusive = true;
        }

        if ( type.indexOf( "." ) >= 0 ) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }

        if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
            // No jQuery handlers for this event type, and it can't have inline handlers
            return;
        }

        // Caller can pass in an Event, Object, or just an event type string
        event = typeof event === "object" ?
            // jQuery.Event object
            event[ jQuery.expando ] ? event :
            // Object literal
            new jQuery.Event( type, event ) :
            // Just the event type (string)
            new jQuery.Event( type );

        event.type = type;
        event.isTrigger = true;
        event.exclusive = exclusive;
        event.namespace = namespaces.join( "." );
        event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
        ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

        // Handle a global trigger
        if ( !elem ) {

            // TODO: Stop taunting the data cache; remove global events and always attach to document
            cache = jQuery.cache;
            for ( i in cache ) {
                if ( cache[ i ].events && cache[ i ].events[ type ] ) {
                    jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
                }
            }
            return;
        }

        // Clean up the event in case it is being reused
        event.result = undefined;
        if ( !event.target ) {
            event.target = elem;
        }

        // Clone any incoming data and prepend the event, creating the handler arg list
        data = data != null ? jQuery.makeArray( data ) : [];
        data.unshift( event );

        // Allow special events to draw outside the lines
        special = jQuery.event.special[ type ] || {};
        if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
            return;
        }

        // Determine event propagation path in advance, per W3C events spec (#9951)
        // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
        eventPath = [[ elem, special.bindType || type ]];
        if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

            bubbleType = special.delegateType || type;
            cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
            old = null;
            for ( ; cur; cur = cur.parentNode ) {
                eventPath.push([ cur, bubbleType ]);
                old = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if ( old && old === elem.ownerDocument ) {
                eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
            }
        }

        // Fire handlers on the event path
        for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

            cur = eventPath[i][0];
            event.type = eventPath[i][1];

            handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
            if ( handle ) {
                handle.apply( cur, data );
            }
            // Note that this is a bare JS function and not a jQuery handler
            handle = ontype && cur[ ontype ];
            if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
                event.preventDefault();
            }
        }
        event.type = type;

        // If nobody prevented the default action, do it now
        if ( !onlyHandlers && !event.isDefaultPrevented() ) {

            if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                // Call a native DOM method on the target with the same name name as the event.
                // Can't use an .isFunction() check here because IE6/7 fails that test.
                // Don't do default actions on window, that's where global variables be (#6170)
                // IE<9 dies on focus/blur to hidden element (#1486)
                if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

                    // Don't re-trigger an onFOO event when we call its FOO() method
                    old = elem[ ontype ];

                    if ( old ) {
                        elem[ ontype ] = null;
                    }

                    // Prevent re-triggering of the same event, since we already bubbled it above
                    jQuery.event.triggered = type;
                    elem[ type ]();
                    jQuery.event.triggered = undefined;

                    if ( old ) {
                        elem[ ontype ] = old;
                    }
                }
            }
        }

        return event.result;
    },

    dispatch: function( event ) {

        // Make a writable jQuery.Event from the native event object
        event = jQuery.event.fix( event || window.event );

        var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
            delegateCount = handlers.delegateCount,
            args = [].slice.call( arguments, 0 ),
            run_all = !event.exclusive && !event.namespace,
            handlerQueue = [],
            i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

        // Use the fix-ed jQuery.Event rather than the (read-only) native event
        args[0] = event;
        event.delegateTarget = this;

        // Determine handlers that should run if there are delegated events
        // Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
        if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

            // Pregenerate a single jQuery object for reuse with .is()
            jqcur = jQuery(this);
            jqcur.context = this.ownerDocument || this;

            for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
                selMatch = {};
                matches = [];
                jqcur[0] = cur;
                for ( i = 0; i < delegateCount; i++ ) {
                    handleObj = handlers[ i ];
                    sel = handleObj.selector;

                    if ( selMatch[ sel ] === undefined ) {
                        selMatch[ sel ] = (
                            handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
                        );
                    }
                    if ( selMatch[ sel ] ) {
                        matches.push( handleObj );
                    }
                }
                if ( matches.length ) {
                    handlerQueue.push({ elem: cur, matches: matches });
                }
            }
        }

        // Add the remaining (directly-bound) handlers
        if ( handlers.length > delegateCount ) {
            handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
        }

        // Run delegates first; they may want to stop propagation beneath us
        for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
            matched = handlerQueue[ i ];
            event.currentTarget = matched.elem;

            for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
                handleObj = matched.matches[ j ];

                // Triggered event must either 1) be non-exclusive and have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

                    event.data = handleObj.data;
                    event.handleObj = handleObj;

                    ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                    if ( ret !== undefined ) {
                        event.result = ret;
                        if ( ret === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        return event.result;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

    fixHooks: {},

    keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function( event, original ) {

            // Add which for key events
            if ( event.which == null ) {
                event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
        }
    },

    mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function( event, original ) {
            var eventDoc, doc, body,
                button = original.button,
                fromElement = original.fromElement;

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && original.clientX != null ) {
                eventDoc = event.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && fromElement ) {
                event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && button !== undefined ) {
                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
            }

            return event;
        }
    },

    fix: function( event ) {
        if ( event[ jQuery.expando ] ) {
            return event;
        }

        // Create a writable copy of the event object and normalize some properties
        var i, prop,
            originalEvent = event,
            fixHook = jQuery.event.fixHooks[ event.type ] || {},
            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        event = jQuery.Event( originalEvent );

        for ( i = copy.length; i; ) {
            prop = copy[ --i ];
            event[ prop ] = originalEvent[ prop ];
        }

        // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
        if ( !event.target ) {
            event.target = originalEvent.srcElement || document;
        }

        // Target should not be a text node (#504, Safari)
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
        if ( event.metaKey === undefined ) {
            event.metaKey = event.ctrlKey;
        }

        return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
    },

    special: {
        ready: {
            // Make sure the ready event is setup
            setup: jQuery.bindReady
        },

        load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
        },

        focus: {
            delegateType: "focusin"
        },
        blur: {
            delegateType: "focusout"
        },

        beforeunload: {
            setup: function( data, namespaces, eventHandle ) {
                // We only want to do this special case on windows
                if ( jQuery.isWindow( this ) ) {
                    this.onbeforeunload = eventHandle;
                }
            },

            teardown: function( namespaces, eventHandle ) {
                if ( this.onbeforeunload === eventHandle ) {
                    this.onbeforeunload = null;
                }
            }
        }
    },

    simulate: function( type, elem, event, bubble ) {
        // Piggyback on a donor event to simulate a different one.
        // Fake originalEvent to avoid donor's stopPropagation, but if the
        // simulated event prevents default then we do the same on the donor.
        var e = jQuery.extend(
            new jQuery.Event(),
            event,
            { type: type,
                isSimulated: true,
                originalEvent: {}
            }
        );
        if ( bubble ) {
            jQuery.event.trigger( e, null, elem );
        } else {
            jQuery.event.dispatch.call( elem, e );
        }
        if ( e.isDefaultPrevented() ) {
            event.preventDefault();
        }
    }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
    function( elem, type, handle ) {
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle, false );
        }
    } :
    function( elem, type, handle ) {
        if ( elem.detachEvent ) {
            elem.detachEvent( "on" + type, handle );
        }
    };

jQuery.Event = function( src, props ) {
    // Allow instantiation without the 'new' keyword
    if ( !(this instanceof jQuery.Event) ) {
        return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

    // Event type
    } else {
        this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
        jQuery.extend( this, props );
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

    // Mark it as fixed
    this[ jQuery.expando ] = true;
};

function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }

        // if preventDefault exists run it on the original event
        if ( e.preventDefault ) {
            e.preventDefault();

        // otherwise set the returnValue property of the original event to false (IE)
        } else {
            e.returnValue = false;
        }
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }
        // if stopPropagation exists run it on the original event
        if ( e.stopPropagation ) {
            e.stopPropagation();
        }
        // otherwise set the cancelBubble property of the original event to true (IE)
        e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        delegateType: fix,
        bindType: fix,

        handle: function( event ) {
            var target = this,
                related = event.relatedTarget,
                handleObj = event.handleObj,
                selector = handleObj.selector,
                ret;

            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = fix;
            }
            return ret;
        }
    };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
        setup: function() {
            // Only need this for delegated form submit events
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            // Lazy-add a submit handler when a descendant form may potentially be submitted
            jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                // Node name check avoids a VML-related crash in IE (#9807)
                var elem = e.target,
                    form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                if ( form && !form._submit_attached ) {
                    jQuery.event.add( form, "submit._submit", function( event ) {
                        // If form was submitted by the user, bubble the event up the tree
                        if ( this.parentNode && !event.isTrigger ) {
                            jQuery.event.simulate( "submit", this.parentNode, event, true );
                        }
                    });
                    form._submit_attached = true;
                }
            });
            // return undefined since we don't need an event listener
        },

        teardown: function() {
            // Only need this for delegated form submit events
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
            jQuery.event.remove( this, "._submit" );
        }
    };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

    jQuery.event.special.change = {

        setup: function() {

            if ( rformElems.test( this.nodeName ) ) {
                // IE doesn't fire change on a check/radio until blur; trigger it on click
                // after a propertychange. Eat the blur-change in special.change.handle.
                // This still fires onchange a second time for check/radio after blur.
                if ( this.type === "checkbox" || this.type === "radio" ) {
                    jQuery.event.add( this, "propertychange._change", function( event ) {
                        if ( event.originalEvent.propertyName === "checked" ) {
                            this._just_changed = true;
                        }
                    });
                    jQuery.event.add( this, "click._change", function( event ) {
                        if ( this._just_changed && !event.isTrigger ) {
                            this._just_changed = false;
                            jQuery.event.simulate( "change", this, event, true );
                        }
                    });
                }
                return false;
            }
            // Delegated event; lazy-add a change handler on descendant inputs
            jQuery.event.add( this, "beforeactivate._change", function( e ) {
                var elem = e.target;

                if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
                    jQuery.event.add( elem, "change._change", function( event ) {
                        if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                            jQuery.event.simulate( "change", this.parentNode, event, true );
                        }
                    });
                    elem._change_attached = true;
                }
            });
        },

        handle: function( event ) {
            var elem = event.target;

            // Swallow native change events from checkbox/radio, we already triggered them above
            if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                return event.handleObj.handler.apply( this, arguments );
            }
        },

        teardown: function() {
            jQuery.event.remove( this, "._change" );

            return rformElems.test( this.nodeName );
        }
    };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        // Attach a single capturing handler while someone wants focusin/focusout
        var attaches = 0,
            handler = function( event ) {
                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
            };

        jQuery.event.special[ fix ] = {
            setup: function() {
                if ( attaches++ === 0 ) {
                    document.addEventListener( orig, handler, true );
                }
            },
            teardown: function() {
                if ( --attaches === 0 ) {
                    document.removeEventListener( orig, handler, true );
                }
            }
        };
    });
}

jQuery.fn.extend({

    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
        var origFn, type;

        // Types can be a map of types/handlers
        if ( typeof types === "object" ) {
            // ( types-Object, selector, data )
            if ( typeof selector !== "string" ) {
                // ( types-Object, data )
                data = selector;
                selector = undefined;
            }
            for ( type in types ) {
                this.on( type, selector, data, types[ type ], one );
            }
            return this;
        }

        if ( data == null && fn == null ) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {
                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {
                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return this;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {
                // Can use an empty set, since event contains the info
                jQuery().off( event );
                return origFn.apply( this, arguments );
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
        }
        return this.each( function() {
            jQuery.event.add( this, types, fn, data, selector );
        });
    },
    one: function( types, selector, data, fn ) {
        return this.on.call( this, types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        if ( types && types.preventDefault && types.handleObj ) {
            // ( event )  dispatched jQuery.Event
            var handleObj = types.handleObj;
            jQuery( types.delegateTarget ).off(
                handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {
            // ( types-object [, selector] )
            for ( var type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each(function() {
            jQuery.event.remove( this, types, fn, selector );
        });
    },

    bind: function( types, data, fn ) {
        return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
        return this.off( types, null, fn );
    },

    live: function( types, data, fn ) {
        jQuery( this.context ).on( types, this.selector, data, fn );
        return this;
    },
    die: function( types, fn ) {
        jQuery( this.context ).off( types, this.selector || "**", fn );
        return this;
    },

    delegate: function( selector, types, data, fn ) {
        return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {
        // ( namespace ) or ( selector, types [, fn] )
        return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
    },

    trigger: function( type, data ) {
        return this.each(function() {
            jQuery.event.trigger( type, data, this );
        });
    },
    triggerHandler: function( type, data ) {
        if ( this[0] ) {
            return jQuery.event.trigger( type, data, this[0], true );
        }
    },

    toggle: function( fn ) {
        // Save reference to arguments for access in closure
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    },

    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
        if ( fn == null ) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ?
            this.on( name, null, data, fn ) :
            this.trigger( name );
    };

    if ( jQuery.attrFn ) {
        jQuery.attrFn[ name ] = true;
    }

    if ( rkeyEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
    }

    if ( rmouseEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
    }
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    expando = "sizcache" + (Math.random() + '').replace('.', ''),
    done = 0,
    toString = Object.prototype.toString,
    hasDuplicate = false,
    baseHasDuplicate = true,
    rBackslash = /\\/g,
    rReturn = /\r\n/g,
    rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
    baseHasDuplicate = false;
    return 0;
});

var Sizzle = function( selector, context, results, seed ) {
    results = results || [];
    context = context || document;

    var origContext = context;

    if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
        return [];
    }
    
    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    var m, set, checkSet, extra, ret, cur, pop, i,
        prune = true,
        contextXML = Sizzle.isXML( context ),
        parts = [],
        soFar = selector;
    
    // Reset the position of the chunker regexp (start from head)
    do {
        chunker.exec( "" );
        m = chunker.exec( soFar );

        if ( m ) {
            soFar = m[3];
        
            parts.push( m[1] );
        
            if ( m[2] ) {
                extra = m[3];
                break;
            }
        }
    } while ( m );

    if ( parts.length > 1 && origPOS.exec( selector ) ) {

        if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
            set = posProcess( parts[0] + parts[1], context, seed );

        } else {
            set = Expr.relative[ parts[0] ] ?
                [ context ] :
                Sizzle( parts.shift(), context );

            while ( parts.length ) {
                selector = parts.shift();

                if ( Expr.relative[ selector ] ) {
                    selector += parts.shift();
                }
                
                set = posProcess( selector, set, seed );
            }
        }

    } else {
        // Take a shortcut and set the context if the root selector is an ID
        // (but not if it'll be faster if the inner selector is an ID)
        if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

            ret = Sizzle.find( parts.shift(), context, contextXML );
            context = ret.expr ?
                Sizzle.filter( ret.expr, ret.set )[0] :
                ret.set[0];
        }

        if ( context ) {
            ret = seed ?
                { expr: parts.pop(), set: makeArray(seed) } :
                Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

            set = ret.expr ?
                Sizzle.filter( ret.expr, ret.set ) :
                ret.set;

            if ( parts.length > 0 ) {
                checkSet = makeArray( set );

            } else {
                prune = false;
            }

            while ( parts.length ) {
                cur = parts.pop();
                pop = cur;

                if ( !Expr.relative[ cur ] ) {
                    cur = "";
                } else {
                    pop = parts.pop();
                }

                if ( pop == null ) {
                    pop = context;
                }

                Expr.relative[ cur ]( checkSet, pop, contextXML );
            }

        } else {
            checkSet = parts = [];
        }
    }

    if ( !checkSet ) {
        checkSet = set;
    }

    if ( !checkSet ) {
        Sizzle.error( cur || selector );
    }

    if ( toString.call(checkSet) === "[object Array]" ) {
        if ( !prune ) {
            results.push.apply( results, checkSet );

        } else if ( context && context.nodeType === 1 ) {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                    results.push( set[i] );
                }
            }

        } else {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                    results.push( set[i] );
                }
            }
        }

    } else {
        makeArray( checkSet, results );
    }

    if ( extra ) {
        Sizzle( extra, origContext, results, seed );
        Sizzle.uniqueSort( results );
    }

    return results;
};

Sizzle.uniqueSort = function( results ) {
    if ( sortOrder ) {
        hasDuplicate = baseHasDuplicate;
        results.sort( sortOrder );

        if ( hasDuplicate ) {
            for ( var i = 1; i < results.length; i++ ) {
                if ( results[i] === results[ i - 1 ] ) {
                    results.splice( i--, 1 );
                }
            }
        }
    }

    return results;
};

Sizzle.matches = function( expr, set ) {
    return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
    return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
    var set, i, len, match, type, left;

    if ( !expr ) {
        return [];
    }

    for ( i = 0, len = Expr.order.length; i < len; i++ ) {
        type = Expr.order[i];
        
        if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
            left = match[1];
            match.splice( 1, 1 );

            if ( left.substr( left.length - 1 ) !== "\\" ) {
                match[1] = (match[1] || "").replace( rBackslash, "" );
                set = Expr.find[ type ]( match, context, isXML );

                if ( set != null ) {
                    expr = expr.replace( Expr.match[ type ], "" );
                    break;
                }
            }
        }
    }

    if ( !set ) {
        set = typeof context.getElementsByTagName !== "undefined" ?
            context.getElementsByTagName( "*" ) :
            [];
    }

    return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
    var match, anyFound,
        type, found, item, filter, left,
        i, pass,
        old = expr,
        result = [],
        curLoop = set,
        isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

    while ( expr && set.length ) {
        for ( type in Expr.filter ) {
            if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                filter = Expr.filter[ type ];
                left = match[1];

                anyFound = false;

                match.splice(1,1);

                if ( left.substr( left.length - 1 ) === "\\" ) {
                    continue;
                }

                if ( curLoop === result ) {
                    result = [];
                }

                if ( Expr.preFilter[ type ] ) {
                    match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                    if ( !match ) {
                        anyFound = found = true;

                    } else if ( match === true ) {
                        continue;
                    }
                }

                if ( match ) {
                    for ( i = 0; (item = curLoop[i]) != null; i++ ) {
                        if ( item ) {
                            found = filter( item, match, i, curLoop );
                            pass = not ^ found;

                            if ( inplace && found != null ) {
                                if ( pass ) {
                                    anyFound = true;

                                } else {
                                    curLoop[i] = false;
                                }

                            } else if ( pass ) {
                                result.push( item );
                                anyFound = true;
                            }
                        }
                    }
                }

                if ( found !== undefined ) {
                    if ( !inplace ) {
                        curLoop = result;
                    }

                    expr = expr.replace( Expr.match[ type ], "" );

                    if ( !anyFound ) {
                        return [];
                    }

                    break;
                }
            }
        }

        // Improper expression
        if ( expr === old ) {
            if ( anyFound == null ) {
                Sizzle.error( expr );

            } else {
                break;
            }
        }

        old = expr;
    }

    return curLoop;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
        nodeType = elem.nodeType,
        ret = "";

    if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 ) {
            // Use textContent || innerText for elements
            if ( typeof elem.textContent === 'string' ) {
                return elem.textContent;
            } else if ( typeof elem.innerText === 'string' ) {
                // Replace IE's carriage returns
                return elem.innerText.replace( rReturn, '' );
            } else {
                // Traverse it's children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
    } else {

        // If no nodeType, this is expected to be an array
        for ( i = 0; (node = elem[i]); i++ ) {
            // Do not traverse comment nodes
            if ( node.nodeType !== 8 ) {
                ret += getText( node );
            }
        }
    }
    return ret;
};

var Expr = Sizzle.selectors = {
    order: [ "ID", "NAME", "TAG" ],

    match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },

    leftMatch: {},

    attrMap: {
        "class": "className",
        "for": "htmlFor"
    },

    attrHandle: {
        href: function( elem ) {
            return elem.getAttribute( "href" );
        },
        type: function( elem ) {
            return elem.getAttribute( "type" );
        }
    },

    relative: {
        "+": function(checkSet, part){
            var isPartStr = typeof part === "string",
                isTag = isPartStr && !rNonWord.test( part ),
                isPartStrNotTag = isPartStr && !isTag;

            if ( isTag ) {
                part = part.toLowerCase();
            }

            for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                if ( (elem = checkSet[i]) ) {
                    while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                    checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                        elem || false :
                        elem === part;
                }
            }

            if ( isPartStrNotTag ) {
                Sizzle.filter( part, checkSet, true );
            }
        },

        ">": function( checkSet, part ) {
            var elem,
                isPartStr = typeof part === "string",
                i = 0,
                l = checkSet.length;

            if ( isPartStr && !rNonWord.test( part ) ) {
                part = part.toLowerCase();

                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        var parent = elem.parentNode;
                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                    }
                }

            } else {
                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        checkSet[i] = isPartStr ?
                            elem.parentNode :
                            elem.parentNode === part;
                    }
                }

                if ( isPartStr ) {
                    Sizzle.filter( part, checkSet, true );
                }
            }
        },

        "": function(checkSet, part, isXML){
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
        },

        "~": function( checkSet, part, isXML ) {
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
        }
    },

    find: {
        ID: function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);
                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                return m && m.parentNode ? [m] : [];
            }
        },

        NAME: function( match, context ) {
            if ( typeof context.getElementsByName !== "undefined" ) {
                var ret = [],
                    results = context.getElementsByName( match[1] );

                for ( var i = 0, l = results.length; i < l; i++ ) {
                    if ( results[i].getAttribute("name") === match[1] ) {
                        ret.push( results[i] );
                    }
                }

                return ret.length === 0 ? null : ret;
            }
        },

        TAG: function( match, context ) {
            if ( typeof context.getElementsByTagName !== "undefined" ) {
                return context.getElementsByTagName( match[1] );
            }
        }
    },
    preFilter: {
        CLASS: function( match, curLoop, inplace, result, not, isXML ) {
            match = " " + match[1].replace( rBackslash, "" ) + " ";

            if ( isXML ) {
                return match;
            }

            for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                if ( elem ) {
                    if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                        if ( !inplace ) {
                            result.push( elem );
                        }

                    } else if ( inplace ) {
                        curLoop[i] = false;
                    }
                }
            }

            return false;
        },

        ID: function( match ) {
            return match[1].replace( rBackslash, "" );
        },

        TAG: function( match, curLoop ) {
            return match[1].replace( rBackslash, "" ).toLowerCase();
        },

        CHILD: function( match ) {
            if ( match[1] === "nth" ) {
                if ( !match[2] ) {
                    Sizzle.error( match[0] );
                }

                match[2] = match[2].replace(/^\+|\s*/g, '');

                // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                    match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                    !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                // calculate the numbers (first)n+(last) including if they are negative
                match[2] = (test[1] + (test[2] || 1)) - 0;
                match[3] = test[3] - 0;
            }
            else if ( match[2] ) {
                Sizzle.error( match[0] );
            }

            // TODO: Move to normal caching system
            match[0] = done++;

            return match;
        },

        ATTR: function( match, curLoop, inplace, result, not, isXML ) {
            var name = match[1] = match[1].replace( rBackslash, "" );
            
            if ( !isXML && Expr.attrMap[name] ) {
                match[1] = Expr.attrMap[name];
            }

            // Handle if an un-quoted value was used
            match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

            if ( match[2] === "~=" ) {
                match[4] = " " + match[4] + " ";
            }

            return match;
        },

        PSEUDO: function( match, curLoop, inplace, result, not ) {
            if ( match[1] === "not" ) {
                // If we're dealing with a complex expression, or a simple one
                if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                    match[3] = Sizzle(match[3], null, null, curLoop);

                } else {
                    var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                    if ( !inplace ) {
                        result.push.apply( result, ret );
                    }

                    return false;
                }

            } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                return true;
            }
            
            return match;
        },

        POS: function( match ) {
            match.unshift( true );

            return match;
        }
    },
    
    filters: {
        enabled: function( elem ) {
            return elem.disabled === false && elem.type !== "hidden";
        },

        disabled: function( elem ) {
            return elem.disabled === true;
        },

        checked: function( elem ) {
            return elem.checked === true;
        },
        
        selected: function( elem ) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }
            
            return elem.selected === true;
        },

        parent: function( elem ) {
            return !!elem.firstChild;
        },

        empty: function( elem ) {
            return !elem.firstChild;
        },

        has: function( elem, i, match ) {
            return !!Sizzle( match[3], elem ).length;
        },

        header: function( elem ) {
            return (/h\d/i).test( elem.nodeName );
        },

        text: function( elem ) {
            var attr = elem.getAttribute( "type" ), type = elem.type;
            // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
            // use getAttribute instead to test this case
            return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
        },

        radio: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
        },

        checkbox: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
        },

        file: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
        },

        password: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
        },

        submit: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "submit" === elem.type;
        },

        image: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
        },

        reset: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "reset" === elem.type;
        },

        button: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && "button" === elem.type || name === "button";
        },

        input: function( elem ) {
            return (/input|select|textarea|button/i).test( elem.nodeName );
        },

        focus: function( elem ) {
            return elem === elem.ownerDocument.activeElement;
        }
    },
    setFilters: {
        first: function( elem, i ) {
            return i === 0;
        },

        last: function( elem, i, match, array ) {
            return i === array.length - 1;
        },

        even: function( elem, i ) {
            return i % 2 === 0;
        },

        odd: function( elem, i ) {
            return i % 2 === 1;
        },

        lt: function( elem, i, match ) {
            return i < match[3] - 0;
        },

        gt: function( elem, i, match ) {
            return i > match[3] - 0;
        },

        nth: function( elem, i, match ) {
            return match[3] - 0 === i;
        },

        eq: function( elem, i, match ) {
            return match[3] - 0 === i;
        }
    },
    filter: {
        PSEUDO: function( elem, match, i, array ) {
            var name = match[1],
                filter = Expr.filters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );

            } else if ( name === "contains" ) {
                return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

            } else if ( name === "not" ) {
                var not = match[3];

                for ( var j = 0, l = not.length; j < l; j++ ) {
                    if ( not[j] === elem ) {
                        return false;
                    }
                }

                return true;

            } else {
                Sizzle.error( name );
            }
        },

        CHILD: function( elem, match ) {
            var first, last,
                doneName, parent, cache,
                count, diff,
                type = match[1],
                node = elem;

            switch ( type ) {
                case "only":
                case "first":
                    while ( (node = node.previousSibling) )  {
                        if ( node.nodeType === 1 ) { 
                            return false; 
                        }
                    }

                    if ( type === "first" ) { 
                        return true; 
                    }

                    node = elem;

                case "last":
                    while ( (node = node.nextSibling) )  {
                        if ( node.nodeType === 1 ) { 
                            return false; 
                        }
                    }

                    return true;

                case "nth":
                    first = match[2];
                    last = match[3];

                    if ( first === 1 && last === 0 ) {
                        return true;
                    }
                    
                    doneName = match[0];
                    parent = elem.parentNode;
    
                    if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
                        count = 0;
                        
                        for ( node = parent.firstChild; node; node = node.nextSibling ) {
                            if ( node.nodeType === 1 ) {
                                node.nodeIndex = ++count;
                            }
                        } 

                        parent[ expando ] = doneName;
                    }
                    
                    diff = elem.nodeIndex - last;

                    if ( first === 0 ) {
                        return diff === 0;

                    } else {
                        return ( diff % first === 0 && diff / first >= 0 );
                    }
            }
        },

        ID: function( elem, match ) {
            return elem.nodeType === 1 && elem.getAttribute("id") === match;
        },

        TAG: function( elem, match ) {
            return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
        },
        
        CLASS: function( elem, match ) {
            return (" " + (elem.className || elem.getAttribute("class")) + " ")
                .indexOf( match ) > -1;
        },

        ATTR: function( elem, match ) {
            var name = match[1],
                result = Sizzle.attr ?
                    Sizzle.attr( elem, name ) :
                    Expr.attrHandle[ name ] ?
                    Expr.attrHandle[ name ]( elem ) :
                    elem[ name ] != null ?
                        elem[ name ] :
                        elem.getAttribute( name ),
                value = result + "",
                type = match[2],
                check = match[4];

            return result == null ?
                type === "!=" :
                !type && Sizzle.attr ?
                result != null :
                type === "=" ?
                value === check :
                type === "*=" ?
                value.indexOf(check) >= 0 :
                type === "~=" ?
                (" " + value + " ").indexOf(check) >= 0 :
                !check ?
                value && result !== false :
                type === "!=" ?
                value !== check :
                type === "^=" ?
                value.indexOf(check) === 0 :
                type === "$=" ?
                value.substr(value.length - check.length) === check :
                type === "|=" ?
                value === check || value.substr(0, check.length + 1) === check + "-" :
                false;
        },

        POS: function( elem, match, i, array ) {
            var name = match[2],
                filter = Expr.setFilters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );
            }
        }
    }
};

var origPOS = Expr.match.POS,
    fescape = function(all, num){
        return "\\" + (num - 0 + 1);
    };

for ( var type in Expr.match ) {
    Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
    Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
    array = Array.prototype.slice.call( array, 0 );

    if ( results ) {
        results.push.apply( results, array );
        return results;
    }
    
    return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
    Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
    makeArray = function( array, results ) {
        var i = 0,
            ret = results || [];

        if ( toString.call(array) === "[object Array]" ) {
            Array.prototype.push.apply( ret, array );

        } else {
            if ( typeof array.length === "number" ) {
                for ( var l = array.length; i < l; i++ ) {
                    ret.push( array[i] );
                }

            } else {
                for ( ; array[i]; i++ ) {
                    ret.push( array[i] );
                }
            }
        }

        return ret;
    };
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
            return a.compareDocumentPosition ? -1 : 1;
        }

        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    };

} else {
    sortOrder = function( a, b ) {
        // The nodes are identical, we can exit early
        if ( a === b ) {
            hasDuplicate = true;
            return 0;

        // Fallback to using sourceIndex (in IE) if it's available on both nodes
        } else if ( a.sourceIndex && b.sourceIndex ) {
            return a.sourceIndex - b.sourceIndex;
        }

        var al, bl,
            ap = [],
            bp = [],
            aup = a.parentNode,
            bup = b.parentNode,
            cur = aup;

        // If the nodes are siblings (or identical) we can do a quick check
        if ( aup === bup ) {
            return siblingCheck( a, b );

        // If no parents were found then the nodes are disconnected
        } else if ( !aup ) {
            return -1;

        } else if ( !bup ) {
            return 1;
        }

        // Otherwise they're somewhere else in the tree so we need
        // to build up a full list of the parentNodes for comparison
        while ( cur ) {
            ap.unshift( cur );
            cur = cur.parentNode;
        }

        cur = bup;

        while ( cur ) {
            bp.unshift( cur );
            cur = cur.parentNode;
        }

        al = ap.length;
        bl = bp.length;

        // Start walking down the tree looking for a discrepancy
        for ( var i = 0; i < al && i < bl; i++ ) {
            if ( ap[i] !== bp[i] ) {
                return siblingCheck( ap[i], bp[i] );
            }
        }

        // We ended someplace up the tree so do a sibling check
        return i === al ?
            siblingCheck( a, bp[i], -1 ) :
            siblingCheck( ap[i], b, 1 );
    };

    siblingCheck = function( a, b, ret ) {
        if ( a === b ) {
            return ret;
        }

        var cur = a.nextSibling;

        while ( cur ) {
            if ( cur === b ) {
                return -1;
            }

            cur = cur.nextSibling;
        }

        return 1;
    };
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
    // We're going to inject a fake input element with a specified name
    var form = document.createElement("div"),
        id = "script" + (new Date()).getTime(),
        root = document.documentElement;

    form.innerHTML = "<a name='" + id + "'/>";

    // Inject it into the root element, check its status, and remove it quickly
    root.insertBefore( form, root.firstChild );

    // The workaround has to do additional checks after a getElementById
    // Which slows things down for other browsers (hence the branching)
    if ( document.getElementById( id ) ) {
        Expr.find.ID = function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);

                return m ?
                    m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                        [m] :
                        undefined :
                    [];
            }
        };

        Expr.filter.ID = function( elem, match ) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

            return elem.nodeType === 1 && node && node.nodeValue === match;
        };
    }

    root.removeChild( form );

    // release memory in IE
    root = form = null;
})();

(function(){
    // Check to see if the browser returns only elements
    // when doing getElementsByTagName("*")

    // Create a fake element
    var div = document.createElement("div");
    div.appendChild( document.createComment("") );

    // Make sure no comments are found
    if ( div.getElementsByTagName("*").length > 0 ) {
        Expr.find.TAG = function( match, context ) {
            var results = context.getElementsByTagName( match[1] );

            // Filter out possible comments
            if ( match[1] === "*" ) {
                var tmp = [];

                for ( var i = 0; results[i]; i++ ) {
                    if ( results[i].nodeType === 1 ) {
                        tmp.push( results[i] );
                    }
                }

                results = tmp;
            }

            return results;
        };
    }

    // Check to see if an attribute returns normalized href attributes
    div.innerHTML = "<a href='#'></a>";

    if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
            div.firstChild.getAttribute("href") !== "#" ) {

        Expr.attrHandle.href = function( elem ) {
            return elem.getAttribute( "href", 2 );
        };
    }

    // release memory in IE
    div = null;
})();

if ( document.querySelectorAll ) {
    (function(){
        var oldSizzle = Sizzle,
            div = document.createElement("div"),
            id = "__sizzle__";

        div.innerHTML = "<p class='TEST'></p>";

        // Safari can't handle uppercase or unicode characters when
        // in quirks mode.
        if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
            return;
        }
    
        Sizzle = function( query, context, extra, seed ) {
            context = context || document;

            // Only use querySelectorAll on non-XML documents
            // (ID selectors don't work in non-HTML documents)
            if ( !seed && !Sizzle.isXML(context) ) {
                // See if we find a selector to speed up
                var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
                
                if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                    // Speed-up: Sizzle("TAG")
                    if ( match[1] ) {
                        return makeArray( context.getElementsByTagName( query ), extra );
                    
                    // Speed-up: Sizzle(".CLASS")
                    } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                        return makeArray( context.getElementsByClassName( match[2] ), extra );
                    }
                }
                
                if ( context.nodeType === 9 ) {
                    // Speed-up: Sizzle("body")
                    // The body element only exists once, optimize finding it
                    if ( query === "body" && context.body ) {
                        return makeArray( [ context.body ], extra );
                        
                    // Speed-up: Sizzle("#ID")
                    } else if ( match && match[3] ) {
                        var elem = context.getElementById( match[3] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id === match[3] ) {
                                return makeArray( [ elem ], extra );
                            }
                            
                        } else {
                            return makeArray( [], extra );
                        }
                    }
                    
                    try {
                        return makeArray( context.querySelectorAll(query), extra );
                    } catch(qsaError) {}

                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    var oldContext = context,
                        old = context.getAttribute( "id" ),
                        nid = old || id,
                        hasParent = context.parentNode,
                        relativeHierarchySelector = /^\s*[+~]/.test( query );

                    if ( !old ) {
                        context.setAttribute( "id", nid );
                    } else {
                        nid = nid.replace( /'/g, "\\$&" );
                    }
                    if ( relativeHierarchySelector && hasParent ) {
                        context = context.parentNode;
                    }

                    try {
                        if ( !relativeHierarchySelector || hasParent ) {
                            return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                        }

                    } catch(pseudoError) {
                    } finally {
                        if ( !old ) {
                            oldContext.removeAttribute( "id" );
                        }
                    }
                }
            }
        
            return oldSizzle(query, context, extra, seed);
        };

        for ( var prop in oldSizzle ) {
            Sizzle[ prop ] = oldSizzle[ prop ];
        }

        // release memory in IE
        div = null;
    })();
}

(function(){
    var html = document.documentElement,
        matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

    if ( matches ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9 fails this)
        var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
            pseudoWorks = false;

        try {
            // This should fail with an exception
            // Gecko does not error, returns false instead
            matches.call( document.documentElement, "[test!='']:sizzle" );
    
        } catch( pseudoError ) {
            pseudoWorks = true;
        }

        Sizzle.matchesSelector = function( node, expr ) {
            // Make sure that attribute selectors are quoted
            expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

            if ( !Sizzle.isXML( node ) ) {
                try { 
                    if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                        var ret = matches.call( node, expr );

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if ( ret || !disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9, so check for that
                                node.document && node.document.nodeType !== 11 ) {
                            return ret;
                        }
                    }
                } catch(e) {}
            }

            return Sizzle(expr, null, null, [node]).length > 0;
        };
    }
})();

(function(){
    var div = document.createElement("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";

    // Opera can't find a second classname (in 9.6)
    // Also, make sure that getElementsByClassName actually exists
    if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
        return;
    }

    // Safari caches class attributes, doesn't catch changes (in 3.2)
    div.lastChild.className = "e";

    if ( div.getElementsByClassName("e").length === 1 ) {
        return;
    }
    
    Expr.order.splice(1, 0, "CLASS");
    Expr.find.CLASS = function( match, context, isXML ) {
        if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
            return context.getElementsByClassName(match[1]);
        }
    };

    // release memory in IE
    div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;

            elem = elem[dir];

            while ( elem ) {
                if ( elem[ expando ] === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 && !isXML ){
                    elem[ expando ] = doneName;
                    elem.sizset = i;
                }

                if ( elem.nodeName.toLowerCase() === cur ) {
                    match = elem;
                    break;
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;
            
            elem = elem[dir];

            while ( elem ) {
                if ( elem[ expando ] === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 ) {
                    if ( !isXML ) {
                        elem[ expando ] = doneName;
                        elem.sizset = i;
                    }

                    if ( typeof cur !== "string" ) {
                        if ( elem === cur ) {
                            match = true;
                            break;
                        }

                    } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                        match = elem;
                        break;
                    }
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

if ( document.documentElement.contains ) {
    Sizzle.contains = function( a, b ) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };

} else if ( document.documentElement.compareDocumentPosition ) {
    Sizzle.contains = function( a, b ) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

} else {
    Sizzle.contains = function() {
        return false;
    };
}

Sizzle.isXML = function( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833) 
    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
    var match,
        tmpSet = [],
        later = "",
        root = context.nodeType ? [context] : context;

    // Position selectors must be done after the filter
    // And so must :not(positional) so we move all PSEUDOs to the end
    while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
        later += match[0];
        selector = selector.replace( Expr.match.PSEUDO, "" );
    }

    selector = Expr.relative[selector] ? selector + "*" : selector;

    for ( var i = 0, l = root.length; i < l; i++ ) {
        Sizzle( selector, root[i], tmpSet, seed );
    }

    return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
    rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
    rmultiselector = /,/,
    isSimple = /^.[^:#\[\.,]*$/,
    slice = Array.prototype.slice,
    POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

jQuery.fn.extend({
    find: function( selector ) {
        var self = this,
            i, l;

        if ( typeof selector !== "string" ) {
            return jQuery( selector ).filter(function() {
                for ( i = 0, l = self.length; i < l; i++ ) {
                    if ( jQuery.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            });
        }

        var ret = this.pushStack( "", "find", selector ),
            length, n, r;

        for ( i = 0, l = this.length; i < l; i++ ) {
            length = ret.length;
            jQuery.find( selector, this[i], ret );

            if ( i > 0 ) {
                // Make sure that the results are unique
                for ( n = length; n < ret.length; n++ ) {
                    for ( r = 0; r < length; r++ ) {
                        if ( ret[r] === ret[n] ) {
                            ret.splice(n--, 1);
                            break;
                        }
                    }
                }
            }
        }

        return ret;
    },

    has: function( target ) {
        var targets = jQuery( target );
        return this.filter(function() {
            for ( var i = 0, l = targets.length; i < l; i++ ) {
                if ( jQuery.contains( this, targets[i] ) ) {
                    return true;
                }
            }
        });
    },

    not: function( selector ) {
        return this.pushStack( winnow(this, selector, false), "not", selector);
    },

    filter: function( selector ) {
        return this.pushStack( winnow(this, selector, true), "filter", selector );
    },

    is: function( selector ) {
        return !!selector && ( 
            typeof selector === "string" ?
                // If this is a positional selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                POS.test( selector ) ? 
                    jQuery( selector, this.context ).index( this[0] ) >= 0 :
                    jQuery.filter( selector, this ).length > 0 :
                this.filter( selector ).length > 0 );
    },

    closest: function( selectors, context ) {
        var ret = [], i, l, cur = this[0];
        
        // Array (deprecated as of jQuery 1.7)
        if ( jQuery.isArray( selectors ) ) {
            var level = 1;

            while ( cur && cur.ownerDocument && cur !== context ) {
                for ( i = 0; i < selectors.length; i++ ) {

                    if ( jQuery( cur ).is( selectors[ i ] ) ) {
                        ret.push({ selector: selectors[ i ], elem: cur, level: level });
                    }
                }

                cur = cur.parentNode;
                level++;
            }

            return ret;
        }

        // String
        var pos = POS.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

        for ( i = 0, l = this.length; i < l; i++ ) {
            cur = this[i];

            while ( cur ) {
                if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                    ret.push( cur );
                    break;

                } else {
                    cur = cur.parentNode;
                    if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
                        break;
                    }
                }
            }
        }

        ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

        return this.pushStack( ret, "closest", selectors );
    },

    // Determine the position of an element within
    // the matched set of elements
    index: function( elem ) {

        // No argument, return index in parent
        if ( !elem ) {
            return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
        }

        // index in selector
        if ( typeof elem === "string" ) {
            return jQuery.inArray( this[0], jQuery( elem ) );
        }

        // Locate the position of the desired element
        return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
        var set = typeof selector === "string" ?
                jQuery( selector, context ) :
                jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
            all = jQuery.merge( this.get(), set );

        return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
            all :
            jQuery.unique( all ) );
    },

    andSelf: function() {
        return this.add( this.prevObject );
    }
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
    parent: function( elem ) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
        return jQuery.dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "parentNode", until );
    },
    next: function( elem ) {
        return jQuery.nth( elem, 2, "nextSibling" );
    },
    prev: function( elem ) {
        return jQuery.nth( elem, 2, "previousSibling" );
    },
    nextAll: function( elem ) {
        return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
        return jQuery.dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
        return jQuery.sibling( elem.parentNode.firstChild, elem );
    },
    children: function( elem ) {
        return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
        return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
            jQuery.makeArray( elem.childNodes );
    }
}, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
        var ret = jQuery.map( this, fn, until );

        if ( !runtil.test( name ) ) {
            selector = until;
        }

        if ( selector && typeof selector === "string" ) {
            ret = jQuery.filter( selector, ret );
        }

        ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

        if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
            ret = ret.reverse();
        }

        return this.pushStack( ret, name, slice.call( arguments ).join(",") );
    };
});

jQuery.extend({
    filter: function( expr, elems, not ) {
        if ( not ) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 ?
            jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
            jQuery.find.matches(expr, elems);
    },

    dir: function( elem, dir, until ) {
        var matched = [],
            cur = elem[ dir ];

        while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
            if ( cur.nodeType === 1 ) {
                matched.push( cur );
            }
            cur = cur[dir];
        }
        return matched;
    },

    nth: function( cur, result, dir, elem ) {
        result = result || 1;
        var num = 0;

        for ( ; cur; cur = cur[dir] ) {
            if ( cur.nodeType === 1 && ++num === result ) {
                break;
            }
        }

        return cur;
    },

    sibling: function( n, elem ) {
        var r = [];

        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                r.push( n );
            }
        }

        return r;
    }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

    // Can't pass null or undefined to indexOf in Firefox 4
    // Set to 0 to skip string check
    qualifier = qualifier || 0;

    if ( jQuery.isFunction( qualifier ) ) {
        return jQuery.grep(elements, function( elem, i ) {
            var retVal = !!qualifier.call( elem, i, elem );
            return retVal === keep;
        });

    } else if ( qualifier.nodeType ) {
        return jQuery.grep(elements, function( elem, i ) {
            return ( elem === qualifier ) === keep;
        });

    } else if ( typeof qualifier === "string" ) {
        var filtered = jQuery.grep(elements, function( elem ) {
            return elem.nodeType === 1;
        });

        if ( isSimple.test( qualifier ) ) {
            return jQuery.filter(qualifier, filtered, !keep);
        } else {
            qualifier = jQuery.filter( qualifier, filtered );
        }
    }

    return jQuery.grep(elements, function( elem, i ) {
        return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
    });
}




function createSafeFragment( document ) {
    var list = nodeNames.split( "|" ),
    safeFrag = document.createDocumentFragment();

    if ( safeFrag.createElement ) {
        while ( list.length ) {
            safeFrag.createElement(
                list.pop()
            );
        }
    }
    return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style)/i,
    rnocache = /<(?:script|object|embed|option|style)/i,
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
    wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    },
    safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
    wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
    text: function( text ) {
        if ( jQuery.isFunction(text) ) {
            return this.each(function(i) {
                var self = jQuery( this );

                self.text( text.call(this, i, self.text()) );
            });
        }

        if ( typeof text !== "object" && text !== undefined ) {
            return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
        }

        return jQuery.text( this );
    },

    wrapAll: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapAll( html.call(this, i) );
            });
        }

        if ( this[0] ) {
            // The elements to wrap the target around
            var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

            if ( this[0].parentNode ) {
                wrap.insertBefore( this[0] );
            }

            wrap.map(function() {
                var elem = this;

                while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                    elem = elem.firstChild;
                }

                return elem;
            }).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapInner( html.call(this, i) );
            });
        }

        return this.each(function() {
            var self = jQuery( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        });
    },

    wrap: function( html ) {
        var isFunction = jQuery.isFunction( html );

        return this.each(function(i) {
            jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
        });
    },

    unwrap: function() {
        return this.parent().each(function() {
            if ( !jQuery.nodeName( this, "body" ) ) {
                jQuery( this ).replaceWith( this.childNodes );
            }
        }).end();
    },

    append: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.appendChild( elem );
            }
        });
    },

    prepend: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.insertBefore( elem, this.firstChild );
            }
        });
    },

    before: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this );
            });
        } else if ( arguments.length ) {
            var set = jQuery.clean( arguments );
            set.push.apply( set, this.toArray() );
            return this.pushStack( set, "before", arguments );
        }
    },

    after: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this.nextSibling );
            });
        } else if ( arguments.length ) {
            var set = this.pushStack( this, "after", arguments );
            set.push.apply( set, jQuery.clean(arguments) );
            return set;
        }
    },

    // keepData is for internal use only--do not document
    remove: function( selector, keepData ) {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                if ( !keepData && elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                    jQuery.cleanData( [ elem ] );
                }

                if ( elem.parentNode ) {
                    elem.parentNode.removeChild( elem );
                }
            }
        }

        return this;
    },

    empty: function() {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            // Remove element nodes and prevent memory leaks
            if ( elem.nodeType === 1 ) {
                jQuery.cleanData( elem.getElementsByTagName("*") );
            }

            // Remove any remaining nodes
            while ( elem.firstChild ) {
                elem.removeChild( elem.firstChild );
            }
        }

        return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map( function () {
            return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
        });
    },

    html: function( value ) {
        if ( value === undefined ) {
            return this[0] && this[0].nodeType === 1 ?
                this[0].innerHTML.replace(rinlinejQuery, "") :
                null;

        // See if we can take a shortcut and just use innerHTML
        } else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
            (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
            !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

            value = value.replace(rxhtmlTag, "<$1></$2>");

            try {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    // Remove element nodes and prevent memory leaks
                    if ( this[i].nodeType === 1 ) {
                        jQuery.cleanData( this[i].getElementsByTagName("*") );
                        this[i].innerHTML = value;
                    }
                }

            // If using innerHTML throws an exception, use the fallback method
            } catch(e) {
                this.empty().append( value );
            }

        } else if ( jQuery.isFunction( value ) ) {
            this.each(function(i){
                var self = jQuery( this );

                self.html( value.call(this, i, self.html()) );
            });

        } else {
            this.empty().append( value );
        }

        return this;
    },

    replaceWith: function( value ) {
        if ( this[0] && this[0].parentNode ) {
            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this), old = self.html();
                    self.replaceWith( value.call( this, i, old ) );
                });
            }

            if ( typeof value !== "string" ) {
                value = jQuery( value ).detach();
            }

            return this.each(function() {
                var next = this.nextSibling,
                    parent = this.parentNode;

                jQuery( this ).remove();

                if ( next ) {
                    jQuery(next).before( value );
                } else {
                    jQuery(parent).append( value );
                }
            });
        } else {
            return this.length ?
                this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                this;
        }
    },

    detach: function( selector ) {
        return this.remove( selector, true );
    },

    domManip: function( args, table, callback ) {
        var results, first, fragment, parent,
            value = args[0],
            scripts = [];

        // We can't cloneNode fragments that contain checked, in WebKit
        if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
            return this.each(function() {
                jQuery(this).domManip( args, table, callback, true );
            });
        }

        if ( jQuery.isFunction(value) ) {
            return this.each(function(i) {
                var self = jQuery(this);
                args[0] = value.call(this, i, table ? self.html() : undefined);
                self.domManip( args, table, callback );
            });
        }

        if ( this[0] ) {
            parent = value && value.parentNode;

            // If we're in a fragment, just use that instead of building a new one
            if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
                results = { fragment: parent };

            } else {
                results = jQuery.buildFragment( args, this, scripts );
            }

            fragment = results.fragment;

            if ( fragment.childNodes.length === 1 ) {
                first = fragment = fragment.firstChild;
            } else {
                first = fragment.firstChild;
            }

            if ( first ) {
                table = table && jQuery.nodeName( first, "tr" );

                for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
                    callback.call(
                        table ?
                            root(this[i], first) :
                            this[i],
                        // Make sure that we do not leak memory by inadvertently discarding
                        // the original fragment (which might have attached data) instead of
                        // using it; in addition, use the original fragment object for the last
                        // item instead of first because it can end up being emptied incorrectly
                        // in certain situations (Bug #8070).
                        // Fragments from the fragment cache must always be cloned and never used
                        // in place.
                        results.cacheable || ( l > 1 && i < lastIndex ) ?
                            jQuery.clone( fragment, true, true ) :
                            fragment
                    );
                }
            }

            if ( scripts.length ) {
                jQuery.each( scripts, evalScript );
            }
        }

        return this;
    }
});

function root( elem, cur ) {
    return jQuery.nodeName(elem, "table") ?
        (elem.getElementsByTagName("tbody")[0] ||
        elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
        elem;
}

function cloneCopyEvent( src, dest ) {

    if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
        return;
    }

    var type, i, l,
        oldData = jQuery._data( src ),
        curData = jQuery._data( dest, oldData ),
        events = oldData.events;

    if ( events ) {
        delete curData.handle;
        curData.events = {};

        for ( type in events ) {
            for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
            }
        }
    }

    // make the cloned public data object a copy from the original
    if ( curData.data ) {
        curData.data = jQuery.extend( {}, curData.data );
    }
}

function cloneFixAttributes( src, dest ) {
    var nodeName;

    // We do not need to do anything for non-Elements
    if ( dest.nodeType !== 1 ) {
        return;
    }

    // clearAttributes removes the attributes, which we don't want,
    // but also removes the attachEvent events, which we *do* want
    if ( dest.clearAttributes ) {
        dest.clearAttributes();
    }

    // mergeAttributes, in contrast, only merges back on the
    // original attributes, not the events
    if ( dest.mergeAttributes ) {
        dest.mergeAttributes( src );
    }

    nodeName = dest.nodeName.toLowerCase();

    // IE6-8 fail to clone children inside object elements that use
    // the proprietary classid attribute value (rather than the type
    // attribute) to identify the type of content to display
    if ( nodeName === "object" ) {
        dest.outerHTML = src.outerHTML;

    } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
        // IE6-8 fails to persist the checked state of a cloned checkbox
        // or radio button. Worse, IE6-7 fail to give the cloned element
        // a checked appearance if the defaultChecked value isn't also set
        if ( src.checked ) {
            dest.defaultChecked = dest.checked = src.checked;
        }

        // IE6-7 get confused and end up setting the value of a cloned
        // checkbox/radio button to an empty string instead of "on"
        if ( dest.value !== src.value ) {
            dest.value = src.value;
        }

    // IE6-8 fails to return the selected option to the default selected
    // state when cloning options
    } else if ( nodeName === "option" ) {
        dest.selected = src.defaultSelected;

    // IE6-8 fails to set the defaultValue to the correct value when
    // cloning other types of input fields
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
        dest.defaultValue = src.defaultValue;
    }

    // Event data gets referenced instead of copied if the expando
    // gets copied too
    dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
    var fragment, cacheable, cacheresults, doc,
    first = args[ 0 ];

    // nodes may contain either an explicit document object,
    // a jQuery collection or context object.
    // If nodes[0] contains a valid object to assign to doc
    if ( nodes && nodes[0] ) {
        doc = nodes[0].ownerDocument || nodes[0];
    }

    // Ensure that an attr object doesn't incorrectly stand in as a document object
    // Chrome and Firefox seem to allow this to occur and will throw exception
    // Fixes #8950
    if ( !doc.createDocumentFragment ) {
        doc = document;
    }

    // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
    if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
        first.charAt(0) === "<" && !rnocache.test( first ) &&
        (jQuery.support.checkClone || !rchecked.test( first )) &&
        (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

        cacheable = true;

        cacheresults = jQuery.fragments[ first ];
        if ( cacheresults && cacheresults !== 1 ) {
            fragment = cacheresults;
        }
    }

    if ( !fragment ) {
        fragment = doc.createDocumentFragment();
        jQuery.clean( args, doc, fragment, scripts );
    }

    if ( cacheable ) {
        jQuery.fragments[ first ] = cacheresults ? fragment : 1;
    }

    return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
        var ret = [],
            insert = jQuery( selector ),
            parent = this.length === 1 && this[0].parentNode;

        if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
            insert[ original ]( this[0] );
            return this;

        } else {
            for ( var i = 0, l = insert.length; i < l; i++ ) {
                var elems = ( i > 0 ? this.clone(true) : this ).get();
                jQuery( insert[i] )[ original ]( elems );
                ret = ret.concat( elems );
            }

            return this.pushStack( ret, name, insert.selector );
        }
    };
});

function getAll( elem ) {
    if ( typeof elem.getElementsByTagName !== "undefined" ) {
        return elem.getElementsByTagName( "*" );

    } else if ( typeof elem.querySelectorAll !== "undefined" ) {
        return elem.querySelectorAll( "*" );

    } else {
        return [];
    }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
    if ( elem.type === "checkbox" || elem.type === "radio" ) {
        elem.defaultChecked = elem.checked;
    }
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
    var nodeName = ( elem.nodeName || "" ).toLowerCase();
    if ( nodeName === "input" ) {
        fixDefaultChecked( elem );
    // Skip scripts, get other children
    } else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
        jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
    }
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
    var div = document.createElement( "div" );
    safeFragment.appendChild( div );

    div.innerHTML = elem.outerHTML;
    return div.firstChild;
}

jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
        var srcElements,
            destElements,
            i,
            // IE<=8 does not properly clone detached, unknown element nodes
            clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
                elem.cloneNode( true ) :
                shimCloneNode( elem );

        if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
            // IE copies events bound via attachEvent when using cloneNode.
            // Calling detachEvent on the clone will also remove the events
            // from the original. In order to get around this, we use some
            // proprietary methods to clear the events. Thanks to MooTools
            // guys for this hotness.

            cloneFixAttributes( elem, clone );

            // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
            srcElements = getAll( elem );
            destElements = getAll( clone );

            // Weird iteration because IE will replace the length property
            // with an element if you are cloning the body and one of the
            // elements on the page has a name or id of "length"
            for ( i = 0; srcElements[i]; ++i ) {
                // Ensure that the destination node is not null; Fixes #9587
                if ( destElements[i] ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }
            }
        }

        // Copy the events from the original to the clone
        if ( dataAndEvents ) {
            cloneCopyEvent( elem, clone );

            if ( deepDataAndEvents ) {
                srcElements = getAll( elem );
                destElements = getAll( clone );

                for ( i = 0; srcElements[i]; ++i ) {
                    cloneCopyEvent( srcElements[i], destElements[i] );
                }
            }
        }

        srcElements = destElements = null;

        // Return the cloned set
        return clone;
    },

    clean: function( elems, context, fragment, scripts ) {
        var checkScriptType;

        context = context || document;

        // !context.createElement fails in IE with an error but returns typeof 'object'
        if ( typeof context.createElement === "undefined" ) {
            context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
        }

        var ret = [], j;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( typeof elem === "number" ) {
                elem += "";
            }

            if ( !elem ) {
                continue;
            }

            // Convert html string into DOM nodes
            if ( typeof elem === "string" ) {
                if ( !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );
                } else {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
                        wrap = wrapMap[ tag ] || wrapMap._default,
                        depth = wrap[0],
                        div = context.createElement("div");

                    // Append wrapper element to unknown element safe doc fragment
                    if ( context === document ) {
                        // Use the fragment we've already created for this document
                        safeFragment.appendChild( div );
                    } else {
                        // Use a fragment created with the owner document
                        createSafeFragment( context ).appendChild( div );
                    }

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if ( !jQuery.support.tbody ) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }
                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = div.childNodes;
                }
            }

            // Resets defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            var len;
            if ( !jQuery.support.appendChecked ) {
                if ( elem[0] && typeof (len = elem.length) === "number" ) {
                    for ( j = 0; j < len; j++ ) {
                        findInputs( elem[j] );
                    }
                } else {
                    findInputs( elem );
                }
            }

            if ( elem.nodeType ) {
                ret.push( elem );
            } else {
                ret = jQuery.merge( ret, elem );
            }
        }

        if ( fragment ) {
            checkScriptType = function( elem ) {
                return !elem.type || rscriptType.test( elem.type );
            };
            for ( i = 0; ret[i]; i++ ) {
                if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                    scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

                } else {
                    if ( ret[i].nodeType === 1 ) {
                        var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

                        ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                    }
                    fragment.appendChild( ret[i] );
                }
            }
        }

        return ret;
    },

    cleanData: function( elems ) {
        var data, id,
            cache = jQuery.cache,
            special = jQuery.event.special,
            deleteExpando = jQuery.support.deleteExpando;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                continue;
            }

            id = elem[ jQuery.expando ];

            if ( id ) {
                data = cache[ id ];

                if ( data && data.events ) {
                    for ( var type in data.events ) {
                        if ( special[ type ] ) {
                            jQuery.event.remove( elem, type );

                        // This is a shortcut to avoid jQuery.event.remove's overhead
                        } else {
                            jQuery.removeEvent( elem, type, data.handle );
                        }
                    }

                    // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                    if ( data.handle ) {
                        data.handle.elem = null;
                    }
                }

                if ( deleteExpando ) {
                    delete elem[ jQuery.expando ];

                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( jQuery.expando );
                }

                delete cache[ id ];
            }
        }
    }
});

function evalScript( i, elem ) {
    if ( elem.src ) {
        jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
        });
    } else {
        jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
    }

    if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
    }
}




var ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    // fixed for IE9, see #8346
    rupper = /([A-Z]|^ms)/g,
    rnumpx = /^-?\d+(?:px)?$/i,
    rnum = /^-?\d/,
    rrelNum = /^([\-+])=([\-+.\de]+)/,

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssWidth = [ "Left", "Right" ],
    cssHeight = [ "Top", "Bottom" ],
    curCSS,

    getComputedStyle,
    currentStyle;

jQuery.fn.css = function( name, value ) {
    // Setting 'undefined' is a no-op
    if ( arguments.length === 2 && value === undefined ) {
        return this;
    }

    return jQuery.access( this, name, value, true, function( elem, name, value ) {
        return value !== undefined ?
            jQuery.style( elem, name, value ) :
            jQuery.css( elem, name );
    });
};

jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
        opacity: {
            get: function( elem, computed ) {
                if ( computed ) {
                    // We should always get a number back from opacity
                    var ret = curCSS( elem, "opacity", "opacity" );
                    return ret === "" ? "1" : ret;

                } else {
                    return elem.style.opacity;
                }
            }
        }
    },

    // Exclude the following css properties to add px
    cssNumber: {
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
        // normalize float css property
        "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },

    // Get and set the style property on a DOM Node
    style: function( elem, name, value, extra ) {
        // Don't set styles on text and comment nodes
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        // Make sure that we're working with the right name
        var ret, type, origName = jQuery.camelCase( name ),
            style = elem.style, hooks = jQuery.cssHooks[ origName ];

        name = jQuery.cssProps[ origName ] || origName;

        // Check if we're setting a value
        if ( value !== undefined ) {
            type = typeof value;

            // convert relative number strings (+= or -=) to relative numbers. #7345
            if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
                // Fixes bug #9237
                type = "number";
            }

            // Make sure that NaN and null values aren't set. See: #7116
            if ( value == null || type === "number" && isNaN( value ) ) {
                return;
            }

            // If a number was passed in, add 'px' to the (except for certain CSS properties)
            if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                value += "px";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
                // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                // Fixes bug #5509
                try {
                    style[ name ] = value;
                } catch(e) {}
            }

        } else {
            // If a hook was provided get the non-computed value from there
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                return ret;
            }

            // Otherwise just get the value from the style object
            return style[ name ];
        }
    },

    css: function( elem, name, extra ) {
        var ret, hooks;

        // Make sure that we're working with the right name
        name = jQuery.camelCase( name );
        hooks = jQuery.cssHooks[ name ];
        name = jQuery.cssProps[ name ] || name;

        // cssFloat needs a special treatment
        if ( name === "cssFloat" ) {
            name = "float";
        }

        // If a hook was provided get the computed value from there
        if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
            return ret;

        // Otherwise, if a way to get the computed value exists, use that
        } else if ( curCSS ) {
            return curCSS( elem, name );
        }
    },

    // A method for quickly swapping in/out CSS properties to get correct calculations
    swap: function( elem, options, callback ) {
        var old = {};

        // Remember the old values, and insert the new ones
        for ( var name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        callback.call( elem );

        // Revert the old values
        for ( name in options ) {
            elem.style[ name ] = old[ name ];
        }
    }
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
    jQuery.cssHooks[ name ] = {
        get: function( elem, computed, extra ) {
            var val;

            if ( computed ) {
                if ( elem.offsetWidth !== 0 ) {
                    return getWH( elem, name, extra );
                } else {
                    jQuery.swap( elem, cssShow, function() {
                        val = getWH( elem, name, extra );
                    });
                }

                return val;
            }
        },

        set: function( elem, value ) {
            if ( rnumpx.test( value ) ) {
                // ignore negative width and height values #1599
                value = parseFloat( value );

                if ( value >= 0 ) {
                    return value + "px";
                }

            } else {
                return value;
            }
        }
    };
});

if ( !jQuery.support.opacity ) {
    jQuery.cssHooks.opacity = {
        get: function( elem, computed ) {
            // IE uses filters for opacity
            return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( parseFloat( RegExp.$1 ) / 100 ) + "" :
                computed ? "1" : "";
        },

        set: function( elem, value ) {
            var style = elem.style,
                currentStyle = elem.currentStyle,
                opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                filter = currentStyle && currentStyle.filter || style.filter || "";

            // IE has trouble with opacity if it does not have layout
            // Force it by setting the zoom level
            style.zoom = 1;

            // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
            if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

                // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                // if "filter:" is present at all, clearType is disabled, we want to avoid this
                // style.removeAttribute is IE Only, but so apparently is this code path...
                style.removeAttribute( "filter" );

                // if there there is no filter style applied in a css rule, we are done
                if ( currentStyle && !currentStyle.filter ) {
                    return;
                }
            }

            // otherwise, set new filter values
            style.filter = ralpha.test( filter ) ?
                filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
        }
    };
}

jQuery(function() {
    // This hook cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    if ( !jQuery.support.reliableMarginRight ) {
        jQuery.cssHooks.marginRight = {
            get: function( elem, computed ) {
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // Work around by temporarily setting element display to inline-block
                var ret;
                jQuery.swap( elem, { "display": "inline-block" }, function() {
                    if ( computed ) {
                        ret = curCSS( elem, "margin-right", "marginRight" );
                    } else {
                        ret = elem.style.marginRight;
                    }
                });
                return ret;
            }
        };
    }
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
    getComputedStyle = function( elem, name ) {
        var ret, defaultView, computedStyle;

        name = name.replace( rupper, "-$1" ).toLowerCase();

        if ( (defaultView = elem.ownerDocument.defaultView) &&
                (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
            ret = computedStyle.getPropertyValue( name );
            if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
                ret = jQuery.style( elem, name );
            }
        }

        return ret;
    };
}

if ( document.documentElement.currentStyle ) {
    currentStyle = function( elem, name ) {
        var left, rsLeft, uncomputed,
            ret = elem.currentStyle && elem.currentStyle[ name ],
            style = elem.style;

        // Avoid setting ret to empty string here
        // so we don't default to auto
        if ( ret === null && style && (uncomputed = style[ name ]) ) {
            ret = uncomputed;
        }

        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels
        if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

            // Remember the original values
            left = style.left;
            rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                elem.runtimeStyle.left = elem.currentStyle.left;
            }
            style.left = name === "fontSize" ? "1em" : ( ret || 0 );
            ret = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                elem.runtimeStyle.left = rsLeft;
            }
        }

        return ret === "" ? "auto" : ret;
    };
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

    // Start with offset property
    var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        which = name === "width" ? cssWidth : cssHeight,
        i = 0,
        len = which.length;

    if ( val > 0 ) {
        if ( extra !== "border" ) {
            for ( ; i < len; i++ ) {
                if ( !extra ) {
                    val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
                }
                if ( extra === "margin" ) {
                    val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
                } else {
                    val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
                }
            }
        }

        return val + "px";
    }

    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, name );
    if ( val < 0 || val == null ) {
        val = elem.style[ name ] || 0;
    }
    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;

    // Add padding, border, margin
    if ( extra ) {
        for ( ; i < len; i++ ) {
            val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
            if ( extra !== "padding" ) {
                val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
            }
            if ( extra === "margin" ) {
                val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
            }
        }
    }

    return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
        var width = elem.offsetWidth,
            height = elem.offsetHeight;

        return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
    };

    jQuery.expr.filters.visible = function( elem ) {
        return !jQuery.expr.filters.hidden( elem );
    };
}




var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rhash = /#.*$/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rselectTextarea = /^(?:select|textarea)/i,
    rspacesAjax = /\s+/,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

    // Keep a copy of the old load method
    _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    // Document location
    ajaxLocation,

    // Document location segments
    ajaxLocParts,

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
    ajaxLocation = location.href;
} catch( e ) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

    // dataTypeExpression is optional and defaults to "*"
    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        if ( jQuery.isFunction( func ) ) {
            var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
                i = 0,
                length = dataTypes.length,
                dataType,
                list,
                placeBefore;

            // For each dataType in the dataTypeExpression
            for ( ; i < length; i++ ) {
                dataType = dataTypes[ i ];
                // We control if we're asked to add before
                // any existing element
                placeBefore = /^\+/.test( dataType );
                if ( placeBefore ) {
                    dataType = dataType.substr( 1 ) || "*";
                }
                list = structure[ dataType ] = structure[ dataType ] || [];
                // then we add to the structure accordingly
                list[ placeBefore ? "unshift" : "push" ]( func );
            }
        }
    };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
        dataType /* internal */, inspected /* internal */ ) {

    dataType = dataType || options.dataTypes[ 0 ];
    inspected = inspected || {};

    inspected[ dataType ] = true;

    var list = structure[ dataType ],
        i = 0,
        length = list ? list.length : 0,
        executeOnly = ( structure === prefilters ),
        selection;

    for ( ; i < length && ( executeOnly || !selection ); i++ ) {
        selection = list[ i ]( options, originalOptions, jqXHR );
        // If we got redirected to another dataType
        // we try there if executing only and not done already
        if ( typeof selection === "string" ) {
            if ( !executeOnly || inspected[ selection ] ) {
                selection = undefined;
            } else {
                options.dataTypes.unshift( selection );
                selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
            }
        }
    }
    // If we're only executing or nothing was selected
    // we try the catchall dataType if not done already
    if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
        selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
    }
    // unnecessary when only executing (prefilters)
    // but it'll be ignored by the caller in that case
    return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for ( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        jQuery.extend( true, target, deep );
    }
}

jQuery.fn.extend({
    load: function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );

        // Don't do a request if no elements are being requested
        } else if ( !this.length ) {
            return this;
        }

        var off = url.indexOf( " " );
        if ( off >= 0 ) {
            var selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // Default to a GET request
        var type = "GET";

        // If the second parameter was provided
        if ( params ) {
            // If it's a function
            if ( jQuery.isFunction( params ) ) {
                // We assume that it's the callback
                callback = params;
                params = undefined;

            // Otherwise, build a param string
            } else if ( typeof params === "object" ) {
                params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                type = "POST";
            }
        }

        var self = this;

        // Request the remote document
        jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params,
            // Complete callback (responseText is used internally)
            complete: function( jqXHR, status, responseText ) {
                // Store the response as specified by the jqXHR object
                responseText = jqXHR.responseText;
                // If successful, inject the HTML into all the matched elements
                if ( jqXHR.isResolved() ) {
                    // #4825: Get the actual response in case
                    // a dataFilter is present in ajaxSettings
                    jqXHR.done(function( r ) {
                        responseText = r;
                    });
                    // See if a selector was specified
                    self.html( selector ?
                        // Create a dummy div to hold the results
                        jQuery("<div>")
                            // inject the contents of the document in, removing the scripts
                            // to avoid any 'Permission Denied' errors in IE
                            .append(responseText.replace(rscript, ""))

                            // Locate the specified elements
                            .find(selector) :

                        // If not, just inject the full result
                        responseText );
                }

                if ( callback ) {
                    self.each( callback, [ responseText, status, jqXHR ] );
                }
            }
        });

        return this;
    },

    serialize: function() {
        return jQuery.param( this.serializeArray() );
    },

    serializeArray: function() {
        return this.map(function(){
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        })
        .filter(function(){
            return this.name && !this.disabled &&
                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                    rinput.test( this.type ) );
        })
        .map(function( i, elem ){
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val, i ){
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
    jQuery.fn[ o ] = function( f ){
        return this.on( o, f );
    };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        // shift arguments if data argument was omitted
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
});

jQuery.extend({

    getScript: function( url, callback ) {
        return jQuery.get( url, undefined, callback, "script" );
    },

    getJSON: function( url, data, callback ) {
        return jQuery.get( url, data, callback, "json" );
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function( target, settings ) {
        if ( settings ) {
            // Building a settings object
            ajaxExtend( target, jQuery.ajaxSettings );
        } else {
            // Extending ajaxSettings
            settings = target;
            target = jQuery.ajaxSettings;
        }
        ajaxExtend( target, settings );
        return target;
    },

    ajaxSettings: {
        url: ajaxLocation,
        isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
        global: true,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        processData: true,
        async: true,
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        traditional: false,
        headers: {},
        */

        accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            text: "text/plain",
            json: "application/json, text/javascript",
            "*": allTypes
        },

        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText"
        },

        // List of data converters
        // 1) key format is "source_type destination_type" (a single space in-between)
        // 2) the catchall symbol "*" can be used for source_type
        converters: {

            // Convert anything to text
            "* text": window.String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
        },

        // For options that shouldn't be deep extended:
        // you can add your own custom options here if
        // and when you create one that shouldn't be
        // deep extended (see ajaxExtend)
        flatOptions: {
            context: true,
            url: true
        }
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    // Main method
    ajax: function( url, options ) {

        // If url is an object, simulate pre-1.5 signature
        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        // Force options to be an object
        options = options || {};

        var // Create the final options object
            s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
            callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
            globalEventContext = callbackContext !== s &&
                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                        jQuery( callbackContext ) : jQuery.event,
            // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks( "once memory" ),
            // Status-dependent callbacks
            statusCode = s.statusCode || {},
            // ifModified key
            ifModifiedKey,
            // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},
            // Response headers
            responseHeadersString,
            responseHeaders,
            // transport
            transport,
            // timeout handle
            timeoutTimer,
            // Cross-domain detection vars
            parts,
            // The jqXHR state
            state = 0,
            // To know if global events are to be dispatched
            fireGlobals,
            // Loop variable
            i,
            // Fake xhr
            jqXHR = {

                readyState: 0,

                // Caches the header
                setRequestHeader: function( name, value ) {
                    if ( !state ) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                // Raw string
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                // Builds headers hashtable if needed
                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match === undefined ? null : match;
                },

                // Overrides response content-type header
                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                // Cancel the request
                abort: function( statusText ) {
                    statusText = statusText || "abort";
                    if ( transport ) {
                        transport.abort( statusText );
                    }
                    done( 0, statusText );
                    return this;
                }
            };

        // Callback for when everything is done
        // It is defined here because jslint complains if it is declared
        // at the end of the function (which would be more logical and readable)
        function done( status, nativeStatusText, responses, headers ) {

            // Called once
            if ( state === 2 ) {
                return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if ( timeoutTimer ) {
                clearTimeout( timeoutTimer );
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            var isSuccess,
                success,
                error,
                statusText = nativeStatusText,
                response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
                lastModified,
                etag;

            // If successful, handle type chaining
            if ( status >= 200 && status < 300 || status === 304 ) {

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {

                    if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
                        jQuery.lastModified[ ifModifiedKey ] = lastModified;
                    }
                    if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
                        jQuery.etag[ ifModifiedKey ] = etag;
                    }
                }

                // If not modified
                if ( status === 304 ) {

                    statusText = "notmodified";
                    isSuccess = true;

                // If we have data
                } else {

                    try {
                        success = ajaxConvert( s, response );
                        statusText = "success";
                        isSuccess = true;
                    } catch(e) {
                        // We have a parsererror
                        statusText = "parsererror";
                        error = e;
                    }
                }
            } else {
                // We extract error from statusText
                // then normalize statusText and status for non-aborts
                error = statusText;
                if ( !statusText || status ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = "" + ( nativeStatusText || statusText );

            // Success/Error
            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            // Status-dependent callbacks
            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
            }

            // Complete
            completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                // Handle the global AJAX counter
                if ( !( --jQuery.active ) ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }
        }

        // Attach deferreds
        deferred.promise( jqXHR );
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;
        jqXHR.complete = completeDeferred.add;

        // Status-dependent callbacks
        jqXHR.statusCode = function( map ) {
            if ( map ) {
                var tmp;
                if ( state < 2 ) {
                    for ( tmp in map ) {
                        statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                    }
                } else {
                    tmp = map[ jqXHR.status ];
                    jqXHR.then( tmp, tmp );
                }
            }
            return this;
        };

        // Remove hash character (#7531: and string promotion)
        // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
        // We also use the url parameter if available
        s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

        // Extract dataTypes list
        s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

        // Determine if a cross-domain request is in order
        if ( s.crossDomain == null ) {
            parts = rurl.exec( s.url.toLowerCase() );
            s.crossDomain = !!( parts &&
                ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
            );
        }

        // Convert data if not already a string
        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = jQuery.param( s.data, s.traditional );
        }

        // Apply prefilters
        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        // If request was aborted inside a prefiler, stop there
        if ( state === 2 ) {
            return false;
        }

        // We can fire global events as of now if asked to
        fireGlobals = s.global;

        // Uppercase the type
        s.type = s.type.toUpperCase();

        // Determine if request has content
        s.hasContent = !rnoContent.test( s.type );

        // Watch for a new set of requests
        if ( fireGlobals && jQuery.active++ === 0 ) {
            jQuery.event.trigger( "ajaxStart" );
        }

        // More options handling for requests with no content
        if ( !s.hasContent ) {

            // If data is available, append data to url
            if ( s.data ) {
                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                // #9682: remove data so that it's not used in an eventual retry
                delete s.data;
            }

            // Get ifModifiedKey before adding the anti-cache parameter
            ifModifiedKey = s.url;

            // Add anti-cache in url if needed
            if ( s.cache === false ) {

                var ts = jQuery.now(),
                    // try replacing _= if it is there
                    ret = s.url.replace( rts, "$1_=" + ts );

                // if nothing was replaced, add timestamp to the end
                s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
            }
        }

        // Set the correct header, if data is being sent
        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
            ifModifiedKey = ifModifiedKey || s.url;
            if ( jQuery.lastModified[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
            }
            if ( jQuery.etag[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
            }
        }

        // Set the Accepts header for the server, depending on the dataType
        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        // Check for headers option
        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        // Allow custom headers/mimetypes and early abort
        if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already
                jqXHR.abort();
                return false;

        }

        // Install callbacks on deferreds
        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        // Get transport
        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        // If no transport, we auto-abort
        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;
            // Send global event
            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }
            // Timeout
            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = setTimeout( function(){
                    jqXHR.abort( "timeout" );
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch (e) {
                // Propagate exception as error if not done
                if ( state < 2 ) {
                    done( -1, e );
                // Simply rethrow otherwise
                } else {
                    throw e;
                }
            }
        }

        return jqXHR;
    },

    // Serialize an array of form elements or a set of
    // key/values into a query string
    param: function( a, traditional ) {
        var s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : value;
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( var prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    }
});

function buildParams( prefix, obj, traditional, add ) {
    if ( jQuery.isArray( obj ) ) {
        // Serialize array item.
        jQuery.each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {
                // Treat each array item as a scalar.
                add( prefix, v );

            } else {
                // If array item is non-scalar (array or object), encode its
                // numeric index to resolve deserialization ambiguity issues.
                // Note that rack (as of 1.0.0) can't currently deserialize
                // nested arrays properly, and attempting to do so may cause
                // a server error. Possible fixes are to modify rack's
                // deserialization algorithm or to provide an option or flag
                // to force array serialization to be shallow.
                buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
            }
        });

    } else if ( !traditional && obj != null && typeof obj === "object" ) {
        // Serialize object item.
        for ( var name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        }

    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

    var contents = s.contents,
        dataTypes = s.dataTypes,
        responseFields = s.responseFields,
        ct,
        type,
        finalDataType,
        firstDataType;

    // Fill responseXXX fields
    for ( type in responseFields ) {
        if ( type in responses ) {
            jqXHR[ responseFields[type] ] = responses[ type ];
        }
    }

    // Remove auto dataType and get content-type in the process
    while( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
        }
    }

    // Check if we're dealing with a known content-type
    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    // Check to see if we have a response for the expected dataType
    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {
        // Try convertible dataTypes
        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }
        // Or just use first one
        finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

    // Apply the dataFilter if provided
    if ( s.dataFilter ) {
        response = s.dataFilter( response, s.dataType );
    }

    var dataTypes = s.dataTypes,
        converters = {},
        i,
        key,
        length = dataTypes.length,
        tmp,
        // Current and previous dataTypes
        current = dataTypes[ 0 ],
        prev,
        // Conversion expression
        conversion,
        // Conversion function
        conv,
        // Conversion functions (transitive conversion)
        conv1,
        conv2;

    // For each dataType in the chain
    for ( i = 1; i < length; i++ ) {

        // Create converters map
        // with lowercased keys
        if ( i === 1 ) {
            for ( key in s.converters ) {
                if ( typeof key === "string" ) {
                    converters[ key.toLowerCase() ] = s.converters[ key ];
                }
            }
        }

        // Get the dataTypes
        prev = current;
        current = dataTypes[ i ];

        // If current is auto dataType, update it to prev
        if ( current === "*" ) {
            current = prev;
        // If no auto and dataTypes are actually different
        } else if ( prev !== "*" && prev !== current ) {

            // Get the converter
            conversion = prev + " " + current;
            conv = converters[ conversion ] || converters[ "* " + current ];

            // If there is no direct converter, search transitively
            if ( !conv ) {
                conv2 = undefined;
                for ( conv1 in converters ) {
                    tmp = conv1.split( " " );
                    if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
                        conv2 = converters[ tmp[1] + " " + current ];
                        if ( conv2 ) {
                            conv1 = converters[ conv1 ];
                            if ( conv1 === true ) {
                                conv = conv2;
                            } else if ( conv2 === true ) {
                                conv = conv1;
                            }
                            break;
                        }
                    }
                }
            }
            // If we found no converter, dispatch an error
            if ( !( conv || conv2 ) ) {
                jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
            }
            // If found converter is not an equivalence
            if ( conv !== true ) {
                // Convert with 1 or 2 converters accordingly
                response = conv ? conv( response ) : conv2( conv1(response) );
            }
        }
    }
    return response;
}




var jsc = jQuery.now(),
    jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        return jQuery.expando + "_" + ( jsc++ );
    }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
        ( typeof s.data === "string" );

    if ( s.dataTypes[ 0 ] === "jsonp" ||
        s.jsonp !== false && ( jsre.test( s.url ) ||
                inspectData && jsre.test( s.data ) ) ) {

        var responseContainer,
            jsonpCallback = s.jsonpCallback =
                jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
            previous = window[ jsonpCallback ],
            url = s.url,
            data = s.data,
            replace = "$1" + jsonpCallback + "$2";

        if ( s.jsonp !== false ) {
            url = url.replace( jsre, replace );
            if ( s.url === url ) {
                if ( inspectData ) {
                    data = data.replace( jsre, replace );
                }
                if ( s.data === data ) {
                    // Add callback manually
                    url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                }
            }
        }

        s.url = url;
        s.data = data;

        // Install callback
        window[ jsonpCallback ] = function( response ) {
            responseContainer = [ response ];
        };

        // Clean-up function
        jqXHR.always(function() {
            // Set callback back to previous value
            window[ jsonpCallback ] = previous;
            // Call if it was a function and we have a response
            if ( responseContainer && jQuery.isFunction( previous ) ) {
                window[ jsonpCallback ]( responseContainer[ 0 ] );
            }
        });

        // Use data converter to retrieve json after script execution
        s.converters["script json"] = function() {
            if ( !responseContainer ) {
                jQuery.error( jsonpCallback + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        // force json dataType
        s.dataTypes[ 0 ] = "json";

        // Delegate to script
        return "script";
    }
});




// Install script dataType
jQuery.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /javascript|ecmascript/
    },
    converters: {
        "text script": function( text ) {
            jQuery.globalEval( text );
            return text;
        }
    }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
        s.global = false;
    }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

    // This transport only deals with cross domain requests
    if ( s.crossDomain ) {

        var script,
            head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

        return {

            send: function( _, callback ) {

                script = document.createElement( "script" );

                script.async = "async";

                if ( s.scriptCharset ) {
                    script.charset = s.scriptCharset;
                }

                script.src = s.url;

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function( _, isAbort ) {

                    if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;

                        // Remove the script
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }

                        // Dereference the script
                        script = undefined;

                        // Callback if not abort
                        if ( !isAbort ) {
                            callback( 200, "success" );
                        }
                    }
                };
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709 and #4378).
                head.insertBefore( script, head.firstChild );
            },

            abort: function() {
                if ( script ) {
                    script.onload( 0, 1 );
                }
            }
        };
    }
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject ? function() {
        // Abort all pending requests
        for ( var key in xhrCallbacks ) {
            xhrCallbacks[ key ]( 0, 1 );
        }
    } : false,
    xhrId = 0,
    xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;

// Determine support properties
(function( xhr ) {
    jQuery.extend( jQuery.support, {
        ajax: !!xhr,
        cors: !!xhr && ( "withCredentials" in xhr )
    });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

    jQuery.ajaxTransport(function( s ) {
        // Cross domain only allowed if supported through XMLHttpRequest
        if ( !s.crossDomain || jQuery.support.cors ) {

            var callback;

            return {
                send: function( headers, complete ) {

                    // Get a new xhr
                    var xhr = s.xhr(),
                        handle,
                        i;

                    // Open the socket
                    // Passing null username, generates a login popup on Opera (#2865)
                    if ( s.username ) {
                        xhr.open( s.type, s.url, s.async, s.username, s.password );
                    } else {
                        xhr.open( s.type, s.url, s.async );
                    }

                    // Apply custom fields if provided
                    if ( s.xhrFields ) {
                        for ( i in s.xhrFields ) {
                            xhr[ i ] = s.xhrFields[ i ];
                        }
                    }

                    // Override mime type if needed
                    if ( s.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( s.mimeType );
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                        headers[ "X-Requested-With" ] = "XMLHttpRequest";
                    }

                    // Need an extra try/catch for cross domain requests in Firefox 3
                    try {
                        for ( i in headers ) {
                            xhr.setRequestHeader( i, headers[ i ] );
                        }
                    } catch( _ ) {}

                    // Do send the request
                    // This may raise an exception which is actually
                    // handled in jQuery.ajax (so no try/catch here)
                    xhr.send( ( s.hasContent && s.data ) || null );

                    // Listener
                    callback = function( _, isAbort ) {

                        var status,
                            statusText,
                            responseHeaders,
                            responses,
                            xml;

                        // Firefox throws exceptions when accessing properties
                        // of an xhr when a network error occured
                        // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                        try {

                            // Was never called and is aborted or complete
                            if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                // Only called once
                                callback = undefined;

                                // Do not keep as active anymore
                                if ( handle ) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    if ( xhrOnUnloadAbort ) {
                                        delete xhrCallbacks[ handle ];
                                    }
                                }

                                // If it's an abort
                                if ( isAbort ) {
                                    // Abort it manually if needed
                                    if ( xhr.readyState !== 4 ) {
                                        xhr.abort();
                                    }
                                } else {
                                    status = xhr.status;
                                    responseHeaders = xhr.getAllResponseHeaders();
                                    responses = {};
                                    xml = xhr.responseXML;

                                    // Construct response list
                                    if ( xml && xml.documentElement /* #4958 */ ) {
                                        responses.xml = xml;
                                    }
                                    responses.text = xhr.responseText;

                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch( e ) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }

                                    // Filter status for non standard behaviors

                                    // If the request is local and we have data: assume a success
                                    // (success with no data won't get notified, that's the best we
                                    // can do given current implementations)
                                    if ( !status && s.isLocal && !s.crossDomain ) {
                                        status = responses.text ? 200 : 404;
                                    // IE - #1450: sometimes returns 1223 when it should be 204
                                    } else if ( status === 1223 ) {
                                        status = 204;
                                    }
                                }
                            }
                        } catch( firefoxAccessException ) {
                            if ( !isAbort ) {
                                complete( -1, firefoxAccessException );
                            }
                        }

                        // Call complete if needed
                        if ( responses ) {
                            complete( status, statusText, responses, responseHeaders );
                        }
                    };

                    // if we're in sync mode or it's in cache
                    // and has been retrieved directly (IE6 & IE7)
                    // we need to manually fire the callback
                    if ( !s.async || xhr.readyState === 4 ) {
                        callback();
                    } else {
                        handle = ++xhrId;
                        if ( xhrOnUnloadAbort ) {
                            // Create the active xhrs callbacks list if needed
                            // and attach the unload handler
                            if ( !xhrCallbacks ) {
                                xhrCallbacks = {};
                                jQuery( window ).unload( xhrOnUnloadAbort );
                            }
                            // Add to list of active xhrs callbacks
                            xhrCallbacks[ handle ] = callback;
                        }
                        xhr.onreadystatechange = callback;
                    }
                },

                abort: function() {
                    if ( callback ) {
                        callback(0,1);
                    }
                }
            };
        }
    });
}




var elemdisplay = {},
    iframe, iframeDoc,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    timerId,
    fxAttrs = [
        // height animations
        [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
        // width animations
        [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
        // opacity animations
        [ "opacity" ]
    ],
    fxNow;

jQuery.fn.extend({
    show: function( speed, easing, callback ) {
        var elem, display;

        if ( speed || speed === 0 ) {
            return this.animate( genFx("show", 3), speed, easing, callback );

        } else {
            for ( var i = 0, j = this.length; i < j; i++ ) {
                elem = this[ i ];

                if ( elem.style ) {
                    display = elem.style.display;

                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
                        display = elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if ( display === "" && jQuery.css(elem, "display") === "none" ) {
                        jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
                    }
                }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                elem = this[ i ];

                if ( elem.style ) {
                    display = elem.style.display;

                    if ( display === "" || display === "none" ) {
                        elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
                    }
                }
            }

            return this;
        }
    },

    hide: function( speed, easing, callback ) {
        if ( speed || speed === 0 ) {
            return this.animate( genFx("hide", 3), speed, easing, callback);

        } else {
            var elem, display,
                i = 0,
                j = this.length;

            for ( ; i < j; i++ ) {
                elem = this[i];
                if ( elem.style ) {
                    display = jQuery.css( elem, "display" );

                    if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
                        jQuery._data( elem, "olddisplay", display );
                    }
                }
            }

            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                if ( this[i].style ) {
                    this[i].style.display = "none";
                }
            }

            return this;
        }
    },

    // Save the old toggle function
    _toggle: jQuery.fn.toggle,

    toggle: function( fn, fn2, callback ) {
        var bool = typeof fn === "boolean";

        if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
            this._toggle.apply( this, arguments );

        } else if ( fn == null || bool ) {
            this.each(function() {
                var state = bool ? fn : jQuery(this).is(":hidden");
                jQuery(this)[ state ? "show" : "hide" ]();
            });

        } else {
            this.animate(genFx("toggle", 3), fn, fn2, callback);
        }

        return this;
    },

    fadeTo: function( speed, to, easing, callback ) {
        return this.filter(":hidden").css("opacity", 0).show().end()
                    .animate({opacity: to}, speed, easing, callback);
    },

    animate: function( prop, speed, easing, callback ) {
        var optall = jQuery.speed( speed, easing, callback );

        if ( jQuery.isEmptyObject( prop ) ) {
            return this.each( optall.complete, [ false ] );
        }

        // Do not change referenced properties as per-property easing will be lost
        prop = jQuery.extend( {}, prop );

        function doAnimation() {
            // XXX 'this' does not always have a nodeName when running the
            // test suite

            if ( optall.queue === false ) {
                jQuery._mark( this );
            }

            var opt = jQuery.extend( {}, optall ),
                isElement = this.nodeType === 1,
                hidden = isElement && jQuery(this).is(":hidden"),
                name, val, p, e,
                parts, start, end, unit,
                method;

            // will store per property easing and be used to determine when an animation is complete
            opt.animatedProperties = {};

            for ( p in prop ) {

                // property name normalization
                name = jQuery.camelCase( p );
                if ( p !== name ) {
                    prop[ name ] = prop[ p ];
                    delete prop[ p ];
                }

                val = prop[ name ];

                // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
                if ( jQuery.isArray( val ) ) {
                    opt.animatedProperties[ name ] = val[ 1 ];
                    val = prop[ name ] = val[ 0 ];
                } else {
                    opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
                }

                if ( val === "hide" && hidden || val === "show" && !hidden ) {
                    return opt.complete.call( this );
                }

                if ( isElement && ( name === "height" || name === "width" ) ) {
                    // Make sure that nothing sneaks out
                    // Record all 3 overflow attributes because IE does not
                    // change the overflow attribute when overflowX and
                    // overflowY are set to the same value
                    opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

                    // Set display property to inline-block for height/width
                    // animations on inline elements that are having width/height animated
                    if ( jQuery.css( this, "display" ) === "inline" &&
                            jQuery.css( this, "float" ) === "none" ) {

                        // inline-level elements accept inline-block;
                        // block-level elements need to be inline with layout
                        if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
                            this.style.display = "inline-block";

                        } else {
                            this.style.zoom = 1;
                        }
                    }
                }
            }

            if ( opt.overflow != null ) {
                this.style.overflow = "hidden";
            }

            for ( p in prop ) {
                e = new jQuery.fx( this, opt, p );
                val = prop[ p ];

                if ( rfxtypes.test( val ) ) {

                    // Tracks whether to show or hide based on private
                    // data attached to the element
                    method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
                    if ( method ) {
                        jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
                        e[ method ]();
                    } else {
                        e[ val ]();
                    }

                } else {
                    parts = rfxnum.exec( val );
                    start = e.cur();

                    if ( parts ) {
                        end = parseFloat( parts[2] );
                        unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

                        // We need to compute starting value
                        if ( unit !== "px" ) {
                            jQuery.style( this, p, (end || 1) + unit);
                            start = ( (end || 1) / e.cur() ) * start;
                            jQuery.style( this, p, start + unit);
                        }

                        // If a +=/-= token was provided, we're doing a relative animation
                        if ( parts[1] ) {
                            end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
                        }

                        e.custom( start, end, unit );

                    } else {
                        e.custom( start, val, "" );
                    }
                }
            }

            // For JS strict compliance
            return true;
        }

        return optall.queue === false ?
            this.each( doAnimation ) :
            this.queue( optall.queue, doAnimation );
    },

    stop: function( type, clearQueue, gotoEnd ) {
        if ( typeof type !== "string" ) {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
        }
        if ( clearQueue && type !== false ) {
            this.queue( type || "fx", [] );
        }

        return this.each(function() {
            var index,
                hadTimers = false,
                timers = jQuery.timers,
                data = jQuery._data( this );

            // clear marker counters if we know they won't be
            if ( !gotoEnd ) {
                jQuery._unmark( true, this );
            }

            function stopQueue( elem, data, index ) {
                var hooks = data[ index ];
                jQuery.removeData( elem, index, true );
                hooks.stop( gotoEnd );
            }

            if ( type == null ) {
                for ( index in data ) {
                    if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
                        stopQueue( this, data, index );
                    }
                }
            } else if ( data[ index = type + ".run" ] && data[ index ].stop ){
                stopQueue( this, data, index );
            }

            for ( index = timers.length; index--; ) {
                if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                    if ( gotoEnd ) {

                        // force the next step to be the last
                        timers[ index ]( true );
                    } else {
                        timers[ index ].saveState();
                    }
                    hadTimers = true;
                    timers.splice( index, 1 );
                }
            }

            // start the next in the queue if the last step wasn't forced
            // timers currently will call their complete callbacks, which will dequeue
            // but only if they were gotoEnd
            if ( !( gotoEnd && hadTimers ) ) {
                jQuery.dequeue( this, type );
            }
        });
    }

});

// Animations created synchronously will run synchronously
function createFxNow() {
    setTimeout( clearFxNow, 0 );
    return ( fxNow = jQuery.now() );
}

function clearFxNow() {
    fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
    var obj = {};

    jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
        obj[ this ] = type;
    });

    return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
    slideDown: genFx( "show", 1 ),
    slideUp: genFx( "hide", 1 ),
    slideToggle: genFx( "toggle", 1 ),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return this.animate( props, speed, easing, callback );
    };
});

jQuery.extend({
    speed: function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function( noUnmark ) {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            } else if ( noUnmark !== false ) {
                jQuery._unmark( this );
            }
        };

        return opt;
    },

    easing: {
        linear: function( p, n, firstNum, diff ) {
            return firstNum + diff * p;
        },
        swing: function( p, n, firstNum, diff ) {
            return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
        }
    },

    timers: [],

    fx: function( elem, options, prop ) {
        this.options = options;
        this.elem = elem;
        this.prop = prop;

        options.orig = options.orig || {};
    }

});

jQuery.fx.prototype = {
    // Simple function for setting a style value
    update: function() {
        if ( this.options.step ) {
            this.options.step.call( this.elem, this.now, this );
        }

        ( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
    },

    // Get the current size
    cur: function() {
        if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
            return this.elem[ this.prop ];
        }

        var parsed,
            r = jQuery.css( this.elem, this.prop );
        // Empty strings, null, undefined and "auto" are converted to 0,
        // complex values such as "rotate(1rad)" are returned as is,
        // simple values such as "10px" are parsed to Float.
        return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
    },

    // Start an animation from one number to another
    custom: function( from, to, unit ) {
        var self = this,
            fx = jQuery.fx;

        this.startTime = fxNow || createFxNow();
        this.end = to;
        this.now = this.start = from;
        this.pos = this.state = 0;
        this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

        function t( gotoEnd ) {
            return self.step( gotoEnd );
        }

        t.queue = this.options.queue;
        t.elem = this.elem;
        t.saveState = function() {
            if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
                jQuery._data( self.elem, "fxshow" + self.prop, self.start );
            }
        };

        if ( t() && jQuery.timers.push(t) && !timerId ) {
            timerId = setInterval( fx.tick, fx.interval );
        }
    },

    // Simple 'show' function
    show: function() {
        var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

        // Remember where we started, so that we can go back to it later
        this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
        this.options.show = true;

        // Begin the animation
        // Make sure that we start at a small width/height to avoid any flash of content
        if ( dataShow !== undefined ) {
            // This show is picking up where a previous hide or show left off
            this.custom( this.cur(), dataShow );
        } else {
            this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
        }

        // Start by showing the element
        jQuery( this.elem ).show();
    },

    // Simple 'hide' function
    hide: function() {
        // Remember where we started, so that we can go back to it later
        this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
        this.options.hide = true;

        // Begin the animation
        this.custom( this.cur(), 0 );
    },

    // Each step of an animation
    step: function( gotoEnd ) {
        var p, n, complete,
            t = fxNow || createFxNow(),
            done = true,
            elem = this.elem,
            options = this.options;

        if ( gotoEnd || t >= options.duration + this.startTime ) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();

            options.animatedProperties[ this.prop ] = true;

            for ( p in options.animatedProperties ) {
                if ( options.animatedProperties[ p ] !== true ) {
                    done = false;
                }
            }

            if ( done ) {
                // Reset the overflow
                if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

                    jQuery.each( [ "", "X", "Y" ], function( index, value ) {
                        elem.style[ "overflow" + value ] = options.overflow[ index ];
                    });
                }

                // Hide the element if the "hide" operation was done
                if ( options.hide ) {
                    jQuery( elem ).hide();
                }

                // Reset the properties, if the item has been hidden or shown
                if ( options.hide || options.show ) {
                    for ( p in options.animatedProperties ) {
                        jQuery.style( elem, p, options.orig[ p ] );
                        jQuery.removeData( elem, "fxshow" + p, true );
                        // Toggle data is no longer needed
                        jQuery.removeData( elem, "toggle" + p, true );
                    }
                }

                // Execute the complete function
                // in the event that the complete function throws an exception
                // we must ensure it won't be called twice. #5684

                complete = options.complete;
                if ( complete ) {

                    options.complete = false;
                    complete.call( elem );
                }
            }

            return false;

        } else {
            // classical easing cannot be used with an Infinity duration
            if ( options.duration == Infinity ) {
                this.now = t;
            } else {
                n = t - this.startTime;
                this.state = n / options.duration;

                // Perform the easing function, defaults to swing
                this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
                this.now = this.start + ( (this.end - this.start) * this.pos );
            }
            // Perform the next step of the animation
            this.update();
        }

        return true;
    }
};

jQuery.extend( jQuery.fx, {
    tick: function() {
        var timer,
            timers = jQuery.timers,
            i = 0;

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
    },

    interval: 13,

    stop: function() {
        clearInterval( timerId );
        timerId = null;
    },

    speeds: {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    },

    step: {
        opacity: function( fx ) {
            jQuery.style( fx.elem, "opacity", fx.now );
        },

        _default: function( fx ) {
            if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                fx.elem.style[ fx.prop ] = fx.now + fx.unit;
            } else {
                fx.elem[ fx.prop ] = fx.now;
            }
        }
    }
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
    jQuery.fx.step[ prop ] = function( fx ) {
        jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
    };
});

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
        return jQuery.grep(jQuery.timers, function( fn ) {
            return elem === fn.elem;
        }).length;
    };
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

    if ( !elemdisplay[ nodeName ] ) {

        var body = document.body,
            elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
            display = elem.css( "display" );
        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if ( display === "none" || display === "" ) {
            // No iframe to use yet, so create it
            if ( !iframe ) {
                iframe = document.createElement( "iframe" );
                iframe.frameBorder = iframe.width = iframe.height = 0;
            }

            body.appendChild( iframe );

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if ( !iframeDoc || !iframe.createElement ) {
                iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
                iframeDoc.close();
            }

            elem = iframeDoc.createElement( nodeName );

            iframeDoc.body.appendChild( elem );

            display = jQuery.css( elem, "display" );
            body.removeChild( iframe );
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;
    }

    return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
    rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
    jQuery.fn.offset = function( options ) {
        var elem = this[0], box;

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        try {
            box = elem.getBoundingClientRect();
        } catch(e) {}

        var doc = elem.ownerDocument,
            docElem = doc.documentElement;

        // Make sure we're not dealing with a disconnected DOM node
        if ( !box || !jQuery.contains( docElem, elem ) ) {
            return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
        }

        var body = doc.body,
            win = getWindow(doc),
            clientTop  = docElem.clientTop  || body.clientTop  || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
            scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
            top  = box.top  + scrollTop  - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return { top: top, left: left };
    };

} else {
    jQuery.fn.offset = function( options ) {
        var elem = this[0];

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;

        while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
            if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
                break;
            }

            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top  -= elem.scrollTop;
            left -= elem.scrollLeft;

            if ( elem === offsetParent ) {
                top  += elem.offsetTop;
                left += elem.offsetLeft;

                if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }

            if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                left += parseFloat( computedStyle.borderLeftWidth ) || 0;
            }

            prevComputedStyle = computedStyle;
        }

        if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
            top  += body.offsetTop;
            left += body.offsetLeft;
        }

        if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
            top  += Math.max( docElem.scrollTop, body.scrollTop );
            left += Math.max( docElem.scrollLeft, body.scrollLeft );
        }

        return { top: top, left: left };
    };
}

jQuery.offset = {

    bodyOffset: function( body ) {
        var top = body.offsetTop,
            left = body.offsetLeft;

        if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
            top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
            left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
        }

        return { top: top, left: left };
    },

    setOffset: function( elem, options, i ) {
        var position = jQuery.css( elem, "position" );

        // set position first, in-case top/left are set even on static elem
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        var curElem = jQuery( elem ),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css( elem, "top" ),
            curCSSLeft = jQuery.css( elem, "left" ),
            calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {}, curPosition = {}, curTop, curLeft;

        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( jQuery.isFunction( options ) ) {
            options = options.call( elem, i, curOffset );
        }

        if ( options.top != null ) {
            props.top = ( options.top - curOffset.top ) + curTop;
        }
        if ( options.left != null ) {
            props.left = ( options.left - curOffset.left ) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );
        } else {
            curElem.css( props );
        }
    }
};


jQuery.fn.extend({

    position: function() {
        if ( !this[0] ) {
            return null;
        }

        var elem = this[0],

        // Get *real* offsetParent
        offsetParent = this.offsetParent(),

        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

        // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0
        offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
        offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

        // Add offsetParent borders
        parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
        parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

        // Subtract the two offsets
        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    },

    offsetParent: function() {
        return this.map(function() {
            var offsetParent = this.offsetParent || document.body;
            while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        });
    }
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
    var method = "scroll" + name;

    jQuery.fn[ method ] = function( val ) {
        var elem, win;

        if ( val === undefined ) {
            elem = this[ 0 ];

            if ( !elem ) {
                return null;
            }

            win = getWindow( elem );

            // Return the scroll offset
            return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                jQuery.support.boxModel && win.document.documentElement[ method ] ||
                    win.document.body[ method ] :
                elem[ method ];
        }

        // Set the scroll offset
        return this.each(function() {
            win = getWindow( this );

            if ( win ) {
                win.scrollTo(
                    !i ? val : jQuery( win ).scrollLeft(),
                     i ? val : jQuery( win ).scrollTop()
                );

            } else {
                this[ method ] = val;
            }
        });
    };
});

function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
        elem :
        elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

    var type = name.toLowerCase();

    // innerHeight and innerWidth
    jQuery.fn[ "inner" + name ] = function() {
        var elem = this[0];
        return elem ?
            elem.style ?
            parseFloat( jQuery.css( elem, type, "padding" ) ) :
            this[ type ]() :
            null;
    };

    // outerHeight and outerWidth
    jQuery.fn[ "outer" + name ] = function( margin ) {
        var elem = this[0];
        return elem ?
            elem.style ?
            parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
            this[ type ]() :
            null;
    };

    jQuery.fn[ type ] = function( size ) {
        // Get window width or height
        var elem = this[0];
        if ( !elem ) {
            return size == null ? null : this;
        }

        if ( jQuery.isFunction( size ) ) {
            return this.each(function( i ) {
                var self = jQuery( this );
                self[ type ]( size.call( this, i, self[ type ]() ) );
            });
        }

        if ( jQuery.isWindow( elem ) ) {
            // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
            // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
            var docElemProp = elem.document.documentElement[ "client" + name ],
                body = elem.document.body;
            return elem.document.compatMode === "CSS1Compat" && docElemProp ||
                body && body[ "client" + name ] || docElemProp;

        // Get document width or height
        } else if ( elem.nodeType === 9 ) {
            // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
            return Math.max(
                elem.documentElement["client" + name],
                elem.body["scroll" + name], elem.documentElement["scroll" + name],
                elem.body["offset" + name], elem.documentElement["offset" + name]
            );

        // Get or set width or height on the element
        } else if ( size === undefined ) {
            var orig = jQuery.css( elem, type ),
                ret = parseFloat( orig );

            return jQuery.isNumeric( ret ) ? ret : orig;

        // Set the width or height on the element (default to pixels if value is unitless)
        } else {
            return this.css( type, typeof size === "string" ? size : size + "px" );
        }
    };

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
}



})( window );
/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line != "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag);
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
/*! Sea.js 2.2.1 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return A++}function e(a){return a.match(D)[0]}function f(a){for(a=a.replace(E,"/");a.match(F);)a=a.replace(F,"/");return a=a.replace(G,"$1/")}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(H))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(I,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(J.test(a))c=a;else if("."===d)c=f((b?e(b):v.cwd)+a);else if("/"===d){var g=v.cwd.match(K);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=S.test(a),e=L.createElement(d?"link":"script");if(c){var f=z(c)?c(a):c;f&&(e.charset=f)}p(e,b,d,a),d?(e.rel="stylesheet",e.href=a):(e.async=!0,e.src=a),T=e,R?Q.insertBefore(e,R):Q.appendChild(e),T=null}function p(a,c,d,e){function f(){a.onload=a.onerror=a.onreadystatechange=null,d||v.debug||Q.removeChild(a),a=null,c()}var g="onload"in a;return!d||!V&&g?(g?(a.onload=f,a.onerror=function(){C("error",{uri:e,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},b):(setTimeout(function(){q(a,c)},1),b)}function q(a,b){var c=a.sheet,d;if(V)c&&(d=!0);else if(c)try{c.cssRules&&(d=!0)}catch(e){"NS_ERROR_DOM_SECURITY_ERR"===e.name&&(d=!0)}setTimeout(function(){d?b():q(a,b)},20)}function r(){if(T)return T;if(U&&"interactive"===U.readyState)return U;for(var a=Q.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return U=c}}function s(a){var b=[];return a.replace(X,"").replace(W,function(a,c,d){d&&b.push(d)}),b}function t(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var u=a.seajs={version:"2.2.1"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=0,B=v.events={};u.on=function(a,b){var c=B[a]||(B[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return B=v.events={},u;var c=B[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete B[a];return u};var C=u.emit=function(a,b){var c=B[a],d;if(c)for(c=c.slice();d=c.shift();)d(b);return u},D=/[^?#]*\//,E=/\/\.\//g,F=/\/[^/]+\/\.\.\//,G=/([^:/])\/\//g,H=/^([^/:]+)(\/.+)$/,I=/{([^{]+)}/g,J=/^\/\/.|:\//,K=/^.*?\/\/.*?\//,L=document,M=e(L.URL),N=L.scripts,O=L.getElementById("seajsnode")||N[N.length-1],P=e(n(O)||M);u.resolve=m;var Q=L.head||L.getElementsByTagName("head")[0]||L.documentElement,R=Q.getElementsByTagName("base")[0],S=/\.css(?:\?|$)/i,T,U,V=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/,"$1")<536;u.request=o;var W=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,X=/\\\\/g,Y=u.cache={},Z,$={},_={},ab={},bb=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.load=function(){var a=this;if(!(a.status>=bb.LOADING)){a.status=bb.LOADING;var c=a.resolve();C("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=t.get(c[f]),e.status<bb.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=Y[c[f]],e.status<bb.FETCHING?e.fetch(g):e.status===bb.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},t.prototype.onload=function(){var a=this;a.status=bb.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=Y[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset)}function d(){delete $[h],_[h]=!0,Z&&(t.save(f,Z),Z=null);var a,b=ab[h];for(delete ab[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=bb.FETCHING;var g={uri:f};C("fetch",g);var h=g.requestUri||f;return!h||_[h]?(e.load(),b):$[h]?(ab[h].push(e),b):($[h]=!0,ab[h]=[e],C("request",g={uri:f,requestUri:h,onRequest:d,charset:v.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.prototype.exec=function(){function a(b){return t.get(a.resolve(b)).exec()}var c=this;if(c.status>=bb.EXECUTING)return c.exports;c.status=bb.EXECUTING;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=bb.EXECUTED,C("exec",c),g},t.resolve=function(a,b){var c={id:a,refUri:b};return C("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!f.uri&&L.attachEvent){var g=r();g&&(f.uri=g.src)}C("define",f),f.uri?t.save(f.uri,f):Z=f},t.save=function(a,b){var c=t.get(a);c.status<bb.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=bb.SAVED)},t.get=function(a,b){return Y[a]||(Y[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=Y[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.preload=function(a){var b=v.preload,c=b.length;c?t.use(b,function(){b.splice(0,c),t.preload(a)},v.cwd+"_preload_"+d()):a()},u.use=function(a,b){return t.preload(function(){t.use(a,b,v.cwd+"_use_"+d())}),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=_,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<bb.EXECUTING&&(b.onload(),b.exec()),b.exports};var cb=/^(.+?\/)(\?\?)?(seajs\/)+/;v.base=(P.match(cb)||["",P])[1],v.dir=P,v.cwd=M,v.charset="utf-8",v.preload=function(){var a=[],b=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return b+=" "+L.cookie,b.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return C("config",a),u}}}(this);

/***
This is part of jsdifflib v1.0. <http://snowtide.com/jsdifflib>

Copyright (c) 2007, Snowtide Informatics Systems, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
        list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.
    * Neither the name of the Snowtide Informatics Systems nor the names of its
        contributors may be used to endorse or promote products derived from this
        software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
***/
/* Author: Chas Emerick <cemerick@snowtide.com> */
__whitespace = {" ":true, "\t":true, "\n":true, "\f":true, "\r":true};

difflib = {
    defaultJunkFunction: function (c) {
        return __whitespace.hasOwnProperty(c);
    },
    
    stripLinebreaks: function (str) { return str.replace(/^[\n\r]*|[\n\r]*$/g, ""); },
    
    stringAsLines: function (str) {
        var lfpos = str.indexOf("\n");
        var crpos = str.indexOf("\r");
        var linebreak = ((lfpos > -1 && crpos > -1) || crpos < 0) ? "\n" : "\r";
        
        var lines = str.split(linebreak);
        for (var i = 0; i < lines.length; i++) {
            lines[i] = difflib.stripLinebreaks(lines[i]);
        }
        
        return lines;
    },
    
    // iteration-based reduce implementation
    __reduce: function (func, list, initial) {
        if (initial != null) {
            var value = initial;
            var idx = 0;
        } else if (list) {
            var value = list[0];
            var idx = 1;
        } else {
            return null;
        }
        
        for (; idx < list.length; idx++) {
            value = func(value, list[idx]);
        }
        
        return value;
    },
    
    // comparison function for sorting lists of numeric tuples
    __ntuplecomp: function (a, b) {
        var mlen = Math.max(a.length, b.length);
        for (var i = 0; i < mlen; i++) {
            if (a[i] < b[i]) return -1;
            if (a[i] > b[i]) return 1;
        }
        
        return a.length == b.length ? 0 : (a.length < b.length ? -1 : 1);
    },
    
    __calculate_ratio: function (matches, length) {
        return length ? 2.0 * matches / length : 1.0;
    },
    
    // returns a function that returns true if a key passed to the returned function
    // is in the dict (js object) provided to this function; replaces being able to
    // carry around dict.has_key in python...
    __isindict: function (dict) {
        return function (key) { return dict.hasOwnProperty(key); };
    },
    
    // replacement for python's dict.get function -- need easy default values
    __dictget: function (dict, key, defaultValue) {
        return dict.hasOwnProperty(key) ? dict[key] : defaultValue;
    },  
    
    SequenceMatcher: function (a, b, isjunk) {
        this.set_seqs = function (a, b) {
            this.set_seq1(a);
            this.set_seq2(b);
        }
        
        this.set_seq1 = function (a) {
            if (a == this.a) return;
            this.a = a;
            this.matching_blocks = this.opcodes = null;
        }
        
        this.set_seq2 = function (b) {
            if (b == this.b) return;
            this.b = b;
            this.matching_blocks = this.opcodes = this.fullbcount = null;
            this.__chain_b();
        }
        
        this.__chain_b = function () {
            var b = this.b;
            var n = b.length;
            var b2j = this.b2j = {};
            var populardict = {};
            for (var i = 0; i < b.length; i++) {
                var elt = b[i];
                if (b2j.hasOwnProperty(elt)) {
                    var indices = b2j[elt];
                    if (n >= 200 && indices.length * 100 > n) {
                        populardict[elt] = 1;
                        delete b2j[elt];
                    } else {
                        indices.push(i);
                    }
                } else {
                    b2j[elt] = [i];
                }
            }
    
            for (var elt in populardict) {
                if (populardict.hasOwnProperty(elt)) {
                    delete b2j[elt];
                }
            }
            
            var isjunk = this.isjunk;
            var junkdict = {};
            if (isjunk) {
                for (var elt in populardict) {
                    if (populardict.hasOwnProperty(elt) && isjunk(elt)) {
                        junkdict[elt] = 1;
                        delete populardict[elt];
                    }
                }
                for (var elt in b2j) {
                    if (b2j.hasOwnProperty(elt) && isjunk(elt)) {
                        junkdict[elt] = 1;
                        delete b2j[elt];
                    }
                }
            }
    
            this.isbjunk = difflib.__isindict(junkdict);
            this.isbpopular = difflib.__isindict(populardict);
        }
        
        this.find_longest_match = function (alo, ahi, blo, bhi) {
            var a = this.a;
            var b = this.b;
            var b2j = this.b2j;
            var isbjunk = this.isbjunk;
            var besti = alo;
            var bestj = blo;
            var bestsize = 0;
            var j = null;
    
            var j2len = {};
            var nothing = [];
            for (var i = alo; i < ahi; i++) {
                var newj2len = {};
                var jdict = difflib.__dictget(b2j, a[i], nothing);
                for (var jkey in jdict) {
                    if (jdict.hasOwnProperty(jkey)) {
                        j = jdict[jkey];
                        if (j < blo) continue;
                        if (j >= bhi) break;
                        newj2len[j] = k = difflib.__dictget(j2len, j - 1, 0) + 1;
                        if (k > bestsize) {
                            besti = i - k + 1;
                            bestj = j - k + 1;
                            bestsize = k;
                        }
                    }
                }
                j2len = newj2len;
            }
    
            while (besti > alo && bestj > blo && !isbjunk(b[bestj - 1]) && a[besti - 1] == b[bestj - 1]) {
                besti--;
                bestj--;
                bestsize++;
            }
                
            while (besti + bestsize < ahi && bestj + bestsize < bhi &&
                    !isbjunk(b[bestj + bestsize]) &&
                    a[besti + bestsize] == b[bestj + bestsize]) {
                bestsize++;
            }
    
            while (besti > alo && bestj > blo && isbjunk(b[bestj - 1]) && a[besti - 1] == b[bestj - 1]) {
                besti--;
                bestj--;
                bestsize++;
            }
            
            while (besti + bestsize < ahi && bestj + bestsize < bhi && isbjunk(b[bestj + bestsize]) &&
                    a[besti + bestsize] == b[bestj + bestsize]) {
                bestsize++;
            }
    
            return [besti, bestj, bestsize];
        }
        
        this.get_matching_blocks = function () {
            if (this.matching_blocks != null) return this.matching_blocks;
            var la = this.a.length;
            var lb = this.b.length;
    
            var queue = [[0, la, 0, lb]];
            var matching_blocks = [];
            var alo, ahi, blo, bhi, qi, i, j, k, x;
            while (queue.length) {
                qi = queue.pop();
                alo = qi[0];
                ahi = qi[1];
                blo = qi[2];
                bhi = qi[3];
                x = this.find_longest_match(alo, ahi, blo, bhi);
                i = x[0];
                j = x[1];
                k = x[2];
    
                if (k) {
                    matching_blocks.push(x);
                    if (alo < i && blo < j)
                        queue.push([alo, i, blo, j]);
                    if (i+k < ahi && j+k < bhi)
                        queue.push([i + k, ahi, j + k, bhi]);
                }
            }
            
            matching_blocks.sort(difflib.__ntuplecomp);
    
            var i1 = j1 = k1 = block = 0;
            var non_adjacent = [];
            for (var idx in matching_blocks) {
                if (matching_blocks.hasOwnProperty(idx)) {
                    block = matching_blocks[idx];
                    i2 = block[0];
                    j2 = block[1];
                    k2 = block[2];
                    if (i1 + k1 == i2 && j1 + k1 == j2) {
                        k1 += k2;
                    } else {
                        if (k1) non_adjacent.push([i1, j1, k1]);
                        i1 = i2;
                        j1 = j2;
                        k1 = k2;
                    }
                }
            }
            
            if (k1) non_adjacent.push([i1, j1, k1]);
    
            non_adjacent.push([la, lb, 0]);
            this.matching_blocks = non_adjacent;
            return this.matching_blocks;
        }
        
        this.get_opcodes = function () {
            if (this.opcodes != null) return this.opcodes;
            var i = 0;
            var j = 0;
            var answer = [];
            this.opcodes = answer;
            var block, ai, bj, size, tag;
            var blocks = this.get_matching_blocks();
            for (var idx in blocks) {
                if (blocks.hasOwnProperty(idx)) {
                    block = blocks[idx];
                    ai = block[0];
                    bj = block[1];
                    size = block[2];
                    tag = '';
                    if (i < ai && j < bj) {
                        tag = 'replace';
                    } else if (i < ai) {
                        tag = 'delete';
                    } else if (j < bj) {
                        tag = 'insert';
                    }
                    if (tag) answer.push([tag, i, ai, j, bj]);
                    i = ai + size;
                    j = bj + size;
                    
                    if (size) answer.push(['equal', ai, i, bj, j]);
                }
            }
            
            return answer;
        }
        
        // this is a generator function in the python lib, which of course is not supported in javascript
        // the reimplementation builds up the grouped opcodes into a list in their entirety and returns that.
        this.get_grouped_opcodes = function (n) {
            if (!n) n = 3;
            var codes = this.get_opcodes();
            if (!codes) codes = [["equal", 0, 1, 0, 1]];
            var code, tag, i1, i2, j1, j2;
            if (codes[0][0] == 'equal') {
                code = codes[0];
                tag = code[0];
                i1 = code[1];
                i2 = code[2];
                j1 = code[3];
                j2 = code[4];
                codes[0] = [tag, Math.max(i1, i2 - n), i2, Math.max(j1, j2 - n), j2];
            }
            if (codes[codes.length - 1][0] == 'equal') {
                code = codes[codes.length - 1];
                tag = code[0];
                i1 = code[1];
                i2 = code[2];
                j1 = code[3];
                j2 = code[4];
                codes[codes.length - 1] = [tag, i1, Math.min(i2, i1 + n), j1, Math.min(j2, j1 + n)];
            }
    
            var nn = n + n;
            var group = [];
            var groups = [];
            for (var idx in codes) {
                if (codes.hasOwnProperty(idx)) {
                    code = codes[idx];
                    tag = code[0];
                    i1 = code[1];
                    i2 = code[2];
                    j1 = code[3];
                    j2 = code[4];
                    if (tag == 'equal' && i2 - i1 > nn) {
                        group.push([tag, i1, Math.min(i2, i1 + n), j1, Math.min(j2, j1 + n)]);
                        groups.push(group);
                        group = [];
                        i1 = Math.max(i1, i2-n);
                        j1 = Math.max(j1, j2-n);
                    }
                    
                    group.push([tag, i1, i2, j1, j2]);
                }
            }
            
            if (group && !(group.length == 1 && group[0][0] == 'equal')) groups.push(group)
            
            return groups;
        }
        
        this.ratio = function () {
            matches = difflib.__reduce(
                            function (sum, triple) { return sum + triple[triple.length - 1]; },
                            this.get_matching_blocks(), 0);
            return difflib.__calculate_ratio(matches, this.a.length + this.b.length);
        }
        
        this.quick_ratio = function () {
            var fullbcount, elt;
            if (this.fullbcount == null) {
                this.fullbcount = fullbcount = {};
                for (var i = 0; i < this.b.length; i++) {
                    elt = this.b[i];
                    fullbcount[elt] = difflib.__dictget(fullbcount, elt, 0) + 1;
                }
            }
            fullbcount = this.fullbcount;
    
            var avail = {};
            var availhas = difflib.__isindict(avail);
            var matches = numb = 0;
            for (var i = 0; i < this.a.length; i++) {
                elt = this.a[i];
                if (availhas(elt)) {
                    numb = avail[elt];
                } else {
                    numb = difflib.__dictget(fullbcount, elt, 0);
                }
                avail[elt] = numb - 1;
                if (numb > 0) matches++;
            }
            
            return difflib.__calculate_ratio(matches, this.a.length + this.b.length);
        }
        
        this.real_quick_ratio = function () {
            var la = this.a.length;
            var lb = this.b.length;
            return _calculate_ratio(Math.min(la, lb), la + lb);
        }
        
        this.isjunk = isjunk ? isjunk : difflib.defaultJunkFunction;
        this.a = this.b = null;
        this.set_seqs(a, b);
    }
};

/*
This is part of jsdifflib v1.0. <http://github.com/cemerick/jsdifflib>

Copyright 2007 - 2011 Chas Emerick <cemerick@snowtide.com>. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY Chas Emerick ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Chas Emerick OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of Chas Emerick.
*/
diffview = {
    /**
     * Builds and returns a visual diff view.  The single parameter, `params', should contain
     * the following values:
     *
     * - baseTextLines: the array of strings that was used as the base text input to SequenceMatcher
     * - newTextLines: the array of strings that was used as the new text input to SequenceMatcher
     * - opcodes: the array of arrays returned by SequenceMatcher.get_opcodes()
     * - baseTextName: the title to be displayed above the base text listing in the diff view; defaults
     *     to "Base Text"
     * - newTextName: the title to be displayed above the new text listing in the diff view; defaults
     *     to "New Text"
     * - contextSize: the number of lines of context to show around differences; by default, all lines
     *     are shown
     * - viewType: if 0, a side-by-side diff view is generated (default); if 1, an inline diff view is
     *     generated
     */
    buildView: function (params) {
        var baseTextLines = params.baseTextLines;
        var newTextLines = params.newTextLines;
        var opcodes = params.opcodes;
        var baseTextName = params.baseTextName ? params.baseTextName : "Base Text";
        var newTextName = params.newTextName ? params.newTextName : "New Text";
        var contextSize = params.contextSize;
        var inline = (params.viewType == 0 || params.viewType == 1) ? params.viewType : 0;

        if (baseTextLines == null)
            throw "Cannot build diff view; baseTextLines is not defined.";
        if (newTextLines == null)
            throw "Cannot build diff view; newTextLines is not defined.";
        if (!opcodes)
            throw "Canno build diff view; opcodes is not defined.";
        
        function celt (name, clazz) {
            var e = document.createElement(name);
            e.className = clazz;
            return e;
        }
        
        function telt (name, text) {
            var e = document.createElement(name);
            e.appendChild(document.createTextNode(text));
            return e;
        }
        
        function ctelt (name, clazz, text) {
            var e = document.createElement(name);
            e.className = clazz;
            e.appendChild(document.createTextNode(text));
            return e;
        }
    
        var tdata = document.createElement("thead");
        var node = document.createElement("tr");
        tdata.appendChild(node);
        if (inline) {
            node.appendChild(document.createElement("th"));
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", baseTextName + " vs. " + newTextName));
        } else {
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", baseTextName));
            node.appendChild(document.createElement("th"));
            node.appendChild(ctelt("th", "texttitle", newTextName));
        }
        tdata = [tdata];
        
        var rows = [];
        var node2;
        
        /**
         * Adds two cells to the given row; if the given row corresponds to a real
         * line number (based on the line index tidx and the endpoint of the 
         * range in question tend), then the cells will contain the line number
         * and the line of text from textLines at position tidx (with the class of
         * the second cell set to the name of the change represented), and tidx + 1 will
         * be returned.  Otherwise, tidx is returned, and two empty cells are added
         * to the given row.
         */
        function addCells (row, tidx, tend, textLines, change) {
            if (tidx < tend) {
                row.appendChild(telt("th", (tidx + 1).toString()));
                row.appendChild(ctelt("td", change, textLines[tidx].replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0")));
                return tidx + 1;
            } else {
                row.appendChild(document.createElement("th"));
                row.appendChild(celt("td", "empty"));
                return tidx;
            }
        }
        
        function addCellsInline (row, tidx, tidx2, textLines, change) {
            row.appendChild(telt("th", tidx == null ? "" : (tidx + 1).toString()));
            row.appendChild(telt("th", tidx2 == null ? "" : (tidx2 + 1).toString()));
            row.appendChild(ctelt("td", change, textLines[tidx != null ? tidx : tidx2].replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0")));
        }
        
        for (var idx = 0; idx < opcodes.length; idx++) {
            code = opcodes[idx];
            change = code[0];
            var b = code[1];
            var be = code[2];
            var n = code[3];
            var ne = code[4];
            var rowcnt = Math.max(be - b, ne - n);
            var toprows = [];
            var botrows = [];
            for (var i = 0; i < rowcnt; i++) {
                // jump ahead if we've alredy provided leading context or if this is the first range
                if (contextSize && opcodes.length > 1 && ((idx > 0 && i == contextSize) || (idx == 0 && i == 0)) && change=="equal") {
                    var jump = rowcnt - ((idx == 0 ? 1 : 2) * contextSize);
                    if (jump > 1) {
                        toprows.push(node = document.createElement("tr"));
                        
                        b += jump;
                        n += jump;
                        i += jump - 1;
                        node.appendChild(telt("th", "..."));
                        if (!inline) node.appendChild(ctelt("td", "skip", ""));
                        node.appendChild(telt("th", "..."));
                        node.appendChild(ctelt("td", "skip", ""));
                        
                        // skip last lines if they're all equal
                        if (idx + 1 == opcodes.length) {
                            break;
                        } else {
                            continue;
                        }
                    }
                }
                
                toprows.push(node = document.createElement("tr"));
                if (inline) {
                    if (change == "insert") {
                        addCellsInline(node, null, n++, newTextLines, change);
                    } else if (change == "replace") {
                        botrows.push(node2 = document.createElement("tr"));
                        if (b < be) addCellsInline(node, b++, null, baseTextLines, "delete");
                        if (n < ne) addCellsInline(node2, null, n++, newTextLines, "insert");
                    } else if (change == "delete") {
                        addCellsInline(node, b++, null, baseTextLines, change);
                    } else {
                        // equal
                        addCellsInline(node, b++, n++, baseTextLines, change);
                    }
                } else {
                    b = addCells(node, b, be, baseTextLines, change);
                    n = addCells(node, n, ne, newTextLines, change);
                }
            }

            for (var i = 0; i < toprows.length; i++) rows.push(toprows[i]);
            for (var i = 0; i < botrows.length; i++) rows.push(botrows[i]);
        }
        
        rows.push(node = ctelt("th", "author", "diff view generated by "));
        node.setAttribute("colspan", inline ? 3 : 4);
        node.appendChild(node2 = telt("a", "jsdifflib"));
        node2.setAttribute("href", "http://github.com/cemerick/jsdifflib");
        
        tdata.push(node = document.createElement("tbody"));
        for (var idx in rows) rows.hasOwnProperty(idx) && node.appendChild(rows[idx]);
        
        node = celt("table", "diff" + (inline ? " inlinediff" : ""));
        for (var idx in tdata) tdata.hasOwnProperty(idx) && node.appendChild(tdata[idx]);
        return node;
    }
};

// auto generated by concat 
;define('ckstyle/base', function(require, exports, module) {

var toString = Object.prototype.toString
var slice = [].slice

var Class = function(upper, init) {
    if (arguments.length == 1) {
        init = upper
        upper = Object
    }

    cls = function() {
        if (this.__init__) {
            var args = slice.call(arguments)
            this.__init__.apply(this, args)
        }
    }

    if (upper) {
        function F(){}
        F.prototype = upper.prototype
        cls.prototype = new F()
        cls.prototype.constructor = cls.prototype.me = cls
        cls.parent = cls.prototype.parent = upper
    }

    var obj = {}
    init.call(obj)

    function wrap(func) {
        if (toString.call(func) != '[object Function]') {
            return func
        }
        return function() {
            var args = slice.call(arguments)
            args.unshift(this)
            return func.apply(this, args)
        }
    }
    for(var prop in obj) {
        obj[prop] = wrap(obj[prop])
    }
    for(var prop in obj) {
        cls.prototype[prop] = obj[prop]
    }
    return cls
}

var Checker = new Class(function() {})

var RuleChecker = new Class(Checker, function() {})
RuleChecker.type = 'rule'

var RuleSetChecker = new Class(Checker, function() {})
RuleSetChecker.type = 'ruleset'

var StyleSheetChecker = new Class(Checker, function() {})
StyleSheetChecker.type = 'stylesheet'

var ExtraChecker = new Class(Checker, function() {})
ExtraChecker.type = 'extra'

var ERROR_LEVEL = {
    ERROR: 0,
    WARNING: 1,
    LOG: 2
}

function findInArray(array, value) {
    if (!array) {
        return false
    }
    return array.indexOf(value) != -1 || array.indexOf(value.trim()) != -1 
}

var toString = Object.prototype.toString
function isObject(obj) {
    return toString.call(obj) == '[object Object]'
}

function isFunction(obj) {
    return toString.call(obj) == '[object Function]'
}

exports.Class = Class
exports.ERROR_LEVEL = ERROR_LEVEL
exports.RuleChecker = RuleChecker
exports.RuleSetChecker = RuleSetChecker
exports.StyleSheetChecker = StyleSheetChecker
exports.ExtraChecker = ExtraChecker
exports.findInArray = findInArray
exports.isObject = isObject
exports.isFunction = isFunction

})
// auto generated by concat 
;define('ckstyle/browsers/Analyser', function(require, exports, module) {

var B = require('./BinaryRule')

var basic = {
    'ie6' : B.IE6,
    'ie7' : B.IE7,
    'ie8' : B.IE8,
    'ie9' : B.IE9PLUS,
    'ie10': B.IE9PLUS,
    'chrome' : B.CHROME,
    'firefox' : B.FIREFOX,
    'opera' : B.OPERA,
    'safari' : B.SAFARI,
    'std' : B.STD | B.NONEIE
}

var mapping = {
    'ie' : B.ALLIE,
    'ie9plus' : B.IE9PLUS,
    'std' : B.STD | B.NONEIE
}

for(var prop in basic) {
    mapping[prop] = basic[prop]
}

var keys = Object.keys(mapping);
var tmp = [];
keys.forEach(function(k) {
    if (k != 'webkit' && k != 'ie9plus') {
        tmp.push(k);
    }
})
var allBrowsers = tmp.join(',');

function analyse(text) {
    if (!text || text == '' || text=='none' || text == 'false')
        return null
    if (text == 'all')
        text = allBrowsers
    text = text.toLowerCase()
    var splited = text.split(',')
    var browsers = {}

    splited.forEach(function(s) {
        if (mapping[s]) {
            browsers[s] = mapping[s] | B.STD;
        }
    })
    return browsers
}

function whatIs(code) {
    var result = [];
    for(var prop in basic) {
        if (basic[prop] & code) {
            result.push(prop);
        }
    }
    return result.join(',')
}


exports.analyse = analyse
exports.whatIs = whatIs

// if (!module.parent) {
//     console.log(analyse('ie6,std'))
//     console.log(whatIs(B.FIREFOX))
// }

})
// auto generated by concat 
;define('ckstyle/browsers/BinaryRule', function(require, exports, module) {

/*
  0x111111111
    |||||||||
    |||||||||
    |||||||||--ie6 ---------|
    ||||||||--ie7  ---------|
    |||||||--ie8   ---------| ALLIE
    ||||||--ie9+   ---------|
    |||||
    |||||--opera
    ||||--safari   ---------|
    |||--firefox            | WEBKIT
    ||-- chrome    ---------|
    |-- STD
*/

var ORIGIN = parseInt("000000000", 2)

var STD    = parseInt("100000000", 2)
var CHROME = parseInt("010000000", 2)
var FIREFOX= parseInt("001000000", 2)
var SAFARI = parseInt("000100000", 2)
var OPERA  = parseInt("000010000", 2)

var WEBKIT = CHROME | SAFARI 

var NONEIE = CHROME | SAFARI | OPERA | FIREFOX

var IE9PLUS= parseInt("000001000", 2)
var IE8    = parseInt("000000100", 2)
var IE7    = parseInt("000000010", 2)
var IE6    = parseInt("000000001", 2)
var ALLIE  = IE9PLUS | IE8 | IE7 | IE6

var NOIE6  = IE9PLUS | IE8 | IE7 | NONEIE
var NOIE67 = IE9PLUS | IE8 | NONEIE
var NOIE678= IE9PLUS | NONEIE
var NONE   = parseInt("000000000", 2)
var ALL    = parseInt("111111111", 2)

exports.ORIGIN = ORIGIN
exports.STD = STD
exports.CHROME = CHROME
exports.FIREFOX = FIREFOX
exports.SAFARI = SAFARI
exports.OPERA = OPERA

exports.WEBKIT = WEBKIT

exports.NONEIE = NONEIE

exports.IE9PLUS = IE9PLUS
exports.IE8 = IE8
exports.IE7 = IE7
exports.IE6 = IE6
exports.ALLIE = ALLIE

exports.NOIE6 = NOIE6
exports.NOIE67 = NOIE67
exports.NOIE678 = NOIE678
exports.NONE = NONE
exports.ALL = ALL

// if (!module.parent) {
//     console.log(FIREFOX, IE6)
// }

})
// auto generated by concat 
;define('ckstyle/browsers/Detector', function(require, exports, module) {

var doRuleDetect = require('./Hacks').doRuleDetect
var doRuleSetDetect = require('./Hacks').doRuleSetDetect
var doExtraDetect = require('./Hacks').doExtraDetect

var Browser = {
    handleRule: function(rule) {
        rule.browser = doRuleDetect(rule.fixedName, rule.fixedValue)
    },
    handleRuleSet: function(ruleSet) {
        ruleSet.browser = doRuleSetDetect(ruleSet.selector)
    },
    handleNestedStatement: function(statement) {
        statement.browser = doExtraDetect(statement.selector)
    }
}

exports.Browser = Browser


// if (!module.parent) {
//     var obj = {
//         fixedName: 'a',
//         fixedValue: 'expression(321)'
//     };
//     var res = Browser.handleRule(obj)
//     console.log(obj.browser.toString(2))

//     var obj = {
//         selector: 'a[b=1]'
//     }
//     var res = Browser.handleRuleSet(obj);
//     console.log(obj.browser)

//     var obj = {
//         selector: '@media all and (-webkit-min-device-pixel-ratio:10000), not all and (-webkit-min-device-pixel-ratio:0)'
//     }
//     var res = Browser.handleNestedStatement(obj);
//     console.log(obj.browser)
// }

})
// auto generated by concat 
;define('ckstyle/browsers/Hacks', function(require, exports, module) {

var B = require('./BinaryRule')

var IE6 = B.IE6
var IE7 = B.IE7
var IE8 = B.IE8
var IE9PLUS = B.IE9PLUS
var NONE = B.NONE
var NONEIE = B.NONEIE
var NOIE678 = B.NOIE678
var NOIE6 = B.NOIE6
var NOIE67 = B.NOIE67
var ALLIE = B.ALLIE
var WEBKIT = B.WEBKIT
var FIREFOX = B.FIREFOX
var OPERA = B.OPERA
var CHROME = B.CHROME
var SAFARI = B.SAFARI
var STD = B.STD
// http://www.swordair.com/tools/css-hack-table/
// big table

var RULE_HACKS = [
    [new RegExp('^_'),                     1,  IE6],
    [new RegExp('^\\+'),                    1,  IE6 | IE7],
    [new RegExp('^\\*'),                    1,  IE6 | IE7],
    [new RegExp('.*\\9'),                  2,  ALLIE],
    [new RegExp('.*\\0/'),                 2,  IE8],
    [new RegExp('.*\\0'),                  2,  IE8 | IE9PLUS],
    [new RegExp('zoom|behavior|filter'),   1,  ALLIE],
    [new RegExp('.*(m|M)icrosoft'),        2,  ALLIE],
    [new RegExp('^expression'),            2,  ALLIE],
    [new RegExp('^\-webkit\-'),            1,  WEBKIT],
    [new RegExp('^\-webkit\-'),            2,  WEBKIT],
    [new RegExp('^\-moz\-'),               1,  FIREFOX],
    [new RegExp('^\-moz\-'),               2,  FIREFOX],
    [new RegExp('^\-ms\-'),                1,  IE9PLUS],
    [new RegExp('^\-ms\-'),                2,  IE9PLUS],
    [new RegExp('^\-khtml\-'),             1,  ALLIE],
    [new RegExp('^\-khtml\-'),             2,  ALLIE],
    [new RegExp('^\-o\-'),                 1,  OPERA],
    [new RegExp('^\-o\-'),                 2,  OPERA],

    // auto generated by script AUTO-GENERATOR-1 .
    [new RegExp('^alignment\-adjust'), 1, NONE],
    [new RegExp('^alignment\-baseline'), 1, NONE],
    [new RegExp('^animation'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-name'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-duration'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-timing\-function'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-delay'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-iteration\-count'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-direction'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-play\-state'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^appearance'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^backface\-visibility'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI],
    [new RegExp('^background\-clip'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^background\-origin'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^background\-size'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^baseline\-shift'), 1, NONE],
    [new RegExp('^bookmark\-label'), 1, NONE],
    [new RegExp('^bookmark\-level'), 1, NONE],
    [new RegExp('^bookmark\-target'), 1, NONE],
    [new RegExp('^border\-bottom\-left\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-bottom\-right\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-image'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-image\-outset'), 1, NONE],
    [new RegExp('^border\-image\-repeat'), 1, NONE],
    [new RegExp('^border\-image\-slice'), 1, NONE],
    [new RegExp('^border\-image\-source'), 1, NONE],
    [new RegExp('^border\-image\-width'), 1, NONE],
    [new RegExp('^border\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-top\-left\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-top\-right\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-decoration\-break'), 1, NONE],
    [new RegExp('^box\-align'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-direction'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-flex'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-flex\-group'), 1, NONE],
    [new RegExp('^box\-lines'), 1, NONE],
    [new RegExp('^box\-ordinal\-group'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-orient'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-pack'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-shadow'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-sizing'), 1, IE8 | IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^color\-profile'), 1, NONE],
    [new RegExp('^column\-fill'), 1, NONE],
    [new RegExp('^column\-gap'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-color'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-style'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-width'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-span'), 1, IE9PLUS | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-width'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^columns'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-count'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^crop'), 1, NONE],
    [new RegExp('^dominant\-baseline'), 1, NONE],
    [new RegExp('^drop\-initial\-after\-adjust'), 1, NONE],
    [new RegExp('^drop\-initial\-after\-align'), 1, NONE],
    [new RegExp('^drop\-initial\-before\-adjust'), 1, NONE],
    [new RegExp('^drop\-initial\-before\-align'), 1, NONE],
    [new RegExp('^drop\-initial\-size'), 1, NONE],
    [new RegExp('^drop\-initial\-value'), 1, NONE],
    [new RegExp('^fit'), 1, NONE],
    [new RegExp('^fit\-position'), 1, NONE],
    [new RegExp('^float\-offset'), 1, NONE],
    [new RegExp('^font\-size\-adjust'), 1, FIREFOX],
    [new RegExp('^font\-stretch'), 1, NONE],
    [new RegExp('^grid\-columns'), 1, NONE],
    [new RegExp('^grid\-rows'), 1, NONE],
    [new RegExp('^hanging\-punctuation'), 1, NONE],
    [new RegExp('^hyphenate\-after'), 1, NONE],
    [new RegExp('^hyphenate\-before'), 1, NONE],
    [new RegExp('^hyphenate\-characters'), 1, NONE],
    [new RegExp('^hyphenate\-lines'), 1, NONE],
    [new RegExp('^hyphenate\-resource'), 1, NONE],
    [new RegExp('^hyphens'), 1, NONE],
    [new RegExp('^icon'), 1, NONE],
    [new RegExp('^image\-orientation'), 1, NONE],
    [new RegExp('^image\-resolution'), 1, NONE],
    [new RegExp('^inline\-box\-align'), 1, NONE],
    [new RegExp('^line\-stacking'), 1, NONE],
    [new RegExp('^line\-stacking\-ruby'), 1, NONE],
    [new RegExp('^line\-stacking\-shift'), 1, NONE],
    [new RegExp('^line\-stacking\-strategy'), 1, NONE],
    [new RegExp('^mark'), 1, NONE],
    [new RegExp('^mark\-after'), 1, NONE],
    [new RegExp('^mark\-before'), 1, NONE],
    [new RegExp('^marks'), 1, NONE],
    [new RegExp('^marquee\-direction'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-play\-count'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-speed'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-style'), 1, CHROME | SAFARI],
    [new RegExp('^move\-to'), 1, NONE],
    [new RegExp('^nav\-down'), 1, OPERA],
    [new RegExp('^nav\-index'), 1, OPERA],
    [new RegExp('^nav\-left'), 1, OPERA],
    [new RegExp('^nav\-right'), 1, OPERA],
    [new RegExp('^nav\-up'), 1, OPERA],
    [new RegExp('^opacity'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^outline\-offset'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^overflow\-style'), 1, NONE],
    [new RegExp('^overflow\-x'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^overflow\-y'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^page'), 1, NONE],
    [new RegExp('^page\-policy'), 1, NONE],
    [new RegExp('^perspective'), 1, CHROME | SAFARI],
    [new RegExp('^perspective\-origin'), 1, CHROME | SAFARI],
    [new RegExp('^punctuation\-trim'), 1, NONE],
    [new RegExp('^rendering\-intent'), 1, NONE],
    [new RegExp('^resize'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^rest'), 1, NONE],
    [new RegExp('^rest\-after'), 1, NONE],
    [new RegExp('^rest\-before'), 1, NONE],
    [new RegExp('^rotation'), 1, NONE],
    [new RegExp('^rotation\-point'), 1, NONE],
    [new RegExp('^ruby\-align'), 1, IE9PLUS],
    [new RegExp('^ruby\-overhang'), 1, IE9PLUS],
    [new RegExp('^ruby\-position'), 1, IE9PLUS],
    [new RegExp('^ruby\-span'), 1, NONE],
    [new RegExp('^size'), 1, NONE],
    [new RegExp('^string\-set'), 1, NONE],
    [new RegExp('^target'), 1, NONE],
    [new RegExp('^target\-name'), 1, NONE],
    [new RegExp('^target\-new'), 1, NONE],
    [new RegExp('^target\-position'), 1, NONE],
    [new RegExp('^text\-align\-last'), 1, NONE],
    [new RegExp('^text\-emphasis'), 1, NONE],
    [new RegExp('^text\-height'), 1, NONE],
    [new RegExp('^text\-justify'), 1, ALLIE],
    [new RegExp('^text\-outline'), 1, NONE],
    [new RegExp('^text\-overflow'), 1, ALLIE | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^text\-shadow'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^text\-wrap'), 1, NONE],
    [new RegExp('^transform'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transform\-origin'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transform\-style'), 1, CHROME | SAFARI],
    [new RegExp('^transition'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-property'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-duration'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-timing\-function'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-delay'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^word\-break'), 1, ALLIE | FIREFOX | CHROME | SAFARI],
    [new RegExp('^word\-wrap'), 1, ALLIE | FIREFOX | CHROME | SAFARI | OPERA]
]

// some hacks
var RULESET_HACKS = [
    [new RegExp('\\*html'),                 1, IE6],
    [new RegExp('\\*\\+html'),               1, IE7],
    [new RegExp('\\*:first\-child\\+html'),  1, IE7],
    [new RegExp('html>body'),              1, IE7 | IE8 | IE9PLUS],
    [new RegExp('html>/\\*\\*/body'),        1, IE8 | IE9PLUS],
    [new RegExp('.*\-webkit\-'),           1, WEBKIT],
    [new RegExp('.*\-moz\-'),              1, FIREFOX],
    [new RegExp('.*\-ms\-'),               1, IE9PLUS],
    [new RegExp('.*\-o\-'),                1, OPERA],

    //auto generated by script AUTO-GENERATOR-2 .
    [new RegExp('.+:first\-line'), 1, NOIE6],
    [new RegExp('.+:first\-letter'), 1, NOIE6],
    [new RegExp('\\.[^\\s]+\\.[^\\s]+'), 2, NOIE6],
    [new RegExp('.+>.+'), 1, NOIE6],
    [new RegExp('.+:first\-child'), 1, NOIE6],
    [new RegExp('.+:focus'), 1, NOIE67],
    [new RegExp('.+\\+.+'), 1, NOIE6],
    [new RegExp('.+\\[.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+~=.+\\]'), 1, NOIE6],
    [new RegExp('.+:before'), 1, NOIE67],
    [new RegExp('.+:after'), 1, NOIE67],
    [new RegExp('.+~.+'), 1, NOIE6],
    [new RegExp('.+\\[.+\^=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\$=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\\*=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\|=.+\\]'), 1, NOIE6],
    [new RegExp('.+:root'), 1, NOIE678],
    [new RegExp('.+:nth\-of\-type'), 1, NOIE678],
    [new RegExp('.+:nth\-last\-of\-type'), 1, NOIE678],
    [new RegExp('.+:first\-of\-type'), 1, NOIE678],
    [new RegExp('.+:last\-of\-type'), 1, NOIE678],
    [new RegExp('.+:only\-of\-type'), 1, NOIE678],
    [new RegExp('.+:only\-child'), 1, NOIE678],
    [new RegExp('.+:last\-child'), 1, NOIE678],
    [new RegExp('.+:nth\-child'), 1, NOIE678],
    [new RegExp('.+:nth\-last\-child'), 1, NOIE678],
    [new RegExp('.+:empty'), 1, NOIE678],
    [new RegExp('.+:target'), 1, NOIE678],
    [new RegExp('.+:checked'), 1, NOIE678],
    [new RegExp('.+::selection'), 1, NOIE678],
    [new RegExp('.+:enabled'), 1, NOIE678],
    [new RegExp('.+:disabled'), 1, NOIE678],
    [new RegExp('.+:not\(.+\)'), 1, NOIE678]
]

/*
# .test[fd*=df], .test:not(xxx) {
#      width:100px;
# }
# use .test:not(xxx) as important hack
*/
RULESET_HACKS = RULESET_HACKS.sort(function(a, b) {
    return a[2] - b[2]
});

// some hacks
var EXTRA_HACKS = [
    [new RegExp('@-webkit-keyframes'),   WEBKIT],
    [new RegExp('@-moz-keyframes'),      FIREFOX],
    [new RegExp('@-ms-keyframes'),       IE9PLUS],
    [new RegExp('@-o-keyframes'),        OPERA],
    [new RegExp('@keyframes'),             NONEIE | IE9PLUS],
    [new RegExp('@font-face'),           IE9PLUS | NONEIE],
    [new RegExp('@-moz-document'),       FIREFOX],
    [new RegExp('@mediascreenand\\(-webkit-min-device-pixel-ratio:0\\)'),  WEBKIT],
    [new RegExp('@mediascreenand\\(max-device-width:480px\\)'),               WEBKIT],
    [new RegExp('@mediaalland\\(-webkit-min-device-pixel-ratio:10000\\),notalland\\(-webkit-min-device-pixel-ratio:0\\)'),  OPERA]
]

function doRuleDetect(name, value) {
    name = '' + name;
    value = '' + value;
    var name = name.trim().replace(/\s+/g, '')
    var value = value.trim().replace(/\s+/g, '')

    for(var i = 0; i < RULE_HACKS.length; i++) {
        var hack = RULE_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(hack[1] == 1 ? name : value)
        if (match) {
            return hack[2]
        }
    }
        
    return STD
}

function doRuleSetDetect(selector) {
    var originSelector = selector.trim();
    selector = originSelector.replace(/\s+/g, '')
    for(var i = 0; i < RULESET_HACKS.length; i++) {
        var hack = RULESET_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(hack[1] == 1 ? selector : originSelector)
        if (match) {
            return hack[2]
        }
    }
    return STD
}

function doExtraDetect(selector) {
    selector = selector.trim().replace(/\s+/g, '')
    for(var i = 0; i < EXTRA_HACKS.length; i++) {
        var hack = EXTRA_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(selector)
        if (match)
            return hack[1]
    }
    return STD
}

exports.doRuleDetect = doRuleDetect
exports.doRuleSetDetect = doRuleSetDetect
exports.doExtraDetect = doExtraDetect

// if (!module.parent) {
    // console.log(doRuleDetect('_width', 100))
    // console.log((doRuleSetDetect('.a, .b')).toString(2))
    // console.log((doExtraDetect('@media screen and (-webkit-min-device-pixel-ratio:0)')).toString(2))
    // console.log((doExtraDetect('@media all and (-webkit-min-device-pixel-ratio:10000), not all and (-webkit-min-device-pixel-ratio:0)')).toString(2))
// }

})
// auto generated by concat 
;define('ckstyle/browsers/index', function(require, exports, module) {

exports.BinaryRule = require('./BinaryRule')
exports.Detector = require('./Detector')
exports.Hacks = require('./Hacks')
exports.Analyser = require('./Analyser')

})
// auto generated by concat 
;define('ckstyle/ckstyler', function(require, exports, module) {

var fs = require('fs');
var CSSParser = require('./parser/index').CSSParser;
var logger = require('./logger/index')
var base = require('./base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var ALL = require('./browsers/index').BinaryRule.ALL;
var isFunction = base.isFunction
var isObject = base.isObject
var findInArray = base.findInArray

var args = require('./command/args');
var defaultConfig = new args.CommandArgs()

var CssChecker = new Class(function() {
    this.__init__ = function(self, parser, config) {
        if (typeof parser == 'string') {
            parser = new CSSParser(parser, config && config.fileName ? config.fileName : 'TMP');
        }
        self.parser = parser
        self.config = config || defaultConfig

        // 错误记录，log是2级，warn是1级，error是0级
        self.logMsgs = []
        self.warningMsgs = []
        self.errorMsgs = []

        // 额外的错误记录，比如工具内部的一些错误等
        self.extraMsgs = []

        // 注册的不同类型的检查器（都来自plugins目录）
        self.ruleSetCheckers = []
        self.ruleCheckers = []
        self.styleSheetCheckers = []

        self.extraCheckers = []

        // 如果有解析过程的错误，则先把那些错误记录下来
        self.handleParseErrors()
    };

    this.prepare = function(self, pluginDir, config) {
        this.loadPlugins(pluginDir);
        this.doParse(config);
    }

    this.resetStyleSheet = function(self) {
        self.parser.styleSheet.rebase()
    }

    this.doParse = function(self) {
        this.parser.doParse(this.config);
    }

    this.getStyleSheet = function(self) {
        // 获取styleSheet引用
        return self.parser.styleSheet
    }

    this.handleParseErrors = function(self) {
        self.parser.getParseErrors().forEach(function(msg) {
            self.remember(msg[0], msg[1])
        })
    }

    this.hasError = function(self) {
        // 判断是否有error
        return self.logMsgs.length != 0 || self.warningMsgs.length != 0 || self.errorMsgs.length != 0
    }

    this.getErrors = this.errors = function(self) {
        // 把错误信息导出
        return [self.logMsgs, self.warningMsgs, self.errorMsgs]
    }

    this.loadPlugins = function(self, pluginDir) {
        if (typeof define == "function" && (define.amd || define.cmd)) {
            var plugins = require('./plugins/index');
            for(var prop in plugins) {
                self.registerPluginClass(plugins[prop])
            }
            return;
        }
        pluginDir = pluginDir || (fs.realpathSync(__dirname) + '/plugins');
        self._doLoadPlugins(pluginDir)
    }

    this._doLoadPlugins = function(self, pluginDir) {
        
        // 从plugins目录动态载入检查类
        fs.readdirSync(pluginDir).forEach(function(filename) {
            if (filename.slice(-3) != '.js' || filename.slice(-1) == '_') {
                return
            }
            if (filename == 'index.js' || filename == 'helper.js') {
                return
            }
            var fullpath = './plugins/' + filename, plugin;
            try {
                plugin = require(fullpath)
            } catch (e) {
                logger.error(e);
                plugin = null;
            }
            if (plugin) {
                self.registerPluginClass(plugin)
            }
        })
    }

    this.registerPluginClass = function(self, pluginClass) {
        var include = self.config.include || 'all'
        var exclude = self.config.exclude || []
        var safe = self.config.safe
        var safeModeExcludes = 'combine-same-rulesets'
        var instance = null;

        if (isFunction(pluginClass)) {
            instance = new pluginClass();
        } else if (isObject(pluginClass)) {
            // 构造plugin的类
            instance = pluginClass
        }
        
        // 如果是always，则说明不论是否选择都需要的规则
        if (!instance.always) {
            if (include != 'all' && include.indexOf(instance.id) == -1) {
                return
            } else if (exclude != 'none' && exclude.indexOf(instance.id) != -1) {
                return
            } else if (safe && safeModeExcludes.indexOf(instance.id) != -1) {
                return
            }
        }
        self.registerChecker(instance)
    }

    this.registerChecker = function(self, checker) {
        // 根据检查器类型的不同，分别注册到不同的检查器列表中
        if (checker.parent && checker.parent.type == 'rule' || checker.type == 'rule') {
            self.registerRuleChecker(checker)
        } else if (checker.parent && checker.parent.type == 'ruleset' || checker.type == 'ruleset') {
            self.registerRuleSetChecker(checker)
        } else if (checker.parent && checker.parent.type == 'stylesheet' || checker.type == 'stylesheet') {
            self.registerStyleSheetChecker(checker)
        } else {
            self.registerExtraChecker(checker)
        }
    }

    this.registerStyleSheetChecker = function(self, checker) {
        self.styleSheetCheckers.push(checker)
    }

    this.registerRuleSetChecker = function(self, checker) {
        self.ruleSetCheckers.push(checker)
    }

    this.registerRuleChecker = function(self, checker) {
        self.ruleCheckers.push(checker)
    }

    this.registerExtraChecker = function(self, checker) {
        self.extraCheckers.push(checker)
    }

    this.remember = function(self, errorLevel, errorMsg) {
        // 记录代码中的问题
        if (errorLevel == ERROR_LEVEL.LOG) {
            if (!self.config.errorLevel || self.config.errorLevel > 1) {
                self.logMsgs.push(errorMsg)
            }
        } else if (errorLevel == ERROR_LEVEL.WARNING) {
            if (!self.config.errorLevel || self.config.errorLevel > 0) {
                self.warningMsgs.push(errorMsg)
            }
        } else if (errorLevel == ERROR_LEVEL.ERROR) {
            self.errorMsgs.push(errorMsg)
        } else {
            logger.error('[DEV] wrong ErrorLevel for ' + errorMsg)
        }
    }

    this.logStyleSheetMessage = function(self, checker, styleSheet, errors) {
        // 记录StyleSheet的问题
        errorLevel = checker.level || checker.errorLevel;
        if (errors == null) {
            errors = [checker.msg || checker.errorMsg]
        }
        errors.forEach(function(errorMsg) {
            obj = {}
            if (!errorMsg)
                logger.error('[DEV] no errorMsg in your plugin, please check it')

            if (errorMsg.indexOf('${file}') == -1) {
                errorMsg = errorMsg + ' (from "' + styleSheet.getFile() + '")'
            // } else {
            //    errorMsg = errorMsg.replace('${file}', styleSheet.getFile())
            }

            obj["errorMsg"] = errorMsg
            obj["file"] = styleSheet.getFile()
            obj["level"] = 'stylesheet'
            self.remember(errorLevel, obj);
        })
    }

    this.logRuleMessage = function(self, checker, rule, errors) {
        // 记录一条key/value的问题
        errorLevel = checker.level || checker.errorLevel;
        if (!errors)
            errors = [checker.msg || checker.errorMsg]
        errors.forEach(function(errorMsg) {
            obj = {}
            if (!errorMsg) {
                logger.error('[DEV] no errorMsg in your plugin, please check it')
                return;
            }
            if (errorMsg.indexOf('${selector}') == -1) {
                errorMsg = errorMsg + ' (from "' + rule.selector + '")'
            //} else {
            //    errorMsg = errorMsg.replace('${selector}', rule.selector)
            }
            //errorMsg = errorMsg.replace('${name}', rule.roughName.trim())
            //errorMsg = errorMsg.replace('${value}', rule.value.trim())
            obj["errorMsg"] = errorMsg
            obj["selector"] = rule.selector
            obj["name"] = rule.roughName.trim()
            obj["value"] = rule.value.trim()
            obj["level"] = 'rule'
            self.remember(errorLevel, obj);
        });
    }

    this.logRuleSetMessage = function(self, checker, ruleSet, errors) {
        // 记录一个"规则集"中的问题
        errorLevel = checker.level || checker.errorLevel;
        if (!errors) {
            errors = [checker.msg || checker.errorMsg]
        }
        errors.forEach(function(errorMsg) {
            obj = {}
            if (errorMsg.indexOf('${selector}') == -1) {
                errorMsg = errorMsg + ' (from "' + ruleSet.selector + '")'
            //} else {
            //    errorMsg = errorMsg.replace('${selector}', ruleSet.selector)
            }
            obj["errorMsg"] = errorMsg
            obj["selector"] = ruleSet.selector
            obj["level"] = 'ruleset'
            self.remember(errorLevel, obj);
        });
    }

    this.doCompress = function(self, browser) {
        browser = browser || ALL;
        self.config._inner.curBrowser = browser
        self.doFix(browser)
        return self.getStyleSheet().compress(browser).trim()
    }

    this.doFormat = function(self) {
        self.resetStyleSheet()
        return self.getStyleSheet().fixed()
    }

    this.doFix = function(self, browser) {
        browser = browser || ALL;
        self.resetStyleSheet()
        // 忽略的规则集（目前只忽略单元测试的selector）
        ignoreRulesets = self.config.ignoreRulesets

        // fix规则集
        function fixRuleSet(ruleSet) {
            self.ruleSetCheckers.forEach(function(checker) {
                if (!checker.fix) {
                    return;
                }
                if (ruleSet.fixedSelector == '') {
                    ruleSet.fixedSelector = ruleSet.selector
                    ruleSet.fixedComment = ruleSet.comment
                }
                checker.fix(ruleSet, self.config)
            });
        }

        // fix规则
        function fixRules(ruleSet) {
            self.ruleCheckers.forEach(function(checker) {
                ruleSet.getRules().forEach(function(rule) {
                    if (!checker.fix) {
                        return;
                    }

                    // 确保fixedName/fixedValue一定有值
                    // fix中一定要针对fixedName/fixedValue来判断，确保其他plugin的fix不会被覆盖
                    if (rule.fixedValue == '') {
                        rule.fixedValue = rule.value
                        rule.fixedName = rule.strippedName
                    }
                    // print checker.id, checker, rule.fixedValue
                    checker.fix(rule, self.config)
                });
            });
        }

        function fixExtraRules(ruleSet) {
            self.extraCheckers.forEach(function(checker) {
                if (!checker.fix) {
                    return;
                }
                if (ruleSet.fixedSelector == '') {
                    ruleSet.fixedSelector = ruleSet.selector
                    ruleSet.fixedStatement = ruleSet.statement
                }
                checker.fix(ruleSet, self.config)
            });
        }

        styleSheet = self.parser.styleSheet

        styleSheet.getRuleSets().forEach(function(ruleSet) {
            if (ruleSet.extra) {
                fixExtraRules(ruleSet)
                return
            }
            // 判断此规则是否忽略
            if (findInArray(ignoreRulesets, ruleSet.selector)) {
                return
            }
            // 先fix rule
            fixRules(ruleSet)
            // 再fix ruleSet
            fixRuleSet(ruleSet)
        });

        // 最后fix styleSheet
        self.styleSheetCheckers.forEach(function(checker) {
            if (checker.fix) {
                checker.fix(styleSheet, self.config)
            }
        });
        return self.getStyleSheet().fixed(self.config)
    }

    this.doCheck = function(self) {
        // 忽略的规则集（目前只忽略单元测试的selector）
        var ignoreRulesets = self.config.ignoreRulesets

        function isBoolean(value) {
            return value === true || value === false;
        }

        function isList(value) {
            return Array.isArray(value)
        }

        // 检查规则集
        function checkRuleSet(ruleSet) {
            self.ruleSetCheckers.forEach(function(checker) {
                if (!checker.check) {
                    return;
                }
                result = checker.check(ruleSet, self.config)
                if (isBoolean(result)) {
                    if (!result) {
                        self.logRuleSetMessage(checker, ruleSet)
                    }
                } else if (isList(result) && len(result) != 0) {
                    self.logRuleSetMessage(checker, ruleSet, result)
                } else {
                    logger.error('check should be boolean/list, ' + checker.id + ' is not.')
                }
            });
        }

        // 检查规则
        function checkRule(ruleSet) {
            self.ruleCheckers.forEach(function(checker) {
                ruleSet.getRules().forEach(function(rule) {
                    if (!checker.check) {
                        return;
                    }
                    result = checker.check(rule, self.config)
                    if (isBoolean(result)) {
                        if (!result) {
                            self.logRuleMessage(checker, rule)
                        }
                    } else if (isList(result) && len(result) != 0) {
                        self.logRuleMessage(checker, rule, result)
                    } else {
                        logger.error('check should be boolean/list, ' + checker.id + ' is not.')
                    }
                });
            });
        }

        // 检查规则
        function checkExtraRule(ruleSet) {
            self.extraCheckers.forEach(function(checker) {
                if (!checker.check) {
                    return;
                }
                result = checker.check(ruleSet, self.config)
                if (isBoolean(result)) {
                    if (!result) {
                        self.logRuleSetMessage(checker, ruleSet)
                    }
                } else if (isList(result) && len(result) != 0) {
                    self.logRuleSetMessage(checker, ruleSet, result)
                } else {
                    logger.error('check should be boolean/list, ' + checker.id + ' is not.')
                }
            });
        }

        // 检查样式表
        styleSheet = self.parser.styleSheet
        self.styleSheetCheckers.forEach(function(checker) {
            if (!checker.check) {
                return;
            }
            result = checker.check(styleSheet, self.config)
            if (isBoolean(result)) {
                if (!result) {
                    self.logStyleSheetMessage(checker, styleSheet)
                }
            } else if (isList(result) && result.length != 0) {
                self.logStyleSheetMessage(checker, styleSheet, result)
            } else {
                logger.error('check should be boolean/list, ' + checker.id + ' is not.')
            }
        });

        styleSheet.getRuleSets().forEach(function(ruleSet) {
            if (ruleSet.extra) {
                checkExtraRule(ruleSet)
                return;
            }
            // 判断此规则是否忽略
            if (findInArray(ignoreRulesets, ruleSet.selector)) {
                return;
            }
            checkRuleSet(ruleSet)
            checkRule(ruleSet)
        })
    }
});

exports.CssChecker = CssChecker;

})
// auto generated by concat 
;define('ckstyle/command/args', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class

var analyse = require('../browsers/Analyser').analyse

var EXTS = {
    check: '.ckstyle.txt',
    fix: '.fixed.css',
    compress: '.min.css'
}

var CommandArgs = new Class(function() {

    this.__init__ = function(self, operation) {

        self.operation = operation || 'check'

        self.errorLevel = 2
        self.recursive = false
        self.print = false
        self.include = 'all'
        self.exclude = 'none'
        self.config = ''

        self.extension = EXTS[self.operation] || '.ckstyle.txt'

        self.standard = ''
        self.json = false
        self.ignoreRulesets = ['@unit-test-expecteds']
        self.singleLine = false
        self.safe = false

        self.combine = true
        self.browsers = null
        self.noBak = false

        // for CKStyle inner use
        self._inner = {
            curBrowser: null
        }

        // plugin config for developers, add plugin section in ckstyle.ini
        // 
        // [plugin]
        // pluginA = 1
        self._pluginConfigs = {}
    }

    this.extend = function(self, config) {
        // load configs i need.
        for(var prop in self) {
            if (prop == 'parent') {
                continue
            }
            if (config.hasOwnProperty(prop)) {
                if (prop == 'browsers') {
                    self[prop] = analyse(config[prop])
                    continue
                }
                self[prop] = config[prop]
            }
        }
    }

    this.toString = function(self) {
        var collector = []
        for(var prop in self) {
            collector.push(prop + ': ' + self[prop])
        }
        return collector.join(', ')
    }
});

exports.CommandArgs = CommandArgs

})
// auto generated by concat 
;define('ckstyle/command/index', function(require, exports, module) {



})
// auto generated by concat 
;define('ckstyle/doCssCheck', function(require, exports, module) {

var fs = require('fs');
var pathm = require('path');
var logger = require('./logger/index')
var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');
var ReporterUtil = require('./reporter/index').ReporterUtil

var defaultConfig = new args.CommandArgs()

function doCheck(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'ckstyle'
    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    checker.doCheck()

    return checker
}

function checkFile(filePath, config) {
    config = config || defaultConfig
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[check] file not exist: ' + filePath)
        return;
    }
    var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    logger.log('[check] checking ' + filePath)
    var checker = doCheck(fileContent, filePath, config)
    var path = filePath + config.extension
    if (checker.hasError()) {
        var reporter = ReporterUtil.getReporter(config.json ? 'json' : 'text', checker)
        reporter.doReport()
        if (config.print) {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            logger.out(reporter.export() + '\n')
        } else {
            fs.writeFileSync(path, reporter.export())
            logger.log('[check] @see ' + path)
        }
        return false
    } else {
        if (config.json)
            logger.ok('{"status":"ok","result":"' + filePath + ' is ok"}')
        else
            logger.ok('[check] ' + filePath + ' is ok\n')
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
        return true
    }
} 



function check(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[check] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            checkDirRecursively(file, config)
        } else {
            checkDirSubFiles(file, config)
        }
    } else {
        checkFile(file, config)
    }
}


function checkDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        checkDirRecursively(directory, config)
    else
        checkDirSubFiles(directory, config)
}

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
}

function checkDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        checkFile(pathm.join(directory, filename), config)
    });
}

function checkDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            checkDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        checkFile(pathm.join(directory, filename), config)
    });
}

function checkCssText(text) {
    var checker = doCheck(text)
    var reporter = ReporterUtil.getReporter('text', checker)
    reporter.doReport()
    logger.log(reporter.export())
}

exports.doCheck = doCheck;
exports.check = check;

})
// auto generated by concat 
;define('ckstyle/doCssCompress', function(require, exports, module) {

var fs = require('fs');
var pathm = require('path');

var logger = require('./logger/index')
var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
}

function prepare(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig
    config.operation = 'compress'

    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
    checker.prepare();
    return checker
}

function doCompress(fileContent, fileName, config) {
    checker = prepare(fileContent, fileName, config)
    message = checker.doCompress()
    return [checker, message]
}

function compressFile(filePath, config) {
    config = config || defaultConfig
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[compress] file not exist: ' + filePath)
        return;
    }

    var extension = config.extension
    if (extension.toLowerCase() == 'none')
        extension = null
    if (extension && endswith(filePath, extension))
        return
    var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    if (!config.print)
        logger.ok('[compress] compressing ' + filePath)
    var path = filePath
    var basic = filePath.split('.css')[0]
    if (!extension) {
        if (config.noBak === false)
            fs.writeFileSync(path + '.bak', fileContent)
    } else {
        path = filePath.split('.css')[0] + extension
    }

    if (!config.browsers) {
        var result = doCompress(fileContent, filePath, config)
        checker = result[0]
        message = result[1]
        if (config.print) {
            if (extension && fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            logger.out(message)
        } else {
            fs.writeFileSync(path, message)
            logger.ok('[compress] compressed ==> ' + path)
        }
    } else {
        items = config.browsers
        onlyOne = Object.keys(items).length == 1
        for (var key in items) {
            var value = items[key];
            // 每次都需要一个新的，避免上一次操作后的对象在内存中重复使用导致错误
            // 尤其是合并过的CSS规则集
            checker = prepare(fileContent, filePath, config)
            message = checker.doCompress(value)
            path = filePath.split('.css')[0] + '.' + key + '.min.css'
            if (config.print) {
                if (extension && fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }
                logger.out((onlyOne ? '' : (key + ' : ')) + message)
            } else {
                fs.writeFileSync(path, message)
                logger.ok('[compress] compressed ==> ' + path)
            }
        }
    }
}

function compress(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[compress] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            compressDirRecursively(file, config)
        } else {
            compressDirSubFiles(file, config)
        }
    } else {
        compressFile(file, config)
    }
}

function compressDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        compressDirRecursively(directory, config)
    else
        compressDirSubFiles(directory, config)
}

function compressDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        compressFile(pathm.join(directory, filename), config)
    });
}

function compressDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            compressDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        compressFile(pathm.join(directory, filename), config)
    });
}

exports.prepare = prepare

exports.doCompress = doCompress;
exports.compress = compress;

})
// auto generated by concat 
;define('ckstyle/doCssFix', function(require, exports, module) {

var fs = require('fs');
var pathm = require('path');

var logger = require('./logger/index')
var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
}

function doFix(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'fixstyle'
    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    var fixed = checker.doFix()

    return [checker, fixed]
}

function fixFile(filePath, config) {
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[fix] file not exist: ' + filePath)
        return;
    }

    config = config || defaultConfig

    extension = config.extension

    if (extension.toLowerCase() == 'none')
        extension = null
    if (extension != null && endswith(filePath, extension))
        return
    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    if (!config.print)
        logger.ok('[fix] fixing ' + filePath)

    var result = doFix(fileContent, filePath, config)
    checker = result[0]
    msg = result[1]

    path = filePath
    if (extension == null) {
        if (!config.noBak)
            fs.writeFileSync(path + '.bak', fileContent)
    } else {
        path = filePath.split('.css')[0] + extension
    }

    if (config.print) {
        if (extension && fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
        logger.out(msg)
    } else {
        fs.writeFileSync(path, msg)
        logger.ok('[fix] fixed ==> ' + path)
    }
} 

function fix(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[fix] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            fixDirRecursively(file, config)
        } else {
            fixDirSubFiles(file, config)
        }
    } else {
        fixFile(file, config)
    }
}

function fixDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        fixDirRecursively(directory, config)
    else
        fixDirSubFiles(directory, config)
}

function fixDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        fixFile(pathm.join(directory, filename), config)
    });
}

function fixDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            fixDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        fixFile(pathm.join(directory, filename), config)
    });
}

exports.doFix = doFix
exports.fix = fix

})
// auto generated by concat 
;define('ckstyle/entity/entityutil', function(require, exports, module) {

var ALL = require('../browsers/BinaryRule').ALL

var Cleaner = {};

Cleaner.clean = function(msg) {
    msg = msg.trim().replace('\r', '').replace('\n', '').replace('    ', ' ')
    msg = msg.replace(/\s*\{\s*/g, '{'); 
    msg = msg.replace(/\s*:\s*/g, ':'); 
    msg = msg.replace(/\s*;\s*\}\s*/g, '}');
    msg = msg.replace(/\s*;\s*/g, ';')
    msg = msg.replace(/\s\s+/g, ' ')
    msg = msg.replace(/\(\s*/g, '(')
    msg = msg.replace(/\s+\)/g, ')')
    msg = msg.replace(/\s+,/g, ',')
    msg = msg.replace(/,\s+/g, ',')
    msg = msg.trim()
    return msg
}

Cleaner.clearName = function(name) {
    name = name.trim()
    // #padding: 10px???
    if (name.indexOf('_') == 0 || name.indexOf('*') == 0 || name.indexOf('+') == 0 || name.indexOf('#') == 0) {
        name = name.substring(1);
    }
    if (name.indexOf('-') == 0) {
        if (name.indexOf('-moz-') == 0
            || name.indexOf('-webkit-') == 0 
            || name.indexOf('-ms-') == 0 
            || name.indexOf('-o-') == 0
            || name.indexOf('-khtml-') == 0)
            name = name.split('-').slice(2).join('-');
    }
    return name.toLowerCase()
}

Cleaner.clearValue = function(value) {
    value = value.trim()
    if (value.slice(-1) == ';')
        value = value.slice(0, -1);
    return value
}

Cleaner.clearValues = function(values) {
    values = values.trim()
    return values
}

Cleaner.clearSelector = function(selector) {
    return selector.split('\n').join(' ').trim()
}

Cleaner.clearComment = function(comment) {
    comment = comment.trim()
    if (comment.length != 0 && comment.indexOf('\n') == -1) {
        comment = comment.replace(/\/\*/g, '').replace(/\*\//g, '').trim()
        comment = '/* ' + comment + ' */'
    }
    return comment
}

exports.Cleaner = Cleaner;

})
// auto generated by concat 
;define('ckstyle/entity/extrastatement', function(require, exports, module) {

var helper = require('./entityutil');
Cleaner = helper.Cleaner;
var doExtraDetect = require('../browsers/Hacks').doExtraDetect
var ALL = require('../browsers/BinaryRule').ALL

function ExtraStatement(operator, statement, comment, styleSheet) {
    var self = this;
    self.extra = true
    self.nested = false
    self.selector = self.operator = operator.trim()
    self.comment = comment || ''
    self.statement = statement || ''
    self.styleSheet = styleSheet

    self.fixedSelector = ''
    self.fixedStatement = ''

    self.browser = doExtraDetect(self.selector)
    self.toBeUsed = {}
}

ExtraStatement.prototype.isImport = function() {
    var self = this;
    return self.operator == '@import'
}

ExtraStatement.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedStatement = ''
}
    
ExtraStatement.prototype.isOpmOperator = function() {
    var self = this;
    return self.operator.indexOf('@-css-compiler') != -1
}

ExtraStatement.prototype.compress = function(browser) {
    // do not export @-css-compiler to online 
    browser = browser || ALL;
    var self = this;
    if (self.isOpmOperator())
        return ''

    if (!(self.browser & browser))
        return ''
    
    msg = Cleaner.clean(self.statement)
    if (msg.slice(-1) != '}' && msg.slice(-1) != ';') {
        msg = msg + ';'
    }
    return msg
}

ExtraStatement.prototype.fixed = function(config) {
    var self = this;
    if (self.comment.length == 0) {
        return self.statement.trim()
    } else {
        return self.comment + '\n' + self.statement.trim()
    }
}

ExtraStatement.prototype.toString = function() {
    var self = this;
    return self.statement
}

module.exports = ExtraStatement;

})
// auto generated by concat 
;define('ckstyle/entity/index', function(require, exports, module) {

var StyleSheet = require('./stylesheet');

exports.StyleSheet = StyleSheet;

})
// auto generated by concat 
;define('ckstyle/entity/nestedstatement', function(require, exports, module) {

var helper = require('./entityutil');
Cleaner = helper.Cleaner;
var doExtraDetect = require('../browsers/Hacks').doExtraDetect
var ALL = require('../browsers/BinaryRule').ALL

function NestedStatement(selector, statement, comments, styleSheet) {
    var self = this;
    self.extra = true
    self.nested = true
    self.selector = Cleaner.clearSelector(selector)
    self.statement = statement.trim()
    self.roughStatement = statement
    self.roughSelector = selector
    self.comments = comments.trim()
    self.styleSheet = styleSheet

    self.fixedSelector = ''
    self.fixedStatement = ''

    self.browser = doExtraDetect(self.selector)
    self.toBeUsed = {}

    self.innerStyleSheet = null
}

NestedStatement.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedStatement = ''
}

NestedStatement.prototype.compress = function(browser) {
    browser = browser || ALL;
    var self = this;
    if (!(self.browser & browser))
        return ''
    return self.fixedSelector + self._compressedStatement(browser)
}

NestedStatement.prototype.fixed = function(config) {
    var self = this;
    self.fixedSelector = self.fixedSelector || self.selector
    self.fixedStatement = self.fixedStatement || self.statement
    // if (self.innerStyleSheet) {
    //     self.fixedStatement = self.innerStyleSheet.fixed(config)
    // }
    return self.fixedSelector + ' {\n    ' + self.fixedStatement.split('\n').join('\n    ') + '\n}'
}
NestedStatement.prototype._compressedStatement = function(browser) {
    var self = this;
    var stmt = Cleaner.clean(self.fixedStatement);
    if (self.innerStyleSheet) {
        stmt = self.innerStyleSheet.compress(browser)
    }
    return '{' + stmt + '}'
}
NestedStatement.prototype.toString = function () {
    var self = this;
    return self.statement
}

module.exports = NestedStatement;

})
// auto generated by concat 
;define('ckstyle/entity/rule', function(require, exports, module) {

var helper = require('./entityutil');
var Cleaner = helper.Cleaner;
var doRuleDetect = require('../browsers/Hacks').doRuleDetect
var ALL = require('../browsers/BinaryRule').ALL

function Rule(selector, name, value, ruleSet) {
    var self = this;

    self.roughName = name
    self.roughValue = value
    self.roughSelector = selector

    self.name = Cleaner.clearName(name)
    self.value = Cleaner.clearValue(value)
    self.selector = Cleaner.clearSelector(selector)

    self.strippedName = name.trim()
    self.strippedValue = value.trim()
    self.strippedSelector = selector.trim()

    self.fixedName = ''
    self.fixedValue = ''
    self.fixedPrefix = ''
    self.ruleSet = ruleSet

    self.browser = doRuleDetect(self.roughName, self.roughValue)
    self.toBeUsed = {}
}

Rule.prototype.rebase = function() {
    var self = this;
    self.fixedName = ''
    self.fixedValue = ''
}
    
Rule.prototype.reset = function(name, value) {
    var self = this;
    self.roughName = self.name = self.strippedName = self.fixedName = name
    self.roughValue = self.value = self.strippedValue = self.fixedValue = value
}

Rule.prototype.compress = function(browser) {
    var self = this;
    browser = browser || ALL;

    if (!self.browser) {
        return '';
    }
    if ((self.browser & browser) == 0) {
        return ''
    }
    var name = self.fixedName ? (self.fixedName + '').trim() : self.name
    var value = self.fixedValue ? (self.fixedValue + '').trim() : self.value
    return name + ':' + Cleaner.clearValue(Cleaner.clean(value)) + ';'
}

Rule.prototype.fixed = function() {
    var self = this;
    var name = (self.fixedName || self.strippedName) + ''
    var value = (self.fixedValue || self.strippedValue) + ''
    return name + ': ' + self.fixedPrefix + Cleaner.clearValue(Cleaner.clean(value)) + ';'
}

Rule.prototype.getRuleSet = function() {
    var self = this;
    return self.ruleSet
}

Rule.prototype.toString = function() {
    var self = this;
    return ' roughName: ' + self.roughName + '\n name: ' + self.name + '\n roughValue: ' + self.roughValue + '\n value: ' + self.value + '\n';
}

module.exports = Rule;

})
// auto generated by concat 
;define('ckstyle/entity/ruleset', function(require, exports, module) {

var helper = require('./entityutil');
var Cleaner = helper.Cleaner;
var doRuleSetDetect = require('../browsers/Hacks').doRuleSetDetect
var ALL = require('../browsers/BinaryRule').ALL

var Rule = require('./rule');

function RuleSet(selector, values, comment, styleSheet) {
    var self = this;
    self.extra = false
    self.roughSelector = selector
    self.roughValue = values
    self.roughComment = comment

    self.selector = Cleaner.clearSelector(selector)
    self.values = Cleaner.clearValues(values)
    self.comment = Cleaner.clearComment(comment)

    self.fixedSelector = ''
    self.fixedComment = ''

    self.styleSheet = styleSheet
    self._rules = []

    self.singleLineFlag = (self.roughValue.split('\n').length == 1)

    self.browser = doRuleSetDetect(self.roughSelector)
    self.toBeUsed = {}
}


RuleSet.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedComment = ''
}

RuleSet.prototype.extendSelector = function(other) {
    var self = this;
    var splited = [];
    var selectors = self.selector.split(',');
    for(var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() != '') {
            splited.push(selectors[i].trim());
        }
    }
    var otherSplited = [];
    var selectors = other.selector.split(',');
    for(var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() != '') {
            otherSplited.push(selectors[i].trim());
        }
    }

    otherSplited.forEach(function(x) {
        if (splited.indexOf(x) == -1) {
            self.selector = self.selector + ', ' + x
            self.roughSelector = self.roughSelector + ', ' + x
            self.fixedSelector = self.fixedSelector + ',' + x
        }
    });

    if (other.comment.length != 0 && self.comment.indexOf(other.comment) == -1) {
        // do not need duplicated comment
        self.roughComment = self.roughComment + ('\n' + other.roughComment)
        self.comment = self.comment + '\n' + other.comment
        self.fixedComment = self.fixedComment + '\n' + other.fixedComment
    }
}

RuleSet.prototype.compressRules = function(browser) {
    var self = this;
    browser = browser || ALL;
    var collector = []
    self._rules.forEach(function(rule) {
        compressed = rule.compress(browser)
        if (compressed != '') {
            collector.push(compressed)
        }
    });
    var collected = collector.join('')
    if (collected != '') {
        collected = collected.slice(0, -1)
    }
    return collected
}

RuleSet.prototype.compress = function(browser) {
    var self = this;
    browser = browser || ALL;
    if (!self.browser) {
        return '';
    }
    if (!(self.browser & browser))
        return ''
    var result = self.fixedSelector || self.selector;
    if (result.indexOf(',') != -1) {
        // remove duplicated selectors
        var selectors = []
        var splited = result.split(',');
        splited.forEach(function(x) {
            x = x.trim()
            if (selectors.indexOf(x) != -1) {
                return;
            }
            selectors.push(x)
        })
        result = selectors.join(',');
    }
    var compressed = self.compressRules(browser)
    if (compressed == '')
        return ''
    result = result + '{' + compressed + '}'
    return result
}

RuleSet.prototype.fixedRules = function(config) {
    var self = this;
    var collector = []
    var spaces = '    '
    var seperator = '\n'
    if (config && config.singleLine) {
        spaces = ''
        seperator = ' '
    }
    self._rules.forEach(function(rule) {
        collector.push(spaces + rule.fixed())
    })
    var collected = collector.join(seperator)
    return collected
}

RuleSet.prototype.fixed = function(config) {
    var self = this;
    var comment = self.fixedComment || self.comment
    var selector = self.fixedSelector || self.selector
    if (selector.indexOf(',') != -1) {
        // remove duplicated selectors
        selectors = []
        selector.split(',').forEach(function(x) {
            x = x.trim()
            if (selectors.indexOf(x) != -1)
                return;
            selectors.push(x)
        })
        selector = selectors.join(',\n')
    }
    var seperator = '\n'
    if (config && config.singleLine) {
        seperator = ' '
    }
    var result = selector + ' {' + seperator + self.fixedRules(config) + seperator + '}'
    if (comment != '') {
        result = comment + '\n' + result
    }
    return result
}

RuleSet.prototype.getSingleLineFlag = function() {
    var self = this;
    return self.singleLineFlag
}

RuleSet.prototype.getStyleSheet = function() {
    var self = this;
    return self.styleSheet
}

RuleSet.prototype.addRuleByStr = function(selector, attr, value) {
    var self = this;
    self._rules.push(new Rule(selector, attr, value, self))
}
RuleSet.prototype.indexOf = function(name) {
    var self = this;
    var counter = 0
    name = name.trim();
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.roughName.trim() == name) {
            return counter
        }
        counter = counter + 1
    }
    return -1
}
RuleSet.prototype.removeRuleByIndex = function(index) {
    var self = this;
    if (index < self._rules.length) {
        self._rules[index] = null;
    }
}
RuleSet.prototype.clean = function() {
    var self = this;
    var newRules = []
    self._rules.forEach(function(rule) {
        if (!rule) {
            return;
        }
        newRules.push(rule)
    })
    self._rules = newRules
}
RuleSet.prototype.existNames = function(name) {
    var self = this, names;
    if (name.indexOf(',') != -1) {
        names = name.split(',')
    } else {
        names = [name]
    }
    for(var i = 0; i < names.length; i++) {
        var name = names[i];
        name = name.trim()
        for(var j = 0; j < self._rules.length; j++) {
            var rule = self._rules[j]
            if (rule.name == name) {
                return true;
            }
        }
    }
    return false
}

RuleSet.prototype.existRoughNames = function(name) {
    var self = this, names;
    if (name.indexOf(',') != -1) {
        names = name.split(',')
    } else {
        names = [name]
    }
    for(var i = 0; i < names.length; i++) {
        var name = names[i];
        name = name.trim()
        for(var j = 0; j < self._rules.length; j++) {
            var rule = self._rules[j]
            if (rule.strippedName == name) {
                return true;
            }
        }
    }
    return false
}

RuleSet.prototype.existValueStarts = function(prefix) {
    var self = this, prefixes;
    if (prefix.indexOf(',') != -1) {
        prefixes = prefix.split(',')
    } else {
        prefixes = [prefix]
    }
    for(var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        prefix = prefix.trim()
        for(var j = 0; j < self._rules.length; j++) {
            var rule = self._rules[j]
            if (rule.strippedValue.indexOf(prefix) == 0) {
                return true;
            }
        }
    }
    return false
}

RuleSet.prototype.getRuleByStrippedName = function(name) {
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.strippedName == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRuleByRoughName = function(name) {
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.roughName == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRuleByName = function(name) {
    if (!name) {
        return;
    }
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.name == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRules = function() {
    var self = this;
    return self._rules
}
RuleSet.prototype.setRules = function(newRules) {
    var self = this;
    self._rules = newRules
}
RuleSet.prototype.toString = function() {
    var self = this;
    return self.selector + ' {' + self.roughValue + '}';
}

module.exports = RuleSet;

})
// auto generated by concat 
;define('ckstyle/entity/stylesheet', function(require, exports, module) {

var RuleSet = require('./ruleset');
var ExtraStatement = require('./extrastatement');
var NestedStatement = require('./nestedstatement');
var EntityUtil = require('./entityutil');

function StyleSheet(fileName) {
    this._ruleSets = [];
    this._file = fileName || '';
    //self.browser = ALL
    this.toBeUsed = {};
}

StyleSheet.prototype.addRuleSetByStr = function(selector, attrs, comment) {
    this._ruleSets.push(new RuleSet(selector, attrs, comment, this))
};

StyleSheet.prototype.addExtraStatement = function(operator, statement, comment) {
    this._ruleSets.push(new ExtraStatement(operator, statement, comment, this))
};

StyleSheet.prototype.addNestedRuleSet = function(selector, attrs, comment) {
    var stmt = new NestedStatement(selector, attrs, comment, this)
    this._ruleSets.push(stmt)
    return stmt
};

StyleSheet.prototype.setFile = function(fileName) {
    this._file = fileName
};

StyleSheet.prototype.getFile = function() {
    var self = this;
    return this._file
};

StyleSheet.prototype.getRuleSets = function() {
    var self = this;
    return self._ruleSets
};

StyleSheet.prototype.removeRuleSetByIndex = function(index) {
    var self = this;
    self._ruleSets[index] = null
};

StyleSheet.prototype.removeRuleSet = function(ruleSet) {
    var self = this;
    var newRuleSets = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        x = this._ruleSets[i];
        if (x == ruleSet) {
            continue
        }
        newRuleSets.push(x)
    }
    this._ruleSets = newRuleSets;
};

StyleSheet.prototype.clean = function() {
    var self = this;
    var newRuleSets = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        x = this._ruleSets[i];
        if (x == null) {
            continue
        }
        newRuleSets.push(x)
    }
    this._ruleSets = newRuleSets
};

StyleSheet.prototype.getRuleSetBySelector = function(selector) {
    var self = this;
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        if (ruleSet.selector == selector) {
            return ruleSet
        }
    }
};

StyleSheet.prototype.compress = function(browser) {
    browser = browser || ALL;
    var self = this;
    var result = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        if (ruleSet.browser && !(ruleSet.browser & browser)) {
            continue
        }
        result.push(ruleSet.compress(browser))
    }
    return result.join('')
};

StyleSheet.prototype.fixed = function(config) {
    var self = this;
    var result = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        result.push(ruleSet.fixed(config))
    }
    return result.join('\n\n')
};

StyleSheet.prototype.rebase = function() {
    var self = this;
    self._ruleSets.forEach(function(ruleSet) {
        ruleSet.rebase()
    });
};

module.exports = StyleSheet;

})
// auto generated by concat 
;define('ckstyle/index', function(require, exports, module) {

module.exports = require('./ckstyler')

})
// auto generated by concat 
;define('ckstyle/logger/index', function(require, exports, module) {

var colors = require('colors')

var prefix = '[CKStyle] '.cyan

function out(msg) {
    console.log(msg)
}

function log(msg) {
    console.log(prefix + msg)
}

function warn(msg) {
    console.log(prefix + msg.yellow)
}

function error(msg) {
    console.log(prefix + msg.red)
}

function ok(msg) {
    console.log(prefix + msg.green)
}

exports.log = log
exports.warn = warn
exports.error = error
exports.ok = ok
exports.out = out

})
// auto generated by concat 
;define('ckstyle/parser/helper', function(require, exports, module) {

function isAlphaChar(char) {
    return char >= 97 && char <= 122
}

specialTexts = [
    {'start':'@', 'text':'@import', 'end':';\n'},
    {'start':'@', 'text':'@charset', 'end':';\n'},
    {'start':'@', 'text':'@namespace', 'end':';'},
    {'start':'@', 'text':'@-css-compiler ', 'end':'}'},
    {'start':'@', 'text':'@-css-compiler{', 'end':'}'},
    {'start':'@', 'text':'@-css-compiler-', 'end':';\n'}]

specialStartChars = [];
for (var i = specialTexts.length - 1; i >= 0; i--) {
    var current = specialTexts[i];
    if (specialStartChars.indexOf(current.start) == -1) {
        specialStartChars.push(current.start);
    }
};

nestedStatements = ['keyframes', '@media', '@-moz-document']

function isSpecialStart(char) {
    for (var i = specialStartChars.length - 1; i >= 0; i--) {
        if (specialStartChars[i] == char) {
            return true;
        }
    }
    return false;
}

function isNestedStatement(selector) {
    if (selector.indexOf('@') == -1) {
        return false
    }
    for (var i = nestedStatements.length - 1; i >= 0; i--) {
        if (selector.indexOf(nestedStatements[i]) != -1)
            return true
    }
    return false;
}

function handleSpecialStatement(text, i, length, char) {
    for(var k = 0; k < specialTexts.length; k++) {
        var obj = specialTexts[k];
        if (char == obj['start'] && isSpecialString(text, i, obj["text"])) {
            tmp = findCharFrom(text, i, length, obj["end"])
            tmp.push(obj["text"])
            return tmp;
        }
    }
    return [null, null, null];
}

function findCharFrom(text, i, length, left, right) {
    right = right || null;
    var counter = 1
    var collector = ''
    for(var j = i + 1; j < length; j++) {
        if (text[j] == ',') {
            collector = collector + text[j]
            continue;
        }
        if (right == null) {
            if (text[j] == left || left.indexOf(text[j]) != -1) {
                break;
            } else {
                collector = collector + text[j]
            }
        } else {
            if (text[j] == left) {
                collector = collector + text[j]
                counter = counter + 1
            } else if (text[j] == right) {
                collector = collector + text[j]
                counter = counter - 1
                if (counter == 0) {
                    break;
                }
            } else {
                collector = collector + text[j]
            }
        }
    }
    return [j, collector]
}

function isSpecialString(text, i, string) {
    return text.substring(i, i + string.length) == string
}

function isCommentStart(char, text, i) {
    return char == '/' && i + 1 < text.length && text[i + 1] == '*'
}

function isCommentEnd(char, text, i) {
    return char == '/' && text[i - 1] == '*'
}

exports.isCommentStart = isCommentStart;
exports.isCommentEnd = isCommentEnd;
exports.isSpecialString = isSpecialString;
exports.findCharFrom = findCharFrom;
exports.isAlphaChar = isAlphaChar;
exports.isSpecialStart = isSpecialStart;
exports.isNestedStatement = isNestedStatement;
exports.handleSpecialStatement = handleSpecialStatement;

})
// auto generated by concat 
;define('ckstyle/parser/index', function(require, exports, module) {

var StyleSheet = require('../entity/index').StyleSheet;

var helper = require('./helper');
findCharFrom = helper.findCharFrom;
handleSpecialStatement = helper.handleSpecialStatement;
isCommentStart = helper.isCommentStart;
isCommentEnd = helper.isCommentEnd
isSpecialStart = helper.isSpecialStart
isNestedStatement = helper.isNestedStatement;

function CSSParser(css, fileName, config) {
    this.reset(css, fileName, config);
}

CSSParser.prototype.reset = function(css, fileName, config) {
    this.roughCss = css;
    this.fileName = fileName;
    this.totalLength = css.length;
    this.styleSheet = new StyleSheet(fileName);
    this._parseErrors = [];
};

CSSParser.prototype.doParse = function(config) {
    var self = this;
    config = config || {};
    if (self.totalLength == 0) {
        return;
    }
    var prevChar = null, inComment = false, length = self.totalLength,
        text = self.roughCss, selector = '', commentText = '', i = -1 , 
        comments = []
    var realComment;
    while (true) {
        if (i == length - 1) {
            break;
        }
        i = i + 1
        var char = text[i]
        if (!inComment && isCommentStart(char, text, i)) {
            commentText = ''
            inComment = true
        }
        if (isCommentEnd(char, text, i)) {
            commentText = commentText + char
            inComment = false
            comments.push(commentText)
            commentText = ''
            continue
        }
        if (inComment) {
            commentText = commentText + char
            continue;
        }
        if (isSpecialStart(char)) {
            var tmp = handleSpecialStatement(text, i, length, char);
            var nextPos = tmp[0];
            var attrs = tmp[1];
            var operator = tmp[2];
            if (nextPos !== null) {
                realComment = ''
                if (comments.length != 0) {
                    realComment = comments.join('\n')
                    comments = []
                }
                self.styleSheet.addExtraStatement(operator, char + attrs + text[nextPos], realComment)
                i = nextPos
                selector = ''
                commentText = ''
                comments = []
                continue
            }
        }

        if (char == '{') {
            var tmp = findCharFrom(text, i, length, '{', '}');
            var nextBracePos = tmp[0];
            var attributes = tmp[1];
            // do not need the last brace
            var realComment = ''
            if (comments.length != 0) {
                realComment = comments.join('\n')
                comments = []
            }
            if (isNestedStatement(selector)) {
                var nestedCss = attributes.slice(0, -1)
                var stmt = self.styleSheet.addNestedRuleSet(selector, nestedCss, realComment)
                parseNestedStatment(stmt, nestedCss, this.fileName, this.config)
            } else {
                self.styleSheet.addRuleSetByStr(selector, attributes.slice(0, -1), realComment)
            }
            commentText = ''
            i = nextBracePos
            selector = ''
        } else if (char == '}') {
            selector = ''
        } else {
            selector = selector + char
        }
    }
        
    function parseNestedStatment(stmt, nestedCss, fileName, config) {
        var innerParser = new CSSParser(nestedCss, fileName, config)
        innerParser.doParse(config)
        stmt.innerStyleSheet = innerParser.styleSheet
    }

    self.styleSheet.getRuleSets().forEach(function(ruleSet) {
        var errors = self.doParseRules(ruleSet)
        self._parseErrors = self._parseErrors.concat(errors);
    })
};

CSSParser.prototype.getParseErrors = function () {
    return this._parseErrors
};

CSSParser.prototype.doParseRules = function(ruleSet) {
    var errors = []
    if (ruleSet.extra) {
        return errors
    }
    var text = ruleSet.roughValue
    var singleLine = text.split('\n').length == 1
    var selector = ruleSet.selector.trim()
    var i = -1
    var length = text.length
    var inComment = false
    var collector = ''
    var attr = ''
    var value = ''
    var valueStarted = false
    while (true) {
        if (i == length - 1)
            break;
        i = i + 1
        char = text[i]
        if (!valueStarted && isCommentStart(char, text, i)) {
            inComment = true
            //errors.push([-1, 'find comment in values of "%s"' % selector])
            collector = ''
        }
        if (!valueStarted && isCommentEnd(char, text, i)) {
            collector = ''
            inComment = false
            continue
        }
        if (!valueStarted && inComment) {
            continue
        }
        if (char == ':') {
            if (valueStarted) {
                collector = collector + char
            } else {
                valueStarted = true
                attr = collector
                collector = ''
            }
        } else if (char == ';' || char == '\n' || i == length - 1) {
            valueStarted = false
            if (attr == '') {
                collector = ''
                continue
            }
            value = collector + char
            // no value yet
            if (value.trim().length == 0) {
                continue;
            }
            // not over yet
            if (value.trim().slice(-1) == ',') {
                continue;
            }
            ruleSet.addRuleByStr(selector, attr, value)
            attr = ''
            value = ''
            collector = ''
        } else if (char == '{') {
            var tmp = findCharFrom(text, i, length, '{', '}');
            nextBracePos = tmp[0];
            attributes = tmp[1]; 
            collector = collector + char + attributes
            i = nextBracePos
        } else if (char == '}') {
            collector = collector + char
        } else if (char == '(') {
            var tmp = findCharFrom(text, i, length, '(', ')');
            nextBracePos = tmp[0];
            attributes = tmp[1];
            collector = collector + char + attributes
            i = nextBracePos
            if (i == length - 1) {
                ruleSet.addRuleByStr(selector, attr, collector)
                break;
            }
        } else {
            collector = collector + char
        }
    }
    return errors
};

exports.CSSParser = CSSParser;

// if (!module.parent) {
//     text = '/*fdsafdas*/.publisher-c .global-publisher-selector{ top:5px;}\
//  .publisher-a .global-publisher-selector-status a,\
//  .publisher-a .global-publisher-selector-status .global-publisher-status-trigger:hover,\
//  .publisher-a .global-publisher-selector .active .global-publisher-status-trigger {\
//     background-position: 0 1px;\
// }\
//  .publisher-a .global-publisher-selector-share a,\
//  .publisher-a .global-publisher-selector-share a:hover,\
//  .publisher-a .global-publisher-selector .active .global-publisher-share-trigger{\
//     background-position: 0 -48px;\
//  }'
//     var parser = new CSSParser(text)
//     parser.doParse();
//     console.log(parser.styleSheet.getRuleSets()[0]);
// }

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCanNotSetFontFamily', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper')

module.exports = global.FEDCanNotSetFontFamily = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-font-family'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'can not set font-family for "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name == 'font-family')
            return false

        if (rule.name == 'font') {
            // many fonts
            if (rule.value.indexOf(',') != -1)
                return false

            // one font
            var splited = rule.value.split(' ')
            if (helper.isFontFamilyName(splited[splited.length - 1])) {
                return false
            }
        }

        return true
    }

    this.__doc__ = {
        "summary":"不允许业务代码设置字体",
        "desc":"由于业务代码中随意设置字体，导致字体取值混乱，因此不允许随意在业务代码中设置字体"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCombineInToOne', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')
var combiner = require('./combiners/CombinerFactory')

module.exports = global.FEDCombineInToOne = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'combine-into-one'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_rough = 'should combine "%s" to "%s" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var counter = self._countCanBeCombined(rules)
        for(var name in counter) {
            var value = counter[name];
            if (name == 'font' && helper.len(value) > 2 || name != 'font' && helper.len(value) > 1) {
                self.errorMsg = self.errorMsg_rough.replace('%s', value.join(',')).replace('%s', name)
                return false
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var counter = self._countCanBeCombined(rules, true)
        var rules = self._combineAttrs(rules, counter)
        ruleSet.setRules(rules)
    }

    this._countCanBeCombined = function(self, rules, forFix) {
        var counter = {}
        rules.forEach(function(rule) {
            var name = rule.name
            if (rule.name != rule.strippedName)
                return
            // do not do any hack combine
            if (helper.containsHack(rule))
                return
            // -moz-border-radius, -o-border-radius is not for me
            if (helper.isCss3PrefixProp(name))
                return

            var bigger = helper.canBeCombined(name)
            if (bigger) {
                if (bigger in counter) {
                    if (forFix) {
                        counter[bigger].push([name, rule.fixedName, rule.fixedValue])
                    } else {
                        counter[bigger].push(name)
                    }
                } else {
                    if (forFix) {
                        counter[bigger] = [[name, rule.fixedName, rule.fixedValue]]
                    } else {
                        counter[bigger] = [name]
                    }
                }
            }
        })
        return counter
    }

    this._combineAttrs = function(self, rules, counter) {
        var originRules = rules
        for(var name in counter) {
            var value = counter[name]
            var tmp = combiner.doCombine(name, value)
            var combined = tmp[0]
            var deleted = tmp[1]
            var hasFather = tmp[2]
            if (!combined)
                continue

            var newRules = []
            originRules.forEach(function(rule) {
                if (helper.containsHack(rule)) {
                    newRules.push(rule)
                    return
                }
                // it is what i want
                if (rule.fixedName == name) {
                    rule.fixedValue = combined
                    newRules.push(rule)
                    return
                }
                // it is what i want to delete
                if (deleted.indexOf(rule.fixedName) != -1) {
                    if (!hasFather) {
                        rule.reset(name, combined)
                        newRules.push(rule)
                        hasFather = true
                    }
                    return
                }
                newRules.push(rule)
            })
            originRules = newRules
        }
        return originRules
    }

    this.__doc__ = {
        "summary":"将多个子样式合并",
        "desc":"有的子样式可以合并为总样式，包括\
            <code>margin</code> <code>padding</code> <code>font</code> <code>background</code> <code>border</code>\
            等，合并以后可以获得更好的执行效率和压缩效果，<br/>\
            例如：<br/>\
            <code>.test {margin:4px; margin-right:0;}</code><br/>\
            <code>==></code><br/>\
            <code>.test{margin:4px 0 4px 4px}</code><br/>\
        "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCombineSameRuleSets', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var StyleSheetChecker = base.StyleSheetChecker
var helper = require('./helper')

var BinaryRule = require('../browsers/BinaryRule')
var ALL = BinaryRule.ALL
var STD = BinaryRule.STD

var doRuleSetDetect = require('../browsers/Hacks').doRuleSetDetect
module.exports = global.FEDCombineSameRuleSets = new Class(StyleSheetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'combine-same-rulesets'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_empty = '"%s" contains the same rules in "${file}"'
        self.errorMsg = ''
    }

    // can be checked correctly only after reorder/fix/compress, so do not check
    this.check = function(self, styleSheet, config) {
        var ruleSets = styleSheet.getRuleSets()
        var mapping = self._gen_hash(ruleSets, ALL)
        var length = helper.len(mapping)

        var errors = {}
        for(var i = 0; i < length; i++) {
            for(var j = i + 1; j < length; j++) {
                if (mapping[i][1] == mapping[j][1]) {
                    var cssText = mapping[i][1]
                    if (!(cssText in errors)) {
                        errors[cssText] = []
                        errors[cssText].push(mapping[i][0])
                        errors[cssText].push(mapping[j][0])
                    } else if (errors[cssText].indexOf(mapping[j][0]) == -1) {
                        errors[cssText].push(mapping[j][0])
                    }
                    //errors.append(self.errorMsg_empty % (mapping[i][0], mapping[j][0]))
                }
            }
        }
        if (helper.len(Object.keys(errors)) == 0)
            return true
        var msgs = [];
        for(var prop in errors) {
            var x = errors[prop];
            msgs.push(self.errorMsg_empty.replace('%s', x.join(', ')))
        }
        return msgs 
    }

    this.fix = function(self, styleSheet, config) {
        var browser = config._inner.curBrowser ? config._inner.curBrowser : ALL
        var ruleSets = styleSheet.getRuleSets()
        var mapping = self._gen_hash(ruleSets, browser)

        var length = helper.len(mapping)

        var splitedSelectors = []
        for (var i = 0; i < length; i++) {
            var splited = mapping[i][0].split(',');
            splited.forEach(function(x) {
                x = x.trim();
                if (x != '') {
                    splitedSelectors.push(x);
                }
            })
        }

        for (var i = 0; i < length; i++) {          
            if (mapping[i][0] == 'extra')
                continue
            var selectorHistory = []

            for (var j = i + 1; j < length; j++) {
                if (mapping[i][1] != mapping[j][1]) {
                    selectorHistory = selectorHistory.concat(splitedSelectors[j])
                    continue
                }

                // 合并则遵循如下策略：
                // 1、两者必须都与当前要求的浏览器兼容，即 browserI & browser != 0 and browserJ & browser != 0
                // 2、两者的浏览器兼容性必须完全一致，即 browserI ^ browserJ == 0
                // 第二点主要是因为有的属性合并以后，由于兼容性不同，受不兼容的selector影响，使本应该兼容的selector失效。
                var browserI = doRuleSetDetect(mapping[i][0])
                var browserJ = doRuleSetDetect(mapping[j][0])
                // mapping.debug && console.log(mapping[i][0], mapping[j][0], browserI, browserJ)
                if (!((browserI & browser) != 0 && (browserJ & browser) != 0 && (browserI ^ browserJ) == 0))
                    continue

                // bakcground-position is dangerous, position设置必须在background-image之后
                if (mapping[j][1].indexOf('background-position') != -1) {
                    selectorHistory = selectorHistory.concat(splitedSelectors[j])
                    continue
                }

                var hasFlag = false
                // ".a {width:0} .a, .b{width:1}, .b{width:0}" 不应该被合并成 ".a, .b{width:0} .a, .b{width:1}"
                // 但是目前还有一个最严重的问题：
                // .c {width:1}, .d{width:0}, .b{width:1}, .a{width:0}
                // class="a c" => width 0
                // class="b d" => width 1
                // 一旦合并成 .b,.c{width:1} .d,.a{width:0} （不论往前合并还是往后合并，都是这个结果，囧）
                // class="a c" => width 0
                // class="b d" => width 0(本来为1)
                // 这是无法解决的问题，因为我不能在没有分析DOM的情况下，确定两个selector指向同一个dom
                // 为此，安全模式 --safe 诞生。
                for(var k = 0; k < splitedSelectors[j].length; k++) {
                    var x = splitedSelectors[j][k];
                    if (selectorHistory.indexOf(x) != -1) {
                        hasFlag = true;
                        break;
                    }
                }
                if (hasFlag) {
                    selectorHistory = selectorHistory.concat(splitedSelectors[j])
                    continue
                }

                // make it different
                mapping[j][1] = helper.str(i) + helper.str(j)
                mapping[j][0] = 'extra'

                // extend target selector
                var target = styleSheet.getRuleSets()[i]
                var src = styleSheet.getRuleSets()[j]
                target.extendSelector(src)

                // remove rule set
                styleSheet.removeRuleSetByIndex(j)
                selectorHistory = selectorHistory.concat(splitedSelectors[j])
            }
        }
        // remember to clean after remove ruleset
        styleSheet.clean()
    }

    this._gen_hash = function(self, ruleSets, browser) {
        var mapping = []
        var counter = 0
        //var flag = false;
        ruleSets.forEach(function(r) {
            if (r.extra) {// or doRuleSetDetect(r.selector) != STD:
                // make it impossible to equal
                mapping.push(['extra', "do_not_combine_" + helper.str(counter)])
                counter = counter + 1
                return
            }
            //flag = r.compressRules(browser).indexOf('width:300px;-moz-transform:1s') != -1;
            mapping.push([r.selector, r.compressRules(browser)])
        });
        // if (flag) {
        //     console.log(mapping)
        // }
        // mapping.debug = flag;
        return mapping
    }

    this.__doc__ = {
        "summary":"合并两个完全相同的规则集",
        "desc":"如果两个规则集完全一样，则可以进行合并。<br>\
            需要指出的是：合并可能会带来功能上的问题。如果有问题，还请告知 wangjeaf@gmail.com~<br>\
            例如：<br>\
            <code>.a {width:100px}</code><br>\
            <code>.b {width:100px}</code><br>\
            <code>==></code><br>\
            <code>.a, .b {width:100px}</code><br>\
            <br>\
            <strong>安全模式下将不执行此规则</strong><br>\
        "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCommentLengthLessThan80', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')

module.exports = global.FEDCommentLengthLessThan80 = new Class(RuleSetChecker, function () {
    this.__init__ = function (self) {
        self.id = 'comment-length';
        self.errorLevel = ERROR_LEVEL.LOG;
        self.errorMsg = 'comment for "${selector}" length should less than 80 per line';
    }

    this.check = function (self, ruleSet, config) {
        var comment = ruleSet.roughComment;
        if (comment.length == 0) {
            return true
        }

        var splittedComment = comment.split('\n');
        for (var i = 0, l = splittedComment.length; i < l; i++) {
            if (helper.countStrLen(splittedComment[i].trim()) > 80) {
                return false
            }
        }
        return true
    }

    this.__doc__ = {
        "summary" : "注释不能超过80个字符",
        "desc" : "注释长度不能超过80个字符，40个汉字，如果超出，则应该要换行~"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCss3PropPrefix', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDCss3PropPrefix = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'css3-with-prefix'
        self.errorLevel_keepInOrder = ERROR_LEVEL.WARNING
        self.errorLevel_missing = ERROR_LEVEL.ERROR
        self.errorLevel = ERROR_LEVEL.LOG

        self.errorMsg_keepInOrder = 'css3 prop "${name}" should keep in "-webkit-,-moz-,-ms-,-o-,std" order in "${selector}"'
        self.errorMsg_missing = 'css3 prop "${name}" missing some of "-webkit-,-moz-,-o-,std" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return true

        if (!helper.isCss3PrefixProp(name))
            return true

        if (helper.doNotNeedPrefixNow(name))
            return true
        
        var ruleSet = rule.getRuleSet()
        var webkitName = '-webkit-' + name
        var mozName = '-moz-' + name
        var msName = '-ms-' + name // not necessary
        var oName = '-o-' + name

        if (!(ruleSet.existRoughNames(webkitName) 
                && ruleSet.existRoughNames(mozName)
                && ruleSet.existRoughNames(oName)
                && ruleSet.existRoughNames(name))) {
            self.errorMsg = self.errorMsg_missing
            self.errorLevel = self.errorLevel_missing
            return false
        }

        // in order -webkit-  -moz-  -ms-  -o-  std
        var webkit = ruleSet.indexOf(webkitName)
        var moz = ruleSet.indexOf(mozName)
        var ms = ruleSet.indexOf(msName)
        if (ms == -1)
            ms = moz
        var o = ruleSet.indexOf(oName)
        var std = ruleSet.indexOf(name)

        if (!(webkit < moz && moz <= ms && ms < o && o < std)) {
            self.errorMsg = self.errorMsg_keepInOrder
            self.errorLevel = self.errorLevel_keepInOrder
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary":"CSS3前缀相关检查",
        "desc":"CSS3属性的前缀，有的可以省略，比如：<br>\
            <code>border-radius</code><br>\
            有的是省略，必须写全，比如：<br><code>transition</code> <code>transform</code>等<br>\
            在编写顺序上，本工具要求按照<br>\
            <code>-webkit-,-moz-,-ms-,-o-,std</code><br>的顺序来编写，并且严格将属性的第一个字符对齐。"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDCss3PropSpaces', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDCss3PropSpaces = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'css3-prop-spaces'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_multi = 'css3 prop "${name}" should align to right in "${selector}"'
        self.errorMsg_single = 'should have 1(only) space before css3 prop "${name}" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return true

        if (!helper.isCss3PrefixProp(name))
            return true
        
        if (helper.doNotNeedPrefixNow(name)) {
            // if exists prefix, then should keep spaces
            if (!rule.getRuleSet().existRoughNames('-webkit-' + name + 
                ',-moz-' + name + 
                ',-ms-' + name + 
                ',-o-' + name)) {
                return true
            }
        }

        var roughName = rule.roughName

        if (!rule.getRuleSet().singleLineFlag) {
            // 12 = 4 + 8, 4 spaces, 8 for align
            if (helper.len(roughName.split(name)[0]) != 12) {
                self.errorMsg = self.errorMsg_multi
                return false
            }
        } else {
            if (helper.startswith(roughName, '  ') || !helper.startswith(roughName, ' ')) {
                self.errorMsg = self.errorMsg_single
                return false
            }
        }
        return true
    }

    this.fix = function(self, rule, config) {
        this._handleName(rule, config);
        this._handleValue(rule, config);
    }

    this._handleValue = function(self, rule, config) {
        var value = rule.fixedValue
        var fixedValue
        var reg = /\s*-(webkit|moz|ms|khtml|o)-/
        if (value.indexOf('-') == 0) {
            var matched = value.match(reg);
            if (!matched) {
                return
            }
            var prefix = matched[0]
            rule.fixedPrefix = helper.times(' ', 8 - helper.len(prefix))
        } else {
            var valueName = value.split('(')[0];
            if (!valueName) {
                return
            }
            valueName = valueName.replace(reg, '')
            if (!rule.getRuleSet().existValueStarts('-webkit-' + valueName + 
                ',-moz-' + valueName + 
                ',-ms-' + valueName + 
                ',-o-' + valueName)) {
                return
            }
            rule.fixedPrefix = helper.times(' ', 8)
        }
    }

    this._handleName = function(self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return

        if (!helper.isCss3PrefixProp(name))
            return

        if (!rule.getRuleSet().existRoughNames('-webkit-' + name + 
                ',-moz-' + name + 
                ',-ms-' + name + 
                ',-o-' + name)) {
            return
        }

        var fixedName = rule.fixedName
        var prefix = fixedName.split(name)[0]
        if (rule.selector.indexOf('%') != -1) {
            var remained = '-webkit-,-moz-,-ms-,-o-,'.replace(prefix + ',', '')
            var splited = remained.slice(0, -1).split(',')
            var collector = []
            splited.forEach(function(x) {
                collector.push(x + name);
            })
            var testString = collector.join(',')
            if (!rule.getRuleSet().existRoughNames(testString)) {
                return
            }
        }

        rule.fixedName = (config.singleLine ? '' : helper.times(' ', 8 - helper.len(prefix))) + fixedName
    }

    this.__doc__ = {
        "summary":"CSS3缩进相关检查",
        "desc":"CSS3属性的缩进，必须将属性名称的第一个字符对齐。即：<br>\
            <code>-webkit-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;-moz-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;-ms-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-o-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;transition:3s;</code>\
        "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDDistinguishBrowserExtra', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var ExtraChecker = base.ExtraChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserExtra = new Class(ExtraChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'extra-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        return true
    }

    this.fix = function(self, ruleSet, config) {
        if (!ruleSet.nested)
            return
        Browser.handleNestedStatement(ruleSet)
    }

    this.__doc__ = {
        "summary":"嵌套规则区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS规则集"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDDistinguishBrowserRule', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserRule = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'rule-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        return true
    }

    this.fix = function(self, rule, config) {
        Browser.handleRule(rule)
    }

    this.__doc__ = {
        "summary":"在属性级别区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDDistinguishBrowserRuleSet', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserRuleSet = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'ruleset-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        return true
    }

    this.fix = function(self, ruleSet, config) {
        Browser.handleRuleSet(ruleSet)
    }

    this.__doc__ = {
        "summary":"在规则集级别区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS规则集"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDDoNotSetStyleForSimpleSelector', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForSimpleSelector = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'no-style-for-simple-selector';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg_rough = 'should not set style for "%s" in "${selector}"';
        self.errorMsg = '';
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase();
        if (selector.indexOf('@media') != -1)
            return true;

        if (selector.indexOf('@-moz-document') != -1)
            return true;

        var selectors = selector.split(',');
        for (var i = 0, l = selectors.length; i < l; i++) {
            var s = selectors[i].trim();
            if (helper.isSimpleSelector(s)) {
                self.errorMsg = self.errorMsg_rough.replace('%s', s);
                return false
            }
        }

        return true
    }

    this.__doc__ = {
        "summary" : "不要为简单选择器设置样式",
        "desc" : "一些简单的选择器，比如：<br> <code>.nav/.list/.content</code><br>非常容易造成属性的相互覆盖，因此在写这样的选择器时，最好加上前缀，比如<br><code>.module-name .nav</code><br><br>工具现有的简单选择器判断，请参考：<br><code>plugins/helper.js</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDDoNotSetStyleForTagOnly', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForTagOnly = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'no-style-for-tag';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg = 'should not set style for html tag in "${selector}"';
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase();
        if (selector.indexOf('@media') != -1)
            return true;

        if (selector.indexOf('@-moz-document') != -1)
            return true;

        var selectors = selector.split(',');
        for (var i = 0, l = selectors.length; i < l; i++) {
            var s = selectors[i].trim();
            if (helper.isHTMLTag(s)) 
                return false
        }

        return true
    }

    this.__doc__ = {
        "summary":"不要为html tag设置样式",
        "desc":"除了重置 CSS(如Reset.css) 的相关设置，其他代码一律不允许为html tag设置样式。"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDFixCommentInValue', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper')

module.exports = global.FEDFixCommentInValue = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'fix-comment-in-value'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = ''
        self._private = true
    }

    this.check = function(self, rule, config) {
        return true
    }   
    
    this.fix = function(self, rule, config) {
        if (rule.name == 'expression')
            return
        
        var value = rule.fixedValue
        if (value.indexOf('/*') == -1)
            return

        var splited = value.split('/*')
        var collector = []
        for(var i = 0; i < splited.length; i++) {
            var x = splited[i];
            tmp = x.split('*/')
            if (helper.len(tmp) == 1) {
                collector.push(tmp[0])
            } else {
                collector.push(tmp[1])
            }
        }
        rule.fixedValue = collector.join('')
    }

    this.__doc__ = {
        "summary":"修复属性中的注释",
        "desc":"width:/* fdasfdas */ 100px /* fdafdas */; ==> width:100px;"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDFixNestedStatement', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var ExtraChecker = base.ExtraChecker
var helper = require('./helper');

module.exports = global.FEDFixNestedStatement = new Class(ExtraChecker, function() {

    this.__init__ = function(self) {
        self.id = 'fix-nested-ruleset'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
        self._private = true
    }

    this.check = function(self, ruleSet, config) {
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        if (!ruleSet.nested)
            return

        ruleSet.fixedSelector = ruleSet.fixedSelector.replace(/"/g, '\'')
        
        var modulePath = '../doCssFix';
        if (config.operation == 'compress') {
            modulePath = '../doCssCompress'
        }
        
        var statement = ruleSet.fixedStatement

        if (config['operation'] == 'compress') {
            var prepare = require(modulePath).prepare
            var checker = prepare(statement, '', config)
            // 嵌套的CSS，如果是压缩，也需要精简
            var msg = checker.doCompress(config._inner.curBrowser)
            ruleSet.fixedStatement = msg
        } else {
            var doFix = require(modulePath).doFix
            var msg = doFix(statement, '', config)[1]
            ruleSet.fixedStatement = msg
        }
    }

    this.__doc__ = {
        "summary":"修复嵌套的CSS",
        "desc":"@keyframes, @media之类的"
    }
});

})
// auto generated by concat 
;define('ckstyle/plugins/FEDFixOutlineZero', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker

module.exports = global.FEDFixOutlineZero = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'fix-outline-none'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'fix outline:none for "${selector}"'
    }

    this.check = function(self, rule, config) {
         if (rule.name == 'outline') {
            if (self._findOutlineNone(rule.value)){
                return false
            }
        }
        return true
    }
    
    this.fix = function(self, rule, config) {
        if (rule.name == 'outline') {
            if (self._findOutlineNone(rule.value)){
                 rule.fixedValue = rule.fixedValue.replace(/none/, "0");
            }
        }
    }

    this._findOutlineNone = function(self, value) {
        return value.indexOf('none') !== -1
    }

    this.__doc__ = {
        "summary":"修复outline:none",
        "desc":"<code>outline:none</code> 和 <code>outline:0</code> 实现了相同的功能，但是后者的代码更简洁，便于压缩。"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDFontSizeShouldBePtOrPx', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDFontSizeShouldBePtOrPx = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'font-unit'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_ptOrPx = 'font-size unit should be px/pt in "${selector}"'
        self.errorMsg_xsmall = 'font-size should not be small/medium/large in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        if (rule.name != 'font-size')
            return true

        var value = rule.value
        if (value.indexOf('small') != -1 || 
            value.indexOf('medium') != -1 || 
            value.indexOf('large') != -1) {
            self.errorMsg = self.errorMsg_xsmall
            return false
        }

        if (value == '0')
            return true

        if (helper.endswith(value, 'pt'))
            return true

        if (helper.endswith(value, 'px'))
            return true

        self.errorMsg = self.errorMsg_ptOrPx
        return false
    }

    this.__doc__ = {
        "summary":"字体的单位必须用px或pt",
        "desc":"字体的单位可以有很多种，比如 <code>px pt em %</code> 等等，为了统一取值，统一要求为 <code>px/pt</code> ， 例如：<br>\
            <code>font-size: 12px;</code><br>\
            <code>font-size: 14pt;</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDHackAttributeInCorrectWay', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDHackAttributeInCorrectWay = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'hack-prop'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = '"${name}" is not in correct hacking way in "${selector}"'
    }

    this.check = function (self, rule, config) {
        if (rule.value.indexOf('\\0') != -1)
            return false

        var stripped = rule.roughName.trim()
        if (rule.name == stripped.toLowerCase())
            return true

        if (helper.isCss3PrefixProp(rule.name))
            return true

        if (!helper.startswith(stripped, '_') && 
            !helper.startswith(stripped, '*') && 
            !helper.startswith(stripped, '+'))
            return false

        return true
    }

    this.__doc__ = {
        "summary" : "hack属性时的检查",
        "desc" : "必须使用正确的 hack 方式， 比如 <code>_ * +</code> 等，其他的属性前缀一律不允许"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDHackRuleSetInCorrectWay', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var ExtraChecker = base.ExtraChecker
var helper = require('./helper');

module.exports = global.FEDHackRuleSetInCorrectWay = new Class(ExtraChecker, function() {

    this.__init__ = function(self) {
        self.id = 'hack-ruleset'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'not correct hacking way in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        if (!ruleSet.nested)
            return true

        var selector = ruleSet.selector.trim()
        if (selector.indexOf('@-moz-document') != -1) {
            if (selector.replace(/\s\s+/g, ' ') != '@-moz-document url-prefix()') {
                return false
            }
        }

        if (selector.indexOf('-webkit-min-device-pixel-ratio:0') != -1) {
            if (selector != '@media screen and (-webkit-min-device-pixel-ratio:0)' && 
                selector.indexOf('-webkit-min-device-pixel-ratio:10000') == -1) {
                return false
            }
        }

        if (selector.indexOf('-webkit-min-device-pixel-ratio:10000') != -1) {
            if (selector.indexOf('@media all') == -1 || 
                selector.indexOf('not all and') == -1 || 
                selector.indexOf('-webkit-min-device-pixel-ratio:0') == -1) {
                return false
            }
        }

        return true 
    }

    this.__doc__ = {
        "summary":"hack规则时的检查",
        "desc":"针对Firefox Opera Safari等浏览器的 hack 方式， <strong>人人FED CSS编码规范</strong>中有详细的描述， \
            不允许使用规定之外的方式进行规则级别的hack"
    }
});

})
// auto generated by concat 
;define('ckstyle/plugins/FEDHexColorShouldUpper', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

var pattern_color = /#([a-f0-9A-F]+)/g

module.exports = global.FEDHexColorShouldUpper = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'hexadecimal-color'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_length = 'wrong color length(should be 3 or 6) in "${selector}"'
        self.errorMsg_replace = 'replace "#%s" with "#%s" in "${selector}"'
        self.errorMsg_upper = 'color should in upper case in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var value = rule.value
        if (value.indexOf('#') == -1)
            return true

        var found = self._findColor(rule.value)
        for(var i = 0; i < found.length; i++) {
            var f = found[i];
            var flag = self._checkEach(f)
            if (!flag)
                return false
        }
        return true
    }

    this.fix = function(self, rule, config) {
        var value = rule.fixedValue
        if (value.indexOf('#') == -1) 
            return

        var hasImportant = rule.fixedValue.indexOf('important') != -1
        var found = self._findColor(rule.fixedValue)
        for(var i = 0; i < found.length; i++) {
            var f = found[i]
            f = f.trim()
            self._fixEach(rule, f, hasImportant)
        }
    }

    this._checkEach = function(self, found) {
        if (!found)
            return true

        if (self._isLower(found)) {
            self.errorMsg = self.errorMsg_upper
            return false
        }

        if (helper.len(found) == 3)
            return true

        if (self._wrongLength(found)) {
            self.errorMsg = self.errorMsg_length
            return false
        }

        if (self._isDuplicate(found)) {
            self.errorMsg = self.errorMsg_replace.replace('%s', found).replace('%s', found[0]+found[2]+found[4])
            return false
        }
        
        return true
    }

    this._fixEach = function(self, rule, found, hasImportant) {
        if (self._isLower(found)) {
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + found.toUpperCase())
            found = found.toUpperCase()
        }

        if (helper.len(found) == 3)
            return

        if (!hasImportant && self._wrongLength(found)) {
            var finalColor = helper.len(found) > 6 ? found.slice(0, 6) : (found + helper.times('F', 6 - helper.len(found)))
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + finalColor)
            found = finalColor
        }
        if (self._isDuplicate(found)) {
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + found[0] + found[2] + found[4])
        }
    }

    this._wrongLength = function(self, found) {
        return helper.len(found) != 3 && helper.len(found) != 6
    }

    this._isLower = function(self, found) {
        return found && found != found.toUpperCase()
    }

    this._isDuplicate = function(self, found) {
        return found[0] == found[1] && found[2] == found[3] && found[4] == found[5]
    }

    this._findColor = function(self, value) {
        var splited = value.split(' ')
        var found = []
        for(var i = 0; i < splited.length; i++) {
            var x = splited[i];
            x = x.trim()
            matcher = x.match(pattern_color)
            if (matcher) {
                found = found.concat(matcher)
            }
            //if x.startswith('#'):
            //    found.append(x.split('!important')[0][1:].split(',')[0].split(')')[0])
            //elif x.find('(#') != -1:
            //    found.append(x.split('(#')[1].split('!important')[0].split(',')[0].split(')')[0])
        }
        for(var i = 0; i < found.length; i++) {
            found[i] = found[i].replace('#', '')
        }
        return found
    }

    this.__doc__ = {
        "summary":"16进制颜色大写&缩写",
        "desc":"<p>浏览器会先将小写的颜色值转换成大写，所以写成大写格式可以省略这部分的开销，并且尽量省略，例如：\
            </br><code>color:#ffffff; </code><br/><code>==></code><br/><code>color:#FFF;</code></p>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDHighPerformanceSelector', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDHighPerformanceSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'high-perf-selector'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_shorter = 'please shorter the selector "${selector}"'
        self.errorMsg_no1 = 'do not use low performance selector ">" in "${selector}"'
        self.errorMsg_lessTag = 'use less tag in "${selector}"'
        self.errorMsg_id = 'should not put "HTMLtag" and "#id" together in "${selector}"'
        self.errorMsg_class = 'should not put "HTMLtag" and ".class" together in "${selector}"'
        self.errorMsg_reg = 'should not use ~=,^=,|=,$=,*= in selector of "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selectors = ruleSet.selector.replace(/\s\s/g, '').split(',')
        for(var i = 0; i < selectors.length; i++) {
            var s = selectors[i];
            if (s.indexOf('@media') != -1)
                continue

            if (s.indexOf('=') != -1) {
                if (s.indexOf('~=') != -1 || 
                    s.indexOf('^=') != -1 || 
                    s.indexOf('|=') != -1 || 
                    s.indexOf('$=') != -1 || 
                    s.indexOf('*=') != -1) {
                    self.errorMsg = self.errorMsg_reg
                    return false
                }
            }

            var splited = s.split(' ')
            if (helper.len(splited) > 5) {
                self.errorMsg = self.errorMsg_shorter
                return false
            }
            var counter = 0
            for(var j = 0; j < splited.length; j++) {
                var p = splited[j];
                if (p == '>') {
                    self.errorMsg = self.errorMsg_no1
                    return false
                }

                var innerSplit = p.split('#')
                if (helper.len(innerSplit) == 2 && helper.isHTMLTag(innerSplit[0])) {
                    self.errorMsg = self.errorMsg_id
                    return false
                }

                var innerSplit = p.split('.')
                if (helper.len(innerSplit) == 2 && helper.isHTMLTag(innerSplit[0])) {
                    self.errorMsg = self.errorMsg_class
                    return false
                }

                if (helper.isHTMLTag(p)) 
                    counter = counter + 1
            }
            if (counter > 1) {
                self.errorMsg = self.errorMsg_lessTag
                return false
            }
        }

        var noSpace = ruleSet.selector.replace(/\s/g, '')
        if (noSpace.indexOf('ulli') != -1 || 
            noSpace.indexOf('olli') != -1 || 
            noSpace.indexOf('dldt') != -1 || 
            noSpace.indexOf('dldd') != -1) {
            self.errorMsg = self.errorMsg_lessTag
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary":"针对低性能的选择器的检查",
        "desc":"低性能选择器，害人害己还集体，本工具收集了一些低性能选择器的情形，具体请参见：<br>\
            <code>FEDHighPerformanceSelector.py</code>中的相关内容"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDMultiLineBraces', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDMultiLineBraces = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-brace'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_shouldEnterAfterOpenningBrace = 'should "enter" after the opening brace in "${selector}"'
        self.errorMsg_shouldEnterBeforeClosingBrace = 'should "enter" before the closing brace in "${selector}"'
        self.errorMsg_extraSpaceAfterOpeningBrace = 'extra "space" after the opening brace in "${selector}"'
        self.errorMsg_everyAttrShouldInSingleLine = 'every name/value should in single line in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var singleLine = ruleSet.getSingleLineFlag()
        if (singleLine)
            return true

        var value = ruleSet.roughValue
        var splited = value.split('\n')
        if (splited[0].trim() != '') {
            self.errorMsg = self.errorMsg_shouldEnterAfterOpenningBrace
            return false
        }

        if (splited[0].trim() == '' && helper.startswith(splited[0], ' ')) {
            self.errorMsg = self.errorMsg_extraSpaceAfterOpeningBrace
            return false
        }

        var ruleLength = helper.len(ruleSet.getRules())
        if (ruleLength != 0 && helper.len(value.trim().split('\n')) != ruleLength) {
            self.errorMsg = self.errorMsg_everyAttrShouldInSingleLine
            return false
        }

        if (!helper.endswith(value.replace(' ', ''), '\n')) {
            self.errorMsg = self.errorMsg_shouldEnterBeforeClosingBrace
            return false
        }

        return true 

    }

    this.__doc__ = {
        "summary":"多行CSS风格的括号检查",
        "desc":"用于检查多行风格下的 <code>{</code> 和 <code>}</code> 的编写风格，前后空格符和回车符的情况等。"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDMultiLineSelectors', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDMultiLineSelectors = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-selector'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" before semicolon in "${selector}"'
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" after semicolon in "${selector}"'
        self.errorMsg_shouldEnter = 'should enter in multi-selector, in "${selector}"'
        self.errorMsg_tooManyEnters = 'too many "enter"s in "${selector}"'
        self.errorMsg_startsWithSpace = 'selector should not start with "space" in "${selector}"'
        self.errorMsg_extraSpaceAfterComma = 'extra "space" after comma in "${selector}"'
        self.errorMsg_extraSpaceBeforeComma = 'extra "space" before comma in "${selector}"'
        self.errorMsg_commaInTheEnd = 'comma should at the end of selector in "${selector}"'
        self.errorMsg_shouldAddSpaceForLast = 'should add "space" for last selector of "${selector}"'
        self.errorMsg_shouldNotEnterAtTheEnd = 'should not "enter" at the end of "${selector}"'
        self.errorMsg_selectorEndsWithSpace = 'selector should end with only one space "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.roughSelector

        if (!helper.endswith(selector, ' ') || helper.endswith(selector, '  ')) {
            self.errorMsg = self.errorMsg_selectorEndsWithSpace
            return false
        }

        if (selector.indexOf(',') == -1)
            return true

        if (helper.endswith(selector.replace(/\s+/g, ''), '\n')) {
            self.errorMsg = self.errorMsg_shouldNotEnterAtTheEnd
            return false
        }

        if (selector.trim().indexOf('\n') == -1) {
            self.errorMsg = self.errorMsg_shouldEnter
            return false
        }

        var selectors = selector.split('\n')
        var length = helper.len(selectors)

        if (helper.len(selector.split(',')) != helper.len(selector.trim().split('\n'))) {
            self.errorMsg = self.errorMsg_tooManyEnters
            return false
        }

        var realSelectors = []
        selectors.forEach(function(s) {
            if (s.trim() != '')
                realSelectors.push(s)
        })

        var counter = 0
        var length = helper.len(realSelectors)
        for(var i = 0; i < realSelectors.length; i++) {
            var current = realSelectors[i];
            counter = counter + 1
            var stripped = current.trim()
            if (stripped == '')
                continue
            if (helper.startswith(current, ' ')) {
                self.errorMsg = self.errorMsg_startsWithSpace
                return false
            }
            if (helper.endswith(stripped, ' ,')) {
                self.errorMsg = self.errorMsg_extraSpaceBeforeComma
                return false
            }
            if (helper.endswith(current, ' ') && helper.endswith(stripped, ',')) {
                self.errorMsg = self.errorMsg_extraSpaceAfterComma
                return false
            }
            if (counter == length && !helper.endswith(current, ' ')) {
                self.errorMsg = self.errorMsg_shouldAddSpaceForLast
                return false
            }
            if (counter != length && stripped.indexOf(',') == -1) {
                self.errorMsg = self.errorMsg_commaInTheEnd
                return false
            }
        }
        return true 
    }

    this.__doc__ = {
        "summary":"多行CSS风格的选择器检查",
        "desc":"多行风格下，每一个选择器单独占一行，并以逗号结尾，例如：<br>\
            <code>.a,</code><br>\
            <code>.b,</code><br>\
            <code>.c {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code>\
        "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDMultiLineSpaces', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper')

module.exports = global.FEDMultiLineSpaces = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-space'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_name_pre = 'should have 4 spaces before "${name}" in "${selector}"'
        self.errorMsg_name_after = 'should not have "space" after "${name}" in "${selector}"'
        self.errorMsg_value_pre = 'should have (only) one "space" before value of "${name}" in "${selector}"'
        self.errorMsg = ''
    }
    
    this.check = function(self, rule, config) {
        var singleLine = rule.getRuleSet().getSingleLineFlag()
        if (singleLine)
            return true
        
        var prefix = '    '
        var name = rule.roughName
        var value = rule.roughValue
        var stripped = rule.roughName.trim()

        // leave special css3 props for FEDCss3AttrChecker
        if (helper.isCss3PrefixProp(rule.name)) {
            if (name.slice(-1) == ' ') {
                self.errorMsg = self.errorMsg_name_after
                return false
            }

            if (!(value.indexOf(' ') == 0) || value.indexOf('  ') == 0) {
                self.errorMsg = self.errorMsg_value_pre
                return false
            }

            return true
        }

        if (name.indexOf('\t') != -1)
            name = name.replace(/\t/g, prefix)

        if (!(name.indexOf(prefix) == 0)) {
            self.errorMsg = self.errorMsg_name_pre
            return false
        }
        if (name.indexOf('     ') == 0) {
            self.errorMsg = self.errorMsg_name_pre
            return false
        }
        if (name.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_name_after
            return false
        }

        if (!(value.indexOf(' ') == 0) || value.indexOf('  ') == 0) {
            self.errorMsg = self.errorMsg_value_pre
            return false
        }

        return true 
    }

    this.__doc__ = {
        "summary":"CSS多行风格的空格检查",
        "desc":"多行风格下，CSS的空格检查包括：\
            <ol>\
                <li>选择器的空格</li>\
                <li>属性的空格</li>\
                <li>结尾}的空格</li>\
            </ol>\
            具体请参见人人相关的CSS规范"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDMustContainAuthorInfo', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var StyleSheetChecker = base.StyleSheetChecker

module.exports = global.FEDMustContainAuthorInfo = new Class(StyleSheetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'add-author'
        self.errorMsg_author = 'should add @author in the head of "${file}"'
        self.errorMsg_empty = 'empty css file "${file}"'
        self.errorMsg = ''
        self.errorLevel = ERROR_LEVEL.ERROR
    }

    this.check = function(self, styleSheet, config) {
        ruleSets = styleSheet.getRuleSets()
        if (ruleSets.length == 0) {
            self.errorMsg = self.errorMsg_empty
            return false
        }

        first = ruleSets[0]

        if (styleSheet.getFile() != '' 
            && first.comment.indexOf('@author') == -1 
            && first.comment.indexOf('@alibaba') == -1 
            && first.comment.indexOf('@taobao') == -1 
            && first.comment.indexOf('@renren-inc.com') == -1) {
            self.errorMsg = self.errorMsg_author
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"需要在文件中添加作者信息",
        "desc":"需要在文件中添加作者的信息，本工具认可的作者信息是在文件顶部的注释中添加 <code>@author:xxx</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoAlphaImageLoader', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;

module.exports = global.FEDNoAlphaImageLoader = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-alpha-image-loader';
        self.errorLevel = ERROR_LEVEL.WARNING;
        self.errorMsg = 'should not use AlphaImageLoader in "${selector}"';
    }
    
    this.check = function (self, rule, config) {
        if (rule.value.indexOf('AlphaImageLoader') != -1)
            return false;
        return true

    }

    this.__doc__ = {
        "summary" : "不要使用AlphaImageLoader",
        "desc" : "<code>AlphaImageLoader</code> 主要用于在IE6下显示半透明图片，\
            此举实际上费力不讨好，对IE的性能影响极大，为了更好地实现网页的 \
            <strong>渐进增强</strong> ，建议不要使用 <code>AlphaImageLoader</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoAppearanceNameInSelector', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForTagOnly = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-appearance-word-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_origin = 'should not use appearance word "%s" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase();
        
        if(selector.indexOf('@media') != -1)
            return true;
        if(selector.indexOf('@-moz-document') != -1)
            return true;

        var word = helper.existsAppearanceWords(selector);
        
        if (word !== null){
            self.errorMsg = self.errorMsg_origin.replace('%s', word)
            return false
        }

        return true
    }

    this.__doc__ ={
        "summary":"选择器中避免表现相关的词汇",
        "desc":"避免将在selector中出现 <code>.red</code> <code>.left</code> 等描述性词汇，\
            用具体的实际意义来代替，比如 <code>.error</code> <code>.sidebar</code> "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoCommentInValues', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

module.exports = global.FEDNoCommentInValues = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-comment-in-value'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg = 'find css comment (/* */) in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        if (ruleSet.roughValue.indexOf('/*') != -1 || 
            ruleSet.roughValue.indexOf('*/') != -1)
            return false
        return true 
    }
    
    this.__doc__ = {
        "summary":"不要在css属性中添加注释",
        "desc":"CSS的注释应该写在 <code>selector</code> 前面，属性中不允许添加css注释，例如：<br>\
            <code>.selector {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;/*comment here*/</code><br>\
            <code>}</code>\
        "
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoEmptyRuleSet', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

module.exports = global.FEDNoEmptyRuleSet = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-empty-ruleset';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg = 'empty ruleset found "${selector}"';
    }

    this.check = function (self, ruleSet, config) {
        if (ruleSet.getRules().length == 0) {
            return false
        }
        return true
    }
    
    this.fix = function (self, ruleSet, config) {
        if (ruleSet.getRules().length == 0){
            styleSheet = ruleSet.getStyleSheet();
            styleSheet.removeRuleSet(ruleSet);
        }
    }

    this.__doc__ = {
        "summary" : "删除空的规则",
        "desc" : "空的CSS规则集是没有任何意义的，应该直接删除掉"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoExpression', function(require, exports, module) {

var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;

module.exports = global.FEDNoExpression = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-expression';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg_use = 'should not use expression in "${selector}" ';
        self.errorMsg_hack = 'should add hack for expression in "${selector}"';
        self.errorMsg = '';
    }
    
    this.check = function (self, rule, config) {
        var value = rule.value,
            name = rule.name,
            replaced = value.replace(/\s+/g, ''); 
    
        if (value.indexOf('expression') == -1)
            return true;

        if (replaced.indexOf('Expressions') != -1 || 
            replaced.indexOf('this.style.' + name + '=') != -1 || 
            replaced.indexOf('this.runtimeStyle.' + name + '=') != -1) {
            if (rule.name == rule.strippedName) {
                selector = rule.selector.replace(/\s+/g, '')
                if (selector.indexOf('*html') == -1) {
                    self.errorMsg = self.errorMsg_hack;
                    return false;
                }
            }
            return true;
        }
        self.errorMsg = self.errorMsg_use;
        return false;
    }

    this.__doc__ = {
        "summary" : "不要使用非一次性表达式",
        "desc" : "IE下，非一次性expression对性能有很大的影响，或许一次鼠标移动，\
            将触发<strong>成千上万次</strong>的expression表达式的执行，因此，为了浏览器的更新换代，\
            应该杜绝使用非一次性表达式。<br>本工具针对一次性表达式的检查，将判断expression中是否有如下两个内容：\
            <br>1. <code>Expressions</code><br>2. <code>this.style.attrName = </code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoSimpleNumberInSelector', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')

var pattern = /\d+/g

module.exports = global.FEDNoSimpleNumberInSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'number-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'do not simply use 1,2,3 as selector(use v1/step1/item1), in "${selector}"'
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector

        if (selector.indexOf('@media') != -1)
            return true
            
        var found = selector.match(pattern)

        if (found) {
            for(var i = 0; i < found.length; i++) {
                var x = found[i]
                if (selector.indexOf('v' + x) == -1 && 
                    selector.indexOf('step' + x) == -1 && 
                    selector.indexOf('item' + x) == -1 && 
                    selector.indexOf('h' + x) == -1)
                    return false
            }
        }
        return true 
    }

    this.__doc__ = {
        "summary":"不要在选择器中使用简单数字",
        "desc":"在业务代码的css中，选择器中不要使用简单的 <code>1, 2, 3</code> 来进行命名，下面的命名方式就是错误的：<br>\
            <code>.test1</code> <code>.main1</code>，但是允许使用 <code>v1</code> <code>step1</code> <code>item1</code> \
            来代表版本、步骤、第几个元素的意思"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoStarInSelector', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')

module.exports = global.FEDNoStarInSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-star-in-selector'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'please remove low performance selector "*" from "${selector}"'
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector;
        if (selector.indexOf('*') == -1)
            return true;

        var replaced = selector.replace(/\s/g, '');
        if (helper.startswith(replaced, '*html') || helper.startswith(replaced, '*+html'))
            return true;

        if (replaced.indexOf('*:not') != -1)
            return true;

        // give it to FEDHighPerformanceSelector.py
        if (replaced.indexOf('*=') != -1 && (replaced.split('*')).length == 2) {
            return true;
        }

        return false;

    }

    this.__doc__ = {
        "summary" : "不要在选择器中使用星号",
        "desc" : "禁止在选择器中加入<code>*</code>来选择所有元素，例如：\
            <br><br><code>*html</code> <code>*+html</code> <code>*:not</code>等几种特殊hack除外"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoUnitAfterZero', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

var pattern_unit = /^[0]+[\w]+/g
var replacer_unit = /,\s+/g

module.exports = global.FEDNoUnitAfterZero = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'del-unit-after-zero'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'unit should be removed when meet 0 in "${selector}"'
    }

    this.check = function(self, rule, config) {
        var values = rule.value.split(' ')

        for(var i = 0; i < values.length; i++) {
            var v = values[i];
            v = v.trim()
            if (v.indexOf('(') != -1) {
                matched = self._startsWithZero(v.split('(')[1])
            } else {
                matched = self._startsWithZero(v)
            }
            if (!matched)
                continue

            for(var j = 0; j < matched.length; j++) {
                var m = matched[j]
                if (m != '0s') {
                    return false;
                }
            }
        }

        return true 
    }

    this.fix = function(self, rule, config) {
        if (rule.name == 'expression')
            return

        var fixed = rule.fixedValue
        rule.fixedValue = rule.fixedValue.replace(/,/g, ', ');

        var collector = []
        rule.fixedValue.split(' ').forEach(function(v) {
            v = v.trim()
            if (v.indexOf('(') != -1) {
                matched = self._startsWithZero(v.split('(')[1])
            } else {
                matched = self._startsWithZero(v)
            }

            if (!matched) {
                collector.push(v)
                return
            }

            var finalV = v;
            for(var j = 0; j < matched.length; j++) {
                var m = matched[j]
                if (m != '0s') {
                    finalV = finalV.replace(m, '0')
                }
            }

            collector.push(finalV)
        })

        rule.fixedValue = collector.join(' ').replace(replacer_unit, ', ')
    }

    this._startsWithZero = function(self, value) {
        var matched = value.match(pattern_unit)
        return matched
    }

    this.__doc__ = {
        "summary":"删除0后面的单位",
        "desc":"0后面的单位可以删除，以实现更好的压缩。比如 <code>0px ==> 0</code> ，<code>0em ==> 0</code> 等，\
            但是<code>transition: 0s</code>的<code>s</code>不能省略"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDNoZeroBeforeDot', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDNoZeroBeforeDot = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-zero-before-dot'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'zero should be removed when meet 0.xxx in "${selector}"'
    }

    this.check = function(self, rule, config) {
        var value = rule.value

        if (self._startsWithZeroDot(value))
            return false

        var values = rule.value.split(' ')
        for(var i = 0; i < values.length; i++) {
            var v = values[i]
            if (self._startsWithZeroDot(v.trim()))
                return false
        }

        return true 
    }

    this.fix = function(self, rule, config) {
        var fixedValue = rule.fixedValue
        fixedValue.split(' ').forEach(function(v) {
            if (self._startsWithZeroDot(v))
                rule.fixedValue = rule.fixedValue.replace(v, v.slice(1))
        })
    }

    this._startsWithZeroDot = function(self, value) {
        return value.indexOf('0.') == 0
    }

    this.__doc__ = {
        "summary":"删除0.x前面的0",
        "desc":" 0.xxx 前面的 0 是可以删除的，以实现更好的压缩。例如<br>\
            <code>0.3px ==> .3px</code><br><br>\
            <code>rgba(0,0,0,0.3)<code><br>\
            <code>==></code><br>\
            <code>rgba(0,0,0,.3)</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDRemoveDuplicatedAttr', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDRemoveDuplicatedAttr = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'remove-duplicated-attr'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'has more than 1 ${name} in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var collector = []
        rules.forEach(function(rule) {
            var info = self.ruleInfo(rule)
            if (collector.indexOf(info) != -1)
                return false
            collector.push(info)
        })
        return true
    }

    this.fix = function(self, ruleSet, config) {
        // make sure we use the last statement, so reverse and filter and reverse again
        // [a1, a2, b, c] ==> [c, b, a2, a1] ==> [c, b, a2] ==> [a2, b, c]
        var rules = ruleSet.getRules()
        rules.reverse()
        var newRules = []
        var collector = []
        rules.forEach(function(rule) {
            var info = self.ruleInfo(rule)
            if (collector.indexOf(info) == -1) {
                collector.push(info)
                newRules.push(rule)
            }
        })
            
        newRules = newRules.reverse()
        ruleSet.setRules(newRules)
    }

    this.ruleInfo = function(self, rule) {
        if (rule.fixedName != '')
            return rule.fixedName + ':' + rule.fixedValue
        return rule.strippedName + ':' + rule.strippedValue
    }

    this.__doc__ = {
        "summary":"删除重复的属性设置",
        "desc":"如果在一个规则集中，对相同的两个属性进行了赋值，而且取值相同，则可以删除前面的赋值，例如：\
            <br>\
            <code>.test {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code><br>\
            <code>==></code><br>\
            <code>.test {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDReplaceBorderZeroWithBorderNone', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDReplaceBorderZeroWithBorderNone = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-border-zero'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_borderWidth = 'replace "border-width: 0" with "border-width: none" in "${selector}"'
        self.errorMsg_border = 'replace "border: 0" with "border: none" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        if (rule.name == 'border' && rule.value == '0') {
            self.errorMsg = self.errorMsg_border
            return false
        }

        if (/border-.*width/.test(rule.name) && rule.value == '0') {
            self.errorMsg = self.errorMsg_borderWidth
            return false
        }

        return true
    }

    this.__doc__ = {
        "summary":"用border:none替换border:0",
        "desc":"<code>border:0</code> 实际上是有border的，只不过宽度为0， 而 <code>border:none;</code>\
            是根本没有border的，对于浏览器来说后者的效率高，但是要注意，后者的代码长度稍微长一些。"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSafeUrlInValue', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSafeUrlInValue = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'safe-url-in-value'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = 'unsafe "%s" value in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var name = rule.name
        if (!helper.canContainUrl(name)) {
            return true
        }
        var value = rule.value
        if (value.indexOf('.js') != -1) {
            self.errorMsg = self.errorMsg_rough.replace('%s', name)
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary": "不安全的取值",
        "desc": "检查不安全的取值，避免自定义脚本随意运行，比如： <code>background-image: url(http://a.com/b.js);</code> 等"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSelectorNoUnderLine', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDSelectorNoUnderLine = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-underline-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'should not use _ in selector "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector
        if (selector.indexOf('_') != -1)
            return false
        return true
    }

    this.__doc__ = {
        "summary":"不要在选择器中使用下划线",
        "desc":"在selector中不要使用下划线 <code>_</code> ，可以使用中划线 <code>-</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSemicolonAfterValue', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSemicolonAfterValue = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'add-semicolon'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'each rule in "${selector}" need semicolon in the end, "${name}" has not'
    }

    this.check = function(self, rule, config) {
        if (!(rule.roughValue.trim().slice(-1) == ';'))
            return false
        return true 
    }

    this.__doc__ = {
        "summary":"为每一个属性后添加分号",
        "desc":"按照CSS编码规范，每一个规则后面都必须加上分号 <code>;</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDShouldNotUseImportant', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDShouldNotUseImportant = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'do-not-use-important'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'Should not use !important in "${name}" of "${selector}"'
    }

    this.check = function(self, rule, config) {
        value = rule.value
        if (value.replace(/\s+/g, '').indexOf('!important') != -1) {
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"不要使用!important",
        "desc":"CSS中不要使用<code>!important</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSingleLineBraces', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker

module.exports = global.FEDSingleLineBraces = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'single-line-brace'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_openingBrace = 'should have "only one space" before the opening brace in "${selector}"'
        self.errorMsg_openingBraceEnd = 'should have "only one space" after the opening brace in "${selector}"'
        self.errorMsg_closingBrace = 'should have "only one space" before the closing brace in "${selector}"'
        self.errorMsg_closingBraceEnd = 'should have "only one space" before the closing brace in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var singleLine = ruleSet.getSingleLineFlag()
        if (!singleLine)
            return true
        var selector = ruleSet.roughSelector
        if (selector.indexOf(',') == -1) {
            if (selector.slice(-2) == '  ' || selector.slice(-1) != ' ') {
                self.errorMsg = self.errorMsg_openingBrace
                return false
            }
        } else {
            return true
        }

        var value = ruleSet.roughValue
        if (value.slice(0, 1) != ' ' || value.slice(0, 2) == '  ') {
            self.errorMsg = self.errorMsg_openingBraceEnd
            return false
        }
        if (value.slice(-1) != ' ' || value.slice(-2) == '  ') {
            self.errorMsg = self.errorMsg_closingBraceEnd
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"单行的括号检查",
        "desc":"与单行CSS编码风格相关的括号检查"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSingleLineSelector', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDSingleLineSelector = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'single-line-selector'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_noEnterInSingleSelector = 'should not "enter" at the end of "${selector}"'
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" after semicolon in "${selector}"'
        self.errorMsg_shouldNotStartsWithSpace = 'should start with "space" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.roughSelector
        if (selector.indexOf(',') != -1)
            return true

        if (selector.replace(/^\s+/, '').indexOf('\n') != -1) {
            self.errorMsg = self.errorMsg_noEnterInSingleSelector
            return false
        }

        var splited = selector.split('\n')
        var realSelector = splited[splited.length - 1]
        
        if (realSelector.indexOf(' ') == 0) {
            self.errorMsg = self.errorMsg_shouldNotStartsWithSpace
            return false
        }

        return true 
    }

    this.__doc__ = {
        "summary":"单行的选择器检查",
        "desc":"单行的选择器检查内容，请参考多行选择器检查和人人FED CSS编码规范"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDSingleLineSpaces', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSingleLineSpaces = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'single-line-space'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_noSpace = 'should have one "space" before "${name}" in "${selector}"'
        self.errorMsg_spaceEnd = 'should not have "space" after "${name}" in "${selector}"'
        self.errorMsg_noSpaceBeforeValue = 'should have one "space" before value of "${name}" in "${selector}"'
        self.errorMsg_extraSpaceAfterValue = 'found extra "space" after value of "${name}" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var singleLine = rule.getRuleSet().getSingleLineFlag()
        if (!singleLine)
            return true

        if (!(rule.roughName.indexOf(' ') == 0)) {
            self.errorMsg = self.errorMsg_noSpace
            return false
        }

        if (rule.roughName.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_spaceEnd
            return false
        }
        
        if (!(rule.roughValue.indexOf(' ') == 0)) {
            self.errorMsg = self.errorMsg_noSpaceBeforeValue
            return false
        }

        var value = rule.roughValue.trim()
        if (value.slice(-2) == ' ;' || value.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_extraSpaceAfterValue
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"单行的空格检查",
        "desc":"单行CSS编码风格相关的空格检查，具体内容请参见CSS编码规范"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDStyleShouldInOrder', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDStyleShouldInOrder = new Class(RuleSetChecker, function() {

    this.__init__ = function(self) {
        self.id = 'keep-in-order'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_rough = '"%s" should after "%s" in "${selector}" (order: display/box/text/other/css3)'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        rules = ruleSet.getRules()
        if (rules.length < 2)
            return true

        var order = self._generateNameOrderMapping(rules)
        length = helper.len(order)
        for(var i = 0; i < order.length; i++) {
            if (i == length - 1)
                break
            var current = order[i]
            var nextAttr = order[i + 1]

            if (current[0] > nextAttr[0]) {
                self.errorMsg = self.errorMsg_rough.replace('%s', current[1]).replace('%s', nextAttr[1]);
                return false
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        rules = ruleSet.getRules()
        if (rules.length < 2)
            return true

        function comp(a, b) {
            if (a[0] != b[0]) {
                return a[0] - b[0]
            }
            var a1 = a[1].fixedValue
            var b1 = b[1].fixedValue
            return helper.getCss3PrefixValue(a1) - helper.getCss3PrefixValue(b1)
        }

        var mapping = self._generateNameRuleMapping(rules)
        mapping = mapping.sort(comp)
        var sortedRules = []
        for(var i = 0; i < mapping.length; i++) {
            sortedRules.push(mapping[i][1])
        }
        ruleSet.setRules(sortedRules)
    }

    this._generateNameOrderMapping = function(self, rules) {
        var collector = [];
        rules.forEach(function(rule) {
            collector.push([helper.getAttrOrder(rule.name, rule.strippedName), rule.strippedName])
        })
        return collector;
    }

    this._generateNameRuleMapping = function(self, rules) {
        var collector = [];
        rules.forEach(function(rule) {
            collector.push([helper.getAttrOrder(rule.name, rule.strippedName), rule])
        })
        return collector;
    }


    this.__doc__ = {
        "summary":"属性应该按照推荐的顺序编写",
        "desc":"相同的CSS属性，如果按照推荐的顺序来编写，浏览器的处理性能会更高，推荐的顺序一般为：<br>\
            显示属性 => 盒模型属性 => 背景/行高 => 文本属性 => 其他"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDTransChnFontFamilyNameIntoEng', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDTransChnFontFamilyNameIntoEng = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'no-chn-font-family'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'should not use chinese font family name in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name != 'font' && rule.name != 'font-family')
            return true

        if (helper.containsChnChar(rule.value))
            return false

        return true 
    }

    this.__doc__ = {
        "summary":"字体设置时使用英文",
        "desc":"有的字体设置可以通过中文和英文两者方式来声明，比如<br>\
            <code>微软雅黑</code> 和 <code>Microsoft Yahei</code> ，我们推荐用英文的方式来实现"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUnknownCssNameChecker', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUnknownCssNameChecker = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'unknown-css-prop'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'unknown attribute name "${name}" found in "${selector}"'
    }

    this.check = function(self, rule, config) {
        return helper.isCssProp(rule.name.toLowerCase())
    }

    this.__doc__ = {
        "summary":"错误的css属性",
        "desc":"本工具会帮您查找错误的CSS属性，如果写错了，即可收到错误提示"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUnknownHTMLTagName', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDUnknownHTMLTagName = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'unknown-html-tag'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = 'unknown html tag "%s" found in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase()
        if (selector.indexOf('@media') != -1)
            return true
        if (selector.indexOf('@-moz-document') != -1)
            return true
        var selectors = selector.split(',')
        for(var i = 0; i < selectors.length; i++) {
            var s = selectors[i];
            var splited = s.split(' ');
            for(var j = 0; j < splited.length; j++) {
                var r = splited[j];
                r = r.trim()
                if (!r) {
                    continue;
                }
                if (r.indexOf('::') != -1) {
                    // p::selection
                    tag = r.split('::')[0].split('.')[0].split('#')[0].trim()
                } else {
                    // abcd:hover
                    // abcd.class-name:hover
                    // abcd#class-name:hover
                    tag = r.split(':')[0].split('.')[0].split('#')[0].trim()
                }
                // .test > .inner
                if (tag == '' || tag == '>' || tag == '*' || tag == '+')
                    continue

                // #id
                if (tag.indexOf('#') != -1)
                    continue

                // input[type=button]
                if (tag.indexOf('[') != -1)
                    tag = tag.split('[')[0].trim()

                // *+html
                if (tag.indexOf('*+') == 0)
                    tag = tag.slice(2)

                // *html
                else if (tag.indexOf('*') == 0)
                    tag = tag.slice(1)
                
                if (!helper.isHTMLTag(tag)) {
                    self.errorMsg = self.errorMsg_rough.replace('%s', tag)
                    return false
                }
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        return;
    }

    this.__doc__ = {
        "summary":"错误的HTML Tag",
        "desc":"如果您输入了错误的HTML Tag，本工具也会给出相应的提示"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUseLowerCaseProp', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUseLowerCaseProp = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'lowercase-prop'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_name = '"${name}" should use lower case, in "${selector}"'
        self.errorMsg_value = 'value of "${name}" should use lower case, in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var value = rule.value
        var name = rule.strippedName

        // give it to FED16ColorShouldUpper.py
        if (name == 'color')
            return true

        if (value.indexOf('expression') != -1)
            return true

        if (name.toLowerCase() != name) {
            self.errorMsg = self.errorMsg_name
            return false
        }

        if (value.indexOf('#') != -1)
            return true

        if (name != 'font' && name != 'font-family' && value != value.toLowerCase() && value.indexOf('#') == -1) {
            self.errorMsg = self.errorMsg_value
            return false
        }

        if (name == 'font-family')
            return true

        if (name == 'font') {
            if (value.indexOf(',') != -1) {
                // font: italic bold 12px/30px 'Courier New', Georgia, serif;
                var other = value.split(',')[0].split('"')[0].split("'")[0].split(' ').slice(0, -1).join(' ');
                if (other != other.toLowerCase()) {
                    self.errorMsg = self.errorMsg_value
                    return false
                }
            }
            return true
        }

        if (value.toLowerCase() != value) {
            self.errorMsg = self.errorMsg_value
            return false
        }

        return true 
    }

    this.fix = function(self, rule, config) {
        return;
    }

    this.__doc__ = {
        "summary":"属性名称应该用小写",
        "desc":"所有的CSS属性名称一律小写，例如 <code>width</code> ，大写的方式是不正确的，\
            例如： <code>WIDTH:100px;</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUseLowerCaseSelector', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDUseLowerCaseSelector = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'lowercase-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'selector should use lower case, in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector
        if (selector.toLowerCase() != selector)
            return false

        return true 
    }

    this.fix = function(self, ruleSet, config) {
        return;
    }

    this.__doc__ = {
        "summary":"选择器用小写字母",
        "desc":"选择器应该用小写字母， 例如 <code>.demo</code> ， 不允许使用大写，例如： <code>.Demo .Test</code>"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUseSingleQuotation', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUseSingleQuotation = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'single-quotation'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'replace " with \' in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (self._findDouble(rule.value))
            return false

        return true
    }

    this.fix = function(self, rule, config) {
        if (self._findDouble(rule.value))
            rule.fixedValue = rule.fixedValue.replace(/"/g, "'")
    }

    this._findDouble = function(self, value) {
        return value.indexOf('"') != -1
    }

    this.__doc__ = {
        "summary":"使用单引号",
        "desc":"CSS的属性取值一律使用单引号<code>'</code>， 不允许使用双引号"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDUseValidValues', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUseValidValues = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'valid-values'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = '%s in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        return true
    }

    this.__doc__ = {
        "summary":"不正确的属性取值",
        "desc":"检查不正确的属性取值，比如： <code>width: underline;</code> 等"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/FEDZIndexShouldInRange', function(require, exports, module) {

var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDZIndexShouldInRange = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'z-index-in-range'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'value of "z-index" is not correct in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name != 'z-index')
            return true

        var zIndex = parseInt(rule.value, 10);

        if (zIndex < -1 || zIndex > 2100)
            return false

        return true 
    }

    this.__doc__ = {
        "summary":"z-index取值应符合范围要求",
        "desc":"<code>z-index</code> 的取值如果混乱，则会造成层之间的相互覆盖，\
            因此 <code>z-index</code> 取值必须符合一定的范围要求，具体要求请参见人人FED CSS编码规范"
    }
})

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/BackgroundCombiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var BackgroundCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
    }

    this.combine = function(self) {
        return [null, [], false]
    }

})

module.exports = BackgroundCombiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/BorderCombiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var BorderCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
    }

    this.fill = function(self, prop, val) {
        self.collector[self.name + '-' + prop] = val
    }

    this._seperate = function(self, value) {
        value = value.replace(/\s*,\s*/g, ',')
        var splited = value.split(' ')
        var length = helper.len(splited)
        if (length == 1) {
            this.fill('width', value)
        } else if (length == 2) {
            this.fill('width', splited[0])
            this.fill('style', splited[1])
        } else if (length == 3) {
            this.fill('width', splited[0])
            this.fill('style', splited[1])
            this.fill('color', splited[2])
        }
    }

    this.collect = function(self) {
        var name = self.name
        var attrs = self.attrs
        attrs.forEach(function(prop) {
            if (helper.containsHack(prop[0], prop[1], prop[2]))
                return

            if (prop[1] == name) {
                self.hasFather = true
                self._seperate(prop[2])
            } else {
                if (!(prop[1] in self.deleted)) {
                    self.deleted.push(prop[1])
                }
                self.collector[prop[0]] = prop[2]
            }
        })
    }

    this.join = function(self) {
        var collector = [];
        var hasWidth, hasStyle, hasColor;
        if (self.collector['border-width']) {
            hasWidth = 1
            collector.push(self.collector['border-width'])
        }
        if (self.collector['border-style']) {
            hasStyle = 1
            collector.push(self.collector['border-style'])
        }
        if (self.collector['border-color']) {
            hasColor = 1
            collector.push(self.collector['border-color'])
        }
        if (hasWidth) {
            self.combined = collector.join(' ')
        } else {
            self.combined = ''
            self.deleted = []
            self.hasFather = false
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = BorderCombiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/Combiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class

var Combiner = new Class(function() {
    this.combine = function(self, name, attrs) {
    }
})

module.exports = Combiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/CombinerFactory', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')

var combiners = {
    margin: require('./MarginCombiner'),
    padding: require('./PaddingCombiner'),
    background: require('./BackgroundCombiner'),
    border: require('./BorderCombiner'),
    font: require('./FontCombiner')
}

function doCombine(name, props) {
    var pluginClass = combiners[name] || NullCombiner
    var instance = new pluginClass(name, props)
    return instance.combine()
}

var NullCombiner = new Class(function() {
    this.__init__ = function(self, name, props) {}
    this.combine = function(self) {
        return [null, [], false]
    }
})

exports.doCombine = doCombine


// if (!module.parent) {
//     console.log(doCombine('margin', [
//         ['margin', 'margin', '50px auto 0 auto']
//     ]))
//     console.log(doCombine('padding', [
//         ['padding', 'padding', '50px auto 50px auto']
//     ]))
// }

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/FontCombiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var FontCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
    }

    this.join = function(self) {
        //console.log(self.collector)
        // border: 1px solid red
        // border-width: 2px
        // border-top-width

    }

    this.combine = function(self) {
        // self.collect()
        // self.join()
        return [null, [], false]
        //return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = FontCombiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/MarginCombiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')


var MarginCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
        self.hasFather = false
        self.subs = ['left', 'top', 'bottom', 'right']
        self.initSubs()
    }

    this.initSubs = function(self) {
        var name = self.name
        self.subs.forEach(function(sub) {
            self.collector[name + '-' + sub] = ''
        })
    }

    this._seperate = function(self, value) {
        var splited = value.split(' ')
        var top = right = bottom = left = ''
        var length = helper.len(splited)
        if (length == 1) {
            top = right = bottom = left = value
        } else if (length == 2) {
            top = bottom = splited[0].trim()
            left = right = splited[1].trim()
        } else if (length == 3) {
            top = splited[0].trim()
            left = right = splited[1].trim()
            bottom = splited[2].trim()
        } else if (length >= 4) {
            top = splited[0].trim()
            right = splited[1].trim()
            bottom = splited[2].trim()
            left = splited[3].trim()
        }
        var name = self.name
        self.collector[self.name + '-top'] = top
        self.collector[self.name + '-right'] = right
        self.collector[self.name + '-bottom'] = bottom
        self.collector[self.name + '-left'] = left
    }

    this.collect = function(self) {
        var name = self.name
        var attrs = self.attrs
        attrs.forEach(function(prop) {
            if (helper.containsHack(prop[0], prop[1], prop[2]))
                return

            if (prop[1] == name) {
                self.hasFather = true
                self._seperate(prop[2])
            } else {
                if (!(prop[1] in self.deleted)) {
                    self.deleted.push(prop[1])
                }
                self.collector[prop[0]] = prop[2]
            }
        })
    }

    this.join = function(self) {
        var left = self.collector[self.name + '-left']
        var top = self.collector[self.name + '-top']
        var right = self.collector[self.name + '-right']
        var bottom = self.collector[self.name + '-bottom']

        if (left == '' || top == '' || right == '' || bottom == '') {
            self.combined = null
            self.deleted = []
            return
        }

        if (left == right && right == bottom && bottom == top) {
            self.combined = left
        } else if (left == right && bottom == top) {
            self.combined = top + ' ' + left
        } else if (top != bottom && left == right) {
            self.combined = top + ' ' + right + ' ' + bottom
        } else {
            self.combined = top + ' ' + right + ' ' + bottom + ' ' + left
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }
})

module.exports = MarginCombiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/PaddingCombiner', function(require, exports, module) {

var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')


var PaddingCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
        self.hasFather = false
        self.subs = ['left', 'top', 'bottom', 'right']
        self.initSubs()
    }

    this.initSubs = function(self) {
        var name = self.name
        self.subs.forEach(function(sub) {
            self.collector[name + '-' + sub] = ''
        })
    }

    this._seperate = function(self, value) {
        var splited = value.split(' ')
        var top = right = bottom = left = ''
        var length = helper.len(splited)
        if (length == 1) {
            top = right = bottom = left = value
        } else if (length == 2) {
            top = bottom = splited[0].trim()
            left = right = splited[1].trim()
        } else if (length == 3) {
            top = splited[0].trim()
            left = right = splited[1].trim()
            bottom = splited[2].trim()
        } else if (length >= 4) {
            top = splited[0].trim()
            right = splited[1].trim()
            bottom = splited[2].trim()
            left = splited[3].trim()
        }
        var name = self.name
        self.collector[self.name + '-top'] = top
        self.collector[self.name + '-right'] = right
        self.collector[self.name + '-bottom'] = bottom
        self.collector[self.name + '-left'] = left
    }

    this.collect = function(self) {
        var name = self.name
        var attrs = self.attrs
        attrs.forEach(function(prop) {
            if (helper.containsHack(prop[0], prop[1], prop[2]))
                return

            if (prop[1] == name) {
                self.hasFather = true
                self._seperate(prop[2])
            } else {
                if (!(prop[1] in self.deleted)) {
                    self.deleted.push(prop[1])
                }
                self.collector[prop[0]] = prop[2]
            }
        })
    }

    this.join = function(self) {
        var left = self.collector[self.name + '-left']
        var top = self.collector[self.name + '-top']
        var right = self.collector[self.name + '-right']
        var bottom = self.collector[self.name + '-bottom']

        if (left == '' || top == '' || right == '' || bottom == '') {
            self.combined = null
            self.deleted = []
            return
        }

        if (left == right && right == bottom && bottom == top) {
            self.combined = left
        } else if (left == right && bottom == top) {
            self.combined = top + ' ' + left
        } else if (top != bottom && left == right) {
            self.combined = top + ' ' + right + ' ' + bottom
        } else {
            self.combined = top + ' ' + right + ' ' + bottom + ' ' + left
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }
})

module.exports = PaddingCombiner

})
// auto generated by concat 
;define('ckstyle/plugins/combiners/helper', function(require, exports, module) {

function containsHack(name, strippedName, value) {
    return name != strippedName || value.indexOf('\9') != -1
}

function camelCase(name) {
    var splited = name.split('-')

    var collector = []
    splited.forEach(function(x) {
        collector.push(x.slice(0, 1).toUpperCase() + x.slice(1))
    })
    return collector.join('')
}

function len(arr) {
    return arr.length;
}

exports.len = len;
exports.containsHack = containsHack
exports.camelCase = camelCase

})
// auto generated by concat 
;define('ckstyle/plugins/helper', function(require, exports, module) {

exports.heredoc = function(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, "")
        .replace(/\*\/[^\/]+$/, "")
        .replace(/^[\s\xA0]+/, "")
        .replace(/[\s\xA0]+$/, "");
};


function len(arr) {
    return arr.length;
}
exports.len = len;

function str(num) {
    return '' + num;
}
exports.str = str;

function startswith(str, pattern) {
    return str.indexOf(pattern) == 0;
}
exports.startswith = startswith;

function endswith(str, pattern) {
    if (str.length < pattern.length) {
        return false;
    }
    return str.slice(pattern.length * -1) == pattern;
}
exports.endswith = endswith;

function times(str, time) {
    var collector = '';
    for(var i = 0; i < time; i++) {
        collector += str;
    }
    return collector;
}
exports.times = times;

exports.isFontFamilyName = function(font) {
    font = font.toLowerCase()
    var added = "," + font + ","
    return fontFamilyNames.indexOf(font) != -1 || fontFamilyNames.indexOf(added) != -1
}


var pattern = /[@\*\[\]\(\):>]/

function len(arr) {
    return arr.length;
}

function hasHackChars(text) {
    return !!pattern.exec(text)
}
exports.hasHackChars = hasHackChars;

function containsHack(rule) {
    return rule.value.indexOf('\\0') != -1 || rule.value.indexOf('\\9') != -1
}
exports.containsHack = containsHack;

function getAttrOrder(attr, strippedName) {
    if (attr in cssAttrOrders)
        return cssAttrOrders[attr] + getCss3PrefixValue(strippedName)
    if (attr.indexOf('-') != -1) {
        var splited = attr.split('-')
        var tmp = splited[0] + '-' + splited[len(splited) - 1]
        if (tmp in cssAttrOrders)
            return cssAttrOrders[tmp] + getCss3PrefixValue(strippedName)
        while (len(splited) != 0) {
            splited = splited.slice(0, -1);
            tmp = splited.join('-')
            if (tmp in cssAttrOrders)
                return cssAttrOrders[tmp] + getCss3PrefixValue(strippedName)
        }
    }
    return 6000 + getCss3PrefixValue(strippedName)
}
exports.getAttrOrder = getAttrOrder

function getCss3PrefixValue(attr) {
    var value = 0
    if (attr.indexOf('-webkit') == 0)
        value = value - 5
    else if (attr.indexOf('-khtml') == 0)
        value = value - 4
    else if (attr.indexOf('-moz') == 0)
        value = value - 3
    else if (attr.indexOf('-ms') == 0)
        value = value - 2
    else if (attr.indexOf('-o') == 0)
        value = value - 1
    return value
}
exports.getCss3PrefixValue = getCss3PrefixValue;

function isHTMLTag(tag) {
    return containsInArray(validHTMLTags, tag)
}
exports.isHTMLTag = isHTMLTag;

function isCssProp(prop) {
    return containsInArray(validCSSAttrs, prop)
}
exports.isCssProp = isCssProp;

function isCss3Prop(prop) {
    return containsInArray(allCss3Props, prop)
}
exports.isCss3Prop = isCss3Prop;

var canBeCombinedProps = {
    border: [
        'border-width', 
        'border-style', 
        'border-color'
    ],
    margin: [
        'margin-top', 
        'margin-right', 
        'margin-bottom', 
        'margin-left'
    ],
    padding: [
        'padding-top', 
        'padding-right', 
        'padding-bottom', 
        'padding-left'
    ],
    background: [
        'background-color', 
        'background-image', 
        'background-repeat', 
        'background-attachment', 
        'background-position'
    ],
    font: [
        'font-style', 
        'font-weight', 
        'font-size', 
        'line-height', 
        'font-family'
    ]
}

function canBeCombined(prop) {
    prop = prop.trim()
    for(var x in canBeCombinedProps) {
        if (prop.indexOf(x) == 0 || canBeCombinedProps[x].indexOf(prop) != -1) {
            return x;
        }
    }
    return null;
}
exports.canBeCombined = canBeCombined;

function countStrLen(str) {
    var chns = str.match(/[\u4e00-\u9fa5]+/g)
    var total = 0;
    chns && chns.forEach(function(chn) {
        total += chn.length * 2
    })
    var engs = str.match(/[^\u4e00-\u9fa5]+/g)
    engs && engs.forEach(function(eng) {
        total += eng.length
    })
    return total
}
exports.countStrLen = countStrLen

function containsChnChar(string) {
    return /[\u4e00-\u9fa5]+/.test(string)
}
exports.containsChnChar = containsChnChar;

function isCss3PrefixProp(prop) {
    return containsInArray(prefixCss3Props, prop)
}
exports.isCss3PrefixProp = isCss3PrefixProp;

var wordsPattern = /\w+/g
function existsAppearanceWords(selector) {
    selector = selector.toLowerCase()
    words = selector.match(wordsPattern)
    for(var i = 0; i < words.length; i++) {
        var w = words[i];
        if (containsInArray(appearanceWords, w)) {
            return w;
        }
    }
    return null;
}
exports.existsAppearanceWords = existsAppearanceWords;

function isSimpleSelector(selector) {
    for(var i = 0; i < simpleSelectors.length; i++) {
        if (simpleSelectors[i] == selector) {
            return true;
        }
    }
    return false;
}
exports.isSimpleSelector = isSimpleSelector;

function containsInArray(array, value) {
    return array.indexOf(value) != -1
}

var maybeDoNotNeedPrefix = 'border-radius'.split(' ')

function doNotNeedPrefixNow(attr) {
    attr = attr.trim()
    if (startswith(attr, 'border') && endswith(attr, 'radius'))
        return true

    for (var i = maybeDoNotNeedPrefix.length - 1; i >= 0; i--) {
        if (maybeDoNotNeedPrefix[i].indexOf(attr) != -1) {
            return true;
        }
    }

    return false;
}
exports.doNotNeedPrefixNow = doNotNeedPrefixNow;

// from https://github.com/stubbornella/csslint/wiki/Require-compatible-vendor-prefixes
var prefixCss3Props = 'animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function appearance border-end border-end-color border-end-style border-end-width border-image border-radius border-start border-start-color border-start-style border-start-width box-align box-direction box-flex box-lines box-ordinal-group box-orient box-pack box-sizing box-shadow column-count column-gap column-rule column-rule-color column-rule-style column-rule-width column-width hyphens line-break margin-end margin-start marquee-speed marquee-style padding-end padding-start tab-size text-size-adjust transform transform-origin transition transition-delay transition-duration transition-property transition-timing-function user-modify user-select background-size writing-mode'.split(' ')

// according to http://fed.renren.com/archives/1212
var cssAttrOrdersMap = {
    0 : ['display', 'position', 'left', 'top', 'bottom', 'right', 'float', 'list-style', 'clear'],
    200 : ['width', 'height', 'margin', 'padding', 'border'],
    400 : ['background'],
    600 : ['line-height'],
    800 : ['color', 'font', 'text-decoration', 'text-align', 'text-indent', 'vertical-align', 'white-space', 'content'],
    1000: ['cursor', 'z-index', 'zoom'],
    1200: prefixCss3Props
    // 1400 : ['other']
}

// convert 0:a, b to a:0, b:0
var cssAttrOrders = {}
for(var key in cssAttrOrdersMap) {
    var value = cssAttrOrdersMap[key];
    counter = 0;
    value.forEach(function(x) {
        cssAttrOrders[x] = parseInt(key) + counter
        counter = counter + 6
    })
}

var canContainUrlProps = 'background behavior cursor'.split(' ')
exports.canContainUrl = function canContainUrl(prop) {
    prop = prop.split('-')[0];
    return containsInArray(canContainUrlProps, prop)
}

// execute in http://www.w3schools.com/cssref/css_websafe_fonts.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.toLowerCase().trim()
//             var spliteds = text.split(',');
//             for (var k = 0; k < spliteds.length; k++) {
//                 values.push(spliteds[k].trim().replace('"', "'").replace('"', "'"))
//             }
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.sort().join(','));

var fontFamilyNames = ("'arial black','book antiqua','comic sans ms','courier new','lucida console','lucida grande','lucida sans unicode','palatino linotype','times new roman','trebuchet ms',arial,charcoal,courier,cursive,gadget,geneva,geneva,helvetica,helvetica,impact,monaco,monospace,monospace,palatino,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,serif,serif,tahoma,times,verdana" + ",georgia").split(',')

// add slowly and progressively
var simpleSelectors = '.nav .sub #main #main2 #sidebar #sidebar2 .header .footer .publisher .box .login .site-nav .side'.split(' ')

//  execute in http://www.w3schools.com/cssref/css_colornames.asp
// 
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.toLowerCase().trim()
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));

var appearanceWords = ("left right top bottom float" + " aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(' ')
// execute on http://www.w3schools.com/cssref/default.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td && trs[j].getElementsByTagName('td')[2].textContent == '3') {
//             var text = td.textContent
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));
//
var allCss3Props = 'animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state background-clip background-origin background-size border-bottom-left-radius border-bottom-right-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-radius border-top-left-radius border-top-right-radius box-decoration-break box-shadow overflow-x overflow-y overflow-style rotation rotation-point color-profile opacity rendering-intent bookmark-label bookmark-level bookmark-target float-offset hyphenate-after hyphenate-before hyphenate-character hyphenate-lines hyphenate-resource hyphens image-resolution marks string-set box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack @font-face font-size-adjust font-stretch crop move-to page-policy grid-columns grid-rows target target-name target-new target-position alignment-adjust alignment-baseline baseline-shift dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size inline-box-align line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy text-height marquee-direction marquee-play-count marquee-speed marquee-style column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns fit fit-position image-orientation page size ruby-align ruby-overhang ruby-position ruby-span mark mark-after mark-before phonemes rest rest-after rest-before voice-balance voice-duration voice-pitch voice-pitch-range voice-rate voice-stress voice-volume hanging-punctuation punctuation-trim text-align-last text-justify text-outline text-overflow text-shadow text-wrap word-break word-wrap transform transform-origin transform-style perspective perspective-origin backface-visibility transition transition-property transition-duration transition-timing-function transition-delay appearance box-sizing icon nav-down nav-index nav-left nav-right nav-up outline-offset user-select resize animation animation-fill-mode border-end border-end-color border-end-style border-end-width border-start border-start-color border-start-style border-start-width line-break margin-end margin-start padding-end padding-start tab-size text-size-adjust user-modify writing-mode'.split(' ')

// execute on http://www.w3schools.com/tags/default.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.split('>')[0].split('<')[1]
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));

var validHTMLTags = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.split(' ')


//  execute on http://www.w3schools.com/cssref/default.asp
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             values.push(td.textContent)
//         }
//     }
// }
// console.log(values.join(' '));

var validCSSAttrs = ('@keyframes animation animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state ' + 
    'background background-attachment background-color background-image background-position background-repeat background-clip background-origin background-size background-inline-policy border border-bottom border-bottom-color border-bottom-style border-bottom-width border-color border-left border-left-color border-left-style border-left-width border-right border-right-color border-right-style border-right-width border-style border-top border-top-color border-top-style border-top-width border-width outline outline-color outline-style outline-width ' + 
    'border-bottom-left-radius border-bottom-right-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-radius border-top-left-radius border-top-right-radius box-decoration-break box-shadow overflow-x overflow-y overflow-style rotation rotation-point color-profile opacity rendering-intent bookmark-label bookmark-level bookmark-target float-offset ' + 
    'hyphenate-after hyphenate-before hyphenate-character hyphenate-lines hyphenate-resource hyphens image-resolution marks string-set height max-height max-width min-height min-width width box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack font font-family font-size font-style font-variant font-weight @font-face font-size-adjust font-stretch content counter-increment counter-reset quotes ' + 
    'crop move-to page-policy grid-columns grid-rows target target-name target-new target-position alignment-adjust alignment-baseline baseline-shift dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size drop-initial-value inline-box-align line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy text-height list-style list-style-image ' + 
    'list-style-position list-style-type margin margin-bottom margin-left margin-right margin-top marquee-direction marquee-play-count marquee-speed marquee-style column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns padding padding-bottom padding-left padding-right padding-top fit fit-position image-orientation page size bottom clear clip cursor display ' + 
    'float left overflow position right top visibility z-index orphans page-break-after page-break-before page-break-inside widows ruby-align ruby-overhang ruby-position ruby-span mark mark-after mark-before phonemes rest rest-after rest-before voice-balance voice-duration voice-pitch voice-pitch-range voice-rate ' + 
    'voice-stress voice-volume border-collapse border-spacing caption-side empty-cells table-layout color direction letter-spacing line-height text-align text-decoration text-indent text-transform unicode-bidi vertical-align white-space word-spacing hanging-punctuation punctuation-trim text-align-last text-justify ' + 
    'text-outline text-overflow text-shadow text-wrap word-break word-wrap transform transform-origin transform-style perspective perspective-origin backface-visibility transition transition-property transition-duration transition-timing-function transition-delay appearance box-sizing icon nav-down nav-index nav-left ' + 
    'nav-right nav-up outline-offset resize expression filter zoom behavior').split(' ')

})
// auto generated by concat 
;define('ckstyle/plugins/index', function(require, exports, module) {

exports.FEDCanNotSetFontFamily = require('./FEDCanNotSetFontFamily'); 
exports.FEDCombineInToOne = require('./FEDCombineInToOne'); 
exports.FEDCombineSameRuleSets = require('./FEDCombineSameRuleSets'); 
exports.FEDCommentLengthLessThan80 = require('./FEDCommentLengthLessThan80'); 
exports.FEDCss3PropPrefix = require('./FEDCss3PropPrefix'); 
exports.FEDCss3PropSpaces = require('./FEDCss3PropSpaces'); 
exports.FEDDistinguishBrowserExtra = require('./FEDDistinguishBrowserExtra'); 
exports.FEDDistinguishBrowserRule = require('./FEDDistinguishBrowserRule'); 
exports.FEDDistinguishBrowserRuleSet = require('./FEDDistinguishBrowserRuleSet'); 
exports.FEDDoNotSetStyleForSimpleSelector = require('./FEDDoNotSetStyleForSimpleSelector'); 
exports.FEDDoNotSetStyleForTagOnly = require('./FEDDoNotSetStyleForTagOnly'); 
exports.FEDFixCommentInValue = require('./FEDFixCommentInValue'); 
exports.FEDFixNestedStatement = require('./FEDFixNestedStatement'); 
exports.FEDFixOutlineZero = require('./FEDFixOutlineZero'); 
exports.FEDFontSizeShouldBePtOrPx = require('./FEDFontSizeShouldBePtOrPx'); 
exports.FEDHackAttributeInCorrectWay = require('./FEDHackAttributeInCorrectWay'); 
exports.FEDHackRuleSetInCorrectWay = require('./FEDHackRuleSetInCorrectWay'); 
exports.FEDHexColorShouldUpper = require('./FEDHexColorShouldUpper'); 
exports.FEDHighPerformanceSelector = require('./FEDHighPerformanceSelector'); 
exports.FEDMultiLineBraces = require('./FEDMultiLineBraces'); 
exports.FEDMultiLineSelectors = require('./FEDMultiLineSelectors'); 
exports.FEDMultiLineSpaces = require('./FEDMultiLineSpaces'); 
exports.FEDMustContainAuthorInfo = require('./FEDMustContainAuthorInfo'); 
exports.FEDNoAlphaImageLoader = require('./FEDNoAlphaImageLoader'); 
exports.FEDNoAppearanceNameInSelector = require('./FEDNoAppearanceNameInSelector'); 
exports.FEDNoCommentInValues = require('./FEDNoCommentInValues'); 
exports.FEDNoEmptyRuleSet = require('./FEDNoEmptyRuleSet'); 
exports.FEDNoExpression = require('./FEDNoExpression'); 
exports.FEDNoSimpleNumberInSelector = require('./FEDNoSimpleNumberInSelector'); 
exports.FEDNoStarInSelector = require('./FEDNoStarInSelector'); 
exports.FEDNoUnitAfterZero = require('./FEDNoUnitAfterZero'); 
exports.FEDNoZeroBeforeDot = require('./FEDNoZeroBeforeDot'); 
exports.FEDRemoveDuplicatedAttr = require('./FEDRemoveDuplicatedAttr'); 
exports.FEDReplaceBorderZeroWithBorderNone = require('./FEDReplaceBorderZeroWithBorderNone'); 
exports.FEDSafeUrlInValue = require('./FEDSafeUrlInValue'); 
exports.FEDSelectorNoUnderLine = require('./FEDSelectorNoUnderLine'); 
exports.FEDSemicolonAfterValue = require('./FEDSemicolonAfterValue'); 
exports.FEDShouldNotUseImportant = require('./FEDShouldNotUseImportant'); 
exports.FEDSingleLineBraces = require('./FEDSingleLineBraces'); 
exports.FEDSingleLineSelector = require('./FEDSingleLineSelector'); 
exports.FEDSingleLineSpaces = require('./FEDSingleLineSpaces'); 
exports.FEDStyleShouldInOrder = require('./FEDStyleShouldInOrder'); 
exports.FEDTransChnFontFamilyNameIntoEng = require('./FEDTransChnFontFamilyNameIntoEng'); 
exports.FEDUnknownCssNameChecker = require('./FEDUnknownCssNameChecker'); 
exports.FEDUnknownHTMLTagName = require('./FEDUnknownHTMLTagName'); 
exports.FEDUseLowerCaseProp = require('./FEDUseLowerCaseProp'); 
exports.FEDUseLowerCaseSelector = require('./FEDUseLowerCaseSelector'); 
exports.FEDUseSingleQuotation = require('./FEDUseSingleQuotation'); 
exports.FEDUseValidValues = require('./FEDUseValidValues'); 
exports.FEDZIndexShouldInRange = require('./FEDZIndexShouldInRange');

})
// auto generated by concat 
;define('ckstyle/reporter/HtmlReporter', function(require, exports, module) {

var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var HttpReporter = new Class(function() {
    this.__init__ = function(self, checker) {
        self.checker = checker
        self.msgs = []
        self.logs = []
        self.errors = []
        self.warnings = []
    }

    this.doReport = function(self) {
        checker = self.checker
        counter = 0

        var result = checker.errors()
        logs = result[0]
        warns = result[1]
        errors = result[2]

        if (len(logs) == 0 && len(warns) == 0 && len(errors) == 0) {
            // self.appendMsg('msg', {
            //     code: 200,
            //     msg: 'aha, no problem'
            // })
            return
        }

        errors.forEach(function(error) {
            counter = counter + 1
            self.appendMsg('error', fill(error))
        })

        warns.forEach(function(warn) {
            counter = counter + 1
            self.appendMsg('warning', fill(warn))
        })

        logs.forEach(function(log) {
            counter = counter + 1
            self.appendMsg('log', fill(log))
        })
    }

    this.appendMsg = function(self, type, msg) {
        if (type == 'msg') {
            self.msgs.push(msg)
        }
        if (type == 'log') {
            self.logs.push(msg)
        }
        if (type == 'error') {
            self.errors.push(msg)
        }
        if (type == 'warning') {
            self.warnings.push(msg)
        }
    }

    this._toHTML = function(self, type, arr, html) {
        if (arr.length) {
            html.push('<div class="' + type.toLowerCase() + '">\n')
            html.push('  <h2>' + type + '</h2>\n');
            html.push('  <ol>\n')
            arr.forEach(function(msg) {
                html.push('    <li>' + msg + '</li>\n')
            })
            html.push('  </ol>\n')
            html.push('</div>\n')
        }
    }

    this.export = function(self) {
        var html = [];
        self._toHTML('MSG', self.msgs, html)
        self._toHTML('ERROR', self.errors, html)
        self._toHTML('WARN', self.warnings, html)
        self._toHTML('LOG', self.logs, html)
        return html.join('')
    }
});

module.exports = HttpReporter;

})
// auto generated by concat 
;define('ckstyle/reporter/JsonReporter', function(require, exports, module) {

var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var TextReporter = new Class(function() {
    this.__init__ = function(self, checker) {
        self.checker = checker
        self.msgs = []
        self.logs = []
        self.errors = []
        self.warnings = []
    }

    this.doReport = function(self) {
        checker = self.checker
        counter = 0

        var result = checker.errors()
        logs = result[0]
        warns = result[1]
        errors = result[2]

        if (len(logs) == 0 && len(warns) == 0 && len(errors) == 0) {
            self.appendMsg('msg', {
                code: 200,
                msg: 'aha, no problem'
            })
            return
        }

        errors.forEach(function(error) {
            counter = counter + 1
            self.appendMsg('error', fill(error))
        })

        warns.forEach(function(warn) {
            counter = counter + 1
            self.appendMsg('warning', fill(warn))
        })

        logs.forEach(function(log) {
            counter = counter + 1
            self.appendMsg('log', fill(log))
        })
    }

    this.appendMsg = function(self, type, msg) {
        if (type == 'msg') {
            self.msgs.push(msg)
        }
        if (type == 'log') {
            self.logs.push(msg)
        }
        if (type == 'error') {
            self.errors.push(msg)
        }
        if (type == 'warning') {
            self.warnings.push(msg)
        }
    }

    this.export = function(self) {
        return JSON.stringify({
            msgs: self.msgs,
            warnings: self.warnings,
            logs: self.logs,
            errors: self.errors
        })
    }
});

module.exports = TextReporter;

})
// auto generated by concat 
;define('ckstyle/reporter/TextReporter', function(require, exports, module) {

var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var TextReporter = new Class(function() {
    this.__init__ = function(self, checker) {
        self.checker = checker
        self.msgs = []
    }

    this.doReport = function(self) {
        checker = self.checker
        counter = 0

        var result = checker.errors()
        logs = result[0]
        warns = result[1]
        errors = result[2]

        if (len(logs) == 0 && len(warns) == 0 && len(errors) == 0) {
            // self.appendMsg('aha, no problem')
            return
        }

        errors.forEach(function(error) {
            counter = counter + 1
            self.appendMsg('[ERROR] ' + counter + '. ' + fill(error))
        })

        warns.forEach(function(warn) {
            counter = counter + 1
            self.appendMsg(' [WARN] ' + counter + '. ' + fill(warn))
        })

        logs.forEach(function(log) {
            counter = counter + 1
            self.appendMsg('  [LOG] ' + counter + '. ' + fill(log))
        })
    }

    this.appendMsg = function(self, msg) {
        self.msgs.push(msg)
    }

    this.export = function(self) {
        return self.msgs.join('\n')
    }
});

module.exports = TextReporter;

})
// auto generated by concat 
;define('ckstyle/reporter/helper', function(require, exports, module) {

function fill(obj) {
    function fillRuleSet(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${selector}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["selector"] + '")'
        else
            errorMsg = errorMsg.replace('${selector}', obj["selector"])
        return errorMsg
    }

    function fillStyleSheet(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${file}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["file"] + '")'
        else
            errorMsg = errorMsg.replace('${file}', obj["file"])
        return errorMsg
    }

    function fillRule(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${selector}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["selector"] + '")'
        else
            errorMsg = errorMsg.replace('${selector}', obj["selector"])
        errorMsg = errorMsg.replace('${name}', obj["name"])
        errorMsg = errorMsg.replace('${value}', obj["value"])
        return errorMsg
    }

    var level = obj["level"]
    if (level == 'rule')
        return fillRule(obj)
    else if (level == 'ruleset')
        return fillRuleSet(obj)
    else if (level == 'stylesheet')
        return fillStyleSheet(obj)
    return obj["errorMsg"]
}

exports.fill = fill;

})
// auto generated by concat 
;define('ckstyle/reporter/index', function(require, exports, module) {

var ReporterUtil = {}

var mapper = {
    text: './TextReporter',
    json: './JsonReporter',
    html: './HtmlReporter'
}

ReporterUtil.getReporter = function(reporterType, checker) {
    var Reporter = require(mapper[reporterType]);
    return new Reporter(checker);
}

exports.ReporterUtil = ReporterUtil

})
;;
// compatible for seajs
;;(function(global) {
    this.global = global;

    define('fs', function(require, exports) {})
    define('path', function(require, exports) {})
    define('colors', function(require, exports) {})

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        };
    }
    
    if (!Object.keys) {
        Object.keys = function (object) {
            var keys = [];
            for (var name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }


    if (!Array.isArray) {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]" ||
                   (obj instanceof Array);
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach =  function(block, thisObject) {
            var len = this.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    block.call(thisObject, this[i], i, this);
                }
            }
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (value /*, fromIndex */ ) {
            var length = this.length;
            var i = arguments[1] || 0;

            if (!length)     return -1;
            if (i >= length) return -1;
            if (i < 0)       i += length;

            for (; i < length; i++) {
                if (!Object.prototype.hasOwnProperty.call(this, i)) { continue }
                if (value === this[i]) return i;
            }
            return -1;
        };
    }

})(this);
define('ckstyle/ckservice', function(require, exports, module) {
    var styler = require('./ckstyler');
    var BinaryRule = require('./browsers/BinaryRule');
    var CssChecker = styler.CssChecker;

    exports.doCompress = function(css) {
        var checker = new CssChecker(css);
        checker.prepare()
        return checker.doCompress();
    }

    exports.doFix = function(css) {
        var checker = new CssChecker(css)
        checker.prepare();
        return checker.doFix()
    }

    exports.doFormat = function(css) {
        var checker = new CssChecker(css)
        checker.prepare();
        return checker.doFormat()
    }
})

define('ckstyle/run-ckservice', function(require, exports, module) {

    var service = require('./ckservice');

    var serverRoot;

    var container, content, loading, content, trigger, close, counter, errormsg, ckcssNode

    var TMPLS = {
        container: [
'<div class="ckstyle-container">',
'    <span class="ckstyle-close">&times;</span>',
'    <h3 class="ckstyle-header">CKStyle Service [',
'        <a href="http://ckstyle.github.io" target="_blank">Home</a> | ',
'        <a href="https://github.com/wangjeaf/ckstyle-node" target="_blank">Github</a> | ',
'        <a href="https://www.npmjs.org/package/ckstyle" target="_blank">NpmJS</a>]',
'        <span class="ckstyle-loading">Loading & Parsing <span class="ckstyle-file-count"></span> CSS files, please wait...</span>',
'        <span class="ckstyle-errormsg"></span>',
'    </h3>',
'    <div class="ckstyle-content"></div>',
'</div>',
'<div class="ckstyle-trigger">CKService</div>'
].join(''),

        data: [
'<table border=1 class="ckstyle-result-table">',
'    <thead>',
'        <tr class="header">',
'            <th width="40%">URL</th>',
'            <th>Chars Before</th>',
'            <th>Chars After</th>',
'            <th>Delta Chars</th>',
'            <th>Delta Bytes</th>',
'            <th>Delta %</th>',
'            <th>Saved/1wPVs</th>',
'            <th>Operations</th>',
'        </tr>',
'    </thead>',
'    <tbody>',
'        {{#cssfiles}}',
'        <tr>',
'            <td> <a target="_blank" title="{{url}}" href="{{url}}">{{urlDisplay}}</a> </td>',
'            <td class="before before-{{id}}">-</td>',
'            <td class="after after-{{id}}">-</td>',
'            <td class="delta delta-{{id}}">-</td>',
'            <td class="delta-byte delta-byte-{{id}}">-</td>',
'            <td class="percent percent-{{id}}">-</td>',
'            <td class="total total-{{id}}">-</td>',
'            <td class="replacer replacer-{{id}}" data-index="{{id}}">handling...</td>',
'        <tr>',
'        <tr>',
'            <td class="code-diff code-diff-{{id}}" colspan="8"><div class="differ">Generating Diff...</div></td>',
'        <tr>',
'        {{/cssfiles}}',
'        <tr class="total">',
'            <td> TOTAL </td>',
'            <td class="before before-total">-</td>',
'            <td class="after after-total">-</td>',
'            <td class="delta delta-total">-</td>',
'            <td class="delta-byte delta-byte-total">-</td>',
'            <td class="percent percent-total">-</td>',
'            <td class="total total-total">-</td>',
'            <td class="replacer replacer-total"></td>',
'        <tr>',
'    </tbody>',
'</table>'
].join(''),

        replacer: '<a href="javascript:;" class="status-a ok">Replace</a> | <a href="javascript:;" class="code-diff-trigger">Diff</a> | <a href="javascript:;" class="disable-trigger">Disable</a>',
        replaceAll: ''
    }

    var CSS = [
'.ckstyle-container {text-align: left; color: #333; width:100%;background-color:rgba(255,255,255,.8);position:fixed;top:0;right:0;z-index:2147483647;border-bottom:1px solid #DDD;box-shadow: 1px 1px 12px #AAA;;}',
'.ckstyle-container .ckstyle-close {color: #666; float:right;margin-right:10px;font-size:20px;margin-top:3px;cursor:pointer;}',
'.ckstyle-container .ckstyle-header {padding:5px;margin:0;font-size:16px;line-height:22px;border-bottom:1px solid #DDD;}',
'.ckstyle-container .ckstyle-loading, .ckstyle-container .ckstyle-errormsg {display: none; padding:5px;margin:0; font-weight: normal; margin-left: 100px;}',
'.ckstyle-container .ckstyle-content {padding:5px;display:none;}',
'.ckstyle-trigger {border:1px solid #DDD; border-right: none; border-top: none; color: #666; box-shadow:1px 1px 2px #666;display:none;top:0;right:0;position:fixed;z-index:2147483647;background-color:#EEE;padding:5px;cursor:pointer;}',
'.ckstyle-result-table {border-color: #AAA; width: 100%; text-align:left;font-size:14px; border-spacing: 0;border-collapse:collapse;}',
'.ckstyle-result-table th, .ckstyle-result-table td {padding: 5px; font-size: 12px !important;}',
'.ckstyle-result-table .header td, .ckstyle-result-table .total td {font-weight: bold}',
'.ckstyle-container .differ {background-color: #FFF;margin: 0; white-space: pre-wrap; word-wrap: break-word; max-width: ' + ($(window).width() - 20) + 'px; overflow: auto; max-height: ' + ($(window).height() / 3 * 2) + 'px;}',
'.ckstyle-container .code-diff {display: none;}',
'.ckstyle-container ins {background-color: #E0F2BE; color: #500;}',
'.ckstyle-container del {background-color: #FFCACA; color: #374E0C;}',
'table.diff {width: 99%; border-collapse:collapse; border:1px solid darkgray; white-space:pre-wrap }',
'table.diff tbody {font-family:Courier, monospace }',
'table.diff tbody th {font-family:verdana,arial,"Bitstream Vera Sans",helvetica,sans-serif; background:#EED; font-size:11px; font-weight:normal; border:1px solid #BBC; color:#886; padding:.3em .5em .1em 0; text-align:right; vertical-align:top }',
'table.diff thead {border-bottom:1px solid #BBC; background:#EFEFEF; font-family:Verdana }',
'table.diff thead th.texttitle {text-align:left }',
'table.diff tbody td {padding:0px .4em; padding-top:.4em; max-width: ' + ($(window).width() / 2 - 120) + 'px; vertical-align:top; }',
'table.diff .empty {background-color:#DDD; }',
'table.diff .replace {background-color:#FD8 }',
'table.diff .delete {background-color:#E99; }',
'table.diff .skip {background-color:#EFEFEF; border:1px solid #AAA; border-right:1px solid #BBC; }',
'table.diff .insert {background-color:#9E9 }',
'table.diff th.author {text-align:right; border-top:1px solid #BBC; background:#EFEFEF }'
    ].join('');

    
    var BASE = 2 * 10000 / 1024 / 1024;

    function getSavedTotalGB(delta) {
        return (delta * BASE).toFixed(4);
    }

    function getBytes(delta) {
        return (delta * 2 / 1024).toFixed(2);
    }

    function getUrl(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.href;
    }

    function getHostname(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.hostname;
    }

    function getOrigin(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.origin;
    }

    function cut(url) {
        if (url.length > 70) {
            url = url.substring(0, 70) + '...';
        }
        return url;
    }

    function appendCss(cssText, target) {
        var style, node;
        if (/MSIE/.test(navigator.userAgent)) {
            style = doc.createStyleSheet();
            style.cssText = cssText;
            return style;
        } else {
            var style = $('<style>').attr('type', 'text/css').append(document.createTextNode(cssText)).attr('ck-append-node', 1);
            if (target) {
                style.insertAfter(target);
            } else {
                style.appendTo('head');
            }
            return style;
        }
    }

    function buildCssFileTable(array) {
        array.forEach(function(ele) {
            ele.urlDisplay = cut(ele.url)
        })
        content.html(Mustache.to_html(TMPLS.data, {
            cssfiles: array
        })).show();
    }

    var guid = 0;

    function getTargetCSSFiles() {
        var links = [];
        $('link').each(function(i, link) {
            if ($(link).attr('rel') != 'stylesheet') {
                return;
            }
            var url = $(link).attr('href');
            if (!url) {
                return;
            }
            if (getUrl(url).indexOf('http') != 0) {
                return;
            }
            // if (getOrigin(url) != window.location.origin) {
            //     return;
            // }
            var hostname = getHostname(url)
            // handle localhost files by xhr, remote server can not fetch them.
            var local = hostname == 'localhost' || hostname == '127.0.0.1';
            if (local) {
                url = getUrl(url);
                url = url.replace(getOrigin(url), window.location.origin)
            }
            links.push({
                url: getUrl(url),
                id: guid++,
                node: link,
                local: local
            });
        });
        return links;
    }

    function bindEvents() {
        close.click(function() {
            container.hide('slow');
            trigger.show('slow');
        });
        trigger.click(function() {
            trigger.hide('slow');
            container.show('slow');
        });

        container.delegate('.replacer a.ok', 'click', function() {
            var me = $(this);
            if (me.data('handling')) {
                return;
            }
            me.data('handling', 1)
            var statusA = me.hasClass('status-a');
            me.html(statusA ? 'Recover' : 'Replace')
                .toggleClass('status-a').toggleClass('status-b');
            var index = me.parent().data('index');
            var node = cssfiles[index].node;
            $(node).attr('rel', statusA ? 'stylesheet-bak' : 'stylesheet');
            setTimeout(function() {
                me.data('handling', 0);
                if (statusA) {
                    cssfiles[index].style = appendCss(cssfiles[index].compressed, node);
                    me.parent().find('.disable-trigger').data('replaced', 0).html('Disable')
                } else {
                    $(cssfiles[index].style).remove();
                    delete cssfiles[index].style;
                }
            }, 500)
           
        }).delegate('.code-diff-trigger', 'click', function() {
            var me = $(this);
            var index = me.parent().data('index');
            var target = $('.code-diff-' + index);
            var flag = target.is(':hidden');
            $('.code-diff').hide();
            if (flag) {
                target.show();
            } else {
                target.hide();
            }
            if (!me.data('diffed')) {
                me.data('diffed', 1)
                var code = cssfiles[index].code 
                setTimeout(function() {
                    diffUsingJS(index, service.doFormat(code), service.doFix(code), 'Before(Simply Formatted)')
                }, 0)
            }
        }).delegate('.disable-trigger', 'click', function() {
            var me = $(this);
            var index = me.parent().data('index');
            var node = cssfiles[index].node;
            if (me.data('replaced')) {
                me.html('Disable')
                $(node).attr('rel', 'stylesheet');
                me.data('replaced', 0)
            } else {
                me.data('replaced', 1)
                me.html('Enable')
                $(node).attr('rel', 'stylesheet-bak');
            }
        })
    }

    function loadCss(urls) {
        content.show();
        if (urls.length == 0) {
            errormsg.show().html('No css file.');
            return loading.hide();
        }
        urls.forEach(function(url) {
            loadLink(url);
        })
    }

    var loaderCounter = 0;

    function loadLink(record) {
        var ajaxUrl = '';
        var index = record.id;
        if (record.local) {
            ajaxUrl = record.url
        } else {
            ajaxUrl = serverRoot + '/cssfile/' + encodeURIComponent(record.url)
        }
        $.ajax({
            url: ajaxUrl, 
            type: 'GET',
            data: {
                index: record.id
            }, 
            dataType: record.local ? 'text' : 'jsonp'
        }).done(function(content) {
            index = content.index || index;
            var code = typeof content.code != 'undefined' ? content.code : content;

            var before = code.length;
            var compressed = ''
            if (code) {
                compressed = service.doCompress(code);
            }
            var after = compressed.length;
            var delta = before == 0 ? 0 : (before - after);

            $('.before-' + index).html(before);
            $('.after-' + index).html(after);
            $('.delta-' + index).html(delta)
            $('.delta-byte-' + index).html(getBytes(delta) + 'KB')
            $('.percent-' + index).html(((delta / (before || 1))*100).toFixed(2) + '%')
            $('.total-' + index).html(getSavedTotalGB(delta) + ' MB')
            $('.replacer-' + index).html(TMPLS.replacer)

            record.code = code;
            record.compressed = compressed;
            record.before = before;
            record.after = after;

            loaderCounter++;

            if (loaderCounter == cssfiles.length) {
                loading.hide();
                loaderCounter = 0;
                
                countAll();
            }
        }).error(function(content) {
            $('.replacer-' + index).html(TMPLS.replacerError)
        });
    }

    function diffUsingJS(index, base, newtxt, beforeText, afterText) {
        base = difflib.stringAsLines(base)
        newtxt = difflib.stringAsLines(newtxt)
        var sm = new difflib.SequenceMatcher(base, newtxt),
            opcodes = sm.get_opcodes(),
            diffoutputdiv = $(".code-diff-" + index + ' .differ')[0];

        diffoutputdiv.innerHTML = "";

        diffoutputdiv.appendChild(diffview.buildView({
            baseTextLines: base,
            newTextLines: newtxt,
            opcodes: opcodes,
            baseTextName: beforeText || "Before(Raw)",
            newTextName: afterText || "After(Precisely Fixed)",
            contextSize: 200,
            viewType: 0
        }));

    // if (code.indexOf('\n') != -1) {
    //     diffUsingJS(index, code, service.doFix(code))
    // } else {
        //diffUsingJS(index, service.doFormat(code), service.doFix(code), 'Before(Simply Formatted)')
    // }
    }

    function countAll() {
        var before = 0,
            after = 0;
        for(var i = 0, current; i < cssfiles.length; i++) {
            current = cssfiles[i];
            before += current.before;
            after += current.after;
        }
        var delta = before - after;
        var index = 'total'
        $('.before-' + index).html(before);
        $('.after-' + index).html(after);
        $('.delta-' + index).html(delta)
        $('.delta-byte-' + index).html(getBytes(delta) + 'KB')
        $('.percent-' + index).html(((delta / before)*100).toFixed(2) + '%')
        $('.total-' + index).html(getSavedTotalGB(delta) + ' MB')
        $('.replacer-' + index).html(TMPLS.replacer)
        $('.replacer-total').html(TMPLS.replaceAll)
    }

    function initDOM() {
        ckcssNode = appendCss(CSS);

        $(TMPLS.container).appendTo('body');

        container = $('.ckstyle-container');
        loading = $('.ckstyle-loading');
        errormsg = $('.ckstyle-errormsg');
        content = $('.ckstyle-content');
        trigger = $('.ckstyle-trigger');
        close = $('.ckstyle-close');
        counter = $('.ckstyle-file-count');
    }

    window.__cssfiles = cssfiles = null;

    function handleCSSFiles() {
        window.__cssfiles = cssfiles = getTargetCSSFiles();
        //window.urls = urls;
        buildCssFileTable(cssfiles);
        counter.html(cssfiles.length);
        loading.show();
        loadCss(cssfiles);
    }

    function init(root) {
        if (root) {
            serverRoot = root;
        }
        $('.ckstyle-container').remove();
        $('.ckstyle-trigger').remove();
        $('.ckservice-loading').remove();
        $('[ck-append-node]').remove();
        $('[rel=stylesheet-bak]').attr('rel', 'stylesheet');

        initDOM();
        bindEvents();

        guid = 0;

        handleCSSFiles();
    }

    exports.go = init;
})

seajs.use('ckstyle/run-ckservice', function(runner) {
    var host = window.CK_CONFIG && window.CK_CONFIG.host || 'http://localhost:4567'
    var wrapper = '<div class="ck-detect-error-wrapper" style="z-index: 2147483647; font-size: 14px; position:fixed;left:0;top:0;right:0;bottom:0;background-color:rgba(0,0,0,.75)">\
        <div style="width: 600px; margin: 0 auto; background-color: #F2F2F2; margin-top: 140px; color: #666; text-align: left; padding: 10px;border-radius: 4px;padding-bottom: 20px; ">\
            <h2 style="font-size: 26px; margin-top: 10px; margin-bottom: 20px;">感谢您使用CKService</h2>\
            <p style="font-size: 14px; line-height: 30px;">我们检测到服务主机： <a href="' + host + '" target="_blank">' + host + '</a> 上的服务并没有启动。</p>\
            <p style="font-size: 14px; line-height: 30px;">您通过以下简单2步，即可让CKService在你的机器上运行起来。</p>\
            <ol style="list-style: none;">\
                <li style="padding: 6px;"> 1. [sudo] npm install -g ckstyle</li>\
                <li style="padding: 6px;"> 2. ckstyle serve</li>\
            </ol>\
            <p style="font-size: 14px; line-height: 30px;">您也可以指定 window.CK_CONFIG.host 属性，指定CKService服务主机</p>\
        </div>\
        <div onclick="$(this).parent().fadeOut()" style="z-index: 2147483647;position: absolute; right: 5px; top: 5px; font-size: 44px; color: #FFF; cursor: pointer;">&times;</div>\
    </div>'

    function detect(callback) {
        $.ajax({
            type: 'get',
            url: host + '/ck_detect',
            dataType: 'jsonp',
            timeout: 3000,
            success: callback,
            error: function(e) {
                $('.ckservice-loading').remove();
                $('.ck-detect-error-wrapper').remove();
                $(wrapper).appendTo('body')
            }
        })
    }

    detect(function() {
        runner.go(host);
    })
})