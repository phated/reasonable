[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

let input = {|
  <html>
    <head>
      <title>A Simple HTML Document</title>
    </head>
    <body>
      <p>This is a very simple HTML document</p>
      <p>It only has two paragraphs</p>
    </body>
  </html>
|};

let result = Js.String.match([%re {|/<p>(.*?)<\/p>/gi|}], input);

switch (result) {
| Some(result) => Js.Array.forEach(print, result)
| None => print("no matches")
};
