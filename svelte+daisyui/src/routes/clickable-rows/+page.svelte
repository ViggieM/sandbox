<div class="mx-auto prose">
	<h1>Clickable Rows Implementation</h1>

	<p>The entire li element is made clickable using TailwindCSS classes:</p>

	<ol>
		<li>
			<strong>Relative positioning</strong> on the <code>li</code> with <code>relative</code> class
		</li>
		<li>
			<strong>Absolute overlay</strong> with
			<code>&lt;span class="absolute inset-0"&gt;&lt;/span&gt;</code>
			inside the <code>&lt;a&gt;</code> tag
		</li>
		<li>
			<strong>Full coverage</strong> - the <code>inset-0</code> class makes the span cover the entire
			li area
		</li>
	</ol>

	<p>
		This creates an invisible clickable overlay that covers the full list item while keeping the
		link semantically correct.
	</p>

	<h2>Example Code</h2>

	<pre><code
			>&lt;li class="list-row relative"&gt;
  &lt;a href="/example"&gt;
    &lt;span class="absolute inset-0"&gt;&lt;/span&gt;
    Example Link Text
  &lt;/a&gt;
&lt;/li&gt;</code
		></pre>
</div>
