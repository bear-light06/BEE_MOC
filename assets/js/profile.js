if(requireAuth()){
const el=document.getElementById('page-content');
el.innerHTML=`
<div class="page-head">
  <div><div class="eyebrow">YOUR ACCOUNT</div><h1>Hồ sơ cá nhân</h1><p>Quản lý thông tin và dấu ấn học tập của bạn.</p></div>
</div>
<div class="grid two">
  <section class="card profile-card">
    <div class="profile-cover"></div>
    <div class="profile-head">
      <div class="profile-avatar-wrap">
        <div class="avatar large profile-avatar" id="profile-avatar" aria-label="Ảnh đại diện">H</div>
        <button class="avatar-edit" type="button" id="avatar-trigger" aria-label="Chọn ảnh đại diện" title="Chọn ảnh đại diện">✎</button>
      </div>
      <div class="profile-identity"><h2 id="profile-name">Đang tải…</h2><p class="small muted" id="profile-username"></p></div>
    </div>
    <form id="profile-form">
      <div class="field"><label>Họ và tên</label><input name="full_name" required minlength="2"></div>
      <div class="field"><label>Email</label><input name="email" type="email" required></div>
      <div class="field">
        <label>Ảnh đại diện</label>
        <input id="avatar-file" class="avatar-file-input" type="file" accept="image/png,image/jpeg,image/webp">
        <div class="avatar-upload-box" id="avatar-dropzone" tabindex="0" role="button" aria-label="Chọn ảnh đại diện">
          <div class="avatar-upload-icon">↑</div>
          <div class="avatar-upload-copy"><strong id="avatar-file-label">Tải ảnh đại diện lên</strong><span>Kéo thả ảnh vào đây hoặc nhấn để chọn</span><small>JPG, PNG hoặc WEBP · Tối đa 2 MB</small></div>
          <button class="btn secondary sm" type="button" id="avatar-choose">Chọn ảnh</button>
        </div>
        <div class="avatar-file-meta hidden" id="avatar-file-meta"><span id="avatar-file-name"></span><button type="button" class="avatar-remove" id="avatar-clear">Bỏ ảnh đã chọn</button></div>
      </div>
      <button class="btn" type="submit" id="profile-save">Lưu thay đổi →</button>
    </form>
  </section>
  <section class="card">
    <h2>Thông tin tài khoản</h2><p class="small">Thông tin đăng nhập và thời gian tham gia.</p>
    <div class="mastery-item between"><span class="muted">Tên đăng nhập</span><strong id="username-value">—</strong></div>
    <div class="mastery-item between"><span class="muted">Ngày tham gia</span><strong id="created-value">—</strong></div>
    <div class="mastery-item between"><span class="muted">Trạng thái</span><span class="tag green">Đang hoạt động</span></div>
    <h3 style="margin-top:25px">Bảo mật tài khoản</h3>
    <p class="small" style="line-height:1.8">Không chia sẻ mật khẩu hoặc mã truy cập. Khi sử dụng thiết bị công cộng, hãy đăng xuất sau khi hoàn tất.</p>
    <button class="btn danger" type="button" onclick="logout()">Đăng xuất khỏi BEE MỐC</button>
  </section>
</div>`;
const fileInput=document.getElementById('avatar-file');
const avatar=document.getElementById('profile-avatar');
let selectedAvatarData=null;
let originalAvatarUrl=null;
function renderAvatar(source){
  avatar.replaceChildren();
  if(source){
    const img=document.createElement('img');
    img.src=source; img.alt='Ảnh đại diện'; img.onerror=()=>{avatar.textContent=initials(document.querySelector('[name=full_name]').value)};
    avatar.append(img);
  }else avatar.textContent=initials(document.querySelector('[name=full_name]').value);
}
function openAvatarPicker(){fileInput.click()}
function clearSelectedAvatar(){
  selectedAvatarData=null; fileInput.value='';
  document.getElementById('avatar-file-meta').classList.add('hidden');
  document.getElementById('avatar-file-label').textContent='Tải ảnh đại diện lên';
  renderAvatar(originalAvatarUrl);
}
document.getElementById('avatar-trigger').onclick=openAvatarPicker;
document.getElementById('avatar-choose').onclick=openAvatarPicker;
document.getElementById('avatar-dropzone').onclick=e=>{if(e.target.closest('button'))return;openAvatarPicker()};
document.getElementById('avatar-dropzone').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAvatarPicker()}};
document.getElementById('avatar-clear').onclick=clearSelectedAvatar;
fileInput.onchange=()=>{
  const file=fileInput.files?.[0]; if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.','error');fileInput.value='';return}
  if(file.size>2*1024*1024){toast('Ảnh đại diện tối đa 2 MB.','error');fileInput.value='';return}
  const reader=new FileReader();
  reader.onload=()=>{selectedAvatarData=reader.result;renderAvatar(selectedAvatarData);document.getElementById('avatar-file-label').textContent='Ảnh đã sẵn sàng';document.getElementById('avatar-file-name').textContent=file.name;document.getElementById('avatar-file-meta').classList.remove('hidden')};
  reader.onerror=()=>toast('Không thể đọc tệp ảnh.','error');
  reader.readAsDataURL(file);
};
const dropzone=document.getElementById('avatar-dropzone');
['dragenter','dragover'].forEach(name=>dropzone.addEventListener(name,e=>{e.preventDefault();dropzone.classList.add('drag-over')}));
['dragleave','drop'].forEach(name=>dropzone.addEventListener(name,e=>{e.preventDefault();dropzone.classList.remove('drag-over')}));
dropzone.addEventListener('drop',e=>{
  const file=e.dataTransfer.files?.[0]; if(!file)return;
  const transfer=new DataTransfer();transfer.items.add(file);fileInput.files=transfer.files;fileInput.dispatchEvent(new Event('change'));
});
(async()=>{
  try{
    const p=await api('/api/auth/me');
    document.querySelector('[name=full_name]').value=p.full_name||'';
    document.querySelector('[name=email]').value=p.email||'';
    document.getElementById('profile-name').textContent=p.full_name||'Học viên';
    document.getElementById('profile-username').textContent='@'+p.username;
    document.getElementById('username-value').textContent=p.username;
    document.getElementById('created-value').textContent=fmtDate(p.created_at);
    originalAvatarUrl=p.avatar_url||null;
    if(originalAvatarUrl)localStorage.setItem('avatar_url',originalAvatarUrl);else localStorage.removeItem('avatar_url');
    renderAvatar(originalAvatarUrl);renderUserAvatars(p.full_name||'Học viên',originalAvatarUrl||'');
  }catch(e){toast(e.message,'error')}
})();
document.getElementById('profile-form').onsubmit=async e=>{
  e.preventDefault();
  const button=document.getElementById('profile-save');button.disabled=true;
  try{
    const f=new FormData(e.target),payload={full_name:f.get('full_name'),email:f.get('email')};
    if(selectedAvatarData!==null)payload.avatar_url=selectedAvatarData;
    const p=await api('/api/auth/me',{method:'PATCH',body:JSON.stringify(payload)});
    localStorage.setItem('full_name',p.full_name);
    document.getElementById('profile-name').textContent=p.full_name||'Học viên';
    originalAvatarUrl=p.avatar_url||selectedAvatarData||originalAvatarUrl;
    if(originalAvatarUrl)localStorage.setItem('avatar_url',originalAvatarUrl);else localStorage.removeItem('avatar_url');
    renderUserAvatars(p.full_name||'Học viên',originalAvatarUrl||'');
    selectedAvatarData=null;fileInput.value='';
    document.getElementById('avatar-file-meta').classList.add('hidden');
    document.getElementById('avatar-file-label').textContent='Tải ảnh đại diện lên';
    renderAvatar(originalAvatarUrl);
    toast('Đã cập nhật hồ sơ');
  }catch(x){toast(x.message,'error')}
  finally{button.disabled=false}
};
}
