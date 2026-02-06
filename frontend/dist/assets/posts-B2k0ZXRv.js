(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function e(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();const h="/api/posts",U="/api/auth",_="/api/comments",X="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",Z=document.body,V=document.querySelectorAll(".user-icon"),T=document.getElementById("userMenuDetails"),j=document.getElementById("authModal"),re=document.getElementById("closeModal"),P=document.getElementById("loginTab"),B=document.getElementById("registerTab"),ie=document.querySelectorAll(".write-post"),le=document.querySelector(".search-icon"),z=document.getElementById("mobileSearch"),ce=document.querySelector(".menu-toggle"),de=document.getElementById("mobileMenu"),A=document.querySelector(".logo"),me=document.querySelector(".all-posts-btn"),ue=document.getElementById("myPosts"),ge=document.getElementById("savedPosts"),fe=document.getElementById("profile-edit"),he=document.getElementById("settings"),D=document.getElementById("themeToggle"),O=document.documentElement;function c(s,o="info",r=5e3){const e=document.getElementById("toast-container");if(!e)return;const t=document.createElement("div");t.className=`toast toast-${o}`;const a=document.createElement("i");o==="success"?a.className="fas fa-check-circle":o==="error"?a.className="fas fa-exclamation-circle":a.className="fas fa-info-circle",t.appendChild(a);const n=document.createElement("span");n.textContent=s,t.appendChild(n),e.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t?.addEventListener("animationend",()=>t.remove())},r)}function ye(){ce?.addEventListener("click",s=>{s.stopPropagation(),T.classList.contains("show")&&T.classList.remove("show"),de.classList.toggle("active")})}function pe(){A?.addEventListener("click",()=>{window.location.href="index.html"}),me?.addEventListener("click",()=>{window.location.href="all-posts.html"}),ue?.addEventListener("click",()=>{window.location.href="my-posts.html"}),fe?.addEventListener("click",()=>{window.location.href="dashboard.html"}),ge?.addEventListener("click",()=>{window.location.href="saved.html"}),he?.addEventListener("click",()=>{window.location.href="settings.html"})}function we(){P?.addEventListener("click",()=>{k.classList.remove("hidden"),E.classList.add("hidden"),P.classList.add("active"),B.classList.remove("active")}),B?.addEventListener("click",()=>{E.classList.remove("hidden"),k.classList.add("hidden"),B.classList.add("active"),P.classList.remove("active")}),re?.addEventListener("click",()=>{j.classList.add("hidden")})}function ve(){V.forEach(s=>s?.addEventListener("click",()=>{const o=localStorage.getItem("user"),r=o?JSON.parse(o):null;r&&r.id?(T.classList.toggle("show"),j.classList.add("hidden")):(T.classList.add("hidden"),j.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden"),k?.reset(),E?.reset())}))}function ke(){le?.addEventListener("click",()=>{z.classList.toggle("show"),z.classList.contains("show")&&z.querySelector("input").focus()})}function Ee(){ie.forEach(s=>{s?.addEventListener("click",o=>{const r=localStorage.getItem("user"),e=r?JSON.parse(r):null;!e||!e.id?(o.preventDefault(),j.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function be(){D?.addEventListener("change",()=>{D.checked?(O.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(O.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),A.src="/Images/logo_optimized.png")})}function De(){localStorage.getItem("theme")==="dark"?(O.setAttribute("data-theme","dark"),D&&(D.checked=!0)):O.setAttribute("data-theme","light")}function Oe(s){s==="dark"?(Z.classList.add("dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(Z.classList.remove("dark"),A.src="/Images/logo_optimized.png"),localStorage.setItem("theme",s)}function He(){ye(),we(),ve(),ke(),Ee(),pe(),be()}const k=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Le=document.getElementById("logoutBtn");function R(s){return s?{...s,id:s.id||s._id}:null}window.currentUser=(()=>{const s=localStorage.getItem("user");return s?R(JSON.parse(s)):null})();function L(s){s?.id?V.forEach(o=>o.title=`Logged in as ${s.name}`):(V.forEach(o=>o.title="Click to Login/Register"),T?.classList.remove("show"))}async function H(s){try{const o=await m("/api/users/me");if(!o.ok)return;s=await o.json();const r=document.querySelectorAll(".user-icon");r&&r.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:X});const e=document.querySelectorAll(".avatar");e&&e.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:X}),window.currentUser=s}catch(o){console.warn("Failed to load auth user:",o)}}function $e(){k?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("loginEmail").value,r=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${U}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:r})}),t=await e.json();console.log("Login response:",t),e.ok||c(`Login failed: ${t.message||"Unknown error"}`,"error");const a=R(t.user);localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,localStorage.setItem("role",a.role),a.role==="admin"&&(window.location.href="admin.html"),L(a),H(a),authModal.classList.add("hidden"),k.reset(),c(`Welcome back, ${a.name}!`,"success"),je()})}function Se(){E?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("registerName").value,r=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,t=await m(`${U}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:r,password:e})}),a=await t.json();console.log("Register response:",a),t.ok||c(`Registration failed: ${a.message||"Unknown error"}`,"error");const n=R(a.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),L(n),H(n),authModal.classList.add("hidden"),E.reset(),c(`Welcome, ${n.name}! Your account has been created.`,"success")})}function Ie(){Le?.addEventListener("click",()=>{ee(),window.location.href="index.html"})}async function _e(){try{const s=await m(`${U}/me`);if(!s.ok)throw new Error("Not authenticated");const o=await s.json(),r=R(o);return localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,L(r),H(r),r}catch{return L(null),H(null),null}}async function ee(s=!1){try{await fetch(`${U}/logout`,{method:"POST",credentials:"include"})}catch(o){console.warn("Logout request failed:",o)}localStorage.removeItem("user"),window.currentUser=null,L(null),s||c("You have been logged out.","info")}function Pe(){const s=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),r=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");s&&s?.addEventListener("click",t=>{t.preventDefault(),o.classList.remove("hidden")}),r&&r?.addEventListener("click",()=>{o.classList.add("hidden")}),e&&e?.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a})})).json();c(i.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(n){console.error(n),c("Failed to send reset link. Try again.","error")}})}function Re(){$e(),Se(),Ie(),Pe()}async function m(s,o={}){let r=await fetch(s,{credentials:"include",...o});return r.status===401&&(await Be()?r=await fetch(s,{credentials:"include",...o}):ee(!0)),r}async function Be(){try{const s=await fetch(`${U}/refresh`,{method:"POST",credentials:"include"});if(!s.ok)throw new Error("Refresh failed");const o=await s.json();return window.currentUser=o.user,L(o.user),!0}catch{return!1}}async function Je(s){const o=s.dataset.slug;if(!o)return;const r=window.location.pathname.endsWith("post.html"),e=r?document.getElementById("singlePostContainer"):s.closest(".post");if(!e)return;const t=e.querySelector(".comments-section"),a=t?.querySelector(".comments-list");!t||!a||(r||t.classList.toggle("show"),(r||t.classList.contains("show"))&&await te(o,a))}async function ze(s){if(s.dataset.deleting==="true")return;s.dataset.deleting="true";const o=s.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){s.dataset.deleting="false";return}try{const e=await m(`${_}/${o}`,{method:"DELETE"}),t=await e.json();if(e.ok){const a=s.closest(".comment");a&&a.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):s.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}c("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),c("Error deleting comment. Please try again.","error")}finally{s.dataset.deleting="false"}}async function te(s,o,r=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${_}/post/${s}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const t=await e.json();if(o.innerHTML="",t.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const a=t.slice(0,r);if(W(a,o),t.length>r){const n=document.createElement("button");n.classList.add("view-more-btn"),n.textContent=`View all ${t.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",W(t,i);let l=!1;n?.addEventListener("click",()=>{l=!l,l?(o.innerHTML="",o.appendChild(i),o.appendChild(n),i.style.display="block",n.textContent="View less comments"):(o.innerHTML="",W(a,o),n.textContent=`View all ${t.length} comments`,o.appendChild(n))}),o.appendChild(n)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function W(s,o){const r=window.currentUser?.id||window.currentUser?._id;s.forEach(e=>{const t=document.createElement("div");t.classList.add("comment");const a=typeof e.authorId=="object"?e.authorId._id:e.authorId,n=r&&a&&a.toString()===r.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${Q(e.text)}</p>
        ${n?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${M(e.createdAt)}
      </small>
    `,o.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Ce(s,o,r,e){try{const t=await m(`${_}/post/${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(t.ok){const n=(await t.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${Q(n.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${n._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(n.createdAt).toLocaleString()}">
        ${M(n.createdAt)}
      </small>
      `,r.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}c("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),c("Failed to post comment","error")}}async function se(s,o){try{const r=await m(`${_}/post/${s}`);if(!r.ok)throw new Error("Failed to fetch comment count");const t=(await r.json()).length;t===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=t,o.title=`${t} comment${t>1?"s":""}`)}catch(r){console.error("Error fetching comment count:",r),o.textContent="0"}}async function Te(s){const o=s.target.closest(".comment-form"),r=o.querySelector(".comment-form button");if(!o)return;s.preventDefault();const e=o.querySelector(".comment-input"),t=e.value.trim();if(!t)return;let a,n,i,l;window.location.pathname.endsWith("post.html")?(a=document.getElementById("singlePostContainer"),n=a.querySelector(".comments-list"),i=a.querySelector(".comment-btn").dataset.slug,l=a.querySelector(".comment-count")):(a=o.closest(".post"),n=a.querySelector(".comments-list"),i=a.querySelector(".like-btn").dataset.slug,l=a.querySelector(".comment-count"));const d=g=>{r.disabled=g,r.innerHTML=g?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(d(!0),!window.currentUser){c("Please log in to comment.","error"),e.value="",d(!1);return}await Ce(i,t,n,l),e.value=""}catch{d(!1)}finally{d(!1)}}function We(){document.addEventListener("submit",Te)}const Ae=document.querySelectorAll(".search");let v={all:[],mine:[],saved:[]},$=1,u=Number(sessionStorage.getItem("postsPage"))||1,Ve=sessionStorage.getItem("postsCategory")||"",Ye=sessionStorage.getItem("postsSearch")||"";function Y(s){return s&&s.startsWith("http")?s:"/Images/fallback.jpg"}function Ue(s){s.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}function K(s){const o=new URL(window.location);s===1?o.searchParams.delete("page"):o.searchParams.set("page",s),window.history.pushState({},"",o)}async function J(s=1,o=6){try{const r=document.getElementById("categoryFilter")?.value,e=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",s),t.append("limit",o),r&&r!=="all"&&t.append("category",r),e.forEach(l=>{if(l){const d=l.value.trim();d&&t.append("search",d)}});const n=await(await m(`${h}?${t.toString()}`)).json();v.all=Array.isArray(n.posts)?n.posts:[],u=n.currentPage??1,$=n.totalPages??1,K(u),typeof u<"u"&&sessionStorage.setItem("postsPage",u),sessionStorage.setItem("postsCategory",r&&r!=="all"?r:"");const i=[...e].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),C("allPostsContainer"),G("allPostsContainer",u,$)}catch(r){console.error("Error fetching posts:",r),c("Something went wrong while displaying posts!","error")}}async function oe(s=1,o=6){try{const r=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",s),e.append("limit",o),r.forEach(l=>{if(l){const d=l.value.trim();d&&e.append("search",d)}});const t=await m(`${h}/mine?${e.toString()}`);if(!t.ok){const l=await t.text();throw new Error(l||"Failed to fetch your posts")}const a=await t.json();v.mine=Array.isArray(a.posts)?a.posts:[],u=a.currentPage||1,$=a.totalPages||1,K(u),sessionStorage.setItem("postsPage",u);const n=[...r].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",n);const i="myPostsContainer";if(C("myPostsContainer",null,"You haven't made any posts yet..."),G(i,u,$),v.mine.length===0){const l=document.getElementById("myPostsContainer");l&&Ue(l)}}catch(r){console.error("Error fetching my posts:",r),c("Failed to load your posts!","error")}}function M(s){const o=Math.floor((Date.now()-new Date(s))/1e3),r=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const t of r){const a=Math.floor(o/t.seconds);if(a>=1)return e.format(-a,t.label)}return"Just now"}function Q(s){return s.replace(/\n/g,"<br>")}function C(s,o=null,r=null){const e=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(s);if(!t)return;t.innerHTML="";let a=[];if(s==="allPostsContainer"||s==="featuredPostsContainer"?a=[...v.all]:s==="myPostsContainer"?a=[...v.mine]:s==="savedPostsContainer"&&(a=[...v.saved]),o&&(a=a.slice(0,o)),a.length===0){t.innerHTML=r??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}a.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const l=n.content.length>150?n.content.substring(0,150)+"...":n.content,d=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,g=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",q=e&&String(d)===String(e);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${Y(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${d}" class="author"><em>By ${g}</em></a>
        <small title="${new Date(n.date).toLocaleString()}">
          ${M(n.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${n.likedByUser?"liked":""}" data-slug="${n.slug}">
              <i class="${n.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${n.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${n.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${n.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${n.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${n.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${n.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${n.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${n.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${q?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(i);const y=i.querySelector(".post-image");y&&(y.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const S=i.querySelector(".like-btn"),F=S.querySelector("i"),p=i.querySelector(".liked-by");p.dataset.slug=n.slug,p.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?p.classList.remove("disabled"):p.classList.add("disabled");const x=Array.isArray(n.likes)?n.likes.map(I=>typeof I=="object"?I._id:I):[];e&&(x.includes(e)||n.likedByUser)?(S.classList.add("liked"),F.className="fa-solid fa-heart"):(S.classList.remove("liked"),F.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?p.textContent="No likes yet":n.likedBy.length===1?p.textContent=`Liked by ${n.likedBy[0]}`:p.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const w=i.querySelector(".comment-count");se(n.slug,w)})}async function Me(s,o,r,e){const t=new FormData;t.append("title",s),t.append("content",o),t.append("category",r),e&&t.append("image",e);const a=await m(`${h}`,{method:"POST",body:t});if(!a.ok)throw new Error("Failed to add post");return await a.json()}async function Ke(s){if(confirm("Are you sure you want to delete this post?"))try{const o=await m(`${h}/${s}`,{method:"DELETE"});if(!o.ok){const r=await o.text();throw new Error(r||"Failed to delete post")}c("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?oe(u):J(u)}catch(o){console.error("Error deleting post:",o),c("Failed to delete post!","error")}}function Qe(s){s&&(localStorage.setItem("editSlug",s),window.location.href="write.html")}function Ge(){const s=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!s)return;const r=localStorage.getItem("editSlug"),e=t=>{o.disabled=t,o.innerHTML=t?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':r?"Update Post":"Add Post"};r&&r!=="null"?((async()=>{try{const t=await m(`${h}/${r}`);if(!t.ok)throw new Error("Post not found");const a=await t.json();if(document.getElementById("title").value=a.title||"",document.getElementById("content").value=a.content||"",document.getElementById("category").value=a.category||"",a.image){const n=document.getElementById("imagePreview");n.src=a.image,n.style.display="block"}}catch(t){console.error("Error loading post:",t)}})(),s.onsubmit=async function(t){t.preventDefault();const a=new FormData;a.append("title",document.getElementById("title").value),a.append("content",document.getElementById("content").value),a.append("category",document.getElementById("category").value);const n=document.getElementById("image").files[0];n&&a.append("image",n);try{e(!0);const i=await m(`${h}/${r}`,{method:"PUT",body:a});i.ok?(c("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),c("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),s?.addEventListener("submit",async function(t){t.preventDefault();const a=document.getElementById("title").value,n=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:a,content:n,category:i,imageFile:l});try{e(!0);const d=await Me(a,n,i,l);console.log("Post created successfully!",d),c("Post created successfully!","success"),s.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(d){console.error("Error adding post:",d),c("Failed to add post!","error")}finally{e(!1)}}))}async function Xe(){const o=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(o&&m(`/api/posts/${o}/view`,{method:"POST"}).catch(r=>{console.error("Failed to increment view",r)}),!!o){try{let I=function(f){w.dataset.saved=f?"true":"false",w.classList.toggle("saved",f);const b=w.querySelector("i");b.classList.toggle("fa-solid",f),b.classList.toggle("fa-regular",!f)};const r=await m(`${h}/${o}`);if(!r.ok)throw new Error("Failed to fetch post");const e=await r.json(),t=window.currentUser?._id||window.currentUser?.id,a=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,n=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=t&&String(a)===String(t),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${Y(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${a}'" style="cursor: pointer;" class="author"><em>By ${n}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${M(e.date)}
      </small>
      <div class="content">
        <p>${Q(e.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${e.likedByUser?"liked":""}" data-slug="${e.slug}">
            <i class="${e.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${e.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-slug="${e.slug}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${e.commentsCount||0}</span>
          </button>
          <button class="share-btn" data-slug="${e.slug}">
            <i class="fa-solid fa-share"></i>
            <span class="share-count">${e.shares}</span>
          </button>
          <span class="bookmark ${e.savedByUser?"saved":""}" data-saved="${e.savedByUser?"true":"false"}" data-slug="${e.slug}">
            <i class="${e.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${e.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${e.slug}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${e.slug}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${i?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const d=l.querySelector(".post-image");d&&(d.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=l?.querySelector(".like-btn"),q=g?.querySelector("i"),y=l?.querySelector(".liked-by");y.dataset.slug=e.slug,y.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?y.classList.remove("disabled"):y.classList.add("disabled");const S=Array.isArray(e.likes)?e.likes.map(f=>typeof f=="object"?f._id:f):[];t&&(S.includes(t)||e.likedByUser)?(g.classList.add("liked"),q.className="fa-solid fa-heart"):(g.classList.remove("liked"),q.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?y.textContent="No likes yet":e.likedBy.length===1?y.textContent=`Liked by ${e.likedBy[0]}`:y.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const F=l.querySelector(".comment-count");se(e.slug,F);const p=document.querySelector(".comments-section"),x=p.querySelector(".comments-list");p&&x&&await te(e.slug,x,1/0);const w=l.querySelector(".bookmark");w?.addEventListener("click",async()=>{const f=w.dataset.slug,b=w.dataset.saved==="true";if(!window.currentUser){c("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const ne=b?`/api/posts/${f}/unsave`:`/api/posts/${f}/save`;try{const N=await m(ne,{method:"POST"}),ae=await N.json();if(!N.ok)throw new Error(ae.message||"Failed to toggle bookmark");I(!b),c(b?"Removed from saved posts":"Post saved","success")}catch(N){console.error("Failed to toggle bookmark",N),c("Something went wrong","error")}})}catch(r){console.error(r),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Fe(o)}}const Ze=async()=>{const o=await(await m(`${h}/trending?limit=5`)).json(),r=document.getElementById("trending-list");r.innerHTML=o.map((e,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function qe(s){const o=document.getElementById("related-posts-container");if(!s.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=s.map(r=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${r.slug}">${r.title}</a></h4>
        <small>${r.category}</small>
      </article>
    `).join("")}const Fe=async s=>{try{const r=await(await m(`${h}/slug/${s}/related`)).json();qe(r)}catch(o){console.error("Failed to fetch related posts.",o)}},xe=document.getElementById("savedPostsContainer");async function Ne(s=1,o=6){try{const r=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",s),e.append("limit",o),r.forEach(i=>{if(i){const l=i.value.trim();l&&e.append("search",l)}});const t=await m(`${h}/saved/me?${e.toString()}`);if(!t.ok)throw new Error("Failed to fetch");const a=await t.json();v.saved=Array.isArray(a.posts)?a.posts:[],u=a.currentPage||1,$=a.totalPages||1,K(u),sessionStorage.setItem("postsPage",u);const n=xe;if(!n)return;if(v.saved.length===0){n.innerHTML="<p>You have no saved posts yet.</p>";return}n.innerHTML=v.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${Y(i.image)}" 
            alt="${i.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${i.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${i.slug}'">
          <h2>${i.title}</h2>
          <p class="tag">${i.category}</p>
          <p class="excerpt">
            ${i.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${i.authorId?.name||"Unknown"}</small>
            <small title="${new Date(i.date).toLocaleString()}">${M(i.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${i.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async l=>{l.stopPropagation();const d=i.dataset.slug;try{await m(`${h}/${d}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),c("Removed from saved posts","success")}catch(g){console.error(g),c("Failed to remove","error")}})}),G("savedPostsContainer",u,$)}catch(r){console.error(r),container.innerHTML="<p>Error loading saved posts.</p>"}}function je(){document.getElementById("allPostsContainer")&&C("allPostsContainer"),document.getElementById("featuredPostsContainer")&&C("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&C("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{sessionStorage.setItem("postsPage",1),J(1)});Ae.forEach(s=>s?.addEventListener("keyup",()=>{sessionStorage.setItem("postsPage",1),J(1)}));function G(s,o,r){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let t=1;t<=r;t++){const a=document.createElement("button");a.textContent=t,a.className=t===o?"pg-active":"",a?.addEventListener("click",()=>{s==="myPostsContainer"?oe(t):s==="savedPostsContainer"?Ne(t):J(t)}),e.appendChild(a)}}}export{ee as A,m as a,V as b,ce as c,Ke as d,Qe as e,u as f,Ve as g,ze as h,Ye as i,_e as j,Re as k,He as l,de as m,We as n,De as o,Oe as p,Ge as q,je as r,c as s,Je as t,T as u,J as v,Ze as w,oe as x,Xe as y,Ne as z};
