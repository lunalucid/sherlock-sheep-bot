# Sherlock Sheep

<p>Sherlock Sheep is a Discord bot that quietly watches your server and fact-checks claims in real time, stepping in when something's worth investigating and staying quiet during casual chat.</p>
<p>Wrapped in a desktop app (Electron) with a simple Start/Stop interface. No hosting required, runs on your machine.</p>
<p><strong>What it does</strong></p>
<p>When a message lands in a channel, Sherlock Sheep runs it through a multi-agent pipeline:</p>
<ul><li>Moderation check → skips bots and filters flagged content</li></ul>
<ul><li>Observation agent → decides if the message is casual chatter, a checkable claim, clearly true/false, or satire</li></ul>
<ul><li>For quick calls: reacts or sends a short correction inline</li></ul>
<ul><li>For deeper claims: hands off to the full fact-check agent, which sends a detailed verdict with animated loading while it thinks</li></ul>
<p><strong>Setup required</strong>
 </p>
<p>This is a free download but you'll need your own API keys (no keys are stored anywhere except your own machine).
 </p>
<ul> <li><a class="underline underline underline-offset-2 decoration-1 decoration-current/40 hover:decoration-current focus:decoration-current" href="https://platform.openai.com/api-keys">OpenAI API key</a>&nbsp;- usage costs apply (see pricing table below)
 </li><li><a class="underline underline underline-offset-2 decoration-1 decoration-current/40 hover:decoration-current focus:decoration-current" href="https://discord.com/developers/applications">Discord bot token</a>&nbsp;-&nbsp;free, one-time setup
</li></ul>
<p><strong>Discord setup</strong> <em>(one time)</em>
 </p>
<ol> <li>Create an app at discord.com/developers/applications
 </li><li>Bot tab → enable Message Content Intent
 </li><li>Copy the Token → paste into the app's Settings tab
 </li><li>OAuth2 → URL Generator → select <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">bot</code>&nbsp;+&nbsp;<code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">applications.commands</code> → invite to your server
</li></ol>
<p><strong>Models used</strong></p>
<p>Moderation model: <a target="_blank" href="https://developers.openai.com/api/docs/models/omni-moderation-latest">omni-moderation-latest</a><br>Moderation review model: <a target="_blank" href="https://developers.openai.com/api/docs/models/gpt-5.4-mini">gpt-5.4-mini</a><br>Observer model: <a target="_blank" href="https://developers.openai.com/api/docs/models/gpt-5.4-mini">gpt-5.4-mini</a><br>Fact check model: <a target="_blank" href="https://developers.openai.com/api/docs/models/gpt-5.4">gpt-5.4</a></p>
<p><a target="_blank" href="https://developers.openai.com/api/docs/pricing">(Prices per 1M tokens)</a></p>
<table><thead><tr><th></th><th colspan="3">Short context</th><th colspan="3"><del>Long context</del></th></tr><tr><th>Model</th><th>Input</th><th>Cached input</th><th>Output</th><th><del>Input</del></th><th><del>Cached input</del></th><th><del>Output</del></th></tr></thead><tbody><tr><td>omni-moderation-latest</td><td>$0.00</td><td>$0.00
</td><td>$0.00
</td><td><del>$0.00
</del></td><td><del>$0.00</del></td><td><del>$0.00</del></td></tr><tr><td>gpt-5.4
</td><td>$2.50
</td><td>$0.25
</td><td>$15.00
</td><td><del>$5.00
</del></td><td><del>$0.50
</del></td><td><del>$22.50</del>
</td></tr><tr><td>gpt-5.4-mini
</td><td>$0.75
</td><td>$0.075
</td><td>$4.50
</td><td><del>-
</del></td><td><del>-
</del></td><td><del>-</del>
</td></tr></tbody></table>
<p>You can check your API usage <a target="_blank" href="https://platform.openai.com/usage">here<br></a></p>
<p>Tip: opting into OpenAI's data sharing program unlocks free daily token allowances (up to 250K for gpt-5.4 and 2.5M for gpt-5.4-mini).</p>
<p><em>Sherlock Sheep bot persona art created by me.</em></p>