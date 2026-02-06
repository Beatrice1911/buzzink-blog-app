(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const y="/api/posts",q="/api/auth",R="/api/comments",X="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",Z=document.body,Y=document.querySelectorAll(".user-icon"),A=document.getElementById("userMenuDetails"),D=document.getElementById("authModal"),re=document.getElementById("closeModal"),B=document.getElementById("loginTab"),C=document.getElementById("registerTab"),ie=document.querySelectorAll(".write-post"),le=document.querySelector(".search-icon"),W=document.getElementById("mobileSearch"),ce=document.querySelector(".menu-toggle"),de=document.getElementById("mobileMenu"),M=document.querySelector(".logo"),me=document.querySelector(".all-posts-btn"),ue=document.getElementById("myPosts"),ge=document.getElementById("savedPosts"),fe=document.getElementById("profile-edit"),he=document.getElementById("settings"),O=document.getElementById("themeToggle"),H=document.documentElement;function c(t,o="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const s=document.createElement("div");s.className=`toast toast-${o}`;const r=document.createElement("i");o==="success"?r.className="fas fa-check-circle":o==="error"?r.className="fas fa-exclamation-circle":r.className="fas fa-info-circle",s.appendChild(r);const n=document.createElement("span");n.textContent=t,s.appendChild(n),e.appendChild(s),setTimeout(()=>{s.style.animation="slideOut 0.5s forwards",s?.addEventListener("animationend",()=>s.remove())},a)}function ye(){ce?.addEventListener("click",t=>{t.stopPropagation(),A.classList.contains("show")&&A.classList.remove("show"),de.classList.toggle("active")})}function pe(){M?.addEventListener("click",()=>{window.location.href="index.html"}),me?.addEventListener("click",()=>{window.location.href="all-posts.html"}),ue?.addEventListener("click",()=>{window.location.href="my-posts.html"}),fe?.addEventListener("click",()=>{window.location.href="dashboard.html"}),ge?.addEventListener("click",()=>{window.location.href="saved.html"}),he?.addEventListener("click",()=>{window.location.href="settings.html"})}function we(){B?.addEventListener("click",()=>{k.classList.remove("hidden"),E.classList.add("hidden"),B.classList.add("active"),C.classList.remove("active")}),C?.addEventListener("click",()=>{E.classList.remove("hidden"),k.classList.add("hidden"),C.classList.add("active"),B.classList.remove("active")}),re?.addEventListener("click",()=>{D.classList.add("hidden")})}function ve(){Y.forEach(t=>t?.addEventListener("click",()=>{const o=localStorage.getItem("user"),a=o?JSON.parse(o):null;a&&a.id?(A.classList.toggle("show"),D.classList.add("hidden")):(A.classList.add("hidden"),D.classList.remove("hidden"),B.classList.add("active"),C.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden"),k?.reset(),E?.reset())}))}function ke(){le?.addEventListener("click",()=>{W.classList.toggle("show"),W.classList.contains("show")&&W.querySelector("input").focus()})}function Ee(){ie.forEach(t=>{t?.addEventListener("click",o=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(o.preventDefault(),D.classList.remove("hidden"),B.classList.add("active"),C.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function be(){O?.addEventListener("change",()=>{O.checked?(H.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),M.src="/Images/logo-dark-theme_optimized_.png"):(H.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),M.src="/Images/logo_optimized.png")})}function Oe(){localStorage.getItem("theme")==="dark"?(H.setAttribute("data-theme","dark"),O&&(O.checked=!0)):H.setAttribute("data-theme","light")}function He(t){t==="dark"?(Z.classList.add("dark"),M.src="/Images/logo-dark-theme_optimized_.png"):(Z.classList.remove("dark"),M.src="/Images/logo_optimized.png"),localStorage.setItem("theme",t)}function _e(){ye(),we(),ve(),ke(),Ee(),pe(),be()}async function Re(t){const o=t.dataset.slug;if(!o)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):t.closest(".post");if(!e)return;const s=e.querySelector(".comments-section"),r=s?.querySelector(".comments-list");!s||!r||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await ee(o,r))}async function ze(t){if(t.dataset.deleting==="true")return;t.dataset.deleting="true";const o=t.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){t.dataset.deleting="false";return}try{const e=await m(`${R}/${o}`,{method:"DELETE"}),s=await e.json();if(e.ok){const r=t.closest(".comment");r&&r.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):t.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}c("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),c("Error deleting comment. Please try again.","error")}finally{t.dataset.deleting="false"}}async function ee(t,o,a=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${R}/post/${t}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const s=await e.json();if(o.innerHTML="",s.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const r=s.slice(0,a);if(V(r,o),s.length>a){const n=document.createElement("button");n.classList.add("view-more-btn"),n.textContent=`View all ${s.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",V(s,i);let l=!1;n?.addEventListener("click",()=>{l=!l,l?(o.innerHTML="",o.appendChild(i),o.appendChild(n),i.style.display="block",n.textContent="View less comments"):(o.innerHTML="",V(r,o),n.textContent=`View all ${s.length} comments`,o.appendChild(n))}),o.appendChild(n)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function V(t,o){const a=window.currentUser?.id||window.currentUser?._id;t.forEach(e=>{const s=document.createElement("div");s.classList.add("comment");const r=typeof e.authorId=="object"?e.authorId._id:e.authorId,n=a&&r&&r.toString()===a.toString();s.innerHTML=`
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
        ${U(e.createdAt)}
      </small>
    `,o.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Le(t,o,a,e){try{const s=await m(`${R}/post/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(s.ok){const n=(await s.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
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
        ${U(n.createdAt)}
      </small>
      `,a.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}c("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),c("Failed to post comment","error")}}async function te(t,o){try{const a=await m(`${R}/post/${t}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=s,o.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),o.textContent="0"}}async function $e(t){const o=t.target.closest(".comment-form"),a=o.querySelector(".comment-form button");if(!o)return;t.preventDefault();const e=o.querySelector(".comment-input"),s=e.value.trim();if(!s)return;let r,n,i,l;window.location.pathname.endsWith("post.html")?(r=document.getElementById("singlePostContainer"),n=r.querySelector(".comments-list"),i=r.querySelector(".comment-btn").dataset.slug,l=r.querySelector(".comment-count")):(r=o.closest(".post"),n=r.querySelector(".comments-list"),i=r.querySelector(".like-btn").dataset.slug,l=r.querySelector(".comment-count"));const d=g=>{a.disabled=g,a.innerHTML=g?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(d(!0),!window.currentUser){c("Please log in to comment.","error"),e.value="",d(!1);return}await Le(i,s,n,l),e.value=""}catch{d(!1)}finally{d(!1)}}function Je(){document.addEventListener("submit",$e)}const Ie=document.querySelectorAll(".search");let v={all:[],mine:[],saved:[]},L=1,u=Number(sessionStorage.getItem("postsPage"))||1;sessionStorage.getItem("postsCategory");sessionStorage.getItem("postsSearch");function K(t){return t&&t.startsWith("http")?t:"/Images/fallback.jpg"}function Se(t){t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function z(t=1,o=6){try{const a=document.getElementById("categoryFilter")?.value,e=document.querySelectorAll(".search"),s=new URLSearchParams;s.append("page",t),s.append("limit",o),a&&a!=="all"&&s.append("category",a),e.forEach(l=>{if(l){const d=l.value.trim();d&&s.append("search",d)}});const n=await(await m(`${y}?${s.toString()}`)).json();v.all=Array.isArray(n.posts)?n.posts:[],u=n.currentPage??1,L=n.totalPages??1,typeof u<"u"&&sessionStorage.setItem("postsPage",u),sessionStorage.setItem("postsCategory",a&&a!=="all"?a:"");const i=[...e].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),T("allPostsContainer"),G("allPostsContainer",u,L)}catch(a){console.error("Error fetching posts:",a),c("Something went wrong while displaying posts!","error")}}async function se(t=1,o=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",t),e.append("limit",o),a.forEach(l=>{if(l){const d=l.value.trim();d&&e.append("search",d)}});const s=await m(`${y}/mine?${e.toString()}`);if(!s.ok){const l=await s.text();throw new Error(l||"Failed to fetch your posts")}const r=await s.json();v.mine=Array.isArray(r.posts)?r.posts:[],u=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",u);const n=[...a].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",n);const i="myPostsContainer";if(T("myPostsContainer",null,"You haven't made any posts yet..."),G(i,u,L),v.mine.length===0){const l=document.getElementById("myPostsContainer");l&&Se(l)}}catch(a){console.error("Error fetching my posts:",a),c("Failed to load your posts!","error")}}function U(t){const o=Math.floor((Date.now()-new Date(t))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const r=Math.floor(o/s.seconds);if(r>=1)return e.format(-r,s.label)}return"Just now"}function Q(t){return t.replace(/\n/g,"<br>")}function T(t,o=null,a=null){const e=window.currentUser?._id||window.currentUser?.id,s=document.getElementById(t);if(!s)return;s.innerHTML="";let r=[];if(t==="allPostsContainer"||t==="featuredPostsContainer"?r=[...v.all]:t==="myPostsContainer"?r=[...v.mine]:t==="savedPostsContainer"&&(r=[...v.saved]),o&&(r=r.slice(0,o)),r.length===0){s.innerHTML=a??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}r.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const l=n.content.length>150?n.content.substring(0,150)+"...":n.content,d=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,g=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",x=e&&String(d)===String(e);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${K(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${d}" class="author"><em>By ${g}</em></a>
        <small title="${new Date(n.date).toLocaleString()}">
          ${U(n.date)}
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
        ${x?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,s.appendChild(i);const p=i.querySelector(".post-image");p&&(p.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const I=i.querySelector(".like-btn"),F=I.querySelector("i"),w=i.querySelector(".liked-by");w.dataset.slug=n.slug,w.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?w.classList.remove("disabled"):w.classList.add("disabled");const N=Array.isArray(n.likes)?n.likes.map(P=>typeof P=="object"?P._id:P):[];e&&(N.includes(e)||n.likedByUser)?(I.classList.add("liked"),F.className="fa-solid fa-heart"):(I.classList.remove("liked"),F.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?w.textContent="No likes yet":n.likedBy.length===1?w.textContent=`Liked by ${n.likedBy[0]}`:w.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const S=i.querySelector(".comment-count");te(n.slug,S);const f=i.querySelector(".share-count");f&&(f.textContent=n.shares||0)})}async function Pe(t,o,a,e){const s=new FormData;s.append("title",t),s.append("content",o),s.append("category",a),e&&s.append("image",e);const r=await m(`${y}`,{method:"POST",body:s});if(!r.ok)throw new Error("Failed to add post");return await r.json()}async function We(t){if(confirm("Are you sure you want to delete this post?"))try{const o=await m(`${y}/${t}`,{method:"DELETE"});if(!o.ok){const a=await o.text();throw new Error(a||"Failed to delete post")}c("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?se(u):z(u)}catch(o){console.error("Error deleting post:",o),c("Failed to delete post!","error")}}function Ve(t){t&&(localStorage.setItem("editSlug",t),window.location.href="write.html")}function Ye(){const t=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!t)return;const a=localStorage.getItem("editSlug"),e=s=>{o.disabled=s,o.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await m(`${y}/${a}`);if(!s.ok)throw new Error("Post not found");const r=await s.json();if(document.getElementById("title").value=r.title||"",document.getElementById("content").value=r.content||"",document.getElementById("category").value=r.category||"",r.image){const n=document.getElementById("imagePreview");n.src=r.image,n.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),t.onsubmit=async function(s){s.preventDefault();const r=new FormData;r.append("title",document.getElementById("title").value),r.append("content",document.getElementById("content").value),r.append("category",document.getElementById("category").value);const n=document.getElementById("image").files[0];n&&r.append("image",n);try{e(!0);const i=await m(`${y}/${a}`,{method:"PUT",body:r});i.ok?(c("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),c("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),t?.addEventListener("submit",async function(s){s.preventDefault();const r=document.getElementById("title").value,n=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:r,content:n,category:i,imageFile:l});try{e(!0);const d=await Pe(r,n,i,l);console.log("Post created successfully!",d),c("Post created successfully!","success"),t.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(d){console.error("Error adding post:",d),c("Failed to add post!","error")}finally{e(!1)}}))}function Be(t){const o=document.getElementById("post-jsonld");o&&o.remove();const a={"@context":"https://schema.org","@type":"Article",headline:t.title,description:t.content.slice(0,160),image:t.image?[t.image]:[],author:{"@type":"Person",name:t.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:t.createdAt||t.date,dateModified:t.updatedAt||t.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},e=document.createElement("script");e.type="application/ld+json",e.id="post-jsonld",e.textContent=JSON.stringify(a),document.head.appendChild(e)}async function Ke(){const o=new URLSearchParams(window.location.search).get("slug");if(o&&m(`/api/posts/${o}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!o){try{let P=function(h){f.dataset.saved=h?"true":"false",f.classList.toggle("saved",h);const b=f.querySelector("i");b.classList.toggle("fa-solid",h),b.classList.toggle("fa-regular",!h)};const a=await m(`${y}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),s=window.currentUser?._id||window.currentUser?.id,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,n=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=s&&String(r)===String(s),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${K(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${r}'" style="cursor: pointer;" class="author"><em>By ${n}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${U(e.date)}
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
    `;const d=l.querySelector(".post-image");d&&(d.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=l?.querySelector(".like-btn"),x=g?.querySelector("i"),p=l?.querySelector(".liked-by");p.dataset.slug=e.slug,p.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?p.classList.remove("disabled"):p.classList.add("disabled");const I=Array.isArray(e.likes)?e.likes.map(h=>typeof h=="object"?h._id:h):[];s&&(I.includes(s)||e.likedByUser)?(g.classList.add("liked"),x.className="fa-solid fa-heart"):(g.classList.remove("liked"),x.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?p.textContent="No likes yet":e.likedBy.length===1?p.textContent=`Liked by ${e.likedBy[0]}`:p.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const F=l.querySelector(".comment-count");te(e.slug,F);const w=document.querySelector(".comments-section"),N=w.querySelector(".comments-list");w&&N&&await ee(e.slug,N,1/0);const S=l.querySelector(".share-count");S&&(S.textContent=Number(S.textContent)+1);const f=l.querySelector(".bookmark");f?.addEventListener("click",async()=>{const h=f.dataset.slug,b=f.dataset.saved==="true";if(!window.currentUser){c("Please log in to save posts");return}f.classList.add("clicked"),setTimeout(()=>f.classList.remove("clicked"),200);const ne=b?`/api/posts/${h}/unsave`:`/api/posts/${h}/save`;try{const j=await m(ne,{method:"POST"}),ae=await j.json();if(!j.ok)throw new Error(ae.message||"Failed to toggle bookmark");P(!b),c(b?"Removed from saved posts":"Post saved","success")}catch(j){console.error("Failed to toggle bookmark",j),c("Something went wrong","error")}}),Be(e)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Te(o)}}const Qe=async()=>{const o=await(await m(`${y}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=o.map((e,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Ce(t){const o=document.getElementById("related-posts-container");if(!t.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=t.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Te=async t=>{try{const a=await(await m(`${y}/slug/${t}/related`)).json();Ce(a)}catch(o){console.error("Failed to fetch related posts.",o)}},Ae=document.getElementById("savedPostsContainer");async function Me(t=1,o=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",t),e.append("limit",o),a.forEach(i=>{if(i){const l=i.value.trim();l&&e.append("search",l)}});const s=await m(`${y}/saved/me?${e.toString()}`);if(!s.ok)throw new Error("Failed to fetch");const r=await s.json();v.saved=Array.isArray(r.posts)?r.posts:[],u=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",u);const n=Ae;if(!n)return;if(v.saved.length===0){n.innerHTML="<p>You have no saved posts yet.</p>";return}n.innerHTML=v.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${K(i.image)}" 
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
            <small title="${new Date(i.date).toLocaleString()}">${U(i.date)}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async l=>{l.stopPropagation();const d=i.dataset.slug;try{await m(`${y}/${d}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),c("Removed from saved posts","success")}catch(g){console.error(g),c("Failed to remove","error")}})}),G("savedPostsContainer",u,L)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}}function qe(){document.getElementById("allPostsContainer")&&T("allPostsContainer"),document.getElementById("featuredPostsContainer")&&T("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&T("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>z(1));Ie.forEach(t=>t?.addEventListener("keyup",()=>z(1)));function G(t,o,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let s=1;s<=a;s++){const r=document.createElement("button");r.textContent=s,r.className=s===o?"pg-active":"",r?.addEventListener("click",()=>{t==="myPostsContainer"?se(s):t==="savedPostsContainer"?Me(s):z(s)}),e.appendChild(r)}}}const k=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Ue=document.getElementById("logoutBtn");function J(t){return t?{...t,id:t.id||t._id}:null}window.currentUser=(()=>{const t=localStorage.getItem("user");return t?J(JSON.parse(t)):null})();function $(t){t?.id?Y.forEach(o=>o.title=`Logged in as ${t.name}`):(Y.forEach(o=>o.title="Click to Login/Register"),A?.classList.remove("show"))}async function _(t){try{const o=await m("/api/users/me");if(!o.ok)return;t=await o.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(s=>{s.src=t.profilePhoto?.trim()?t.profilePhoto:X});const e=document.querySelectorAll(".avatar");e&&e.forEach(s=>{s.src=t.profilePhoto?.trim()?t.profilePhoto:X}),window.currentUser=t}catch(o){console.warn("Failed to load auth user:",o)}}function xe(){k?.addEventListener("submit",async t=>{t.preventDefault();const o=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${q}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:a})}),s=await e.json();console.log("Login response:",s),e.ok||c(`Login failed: ${s.message||"Unknown error"}`,"error");const r=J(s.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),r.role==="admin"&&(window.location.href="admin.html"),$(r),_(r),authModal.classList.add("hidden"),k.reset(),c(`Welcome back, ${r.name}!`,"success"),qe()})}function Fe(){E?.addEventListener("submit",async t=>{t.preventDefault();const o=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,s=await m(`${q}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:a,password:e})}),r=await s.json();console.log("Register response:",r),s.ok||c(`Registration failed: ${r.message||"Unknown error"}`,"error");const n=J(r.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),$(n),_(n),authModal.classList.add("hidden"),E.reset(),c(`Welcome, ${n.name}! Your account has been created.`,"success")})}function Ne(){Ue?.addEventListener("click",()=>{oe(),window.location.href="index.html"})}async function Ge(){try{const t=await m(`${q}/me`);if(!t.ok)throw new Error("Not authenticated");const o=await t.json(),a=J(o);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,$(a),_(a),a}catch{return $(null),_(null),null}}async function oe(t=!1){try{await fetch(`${q}/logout`,{method:"POST",credentials:"include"})}catch(o){console.warn("Logout request failed:",o)}localStorage.removeItem("user"),window.currentUser=null,$(null),t||c("You have been logged out.","info")}function je(){const t=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");t&&t?.addEventListener("click",s=>{s.preventDefault(),o.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{o.classList.add("hidden")}),e&&e?.addEventListener("submit",async s=>{s.preventDefault();const r=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r})})).json();c(i.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(n){console.error(n),c("Failed to send reset link. Try again.","error")}})}function Xe(){xe(),Fe(),Ne(),je()}async function m(t,o={}){let a=await fetch(t,{credentials:"include",...o});return a.status===401&&(await De()?a=await fetch(t,{credentials:"include",...o}):oe(!0)),a}async function De(){try{const t=await fetch(`${q}/refresh`,{method:"POST",credentials:"include"});if(!t.ok)throw new Error("Refresh failed");const o=await t.json();return window.currentUser=o.user,$(o.user),!0}catch{return!1}}export{m as a,Y as b,ce as c,We as d,Ve as e,Ge as f,_e as g,ze as h,Xe as i,Je as j,He as k,Oe as l,de as m,Ye as n,z as o,Qe as p,se as q,qe as r,c as s,Re as t,A as u,Ke as v,Me as w,oe as x};
