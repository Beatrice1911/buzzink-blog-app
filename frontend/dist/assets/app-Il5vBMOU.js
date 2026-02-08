(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const p="/api/posts",T="/api/auth",W="/api/comments",ie="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",le=document.body,ce=document.querySelectorAll(".user-icon"),k=document.getElementById("userMenuDetails"),me=document.getElementById("authModal"),Ee=document.getElementById("closeModal"),N=document.getElementById("loginTab"),D=document.getElementById("registerTab"),Se=document.querySelectorAll(".write-post"),$e=document.querySelector(".search-icon"),K=document.getElementById("mobileSearch"),ge=document.querySelector(".menu-toggle"),j=document.getElementById("mobileMenu"),P=document.querySelector(".logo"),Ie=document.querySelector(".all-posts-btn"),Pe=document.getElementById("myPosts"),Be=document.getElementById("savedPosts"),Ce=document.getElementById("profile-edit"),Te=document.getElementById("settings"),O=document.getElementById("themeToggle"),H=document.documentElement;function d(e,n="info",a=5e3){const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className=`toast toast-${n}`;const o=document.createElement("i");n==="success"?o.className="fas fa-check-circle":n==="error"?o.className="fas fa-exclamation-circle":o.className="fas fa-info-circle",s.appendChild(o);const r=document.createElement("span");r.textContent=e,s.appendChild(r),t.appendChild(s),setTimeout(()=>{s.style.animation="slideOut 0.5s forwards",s?.addEventListener("animationend",()=>s.remove())},a)}function Me(){ge?.addEventListener("click",e=>{e.stopPropagation(),k.classList.contains("show")&&k.classList.remove("show"),j.classList.toggle("active")})}function Ue(){P?.addEventListener("click",()=>{window.location.href="index.html"}),Ie?.addEventListener("click",()=>{window.location.href="all-posts.html"}),Pe?.addEventListener("click",()=>{window.location.href="my-posts.html"}),Ce?.addEventListener("click",()=>{window.location.href="dashboard.html"}),Be?.addEventListener("click",()=>{window.location.href="saved.html"}),Te?.addEventListener("click",()=>{window.location.href="settings.html"})}function Fe(){N?.addEventListener("click",()=>{B.classList.remove("hidden"),C.classList.add("hidden"),N.classList.add("active"),D.classList.remove("active")}),D?.addEventListener("click",()=>{C.classList.remove("hidden"),B.classList.add("hidden"),D.classList.add("active"),N.classList.remove("active")}),Ee?.addEventListener("click",()=>{me.classList.add("hidden")})}function qe(){$e?.addEventListener("click",()=>{K.classList.toggle("show"),K.classList.contains("show")&&K?.querySelector("input").focus()})}function Ae(){Se.forEach(e=>{e?.addEventListener("click",n=>{const a=localStorage.getItem("user"),t=a?JSON.parse(a):null;!t||!t.id?(n.preventDefault(),me.classList.remove("hidden"),N.classList.add("active"),D.classList.remove("active"),B.classList.remove("hidden"),C.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function xe(){O?.addEventListener("change",()=>{O.checked?(H.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),P.src="/Images/logo-dark-theme_optimized_.png"):(H.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),P.src="/Images/logo_optimized.png")})}function Ne(){localStorage.getItem("theme")==="dark"?(H.setAttribute("data-theme","dark"),O&&(O.checked=!0)):H.setAttribute("data-theme","light")}function fe(e){e==="dark"?(le.classList.add("dark"),P.src="/Images/logo-dark-theme_optimized_.png"):(le.classList.remove("dark"),P.src="/Images/logo_optimized.png"),localStorage.setItem("theme",e)}function he(){Me(),Fe(),qe(),Ae(),Ue(),xe()}let De,G;function A(e="allPostsContainer",n=6){clearTimeout(De);const a=document.getElementById(e);if(!a)return;let t=a.previousElementSibling?.classList.contains("skeleton-wrapper")?a.previousElementSibling:null;t||(t=document.createElement("div"),t.className="skeleton-wrapper",a.before(t)),t.innerHTML="",t.classList.remove("hidden");for(let s=0;s<n;s++){let o="";e==="savedPostsContainer"?o=`
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
      `:o=`
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
      `,t.insertAdjacentHTML("beforeend",o)}}function z(){const e=document.querySelector(".posts-container");document.querySelectorAll(".skeleton-wrapper").forEach(n=>{n.classList.add("hide"),setTimeout(()=>n.remove(),e.classList.add("show"),300)})}function Z(){clearTimeout(G),G=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function ee(){clearTimeout(G),document.getElementById("postsLoader")?.classList.add("hidden")}const B=document.getElementById("loginForm"),C=document.getElementById("registerForm"),je=document.getElementById("logoutBtn");function J(e){return e?{...e,id:e.id||e._id}:null}window.currentUser=(()=>{const e=localStorage.getItem("user");return e?J(JSON.parse(e)):null})();function I(e){e?.id?ce.forEach(n=>n.title=`Logged in as ${e.name}`):(ce.forEach(n=>n.title="Click to Login/Register"),k?.classList.remove("show"))}async function R(e){try{const n=await u("/api/users/me");if(!n.ok)return;e=await n.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(s=>{s.src=e.profilePhoto?.trim()?e.profilePhoto:ie});const t=document.querySelectorAll(".avatar");t&&t.forEach(s=>{s.src=e.profilePhoto?.trim()?e.profilePhoto:ie}),window.currentUser=e}catch(n){console.warn("Failed to load auth user:",n)}}function Oe(){B?.addEventListener("submit",async e=>{e.preventDefault();const n=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const t=await u(`${T}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:a})}),s=await t.json();console.log("Login response:",s),t.ok||d(`Login failed: ${s.message||"Unknown error"}`,"error");const o=J(s.user);localStorage.setItem("user",JSON.stringify(o)),window.currentUser=o,localStorage.setItem("role",o.role),o.role==="admin"&&(window.location.href="admin.html"),I(o),R(o),authModal.classList.add("hidden"),B.reset(),d(`Welcome back, ${o.name}!`,"success"),Y()})}function He(){C?.addEventListener("submit",async e=>{e.preventDefault();const n=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,t=document.getElementById("registerPassword").value,s=await u(`${T}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:a,password:t})}),o=await s.json();console.log("Register response:",o),s.ok||d(`Registration failed: ${o.message||"Unknown error"}`,"error");const r=J(o.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),I(r),R(r),authModal.classList.add("hidden"),C.reset(),d(`Welcome, ${r.name}! Your account has been created.`,"success"),Y()})}function Re(){je?.addEventListener("click",()=>{pe(),window.location.href="index.html"})}async function _e(){try{const e=await u(`${T}/me`);if(!e.ok)throw new Error("Not authenticated");const n=await e.json(),a=J(n);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,I(a),R(a),a}catch{return I(null),R(null),null}}async function pe(e=!1){try{await fetch(`${T}/logout`,{method:"POST",credentials:"include"})}catch(n){console.warn("Logout request failed:",n)}localStorage.removeItem("user"),window.currentUser=null,I(null),e||d("You have been logged out.","info")}function We(){const e=document.getElementById("forgotPasswordLink"),n=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),t=document.getElementById("forgotPasswordForm");e&&e?.addEventListener("click",s=>{s.preventDefault(),n.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{n.classList.add("hidden")}),t&&t?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o})})).json();d(i.message||"Check your email for the reset link.","success"),n.classList.add("hidden")}catch(r){console.error(r),d("Failed to send reset link. Try again.","error")}})}function ze(){Oe(),He(),Re(),We()}async function u(e,n={}){let a=await fetch(e,{credentials:"include",...n});return a.status===401&&(await Je()?a=await fetch(e,{credentials:"include",...n}):pe(!0)),a}async function Je(){try{const e=await fetch(`${T}/refresh`,{method:"POST",credentials:"include"});if(!e.ok)throw new Error("Refresh failed");const n=await e.json();return window.currentUser=n.user,I(n.user),!0}catch{return!1}}async function Ve(e){const n=e.dataset.slug;if(!n)return;const a=window.location.pathname.endsWith("post.html"),t=a?document.getElementById("singlePostContainer"):e.closest(".post");if(!t)return;const s=t.querySelector(".comments-section"),o=s?.querySelector(".comments-list");!s||!o||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await ye(n,o))}async function Ye(e){if(e.dataset.deleting==="true")return;e.dataset.deleting="true";const n=e.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){e.dataset.deleting="false";return}try{const t=await u(`${W}/${n}`,{method:"DELETE"}),s=await t.json();if(t.ok){const o=e.closest(".comment");o&&o.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):e.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(t){console.error("Error deleting comment:",t),d("Error deleting comment. Please try again.","error")}finally{e.dataset.deleting="false"}}async function ye(e,n,a=3){try{n.innerHTML='<p class="loading-comments">Loading comments...</p>';const t=await u(`${W}/post/${e}?_=${Date.now()}`);if(!t.ok)throw new Error("Failed to fetch comments");const s=await t.json();if(n.innerHTML="",s.length===0){n.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const o=s.slice(0,a);if(Q(o,n),s.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${s.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",Q(s,i);let l=!1;r?.addEventListener("click",()=>{l=!l,l?(n.innerHTML="",n.appendChild(i),n.appendChild(r),i.style.display="block",r.textContent="View less comments"):(n.innerHTML="",Q(o,n),r.textContent=`View all ${s.length} comments`,n.appendChild(r))}),n.appendChild(r)}}catch(t){console.error("Error fetching comments:",t),n.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function Q(e,n){const a=window.currentUser?.id||window.currentUser?._id;e.forEach(t=>{const s=document.createElement("div");s.classList.add("comment");const o=typeof t.authorId=="object"?t.authorId._id:t.authorId,r=a&&o&&o.toString()===a.toString();s.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${t.authorId?.name||"Anonymous"}:</strong> ${ne(t.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${t._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(t.createdAt).toLocaleString()}">
        ${U(t.createdAt)}
      </small>
    `,n.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${t.authorId?._id}`})})}async function Ke(e,n,a,t){try{const s=await u(`${W}/post/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n})});if(s.ok){const r=(await s.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${ne(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${U(r.createdAt)}
      </small>
      `,a.prepend(i),t&&t){let l=parseInt(t.textContent)||0;t.textContent=l+1,t.title=`${l+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),d("Failed to post comment","error")}}async function we(e,n){try{const a=await u(`${W}/post/${e}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(n.textContent="0",n.title="No comments yet"):(n.textContent=s,n.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),n.textContent="0"}}async function Qe(e){const n=e.target.closest(".comment-form");if(!n)return;const a=n.querySelector("button");if(!a)return;e.preventDefault();const t=n.querySelector(".comment-input"),s=t.value.trim();if(!s)return;let o,r,i,l;window.location.pathname.endsWith("post.html")?(o=document.getElementById("singlePostContainer"),r=o.querySelector(".comments-list"),i=o.querySelector(".comment-btn").dataset.slug,l=o.querySelector(".comment-count")):(o=n.closest(".post"),r=o.querySelector(".comments-list"),i=o.querySelector(".like-btn").dataset.slug,l=o.querySelector(".comment-count"));const c=h=>{a.disabled=h,a.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),t.value="",c(!1);return}await Ke(i,s,r,l),t.value=""}catch{c(!1)}finally{c(!1)}}function Ge(){document.addEventListener("submit",Qe)}const te=document.querySelectorAll(".search");function V(){return[...te].find(e=>e.value.trim())?.value.trim()||""}let f={all:[],featured:[],mine:[],saved:[]},E=1;function se(e){return e&&e.startsWith("http")?e:"/Images/fallback.jpg"}function L(){const e=new URLSearchParams(window.location.search);return{page:Number(e.get("page"))||1,category:e.get("category")||"",search:e.get("search")||""}}function S({page:e,category:n,search:a},{replace:t=!1}={}){const s=new URL(window.location);e===1?s.searchParams.delete("page"):s.searchParams.set("page",e),n?s.searchParams.set("category",n):s.searchParams.delete("category"),a?s.searchParams.set("search",a):s.searchParams.delete("search"),t?history.replaceState({page:e,category:n,search:a},"",s):history.pushState({page:e,category:n,search:a},"",s)}function x(){const{category:e,search:n}=L(),a=document.getElementById("categoryFilter");a&&(a.value=e||"all"),te.forEach(t=>{t.value=n||""})}async function M(e,n=6){try{const a=L(),t=e??a.page,s=document.getElementById("categoryFilter")?.value||a.category,o=V()||a.search;S({page:t,category:s!=="all"?s:"",search:o},{replace:!0});const r=new URLSearchParams({page:t,limit:n});s&&s!=="all"&&r.append("category",s),o&&r.append("search",o),t!==1&&Z();const l=await(await u(`${p}?${r.toString()}`)).json();f.all=Array.isArray(l.posts)?l.posts:[],E=l.totalPages??1,ae("allPostsContainer"),_("allPostsContainer",t,E)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{z(),ee()}}async function ve(e=3){try{const n=L(),a=V()||n.search;S({search:a},{replace:!0});const t=new URLSearchParams({limit:e});a&&t.append("search",a);const o=await(await u(`${p}?${t.toString()}`)).json();f.featured=Array.isArray(o.posts)?o.posts:[],ae("featuredPostsContainer",e)}catch(n){console.error("Failed to load featured posts",n)}finally{z()}}async function oe(e,n=6){try{const a=L(),t=e??a.page,s=V()||a.search;S({page:t,search:s},{replace:!0});const o=new URLSearchParams({page:t,limit:n});s&&o.append("search",s),t!==1&&Z();const r=await u(`${p}/mine?${o.toString()}`);if(!r.ok){const l=await r.text();throw new Error(l||"Failed to fetch your posts")}const i=await r.json();f.mine=Array.isArray(i.posts)?i.posts:[],E=i.totalPages||1,ae("myPostsContainer"),_("myPostsContainer",t,E)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{z(),ee()}}function U(e){const n=Math.floor((Date.now()-new Date(e))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],t=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const o=Math.floor(n/s.seconds);if(o>=1)return t.format(-o,s.label)}return"Just now"}function ne(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML.replace(/\n/g,"<br>")}function ae(e,n=null){const a=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(e);if(!t)return;t.innerHTML="";let s=[];if(e==="allPostsContainer"?s=[...f.all]:e==="featuredPostsContainer"?s=[...f.featured]:e==="myPostsContainer"?s=[...f.mine]:e==="savedPostsContainer"&&(s=[...f.saved]),n&&(s=s.slice(0,n)),s.length===0){e==="myPostsContainer"?t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:t.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}s.forEach(o=>{const r=document.createElement("div");r.classList.add("post");const i=o.content.length>150?o.content.substring(0,150)+"...":o.content,l=typeof o.authorId=="object"&&o.authorId!==null?o.authorId._id:o.authorId,c=typeof o.authorId=="object"&&o.authorId!==null?o.authorId.name:o.authorName||"Unknown",h=a&&String(l)===String(a);r.innerHTML=`
      ${o.image?`<a href="post.html?slug=${o.slug}">
             <img src="${se(o.image)}" alt="${o.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${o.category}</p>
        <h2>
          <a href="post.html?slug=${o.slug}" class="post-link">${o.title}</a>
        </h2>
        <p>${i} <a href="post.html?slug=${o.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${l}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(o.date).toLocaleString()}">
          ${U(o.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${o.likedByUser?"liked":""}" data-slug="${o.slug}">
              <i class="${o.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${o.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${o.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${o.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${o.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${o.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${o.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <h3>Liked by</h3>
            <ul id="likesList-${o.slug}" class="likes-list"></ul>            
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
            <button class="edit-btn btn" data-slug="${o.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${o.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(r);const w=r.querySelector(".post-image");w&&(w.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const m=r.querySelector(".like-btn"),g=m.querySelector("i"),y=r.querySelector(".liked-by");y.dataset.slug=o.slug,y.dataset.likedBy=JSON.stringify(o.likedBy||[]),m.classList.toggle("liked",o.likedByUser),g.className=o.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",o.likesCount?(y.textContent=o.likesCount===1?`Liked by ${o.likedBy[0]}`:`Liked by ${o.likedBy[0]} and ${o.likedBy.length-1} others`,y.classList.remove("disabled")):(y.textContent="No likes yet",y.classList.add("disabled"));const F=r.querySelector(".comment-count");we(o.slug,F)})}async function Xe(e,n,a,t){const s=new FormData;s.append("title",e),s.append("content",n),s.append("category",a),t&&s.append("image",t);const o=await u(`${p}`,{method:"POST",body:s});if(!o.ok)throw new Error("Failed to add post");return await o.json()}async function Ze(e){if(confirm("Are you sure you want to delete this post?"))try{const n=await u(`${p}/${e}`,{method:"DELETE"});if(!n.ok){const t=await n.text();throw new Error(t||"Failed to delete post")}d("Post deleted successfully!","success");const{page:a}=L();window.location.pathname.endsWith("my-posts.html")?oe(a):M(a)}catch(n){console.error("Error deleting post:",n),d("Failed to delete post!","error")}}function et(e){e&&(localStorage.setItem("editSlug",e),window.location.href="write.html")}function tt(){const e=document.getElementById("postForm"),n=document.querySelector(".add-post-btn");if(!e)return;const a=localStorage.getItem("editSlug"),t=s=>{n.disabled=s,n.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await u(`${p}/${a}`);if(!s.ok)throw new Error("Post not found");const o=await s.json();if(document.getElementById("title").value=o.title||"",document.getElementById("content").value=o.content||"",document.getElementById("category").value=o.category||"",o.image){const r=document.getElementById("imagePreview");r.src=o.image,r.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),e.onsubmit=async function(s){s.preventDefault();const o=new FormData;o.append("title",document.getElementById("title").value),o.append("content",document.getElementById("content").value),o.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&o.append("image",r);try{t(!0);const i=await u(`${p}/${a}`,{method:"PUT",body:o});i.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),d("Failed to update post!","error")}finally{t(!1)}}):(localStorage.removeItem("editSlug"),e?.addEventListener("submit",async function(s){s.preventDefault();const o=document.getElementById("title").value,r=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:o,content:r,category:i,imageFile:l});try{t(!0);const c=await Xe(o,r,i,l);console.log("Post created successfully!",c),d("Post created successfully!","success"),e.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{t(!1)}}))}async function de(){const n=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(n&&u(`/api/posts/${n}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!n){try{let ke=function(b){v.dataset.saved=b?"true":"false",v.classList.toggle("saved",b);const $=v.querySelector("i");$.classList.toggle("fa-solid",b),$.classList.toggle("fa-regular",!b)};const a=await u(`${p}/${n}`);if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),s=window.currentUser?._id||window.currentUser?.id,o=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",i=s&&String(o)===String(s),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${t.image?`<img src="${se(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${o}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(t.date).toLocaleString()}">
        ${U(t.date)}
      </small>
      <div class="content">
        <p>${ne(t.content)}</p>
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
      ${i?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
      </div>`:""}
    `;const c=l.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=l?.querySelector(".like-btn"),w=h?.querySelector("i"),m=l?.querySelector(".liked-by");m.dataset.slug=t.slug,m.dataset.likedBy=JSON.stringify(t.likedBy||[]),h.classList.toggle("liked",t.likedByUser),w.className=t.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",t.likesCount?(m.textContent=t.likesCount===1?`Liked by ${t.likedBy[0]}`:`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`,m.classList.remove("disabled")):(m.textContent="No likes yet",m.classList.add("disabled"));const g=l.querySelector(".comment-count");we(t.slug,g);const y=document.querySelector(".comments-section"),F=y.querySelector(".comments-list");y&&F&&await ye(t.slug,F,1/0);const v=l.querySelector(".bookmark");v?.addEventListener("click",async()=>{const b=v.dataset.slug,$=v.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}v.classList.add("clicked"),setTimeout(()=>v.classList.remove("clicked"),200);const Le=$?`/api/posts/${b}/unsave`:`/api/posts/${b}/save`;try{const q=await u(Le,{method:"POST"}),be=await q.json();if(!q.ok)throw new Error(be.message||"Failed to toggle bookmark");ke(!$),d($?"Removed from saved posts":"Post saved","success")}catch(q){console.error("Failed to toggle bookmark",q),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}nt(n)}}const st=async()=>{const n=await(await u(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=n.map((t,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${t.slug}" class="trending-title">${t.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function ot(e){const n=document.getElementById("related-posts-container");if(!e.length){n.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}n.innerHTML=e.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const nt=async e=>{try{const a=await(await u(`${p}/slug/${e}/related`)).json();ot(a)}catch(n){console.error("Failed to fetch related posts.",n)}},at=document.getElementById("savedPostsContainer");async function re(e,n=6){const a=at;try{const t=L(),s=e??t.page,o=V()||t.search;S({page:s,search:o},{replace:!0});const r=new URLSearchParams({page:s,limit:n});o&&r.append("search",o),s!==1&&Z();const i=await u(`${p}/saved/me?${r.toString()}`);if(!i.ok)throw new Error("Failed to fetch");const l=await i.json();if(f.saved=Array.isArray(l.posts)?l.posts:[],E=l.totalPages||1,!a)return;if(f.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=f.saved.map(c=>`
      <article class="post-card">
        ${c.image?`
          <img 
            src="${se(c.image)}" 
            alt="${c.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${c.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${c.slug}'">
          <h2>${c.title}</h2>
          <p class="tag">${c.category}</p>
          <p class="excerpt">
            ${c.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${c.authorId?.name||"Unknown"}</small>
            <small title="${new Date(c.date).toLocaleString()}">${U(c.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${c.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async h=>{h.stopPropagation();const w=c.dataset.slug;try{await u(`${p}/${w}/unsave`,{method:"POST"}),f.saved=f.saved.filter(g=>g.slug!==w),c.closest(".post-card").remove(),d("Removed from saved posts","success");const{page:m}=L();f.saved.length===0&&m>1?re(m-1):_("savedPostsContainer",m,E)}catch(m){console.error(m),d("Failed to remove","error")}})}),_("savedPostsContainer",s,E)}catch(t){console.error(t),a.innerHTML="<p>Error loading saved posts.</p>"}finally{z(),ee()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{S({page:1}),M(1)});let ue;te.forEach(e=>e?.addEventListener("keyup",()=>{clearTimeout(ue),ue=setTimeout(()=>{S({page:1}),ve(),M(1),oe(1),re(1)},400)}));function _(e,n,a){const t=document.getElementById("pagination");if(t){t.innerHTML="";for(let s=1;s<=a;s++){const o=document.createElement("button");o.textContent=s,o.className=s===n?"pg-active":"",o?.addEventListener("click",async()=>{S({page:s}),M(s)}),t.appendChild(o)}}}async function rt(e){const n=e.dataset.slug,a=e.querySelector("i"),t=e.querySelector(".like-count"),s=e.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){d("Please log in to like or unlike posts.","error");return}const o=e.classList.contains("liked");try{const r=await u(`/api/posts/${n}/${o?"unlike":"like"}`,{method:"POST"}),i=await r.json();if(r.ok){e.classList.toggle("liked",!o),a.className=o?"fa-regular fa-heart":"fa-solid fa-heart";const l=i.likesCount??i.likes??0;t.textContent=l,s&&(l?(s.textContent=l===1?"1 like":`${l} likes`,s.classList.remove("disabled")):(s.textContent="No likes yet",s.classList.add("disabled")),Array.isArray(i.likedBy)&&(s.dataset.slug=n,s.dataset.likedBy=JSON.stringify(i.likedBy)))}else d(`Failed to update likes: ${i.message}`,"error")}catch(r){console.error("Like action failed:",r),d("Error updating like. Please try again.","error")}}const it=async e=>{const n=e.dataset.slug,a=`${window.location.origin}/post/${n}`,t=`shared_${n}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:a}):(await navigator.clipboard.writeText(a),d("Link copied to clipboard!","success")),sessionStorage.getItem(t)||(sessionStorage.setItem(t,"true"),u(`/api/posts/${n}/share`,{method:"POST"}).catch(()=>{}));const s=e.querySelector(".share-count");s&&(s.textContent=Number(s.textContent)+1)}catch(s){d("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",s)}};let X=!1;async function lt(e){if(X)return;const n=encodeURIComponent(e),a=document.getElementById(`likesModal-${n}`),t=document.getElementById(`likesList-${n}`);if(!(!a||!t)&&!a.classList.contains("active")){X=!0,a.classList.remove("hidden"),requestAnimationFrame(()=>a.classList.add("active")),t.innerHTML="<li>Loading...</li>";try{const o=await(await u(`/api/posts/${e}/likes`)).json();if(t.innerHTML="",!Array.isArray(o.users)||o.users.length===0){t.innerHTML="<li>No likes yet</li>";return}o.users.forEach(r=>{const i=document.createElement("li");i.textContent=r,t.appendChild(i)})}catch(s){t.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",s)}}}function ct(e){const n=encodeURIComponent(e),a=document.getElementById(`likesModal-${n}`);a&&(X=!1,a.classList.remove("active"),setTimeout(()=>{a.classList.add("hidden")},300))}function dt(){document.addEventListener("click",async e=>{const n=e.target.closest(".edit-btn");if(n){e.preventDefault(),e.stopPropagation(),et(n.dataset.slug);return}const a=e.target.closest(".delete-btn");if(a){e.preventDefault(),e.stopPropagation(),Ze(a.dataset.slug);return}const t=e.target.closest(".like-btn");if(t){e.preventDefault(),rt(t);return}const s=e.target.closest(".comment-btn");if(s){e.preventDefault(),Ve(s);return}const o=e.target.closest(".share-btn");if(o){e.preventDefault(),it(o);return}const r=e.target.closest(".likes-info");if(r&&!r.classList.contains("disabled")){e.preventDefault(),e.stopPropagation();const g=r.dataset.slug;if(!g)return;lt(g);return}const i=document.querySelector(".likes-modal.active");if(i&&!i.contains(e.target)){const g=i.id.replace("likesModal-","");ct(g)}const l=e.target.closest(".delete-comment-btn");l&&(e.preventDefault(),e.stopPropagation(),Ye(l));const c=e.target.closest(".menu-btn"),h=e.target.closest(".menu-options");if(!c&&!h&&document.querySelectorAll(".menu-options").forEach(g=>g.classList.add("hidden")),c&&c.nextElementSibling.classList.toggle("hidden"),k?.classList.contains("show")&&!k.contains(e.target)&&!e.target.closest(".user-icon")&&k.classList.remove("show"),j?.classList.contains("active")&&!j.contains(e.target)&&!ge.contains(e.target)&&j.classList.remove("active"),!e.target.closest(".user-icon"))return;e.stopPropagation();const m=window.currentUser;m&&m.id?(k.classList.toggle("show"),authModal.classList.add("hidden")):(k.classList.remove("show"),authModal.classList.remove("hidden"),loginTab.classList.add("active"),registerTab.classList.remove("active"),loginForm.classList.remove("hidden"),registerForm.classList.add("hidden"))})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function ut(){const e=`scroll:${window.location.pathname}${window.location.search}`,n=sessionStorage.getItem(e);n!==null&&(window.scrollTo(0,Number(n)),sessionStorage.removeItem(e))}async function Y(){const e=window.location.pathname,{page:n}=L();e==="/"||e.endsWith("index.html")?(x(),A("featuredPostsContainer",3),await ve(),await st()):e.endsWith("my-posts.html")?(x(),A("myPostsContainer",6),await oe(n)):e.endsWith("post.html")?await de():e.endsWith("saved.html")?(x(),A("savedPostsContainer",6),await re(n)):e.startsWith("/post/")?de():(x(),A(),await M(n)),ut()}document.addEventListener("DOMContentLoaded",async()=>{const e=await _e();window.currentUser=e,ze(),he(),dt(),Ge(),Ne();const n=localStorage.getItem("theme")||"light";fe(n),await Y(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),tt()});window.addEventListener("pageshow",e=>{if(e.persisted){const n=localStorage.getItem("theme")||"light";fe(n),he()}});window.addEventListener("popstate",()=>{Y()});export{u as a,pe as l,d as s};
