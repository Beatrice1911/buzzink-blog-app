(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const y="/api/posts",F="/api/auth",J="/api/comments",ce="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",de=document.body,ue=document.querySelectorAll(".user-icon"),w=document.getElementById("userMenuDetails"),H=document.getElementById("authModal"),Se=document.getElementById("closeModal"),M=document.getElementById("loginTab"),U=document.getElementById("registerTab"),$e=document.querySelectorAll(".write-post"),Ie=document.querySelector(".search-icon"),G=document.getElementById("mobileSearch"),fe=document.querySelector(".menu-toggle"),O=document.getElementById("mobileMenu"),q=document.querySelector(".logo"),Pe=document.querySelector(".all-posts-btn"),Be=document.getElementById("myPosts"),Ce=document.getElementById("savedPosts"),Te=document.getElementById("profile-edit"),Me=document.getElementById("settings"),R=document.getElementById("themeToggle"),_=document.documentElement;function u(s,a="info",r=5e3){const t=document.getElementById("toast-container");if(!t)return;const o=document.createElement("div");o.className=`toast toast-${a}`;const n=document.createElement("i");a==="success"?n.className="fas fa-check-circle":a==="error"?n.className="fas fa-exclamation-circle":n.className="fas fa-info-circle",o.appendChild(n);const i=document.createElement("span");i.textContent=s,o.appendChild(i),t.appendChild(o),setTimeout(()=>{o.style.animation="slideOut 0.5s forwards",o?.addEventListener("animationend",()=>o.remove())},r)}function Ue(){fe?.addEventListener("click",s=>{s.stopPropagation(),w.classList.contains("show")&&w.classList.remove("show"),O.classList.toggle("active")})}function qe(){q?.addEventListener("click",()=>{window.location.href="index.html"}),Pe?.addEventListener("click",()=>{window.location.href="all-posts.html"}),Be?.addEventListener("click",()=>{window.location.href="my-posts.html"}),Te?.addEventListener("click",()=>{window.location.href="dashboard.html"}),Ce?.addEventListener("click",()=>{window.location.href="saved.html"}),Me?.addEventListener("click",()=>{window.location.href="settings.html"})}function Fe(){M?.addEventListener("click",()=>{$.classList.remove("hidden"),I.classList.add("hidden"),M.classList.add("active"),U.classList.remove("active")}),U?.addEventListener("click",()=>{I.classList.remove("hidden"),$.classList.add("hidden"),U.classList.add("active"),M.classList.remove("active")}),Se?.addEventListener("click",()=>{H.classList.add("hidden")})}function Ae(){Ie?.addEventListener("click",()=>{G.classList.toggle("show"),G.classList.contains("show")&&G?.querySelector("input").focus()})}function xe(){$e.forEach(s=>{s?.addEventListener("click",a=>{const r=localStorage.getItem("user"),t=r?JSON.parse(r):null;!t||!t.id?(a.preventDefault(),H.classList.remove("hidden"),M.classList.add("active"),U.classList.remove("active"),$.classList.remove("hidden"),I.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Ne(){R?.addEventListener("change",()=>{R.checked?(_.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),q.src="/Images/logo-dark-theme_optimized_.png"):(_.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),q.src="/Images/logo_optimized.png")})}function De(){localStorage.getItem("theme")==="dark"?(_.setAttribute("data-theme","dark"),R&&(R.checked=!0)):_.setAttribute("data-theme","light")}function he(s){s==="dark"?(de.classList.add("dark"),q.src="/Images/logo-dark-theme_optimized_.png"):(de.classList.remove("dark"),q.src="/Images/logo_optimized.png"),localStorage.setItem("theme",s)}function pe(){Ue(),Fe(),Ae(),xe(),qe(),Ne()}let je,Z;function D(s="allPostsContainer",a=6){clearTimeout(je);const r=document.getElementById(s);if(!r)return;let t=r.previousElementSibling?.classList.contains("skeleton-wrapper")?r.previousElementSibling:null;t||(t=document.createElement("div"),t.className="skeleton-wrapper",r.before(t)),t.innerHTML="",t.classList.remove("hidden");for(let o=0;o<a;o++){let n="";s==="savedPostsContainer"?n=`
        <article class="post-card skeleton">
          <div class="skeleton-img"></div>
          <div class="post-body">
            <div class="skeleton-title"></div>
            <div class="skeleton-tag"></div>
            <div class="skeleton-excerpt"></div>
            <div class="post-meta">
              <div class="skeleton-meta-line"></div>
            </div>
          </div>
          <div class="skeleton-bookmark"></div>
        </article>
      `:n=`
        <div class="post skeleton">
          <div class="skeleton-img"></div>
          <p class="skeleton-tag"></p>
          <h2 class="skeleton-title"></h2>
          <p class="skeleton-excerpt"></p>
          <a href="#" class="skeleton-author"></a>
          <small class="skeleton-date"></small>
          <div class="post-interactions-container">
            <div class="post-interactions">
              <button class="skeleton-btn like-btn"></button>
              <button class="skeleton-btn comment-btn"></button>
              <button class="skeleton-btn share-btn"></button>
            </div>
            <span class="liked-by likes-info skeleton"></span>
          </div>
          <div class="comments-section skeleton"></div>
          <div class="post-actions skeleton"></div>
        </div>
      `,t.insertAdjacentHTML("beforeend",n)}}function V(){const s=document.querySelector(".posts-container");document.querySelectorAll(".skeleton-wrapper").forEach(a=>{a.classList.add("hide"),setTimeout(()=>a.remove(),s.classList.add("show"),300)})}function te(){clearTimeout(Z),Z=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function se(){clearTimeout(Z),document.getElementById("postsLoader")?.classList.add("hidden")}const $=document.getElementById("loginForm"),I=document.getElementById("registerForm"),Oe=document.getElementById("logoutBtn");function Y(s){return s?{...s,id:s.id||s._id}:null}window.currentUser=(()=>{const s=localStorage.getItem("user");return s?Y(JSON.parse(s)):null})();function C(s){s?.id?ue.forEach(a=>a.title=`Logged in as ${s.name}`):(ue.forEach(a=>a.title="Click to Login/Register"),w?.classList.remove("show"))}async function W(s){try{const a=await m("/api/users/me");if(!a.ok)return;s=await a.json();const r=document.querySelectorAll(".user-icon");r&&r.forEach(o=>{o.src=s.profilePhoto?.trim()?s.profilePhoto:ce});const t=document.querySelectorAll(".avatar");t&&t.forEach(o=>{o.src=s.profilePhoto?.trim()?s.profilePhoto:ce}),window.currentUser=s}catch(a){console.warn("Failed to load auth user:",a)}}function He(){$?.addEventListener("submit",async s=>{s.preventDefault();const a=document.getElementById("loginEmail").value,r=document.getElementById("loginPassword").value;console.log("Login Triggered");const t=await m(`${F}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:r})}),o=await t.json();console.log("Login response:",o),t.ok||u(`Login failed: ${o.message||"Unknown error"}`,"error");const n=Y(o.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),n.role==="admin"&&(window.location.href="admin.html"),C(n),W(n),authModal.classList.add("hidden"),$.reset(),u(`Welcome back, ${n.name}!`,"success"),Q()})}function Re(){I?.addEventListener("submit",async s=>{s.preventDefault();const a=document.getElementById("registerName").value,r=document.getElementById("registerEmail").value,t=document.getElementById("registerPassword").value,o=await m(`${F}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,email:r,password:t})}),n=await o.json();console.log("Register response:",n),o.ok||u(`Registration failed: ${n.message||"Unknown error"}`,"error");const i=Y(n.user);localStorage.setItem("user",JSON.stringify(i)),window.currentUser=i,localStorage.setItem("role",i.role),C(i),W(i),authModal.classList.add("hidden"),I.reset(),u(`Welcome, ${i.name}! Your account has been created.`,"success"),Q()})}function _e(){Oe?.addEventListener("click",()=>{ye(),window.location.href="index.html"})}async function We(){try{const s=await m(`${F}/me`);if(!s.ok)throw new Error("Not authenticated");const a=await s.json(),r=Y(a);return localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,C(r),W(r),r}catch{return C(null),W(null),null}}async function ye(s=!1){try{await fetch(`${F}/logout`,{method:"POST",credentials:"include"})}catch(a){console.warn("Logout request failed:",a)}localStorage.removeItem("user"),window.currentUser=null,C(null),s||u("You have been logged out.","info")}function ze(){const s=document.getElementById("forgotPasswordLink"),a=document.getElementById("forgotPasswordModal"),r=document.getElementById("closeForgotModal"),t=document.getElementById("forgotPasswordForm");s&&s?.addEventListener("click",o=>{o.preventDefault(),a.classList.remove("hidden")}),r&&r?.addEventListener("click",()=>{a.classList.add("hidden")}),t&&t?.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("forgotEmail").value.trim();try{const l=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n})})).json();u(l.message||"Check your email for the reset link.","success"),a.classList.add("hidden")}catch(i){console.error(i),u("Failed to send reset link. Try again.","error")}})}function Je(){He(),Re(),_e(),ze()}async function m(s,a={}){let r=await fetch(s,{credentials:"include",...a});return r.status===401&&(await Ve()?r=await fetch(s,{credentials:"include",...a}):ye(!0)),r}async function Ve(){try{const s=await fetch(`${F}/refresh`,{method:"POST",credentials:"include"});if(!s.ok)throw new Error("Refresh failed");const a=await s.json();return window.currentUser=a.user,C(a.user),!0}catch{return!1}}async function Ye(s){const a=s.dataset.slug;if(!a)return;const r=window.location.pathname.endsWith("post.html"),t=r?document.getElementById("singlePostContainer"):s.closest(".post");if(!t)return;const o=t.querySelector(".comments-section"),n=o?.querySelector(".comments-list");!o||!n||(r||o.classList.toggle("show"),(r||o.classList.contains("show"))&&await ve(a,n))}async function Ke(s){if(s.dataset.deleting==="true")return;s.dataset.deleting="true";const a=s.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){s.dataset.deleting="false";return}try{const t=await m(`${J}/${a}`,{method:"DELETE"}),o=await t.json();if(t.ok){const n=s.closest(".comment");n&&n.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):s.closest(".post"))?.querySelector(".comment-count");if(l){let c=parseInt(l.textContent)||0;c=Math.max(c-1,0),l.textContent=c,l.title=`${c} comment${c!==1?"s":""}`}u("Comment deleted successfully!","success")}else throw new Error(o.message||"Delete failed")}catch(t){console.error("Error deleting comment:",t),u("Error deleting comment. Please try again.","error")}finally{s.dataset.deleting="false"}}async function ve(s,a,r=3){try{a.innerHTML='<p class="loading-comments">Loading comments...</p>';const t=await m(`${J}/post/${s}?_=${Date.now()}`);if(!t.ok)throw new Error("Failed to fetch comments");const o=await t.json();if(a.innerHTML="",o.length===0){a.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const n=o.slice(0,r);if(X(n,a),o.length>r){const i=document.createElement("button");i.classList.add("view-more-btn"),i.textContent=`View all ${o.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",X(o,l);let c=!1;i?.addEventListener("click",()=>{c=!c,c?(a.innerHTML="",a.appendChild(l),a.appendChild(i),l.style.display="block",i.textContent="View less comments"):(a.innerHTML="",X(n,a),i.textContent=`View all ${o.length} comments`,a.appendChild(i))}),a.appendChild(i)}}catch(t){console.error("Error fetching comments:",t),a.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function X(s,a){const r=window.currentUser?.id||window.currentUser?._id;s.forEach(t=>{const o=document.createElement("div");o.classList.add("comment");const n=typeof t.authorId=="object"?t.authorId._id:t.authorId,i=r&&n&&n.toString()===r.toString();o.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${t.authorId?.name||"Anonymous"}:</strong> ${re(t.text)}</p>
        ${i?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${t._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(t.createdAt).toLocaleString()}">
        ${A(t.createdAt)}
      </small>
    `,a.appendChild(o),o.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${t.authorId?._id}`})})}async function Qe(s,a,r,t){try{const o=await m(`${J}/post/${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:a})});if(o.ok){const i=(await o.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${re(i.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${i._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(i.createdAt).toLocaleString()}">
        ${A(i.createdAt)}
      </small>
      `,r.prepend(l),t&&t){let c=parseInt(t.textContent)||0;t.textContent=c+1,t.title=`${c+1} comments`}u("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(o){console.error("Error posting comment:",o),u("Failed to post comment","error")}}async function we(s,a){try{const r=await m(`${J}/post/${s}`);if(!r.ok)throw new Error("Failed to fetch comment count");const o=(await r.json()).length;o===0?(a.textContent="0",a.title="No comments yet"):(a.textContent=o,a.title=`${o} comment${o>1?"s":""}`)}catch(r){console.error("Error fetching comment count:",r),a.textContent="0"}}async function Ge(s){const a=s.target.closest(".comment-form");if(!a)return;const r=a.querySelector(".comment-form button");s.preventDefault();const t=a.querySelector(".comment-input"),o=t.value.trim();if(!o)return;let n,i,l,c;window.location.pathname.endsWith("post.html")?(n=document.getElementById("singlePostContainer"),i=n.querySelector(".comments-list"),l=n.querySelector(".comment-btn").dataset.slug,c=n.querySelector(".comment-count")):(n=a.closest(".post"),i=n.querySelector(".comments-list"),l=n.querySelector(".like-btn").dataset.slug,c=n.querySelector(".comment-count"));const d=h=>{r.disabled=h,r.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(d(!0),!window.currentUser){u("Please log in to comment.","error"),t.value="",d(!1);return}await Qe(l,o,i,c),t.value=""}catch{d(!1)}finally{d(!1)}}function Xe(){document.addEventListener("submit",Ge)}const oe=document.querySelectorAll(".search");function K(){return[...oe].find(s=>s.value.trim())?.value.trim()||""}let p={all:[],featured:[],mine:[],saved:[]},S=1;function ne(s){return s&&s.startsWith("http")?s:"/Images/fallback.jpg"}function L(){const s=new URLSearchParams(window.location.search);return{page:Number(s.get("page"))||1,category:s.get("category")||"",search:s.get("search")||""}}function P({page:s,category:a,search:r},{replace:t=!1}={}){const o=new URL(window.location);s===1?o.searchParams.delete("page"):o.searchParams.set("page",s),a?o.searchParams.set("category",a):o.searchParams.delete("category"),r?o.searchParams.set("search",r):o.searchParams.delete("search"),t?history.replaceState({page:s,category:a,search:r},"",o):history.pushState({page:s,category:a,search:r},"",o)}function j(){const{category:s,search:a}=L(),r=document.getElementById("categoryFilter");r&&(r.value=s||"all"),oe.forEach(t=>{t.value=a||""})}async function T(s,a=6){try{const r=L(),t=s??r.page,o=document.getElementById("categoryFilter")?.value||r.category,n=K()||r.search;P({page:t,category:o!=="all"?o:"",search:n},{replace:!0});const i=new URLSearchParams({page:t,limit:a});o&&o!=="all"&&i.append("category",o),n&&i.append("search",n),t!==1&&te();const c=await(await m(`${y}?${i.toString()}`)).json();p.all=Array.isArray(c.posts)?c.posts:[],S=c.totalPages??1,ie("allPostsContainer"),z("allPostsContainer",t,S)}catch(r){console.error("Error fetching posts:",r),u("Something went wrong while displaying posts!","error")}finally{V(),se()}}async function ke(s=3){try{const a=L(),r=K()||a.search;P({search:r},{replace:!0});const t=new URLSearchParams({limit:s});r&&t.append("search",r);const n=await(await m(`${y}?${t.toString()}`)).json();p.featured=Array.isArray(n.posts)?n.posts:[],ie("featuredPostsContainer",s)}catch(a){console.error("Failed to load featured posts",a)}finally{V()}}async function ae(s,a=6){try{const r=L(),t=s??r.page,o=K()||r.search;P({page:t,search:o},{replace:!0});const n=new URLSearchParams({page:t,limit:a});o&&n.append("search",o),t!==1&&te();const i=await m(`${y}/mine?${n.toString()}`);if(!i.ok){const c=await i.text();throw new Error(c||"Failed to fetch your posts")}const l=await i.json();p.mine=Array.isArray(l.posts)?l.posts:[],S=l.totalPages||1,ie("myPostsContainer"),z("myPostsContainer",t,S)}catch(r){console.error("Error fetching my posts:",r),u("Failed to load your posts!","error")}finally{V(),se()}}function A(s){const a=Math.floor((Date.now()-new Date(s))/1e3),r=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],t=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const o of r){const n=Math.floor(a/o.seconds);if(n>=1)return t.format(-n,o.label)}return"Just now"}function re(s){const a=document.createElement("div");return a.textContent=s,a.innerHTML.replace(/\n/g,"<br>")}function ie(s,a=null){const r=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(s);if(!t)return;t.innerHTML="";let o=[];if(s==="allPostsContainer"?o=[...p.all]:s==="featuredPostsContainer"?o=[...p.featured]:s==="myPostsContainer"?o=[...p.mine]:s==="savedPostsContainer"&&(o=[...p.saved]),a&&(o=o.slice(0,a)),o.length===0){s==="myPostsContainer"?t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:t.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}o.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const l=n.content.length>150?n.content.substring(0,150)+"...":n.content,c=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,d=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",h=r&&String(c)===String(r);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${ne(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${c}" class="author"><em>By ${d}</em></a>
        <small title="${new Date(n.date).toLocaleString()}">
          ${A(n.date)}
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
        ${h?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(i);const v=i.querySelector(".post-image");v&&(v.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=i.querySelector(".like-btn"),b=g.querySelector("i"),f=i.querySelector(".liked-by");f.dataset.slug=n.slug,f.dataset.likedBy=JSON.stringify(n.likedBy||[]),g.classList.toggle("liked",n.likedByUser),b.className=n.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",n.likesCount?(f.textContent=n.likesCount===1?`Liked by ${n.likedBy[0]}`:`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`,f.classList.remove("disabled")):(f.textContent="No likes yet",f.classList.add("disabled"));const x=i.querySelector(".comment-count");we(n.slug,x)})}async function Ze(s,a,r,t){const o=new FormData;o.append("title",s),o.append("content",a),o.append("category",r),t&&o.append("image",t);const n=await m(`${y}`,{method:"POST",body:o});if(!n.ok)throw new Error("Failed to add post");return await n.json()}async function et(s){if(confirm("Are you sure you want to delete this post?"))try{const a=await m(`${y}/${s}`,{method:"DELETE"});if(!a.ok){const t=await a.text();throw new Error(t||"Failed to delete post")}u("Post deleted successfully!","success");const{page:r}=L();window.location.pathname.endsWith("my-posts.html")?ae(r):T(r)}catch(a){console.error("Error deleting post:",a),u("Failed to delete post!","error")}}function tt(s){s&&(localStorage.setItem("editSlug",s),window.location.href="write.html")}function st(){const s=document.getElementById("postForm"),a=document.querySelector(".add-post-btn");if(!s)return;const r=localStorage.getItem("editSlug"),t=o=>{a.disabled=o,a.innerHTML=o?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':r?"Update Post":"Add Post"};r&&r!=="null"?((async()=>{try{const o=await m(`${y}/${r}`);if(!o.ok)throw new Error("Post not found");const n=await o.json();if(document.getElementById("title").value=n.title||"",document.getElementById("content").value=n.content||"",document.getElementById("category").value=n.category||"",n.image){const i=document.getElementById("imagePreview");i.src=n.image,i.style.display="block"}}catch(o){console.error("Error loading post:",o)}})(),s.onsubmit=async function(o){o.preventDefault();const n=new FormData;n.append("title",document.getElementById("title").value),n.append("content",document.getElementById("content").value),n.append("category",document.getElementById("category").value);const i=document.getElementById("image").files[0];i&&n.append("image",i);try{t(!0);const l=await m(`${y}/${r}`,{method:"PUT",body:n});l.ok?(u("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),u("Failed to update post!","error")}finally{t(!1)}}):(localStorage.removeItem("editSlug"),s?.addEventListener("submit",async function(o){o.preventDefault();const n=document.getElementById("title").value,i=document.getElementById("content").value,l=document.getElementById("category").value,c=document.getElementById("image").files[0];console.log("Submitting new post:",{title:n,content:i,category:l,imageFile:c});try{t(!0);const d=await Ze(n,i,l,c);console.log("Post created successfully!",d),u("Post created successfully!","success"),s.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(d){console.error("Error adding post:",d),u("Failed to add post!","error")}finally{t(!1)}}))}async function me(){const a=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(a&&m(`/api/posts/${a}/view`,{method:"POST"}).catch(r=>{console.error("Failed to increment view",r)}),!!a){try{let Le=function(E){k.dataset.saved=E?"true":"false",k.classList.toggle("saved",E);const B=k.querySelector("i");B.classList.toggle("fa-solid",E),B.classList.toggle("fa-regular",!E)};const r=await m(`${y}/${a}`);if(!r.ok)throw new Error("Failed to fetch post");const t=await r.json(),o=window.currentUser?._id||window.currentUser?.id,n=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,i=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",l=o&&String(n)===String(o),c=document.getElementById("singlePostContainer");c.innerHTML=`
      ${t.image?`<img src="${ne(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${n}'" style="cursor: pointer;" class="author"><em>By ${i}</em></p>
      <small title="${new Date(t.date).toLocaleString()}">
        ${A(t.date)}
      </small>
      <div class="content">
        <p>${re(t.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${t.likedByUser?"liked":""}" data-slug="${t.slug}">
            <i class="${t.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${t.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-slug="${t.slug}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${t.commentsCount||0}</span>
          </button>
          <button class="share-btn" data-slug="${t.slug}">
            <i class="fa-solid fa-share"></i>
            <span class="share-count">${t.shares}</span>
          </button>
          <span class="bookmark ${t.savedByUser?"saved":""}" data-saved="${t.savedByUser?"true":"false"}" data-slug="${t.slug}">
            <i class="${t.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${t.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <h3>Liked by</h3>
          <ul id="likesList-${t.slug}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${l?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
      </div>`:""}
    `;const d=c.querySelector(".post-image");d&&(d.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=c?.querySelector(".like-btn"),v=h?.querySelector("i"),g=c?.querySelector(".liked-by");g.dataset.slug=t.slug,g.dataset.likedBy=JSON.stringify(t.likedBy||[]),h.classList.toggle("liked",t.likedByUser),v.className=t.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",t.likesCount?(g.textContent=t.likesCount===1?`Liked by ${t.likedBy[0]}`:`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`,g.classList.remove("disabled")):(g.textContent="No likes yet",g.classList.add("disabled"));const b=c.querySelector(".comment-count");we(t.slug,b);const f=document.querySelector(".comments-section"),x=f.querySelector(".comments-list");f&&x&&await ve(t.slug,x,1/0);const k=c.querySelector(".bookmark");k?.addEventListener("click",async()=>{const E=k.dataset.slug,B=k.dataset.saved==="true";if(!window.currentUser){u("Please log in to save posts");return}k.classList.add("clicked"),setTimeout(()=>k.classList.remove("clicked"),200);const be=B?`/api/posts/${E}/unsave`:`/api/posts/${E}/save`;try{const N=await m(be,{method:"POST"}),Ee=await N.json();if(!N.ok)throw new Error(Ee.message||"Failed to toggle bookmark");Le(!B),u(B?"Removed from saved posts":"Post saved","success")}catch(N){console.error("Failed to toggle bookmark",N),u("Something went wrong","error")}})}catch(r){console.error(r),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}at(a)}}const ot=async()=>{const a=await(await m(`${y}/trending?limit=5`)).json(),r=document.getElementById("trending-list");r.innerHTML=a.map((t,o)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][o]||`#${o+1}`}</span>
      <a href="post.html?slug=${t.slug}" class="trending-title">${t.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function nt(s){const a=document.getElementById("related-posts-container");if(!s.length){a.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}a.innerHTML=s.map(r=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${r.slug}">${r.title}</a></h4>
        <small>${r.category}</small>
      </article>
    `).join("")}const at=async s=>{try{const r=await(await m(`${y}/slug/${s}/related`)).json();nt(r)}catch(a){console.error("Failed to fetch related posts.",a)}},rt=document.getElementById("savedPostsContainer");async function le(s,a=6){const r=rt;try{const t=L(),o=s??t.page,n=K()||t.search;P({page:o,search:n},{replace:!0});const i=new URLSearchParams({page:o,limit:a});n&&i.append("search",n),o!==1&&te();const l=await m(`${y}/saved/me?${i.toString()}`);if(!l.ok)throw new Error("Failed to fetch");const c=await l.json();if(p.saved=Array.isArray(c.posts)?c.posts:[],S=c.totalPages||1,!r)return;if(p.saved.length===0){r.innerHTML="<p>You have no saved posts yet.</p>";return}r.innerHTML=p.saved.map(d=>`
      <article class="post-card">
        ${d.image?`
          <img 
            src="${ne(d.image)}" 
            alt="${d.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${d.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${d.slug}'">
          <h2>${d.title}</h2>
          <p class="tag">${d.category}</p>
          <p class="excerpt">
            ${d.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${d.authorId?.name||"Unknown"}</small>
            <small title="${new Date(d.date).toLocaleString()}">${A(d.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${d.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(d=>{d?.addEventListener("click",async h=>{h.stopPropagation();const v=d.dataset.slug;try{await m(`${y}/${v}/unsave`,{method:"POST"}),p.saved=p.saved.filter(b=>b.slug!==v),d.closest(".post-card").remove(),u("Removed from saved posts","success");const{page:g}=L();p.saved.length===0&&g>1?le(g-1):z("savedPostsContainer",g,S)}catch(g){console.error(g),u("Failed to remove","error")}})}),z("savedPostsContainer",o,S)}catch(t){console.error(t),r.innerHTML="<p>Error loading saved posts.</p>"}finally{V(),se()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{P({page:1}),T(1)});let ge;oe.forEach(s=>s?.addEventListener("keyup",()=>{clearTimeout(ge),ge=setTimeout(()=>{P({page:1}),ke(),T(1),ae(1),le(1)},400)}));function z(s,a,r){const t=document.getElementById("pagination");if(t){t.innerHTML="";for(let o=1;o<=r;o++){const n=document.createElement("button");n.textContent=o,n.className=o===a?"pg-active":"",n?.addEventListener("click",async()=>{P({page:o}),T(o)}),t.appendChild(n)}}}async function it(s){const a=s.dataset.slug,r=s.querySelector("i"),t=s.querySelector(".like-count"),o=s.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){u("Please log in to like or unlike posts.","error");return}const n=s.classList.contains("liked");try{const i=await m(`/api/posts/${a}/${n?"unlike":"like"}`,{method:"POST"}),l=await i.json();if(i.ok){s.classList.toggle("liked",!n),r.className=n?"fa-regular fa-heart":"fa-solid fa-heart";const c=l.likesCount??l.likes??0;t.textContent=c,o&&(c?(o.textContent=c===1?"1 like":`${c} likes`,o.classList.remove("disabled")):(o.textContent="No likes yet",o.classList.add("disabled")),Array.isArray(l.likedBy)&&(o.dataset.slug=a,o.dataset.likedBy=JSON.stringify(l.likedBy)))}else u(`Failed to update likes: ${l.message}`,"error")}catch(i){console.error("Like action failed:",i),u("Error updating like. Please try again.","error")}}const lt=async s=>{const a=s.dataset.slug,r=`${window.location.origin}/post/${a}`,t=`shared_${a}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:r}):(await navigator.clipboard.writeText(r),u("Link copied to clipboard!","success")),sessionStorage.getItem(t)||(sessionStorage.setItem(t,"true"),m(`/api/posts/${a}/share`,{method:"POST"}).catch(()=>{}));const o=s.querySelector(".share-count");o&&(o.textContent=Number(o.textContent)+1)}catch(o){u("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",o)}};let ee=!1;async function ct(s){if(ee)return;const a=encodeURIComponent(s),r=document.getElementById(`likesModal-${a}`),t=document.getElementById(`likesList-${a}`);if(!(!r||!t)&&!r.classList.contains("active")){ee=!0,r.classList.remove("hidden"),requestAnimationFrame(()=>r.classList.add("active")),t.innerHTML="<li>Loading...</li>";try{const n=await(await m(`/api/posts/${s}/likes`)).json();if(t.innerHTML="",!Array.isArray(n.users)||n.users.length===0){t.innerHTML="<li>No likes yet</li>";return}n.users.forEach(i=>{const l=document.createElement("li");l.textContent=i,t.appendChild(l)})}catch(o){t.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",o)}}}function dt(s){const a=encodeURIComponent(s),r=document.getElementById(`likesModal-${a}`);r&&(ee=!1,r.classList.remove("active"),setTimeout(()=>{r.classList.add("hidden")},300))}function ut(){if(document.addEventListener("click",async t=>{const o=t.target.closest(".edit-btn");if(o){t.preventDefault(),t.stopPropagation(),tt(o.dataset.slug);return}const n=t.target.closest(".delete-btn");if(n){t.preventDefault(),t.stopPropagation(),et(n.dataset.slug);return}const i=t.target.closest(".like-btn");if(i){t.preventDefault(),it(i);return}const l=t.target.closest(".comment-btn");if(l){t.preventDefault(),Ye(l);return}const c=t.target.closest(".share-btn");if(c){t.preventDefault(),lt(c);return}const d=t.target.closest(".likes-info");if(d&&!d.classList.contains("disabled")){t.preventDefault(),t.stopPropagation();const f=d.dataset.slug;if(!f)return;ct(f);return}const h=document.querySelector(".likes-modal.active");if(h&&!h.contains(t.target)){const f=h.id.replace("likesModal-","");dt(f)}const v=t.target.closest(".delete-comment-btn");v&&(t.preventDefault(),t.stopPropagation(),Ke(v));const g=t.target.closest(".menu-btn"),b=t.target.closest(".menu-options");!g&&!b&&document.querySelectorAll(".menu-options").forEach(f=>f.classList.add("hidden")),g&&g.nextElementSibling.classList.toggle("hidden"),w?.classList.contains("show")&&!w.contains(t.target)&&!t.target.closest(".user-icon")&&w.classList.remove("show"),O?.classList.contains("active")&&!O.contains(t.target)&&!fe.contains(t.target)&&O.classList.remove("active")}),!e.target.closest(".user-icon"))return;e.stopPropagation();const a=localStorage.getItem("user"),r=a?JSON.parse(a):null;r&&r.id?(w.classList.toggle("show"),w?.addEventListener("click",t=>t.stopPropagation()),H.classList.add("hidden")):(w.classList.add("hidden"),H.classList.remove("hidden"),M.classList.add("active"),U.classList.remove("active"),$.classList.remove("hidden"),I.classList.add("hidden"),$?.reset(),I?.reset())}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function mt(){const s=`scroll:${window.location.pathname}${window.location.search}`,a=sessionStorage.getItem(s);a!==null&&(window.scrollTo(0,Number(a)),sessionStorage.removeItem(s))}async function Q(){const s=window.location.pathname,{page:a}=L();s==="/"||s.endsWith("index.html")?(j(),D("featuredPostsContainer",3),await ke(),await T(a),await ot()):s.endsWith("my-posts.html")?(j(),D("myPostsContainer",6),await ae(a)):s.endsWith("post.html")?await me():s.endsWith("saved.html")?(j(),D("savedPostsContainer",6),await le(a)):s.startsWith("/post/")?me():(j(),D(),await T(a)),mt()}document.addEventListener("DOMContentLoaded",async()=>{const s=await We();window.currentUser=s,Je(),pe(),ut(),Xe(),De();const a=localStorage.getItem("theme")||"light";he(a),await Q(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),st()});window.addEventListener("pageshow",s=>{if(s.persisted){const a=localStorage.getItem("theme")||"light";he(a),pe()}});window.addEventListener("popstate",()=>{Q()});export{m as a,ye as l,u as s};
