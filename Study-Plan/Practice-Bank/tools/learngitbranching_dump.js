const path=require('path');
const idx=require(path.resolve('src/levels/index.js'));
const out={sequences:[]};
for (const [seq, levels] of Object.entries(idx.levelSequences)) {
  const info=idx.sequenceInfo[seq]||{};
  out.sequences.push({id:seq, name:(info.displayName||{}).en_US||seq, about:(info.about||{}).en_US||'', tab:idx.getTabForSequence?idx.getTabForSequence(seq):'',
    levels:levels.map(l=>({name:(l.name||{}).en_US, hint:(l.hint||{}).en_US||'', solution:l.solutionCommand,
      dialog:((l.startDialog||{}).en_US||{childViews:[]}).childViews.map(v=>(v.options&&(v.options.markdowns||[]).join('\n'))||(v.options&&v.options.beforeMarkdowns? (v.options.beforeMarkdowns.join('\n')+'\n\n`'+(v.options.command||'')+'`\n\n'+(v.options.afterMarkdowns||[]).join('\n')):'')).filter(Boolean)}))});
}
console.log(JSON.stringify(out));
