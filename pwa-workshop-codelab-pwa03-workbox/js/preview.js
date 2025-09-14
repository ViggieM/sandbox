// import {openDB} from "idb";
// import {marked} from "marked";
//
// window.addEventListener("DOMContentLoaded", async (event) => {
//   const preview = document.querySelector(".preview");
//   const db = await openDB('settings-store')
//   const content = (await db.get('settings', 'content') || '')
//   preview.innerHTML = marked(content)
// })

import {wrap, proxy} from "comlink";

window.addEventListener("DOMContentLoaded", (event) => {
  const preview = document.querySelector(".preview");
  const worker = new SharedWorker(new URL('./worker.js', import.meta.url), {
    type: 'module',
  });
  const compiler = wrap(worker.port)

  compiler.subscribe(
    proxy((data) => {
      preview.innerHTML = data.compiled;
    })
  )
})
