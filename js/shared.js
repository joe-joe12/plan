(function(){
  var KEYS=['exam-review-plan-v1','exam-calendar-v1'];
  var wrap=document.querySelector('.wrap');
  if(!wrap)return;
  var box=document.createElement('details');
  box.className='panel';
  box.style.marginTop='8px';
  box.innerHTML='<summary style="cursor:pointer;font-weight:700">備份與還原</summary>'
    +'<p class="hint" style="margin:8px 0">資料只存在這個瀏覽器裡。換手機、換電腦或清除瀏覽資料之前，先匯出備份檔；在新的裝置匯入，就能接著用。</p>'
    +'<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">'
    +'<button type="button" id="bkOut">匯出備份檔</button>'
    +'<button type="button" id="bkIn">匯入備份檔</button>'
    +'<input type="file" id="bkFile" accept=".json,application/json" hidden></div>';
  wrap.appendChild(box);

  box.querySelector('#bkOut').addEventListener('click',function(){
    var o={app:'exam-plan',version:1,data:{}};
    KEYS.forEach(function(k){
      try{var r=localStorage.getItem(k);if(r)o.data[k]=JSON.parse(r);}catch(e){}
    });
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));
    a.download='段考複習計畫備份-'+new Date().toLocaleDateString('sv-SE')+'.json';
    document.body.appendChild(a);a.click();a.remove();
  });

  var file=box.querySelector('#bkFile');
  box.querySelector('#bkIn').addEventListener('click',function(){file.click();});
  file.addEventListener('change',function(){
    var f=file.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(){
      try{
        var o=JSON.parse(r.result);
        if(!o||o.app!=='exam-plan'||typeof o.data!=='object')throw new Error('bad');
        if(!confirm('匯入會取代這個瀏覽器目前的資料，確定要繼續嗎？'))return;
        KEYS.forEach(function(k){if(o.data[k])localStorage.setItem(k,JSON.stringify(o.data[k]));});
        location.reload();
      }catch(e){alert('這不是有效的備份檔。');}
    };
    r.readAsText(f);
    file.value='';
  });
})();
