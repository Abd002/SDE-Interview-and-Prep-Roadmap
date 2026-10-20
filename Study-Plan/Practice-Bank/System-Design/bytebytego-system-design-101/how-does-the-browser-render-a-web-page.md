# ByteByteGo System Design 101: How Browsers Render Web Pages

> Copied from <https://github.com/ByteByteGoHq/system-design-101> (CC BY-NC-ND 4.0, by ByteByteGo). Questions and answers are the source's own; nothing was answered or rewritten here.


![](images/0090-browser-render-page.webp)

*   **Parse HTML and generate a Document Object Model (DOM) tree.**

    When the browser receives the HTML data from the server, it immediately parses it and converts it into a DOM tree.

*   **Parse CSS and generate CSSOM tree.**

    The styles (CSS files) are loaded and parsed to the CSSOM (CSS Object Model).

*   **Combine DOM tree and CSSOM tree to construct the Render Tree.** The render tree maps all DOM structures except invisible elements (such as `<head>` or tags with `display:none;`). In other words, the render tree is a visual representation of the DOM.

*   **Layout**

    The content in each element of the rendering tree will be calculated to get the geometric information (position, size), which is called layout.

*   **Painting**

    After the layout is complete, the rendering tree is transformed into the actual content on the screen. This step is called painting. The browser gets the absolute pixels of the content.

*   **Display**

    Finally, the browser sends the absolute pixels to the GPU and displays them on the page.
