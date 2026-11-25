const API_BASE = ['localhost','127.0.0.1'].includes(location.hostname) ? 'http://127.0.0.1:8000' : location.origin;
const token=()=>localStorage.getItem('token');
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message,type='success'){let r=document.querySelector('.toast-region');if(!r){r=document.createElement('div');r.className='toast-region';document.body.append(r)}let t=document.createElement('div');t.className='toast '+(type==='error'?'error':'');t.textContent=message;r.append(t);setTimeout(()=>t.remove(),4200)}
async function api(path,options={}){const headers=new Headers(options.headers||{});if(token())headers.set('Authorization',`Bearer ${token()}`);if(options.body&&!(options.body instanceof FormData)&&!(options.body instanceof URLSearchParams))headers.set('Content-Type','application/json');let res;try{res=await fetch(API_BASE+path,{...options,headers})}catch(e){throw Error('Không kết nối được Backend tại 127.0.0.1:8000. Hãy kiểm tra máy chủ.')};const data=await res.json().catch(()=>null);if(!res.ok){if(res.status===401&&token()){localStorage.removeItem('token');location.href='index.html'}let d=data?.detail;throw Error(Array.isArray(d)?d.map(x=>x.msg).join('; '):d||`Lỗi máy chủ ${res.status}`)}return data}
function requireAuth(){if(!token()){location.replace('index.html');return false}return true}
function initials(n='Học viên'){return [...n.trim()][0]?.toLocaleUpperCase('vi')||'H'}
function renderUserAvatars(name=localStorage.getItem('full_name')||'Học viên',url=localStorage.getItem('avatar_url')||''){
  document.querySelectorAll('.js-user-avatar').forEach(node=>{
    node.replaceChildren();
    if(url){
      const img=document.createElement('img');
      img.src=url; img.alt='Ảnh đại diện'; img.onerror=()=>{node.textContent=initials(name)};
      node.append(img);
    }else node.textContent=initials(name);
  });
}
async function refreshShellUser(){
  if(!token())return;
  try{
    const user=await api('/api/auth/me');
    const name=user.full_name||localStorage.getItem('full_name')||'Học viên';
    localStorage.setItem('full_name',name);
    if(user.avatar_url)localStorage.setItem('avatar_url',user.avatar_url);
    else localStorage.removeItem('avatar_url');
    renderUserAvatars(name,user.avatar_url||'');
    document.querySelectorAll('.js-shell-name').forEach(n=>n.textContent=name);
  }catch(_){renderUserAvatars()}
}
function logout(){['token','username','full_name','avatar_url'].forEach(k=>localStorage.removeItem(k));location.href='index.html'}
function statusTag(s){let x=String(s||'').toLowerCase();return ['done','completed','submitted'].includes(x)?'<span class="tag green">Sẵn sàng</span>':['processing','pending','inprogress'].includes(x)?'<span class="tag orange">Đang xử lý</span>':'<span class="tag red">Chưa sẵn sàng</span>'}
function shell(active,title){let name=localStorage.getItem('full_name')||'Học viên';let links=[['dashboard','dashboard.html','⌂','Tổng quan'],['library','library.html','▤','Thư viện tài liệu'],['practice','practice.html','✎','Luyện thi'],['analytics','analytics.html','▥','Tiến độ học tập'],['review','analytics.html#review','↻','Ôn tập (Review)'],['profile','profile.html','◎','Hồ sơ cá nhân']];return `<aside class="sidebar" id="sidebar"><a class="brand" href="dashboard.html"><span class="brand-mark">🐝</span><span>BEE <span style="color:#c3a5ff">MỐC</span><small class="muted" style="display:block;font-size:9px;letter-spacing:.12em">SMART LEARNING</small></span></a><div class="nav-label">Không gian học tập</div><nav class="nav">${links.map(([id,url,ico,label])=>`<a class="${active===id?'active':''}" href="${url}"><span class="ico">${ico}</span>${label}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="study-note"><strong>✦ Học đều mỗi ngày</strong><span class="small muted">Mỗi bước nhỏ tạo nên tiến bộ lớn.</span></div><div class="user-mini"><div class="avatar js-user-avatar">${esc(initials(name))}</div><div class="meta"><strong class="js-shell-name">${esc(name)}</strong><small>Học viên BEE MỐC</small></div><button class="icon-btn" onclick="logout()" title="Đăng xuất">↗</button></div></div></aside><div class="main"><header class="topbar"><div class="row"><button class="icon-btn mobile-menu" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="crumb">BEE MỐC / ${title}</div><strong>${title}</strong></div></div><div class="top-actions"><span class="tag green">● API learning space</span><div class="avatar js-user-avatar">${esc(initials(name))}</div></div></header><main class="content" id="page-content"></main></div>`}
function mount(active,title){document.body.innerHTML=`<div class="app">${shell(active,title)}</div><div class="toast-region"></div>`;renderUserAvatars();refreshShellUser()}
function fmtDate(d){return d?new Date(d).toLocaleDateString('vi-VN'):'—'}
