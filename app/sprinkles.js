///////////////////////////////////////////////////////////
//  sprinkles.js
//
//  I deliberately chose the name for a laugh.
//
//  I built this a while ago but it was choppy, all it does
//  is allow you to create a set of elements that share
//  a common id prefix and unique index - so, for example:
//      
//      var s = sprinkles({
//          "parent_id": ",y-sprinkles",
//          "child_prefix": "some-prefix"
//      });
//
//      s.getSprinkles("Sprinkle this");
//
//  It will create a series of indexed <div> elements 
//  within the parent:
//
//      <div id="some-prefix-0">S</div>
//      <div id="some-prefix-1">p</div>
//      <div id="some-prefix-2">r</div>
//      <div id="some-prefix-3">i</div>
//      <div id="some-prefix-4">n</div>
//      <div id="some-prefix-5">k</div>
//      <div id="some-prefix-6">l</div>
//      <div id="some-prefix-7">e</div>
//      <div id="some-prefix-8">&nbsp;</div>
//      <div id="some-prefix-9">t</div>
//      <div id="some-prefix-0">h</div>
//      <div id="some-prefix-11">i</div>
//      <div id="some-prefix-12">s</div>
//
//  We can not use the sprinkle() method to apply aa
//  animation to each individual element.
//
//      s.sprinkle({
//          "start": -1,
//          "end": -1,
//          "style": {
//              "opacity": "0.99",
//              "color": "white"
//          },
//          "duration": 200,
//          "easing": "swing",
//          "finished": function() {
//              console.log("All sprinkled!");
//          },
//          "beforeEach": function(n) {
//              console.log("Preparing to sprinkle element " + n);
//          },
//          "afterEach": function(n) {
//              console.log("Sprinkled element " + n);
//          }
//      });
//
//  I'm not going into detail as to what the options do,
//  most of them are self explanitory - anything that isn't
//  obvious will be clarified in the code.
//
//  M. Nealon, 2018.
//

    let _sprinkles = function(options) {
    //  The _getSprinkes() method populates this with the
    //  string being sprinkled.
        let _string = "";

    //  The id attribute of the parent container.
        let _parent_id = "";

        let _el = null;

    //  Type of element used to create each sprinkle.
        let _el_type = "div";

    //  Prefix and class for each child.
        let _child_prefix = "sprinkle-";
        let _child_class = "sprinkle";

    //  The entire string is stretched to fit the
    //  parent - so if we have a 100px width parent
    //  and sprinkle a 10-char string then each of
    //  the sprinkled element will be 10px wide.
        let _child_width;


    //  _getSprinkle()
    //
    //  Given the string being sprinkled and the position of a
    //  particular char in that string, will create and return
    //  the relevant element.
    //
        let _getSprinkle = function(str, ch) {
            var el = document.createElement(_el_type);
            var character = str[ch];

        //  TODO: Add more HTML entities...
            if (character == " ") 
                character = "&nbsp;";

            el.setAttribute("id", _child_prefix + "-" + ch.toString());
            el.setAttribute("class", _child_class);
            el.setAttribute("style", "width: " + _child_width.toString() + "%");
            
            el.innerHTML = character;

            return el;
        };


    //  _getSprinles()
    //
    //  Given a string, will produce and sprinkle a set
    //  of child elements based on current config.
    //
    //  The only time this will error or return false is
    //  when the _parent_id property is unset.
    //
        let _getSprinkles = function(str) {
            _string = str;

            if (_parent_id === "")
                return false;
            
            if (_el === null)
                _el = document.getElementById(_parent_id);

            _el.innerHTML ="";

        //  Work out the width of each sprinkled child.
            _child_width = Math.floor(100 / str.length);

        //  The _getSprinkle() method is used on each
        //  character in the string...
            for (var ch = 0; ch < str.length; ch++) {
                _el.appendChild(_getSprinkle(str, ch));
            }
        };


    //  _startSprinkling()
    //
    //  Recursive method - will animate the element indexed
    //  by _start. Will then increate or decrease start (relative
    //  to its value compared to that of _end) and recall itself
    //  to animate the next sprinkle.
    //
    //  Simple enough. If _start > _end it's working backwards
    //  (_start is decreasing), else it's working forwards.
    //
    //  You don't call this method directly, instead the
    //  public sprinkle() method (_sprinkle()) is invoked (see
    //  below)
    //
        let _startSprinkling = function(_start, _end, options) {
            let el = $("#" + _child_prefix + "-" + _start.toString());

            if (options.beforeEach !== null)
                options.beforeEach(_start);

            el.stop().animate(
                options.style,
                options.duration,
                options.easing,
                function() {
                    if (
                        _start === _end ||
                        _start >= _string.length ||
                        _start < 0
                    ) {
                    //  The finished() callback is only invoked
                    //  when the last sprinkle has been animated.
                    //
                        if (options.finished !== null)
                            options.finished();
                        return;
                    }
                    else {
                    //  The afterEach() callback is invoked
                    //  after each sprinkle (except the last).
                    //
                        if (options.afterEach !== null)
                            options.afterEach(_start);

                    //  Pint _start to the next element.
                        if (_start < _end) _start++;
                        else _start--;

                    //  Recur!
                        _startSprinkling(_start, _end, options);
                    }
                }
            )
        };


    //  _sprinkle()
    //
    //  This is the method we call to trigger a sprinkling
    //  of epit proportions!
    //
    //  Options are self explanitory...this method does some
    //  simple checks on the supplied options, defaulting
    //  unspecified options, etc.
    //
    //  Nothing special - once all that dirty work is done
    //  the _startSprinkling() method is called.
    //
        let _sprinkle = function(options) {
        //  Defaults for _start and _end covers the
        //  entire string in ascending order.
            let _start = 0;
            let _end = (_string.length - 1);

            if (typeof(options.start) === "number")
                _start = options.start;
            if (typeof(options.end) === "number")
                _end = options.end;

        //  Defaults for various other options.
            if (typeof(options.style) !== "object")
                options.style = {};
            if (typeof(options.easing) !== "string")
                options.easing = "linear"
            if (typeof(options.duration) !== "number")
                options.duration = 200;
            if (typeof(options.finished) !== "function")
                options.finished = null;
            if (typeof(options.beforeEach) !== "function")
                options.beforeEach = null;
            if (typeof(options.afterEach) !== "function")
                options.afterEach = null;

            if (_start < 0 || _start >= _string.length) _start = 0;
            if (_end < 0 || _end >= _string.length) _end = (_string.length - 1);

        //  Let's do this!
            _startSprinkling(
                _start,
                _end,
                options
            );
        };


    //  Basic initialisation. These options are passed
    //  when the object is initially created.
    //
        if (typeof(options.parent_id) === "string")
            _parent_id = options.parent_id;

        if (typeof(options.element_type) === "string")
            _el_type = options.element_type;
        
        if (typeof(options.child_prefix) === "string")
            _child_prefix = options.child_prefix;
        if (typeof(options.child_class) === "string")
            _child_class = options.child_class;


    //  Public methods.
        return {
            "getSprinkles":         _getSprinkles,
            "sprinkle":             _sprinkle
        };

    };


///////////////////////////////////////////////////////////
//  sprinkles()
//
//  Function that facilitates laziness...
//
    function sprinkles(options) {
        if (typeof(options) === "undefined")
            options = {};
        
        return new _sprinkles(options);
    }

