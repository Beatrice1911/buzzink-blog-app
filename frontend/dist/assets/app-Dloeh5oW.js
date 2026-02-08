import{a as u,C as M,s as d,b as x,c as j,A as p,h as U,d as H,u as q,e as oe,m as F,f as ne,g as ae,i as re,j as V,l as le,k as Y}from"./api-BOA6rqPC.js";async function ie(t){const o=t.dataset.slug;if(!o)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):t.closest(".post");if(!e)return;const n=e.querySelector(".comments-section"),s=n?.querySelector(".comments-list");!n||!s||(a||n.classList.toggle("show"),(a||n.classList.contains("show"))&&await K(o,s))}async function ce(t){if(t.dataset.deleting==="true")return;t.dataset.deleting="true";const o=t.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){t.dataset.deleting="false";return}try{const e=await u(`${M}/${o}`,{method:"DELETE"}),n=await e.json();if(e.ok){const s=t.closest(".comment");s&&s.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):t.closest(".post"))?.querySelector(".comment-count");if(l){let i=parseInt(l.textContent)||0;i=Math.max(i-1,0),l.textContent=i,l.title=`${i} comment${i!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(n.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),d("Error deleting comment. Please try again.","error")}finally{t.dataset.deleting="false"}}async function K(t,o,a=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await u(`${M}/post/${t}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const n=await e.json();if(o.innerHTML="",n.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const s=n.slice(0,a);if(A(s,o),n.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${n.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",A(n,l);let i=!1;r?.addEventListener("click",()=>{i=!i,i?(o.innerHTML="",o.appendChild(l),o.appendChild(r),l.style.display="block",r.textContent="View less comments"):(o.innerHTML="",A(s,o),r.textContent=`View all ${n.length} comments`,o.appendChild(r))}),o.appendChild(r)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function A(t,o){const a=window.currentUser?.id||window.currentUser?._id;t.forEach(e=>{const n=document.createElement("div");n.classList.add("comment");const s=typeof e.authorId=="object"?e.authorId._id:e.authorId,r=a&&s&&s.toString()===a.toString();n.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${W(e.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${I(e.createdAt)}
      </small>
    `,o.appendChild(n),n.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function de(t,o,a,e){try{const n=await u(`${M}/post/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(n.ok){const r=(await n.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${W(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${I(r.createdAt)}
      </small>
      `,a.prepend(l),e&&e){let i=parseInt(e.textContent)||0;e.textContent=i+1,e.title=`${i+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(n){console.error("Error posting comment:",n),d("Failed to post comment","error")}}async function G(t,o){try{const a=await u(`${M}/post/${t}`);if(!a.ok)throw new Error("Failed to fetch comment count");const n=(await a.json()).length;n===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=n,o.title=`${n} comment${n>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),o.textContent="0"}}async function ue(t){const o=t.target.closest(".comment-form"),a=o.querySelector(".comment-form button");if(!o)return;t.preventDefault();const e=o.querySelector(".comment-input"),n=e.value.trim();if(!n)return;let s,r,l,i;window.location.pathname.endsWith("post.html")?(s=document.getElementById("singlePostContainer"),r=s.querySelector(".comments-list"),l=s.querySelector(".comment-btn").dataset.slug,i=s.querySelector(".comment-count")):(s=o.closest(".post"),r=s.querySelector(".comments-list"),l=s.querySelector(".like-btn").dataset.slug,i=s.querySelector(".comment-count"));const c=h=>{a.disabled=h,a.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),e.value="",c(!1);return}await de(l,n,r,i),e.value=""}catch{c(!1)}finally{c(!1)}}function me(){document.addEventListener("submit",ue)}const N=document.querySelectorAll(".search");function R(){return[...N].find(t=>t.value.trim())?.value.trim()||""}let f={all:[],featured:[],mine:[],saved:[]},k=1;function O(t){return t&&t.startsWith("http")?t:"/Images/fallback.jpg"}function $(){const t=new URLSearchParams(window.location.search);return{page:Number(t.get("page"))||1,category:t.get("category")||"",search:t.get("search")||""}}function E({page:t,category:o,search:a}){const e=new URL(window.location);t===1?e.searchParams.delete("page"):e.searchParams.set("page",t),o?e.searchParams.set("category",o):e.searchParams.delete("category"),a?e.searchParams.set("search",a):e.searchParams.delete("search"),window.history.pushState({},"",e)}function S(){const{category:t,search:o}=$(),a=document.getElementById("categoryFilter");a&&(a.value=t||"all"),N.forEach(e=>{e.value=o||""})}async function L(t,o=6){try{const a=$(),e=t??a.page,n=document.getElementById("categoryFilter")?.value||a.category,s=R()||a.search;E({page:e,category:n!=="all"?n:"",search:s});const r=new URLSearchParams({page:e,limit:o});n&&n!=="all"&&r.append("category",n),s&&r.append("search",s),e===1?x("allPostsContainer",o):j();const i=await(await u(`${p}?${r.toString()}`)).json();f.all=Array.isArray(i.posts)?i.posts:[],k=i.totalPages??1,_("allPostsContainer"),T("allPostsContainer",e,k)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{U(),H()}}async function ge(t=3){try{x("featuredPostsContainer",t);const a=await(await u(`${p}?page=1&limit=${t}`)).json();f.featured=Array.isArray(a.posts)?a.posts:[],_("featuredPostsContainer",t)}catch(o){console.error("Failed to load featured posts",o)}finally{U()}}async function Q(t,o=6){try{const a=$(),e=t??a.page,n=R()||a.search;a.search,E({page:e,search:n});const s=new URLSearchParams({page:e,limit:o});n&&s.append("search",n),e===1?x("allPostsContainer",o):j();const r=await u(`${p}/mine?${s.toString()}`);if(!r.ok){const i=await r.text();throw new Error(i||"Failed to fetch your posts")}const l=await r.json();f.mine=Array.isArray(l.posts)?l.posts:[],k=l.totalPages||1,_("myPostsContainer"),T("myPostsContainer",e,k)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{U(),H()}}function I(t){const o=Math.floor((Date.now()-new Date(t))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const n of a){const s=Math.floor(o/n.seconds);if(s>=1)return e.format(-s,n.label)}return"Just now"}function W(t){const o=document.createElement("div");return o.textContent=t,o.innerHTML.replace(/\n/g,"<br>")}function _(t,o=null){const a=window.currentUser?._id||window.currentUser?.id,e=document.getElementById(t);if(!e)return;e.innerHTML="";let n=[];if(t==="allPostsContainer"?n=[...f.all]:t==="featuredPostsContainer"?n=[...f.featured]:t==="myPostsContainer"?n=[...f.mine]:t==="savedPostsContainer"&&(n=[...f.saved]),o&&(n=n.slice(0,o)),n.length===0){t==="myPostsContainer"?e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:e.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}n.forEach(s=>{const r=document.createElement("div");r.classList.add("post");const l=s.content.length>150?s.content.substring(0,150)+"...":s.content,i=typeof s.authorId=="object"&&s.authorId!==null?s.authorId._id:s.authorId,c=typeof s.authorId=="object"&&s.authorId!==null?s.authorId.name:s.authorName||"Unknown",h=a&&String(i)===String(a);r.innerHTML=`
      ${s.image?`<a href="post.html?slug=${s.slug}">
             <img src="${O(s.image)}" alt="${s.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${s.category}</p>
        <h2>
          <a href="post.html?slug=${s.slug}" class="post-link">${s.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${s.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${i}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(s.date).toLocaleString()}">
          ${I(s.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${s.likedByUser?"liked":""}" data-slug="${s.slug}">
              <i class="${s.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${s.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${s.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${s.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${s.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${s.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${s.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <h3>Liked by</h3>
            <ul id="likesList-${s.slug}" class="likes-list"></ul>            
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
            <button class="edit-btn btn" data-slug="${s.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${s.slug}">Delete</button>
        </div>
        `:""}
    `,e.appendChild(r);const m=r.querySelector(".post-image");m&&(m.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=r.querySelector(".like-btn"),P=g.querySelector("i"),y=r.querySelector(".liked-by");y.dataset.slug=s.slug,y.dataset.likedBy=JSON.stringify(s.likedBy||[]),g.classList.toggle("liked",s.likedByUser),P.className=s.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",s.likesCount?(y.textContent=s.likesCount===1?`Liked by ${s.likedBy[0]}`:`Liked by ${s.likedBy[0]} and ${s.likedBy.length-1} others`,y.classList.remove("disabled")):(y.textContent="No likes yet",y.classList.add("disabled"));const C=r.querySelector(".comment-count");G(s.slug,C)})}async function fe(t,o,a,e){const n=new FormData;n.append("title",t),n.append("content",o),n.append("category",a),e&&n.append("image",e);const s=await u(`${p}`,{method:"POST",body:n});if(!s.ok)throw new Error("Failed to add post");return await s.json()}async function he(t){if(confirm("Are you sure you want to delete this post?"))try{const o=await u(`${p}/${t}`,{method:"DELETE"});if(!o.ok){const e=await o.text();throw new Error(e||"Failed to delete post")}d("Post deleted successfully!","success");const{page:a}=$();window.location.pathname.endsWith("my-posts.html")?Q(a):L(a)}catch(o){console.error("Error deleting post:",o),d("Failed to delete post!","error")}}function pe(t){t&&(localStorage.setItem("editSlug",t),window.location.href="write.html")}function ye(){const t=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!t)return;const a=localStorage.getItem("editSlug"),e=n=>{o.disabled=n,o.innerHTML=n?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const n=await u(`${p}/${a}`);if(!n.ok)throw new Error("Post not found");const s=await n.json();if(document.getElementById("title").value=s.title||"",document.getElementById("content").value=s.content||"",document.getElementById("category").value=s.category||"",s.image){const r=document.getElementById("imagePreview");r.src=s.image,r.style.display="block"}}catch(n){console.error("Error loading post:",n)}})(),t.onsubmit=async function(n){n.preventDefault();const s=new FormData;s.append("title",document.getElementById("title").value),s.append("content",document.getElementById("content").value),s.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&s.append("image",r);try{e(!0);const l=await u(`${p}/${a}`,{method:"PUT",body:s});l.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),d("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),t?.addEventListener("submit",async function(n){n.preventDefault();const s=document.getElementById("title").value,r=document.getElementById("content").value,l=document.getElementById("category").value,i=document.getElementById("image").files[0];console.log("Submitting new post:",{title:s,content:r,category:l,imageFile:i});try{e(!0);const c=await fe(s,r,l,i);console.log("Post created successfully!",c),d("Post created successfully!","success"),t.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{e(!1)}}))}async function z(){const o=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(o&&u(`/api/posts/${o}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!o){try{let ee=function(v){w.dataset.saved=v?"true":"false",w.classList.toggle("saved",v);const b=w.querySelector("i");b.classList.toggle("fa-solid",v),b.classList.toggle("fa-regular",!v)};const a=await u(`${p}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),n=window.currentUser?._id||window.currentUser?.id,s=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",l=n&&String(s)===String(n),i=document.getElementById("singlePostContainer");i.innerHTML=`
      ${e.image?`<img src="${O(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${s}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${I(e.date)}
      </small>
      <div class="content">
        <p>${W(e.content)}</p>
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
      ${l?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const c=i.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=i?.querySelector(".like-btn"),m=h?.querySelector("i"),g=i?.querySelector(".liked-by");g.dataset.slug=e.slug,g.dataset.likedBy=JSON.stringify(e.likedBy||[]),h.classList.toggle("liked",e.likedByUser),m.className=e.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",e.likesCount?(g.textContent=e.likesCount===1?`Liked by ${e.likedBy[0]}`:`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`,g.classList.remove("disabled")):(g.textContent="No likes yet",g.classList.add("disabled"));const P=i.querySelector(".comment-count");G(e.slug,P);const y=document.querySelector(".comments-section"),C=y.querySelector(".comments-list");y&&C&&await K(e.slug,C,1/0);const w=i.querySelector(".bookmark");w?.addEventListener("click",async()=>{const v=w.dataset.slug,b=w.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const te=b?`/api/posts/${v}/unsave`:`/api/posts/${v}/save`;try{const B=await u(te,{method:"POST"}),se=await B.json();if(!B.ok)throw new Error(se.message||"Failed to toggle bookmark");ee(!b),d(b?"Removed from saved posts":"Post saved","success")}catch(B){console.error("Failed to toggle bookmark",B),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}ke(o)}}const we=async()=>{const o=await(await u(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=o.map((e,n)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][n]||`#${n+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function ve(t){const o=document.getElementById("related-posts-container");if(!t.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=t.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const ke=async t=>{try{const a=await(await u(`${p}/slug/${t}/related`)).json();ve(a)}catch(o){console.error("Failed to fetch related posts.",o)}},$e=document.getElementById("savedPostsContainer");async function X(t,o=6){const a=$e;try{const e=$(),n=t??e.page,s=R()||e.search;E({page:n,search:s});const r=new URLSearchParams({page:n,limit:o});s&&r.append("search",s),n===1?x("allPostsContainer",o):j();const l=await u(`${p}/saved/me?${r.toString()}`);if(!l.ok)throw new Error("Failed to fetch");const i=await l.json();if(f.saved=Array.isArray(i.posts)?i.posts:[],k=i.totalPages||1,!a)return;if(f.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=f.saved.map(c=>`
      <article class="post-card">
        ${c.image?`
          <img 
            src="${O(c.image)}" 
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
            <small title="${new Date(c.date).toLocaleString()}">${I(c.date)}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async h=>{h.stopPropagation();const m=c.dataset.slug;try{await u(`${p}/${m}/unsave`,{method:"POST"}),f.saved=f.saved.filter(P=>P.slug!==m),c.closest(".post-card").remove(),d("Removed from saved posts","success");const{page:g}=$();f.saved.length===0&&g>1?X(g-1):T("savedPostsContainer",g,k)}catch(g){console.error(g),d("Failed to remove","error")}})}),T("savedPostsContainer",n,k)}catch(e){console.error(e),a.innerHTML="<p>Error loading saved posts.</p>"}finally{U(),H()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{E({page:1}),L(1)});let J;N.forEach(t=>t?.addEventListener("keyup",()=>{clearTimeout(J),J=setTimeout(()=>{E({page:1}),L(1)},400)}));function T(t,o,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let n=1;n<=a;n++){const s=document.createElement("button");s.textContent=n,s.className=n===o?"pg-active":"",s?.addEventListener("click",async()=>{E({page:n}),L(n)}),e.appendChild(s)}}}async function be(t){const o=t.dataset.slug,a=t.querySelector("i"),e=t.querySelector(".like-count"),n=t.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){d("Please log in to like or unlike posts.","error");return}const s=t.classList.contains("liked");try{const r=await u(`/api/posts/${o}/${s?"unlike":"like"}`,{method:"POST"}),l=await r.json();if(r.ok){t.classList.toggle("liked",!s),a.className=s?"fa-regular fa-heart":"fa-solid fa-heart";const i=l.likesCount??l.likes??0;e.textContent=i,n&&(i?(n.textContent=i===1?"1 like":`${i} likes`,n.classList.remove("disabled")):(n.textContent="No likes yet",n.classList.add("disabled")),Array.isArray(l.likedBy)&&(n.dataset.slug=o,n.dataset.likedBy=JSON.stringify(l.likedBy)))}else d(`Failed to update likes: ${l.message}`,"error")}catch(r){console.error("Like action failed:",r),d("Error updating like. Please try again.","error")}}const Se=async t=>{const o=t.dataset.slug,a=`${window.location.origin}/post/${o}`,e=`shared_${o}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:a}):(await navigator.clipboard.writeText(a),d("Link copied to clipboard!","success")),sessionStorage.getItem(e)||(sessionStorage.setItem(e,"true"),u(`/api/posts/${o}/share`,{method:"POST"}).catch(()=>{}));const n=t.querySelector(".share-count");n&&(n.textContent=Number(n.textContent)+1)}catch(n){d("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",n)}};let D=!1;async function Le(t){if(D)return;const o=encodeURIComponent(t),a=document.getElementById(`likesModal-${o}`),e=document.getElementById(`likesList-${o}`);if(!(!a||!e)&&!a.classList.contains("active")){D=!0,a.classList.remove("hidden"),requestAnimationFrame(()=>a.classList.add("active")),e.innerHTML="<li>Loading...</li>";try{const s=await(await u(`/api/posts/${t}/likes`)).json();if(e.innerHTML="",!Array.isArray(s.users)||s.users.length===0){e.innerHTML="<li>No likes yet</li>";return}s.users.forEach(r=>{const l=document.createElement("li");l.textContent=r,e.appendChild(l)})}catch(n){e.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",n)}}}function Ee(t){const o=encodeURIComponent(t),a=document.getElementById(`likesModal-${o}`);a&&(D=!1,a.classList.remove("active"),setTimeout(()=>{a.classList.add("hidden")},300))}function Pe(){document.addEventListener("click",async t=>{const o=t.target.closest(".edit-btn");if(o){t.preventDefault(),t.stopPropagation(),pe(o.dataset.slug);return}const a=t.target.closest(".delete-btn");if(a){t.preventDefault(),t.stopPropagation(),he(a.dataset.slug);return}const e=t.target.closest(".like-btn");if(e){t.preventDefault(),be(e);return}const n=t.target.closest(".comment-btn");if(n){t.preventDefault(),ie(n);return}const s=t.target.closest(".share-btn");if(s){t.preventDefault(),Se(s);return}const r=t.target.closest(".likes-info");if(r&&!r.classList.contains("disabled")){t.preventDefault(),t.stopPropagation();const m=r.dataset.slug;if(!m)return;Le(m);return}const l=document.querySelector(".likes-modal.active");if(l&&!l.contains(t.target)){const m=l.id.replace("likesModal-","");Ee(m)}const i=t.target.closest(".delete-comment-btn");i&&(t.preventDefault(),t.stopPropagation(),ce(i));const c=t.target.closest(".menu-btn"),h=t.target.closest(".menu-options");!c&&!h&&document.querySelectorAll(".menu-options").forEach(m=>m.classList.add("hidden")),c&&c.nextElementSibling.classList.toggle("hidden"),q?.classList.contains("show")&&!q.contains(t.target)&&![...oe].some(m=>m.contains(t.target))&&q.classList.remove("show"),F?.classList.contains("active")&&!F.contains(t.target)&&!ne.contains(t.target)&&F.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function Ie(){const t=`scroll:${window.location.pathname}${window.location.search}`,o=sessionStorage.getItem(t);o!==null&&(window.scrollTo(0,Number(o)),sessionStorage.removeItem(t))}async function Z(){const t=window.location.pathname,{page:o}=$();t==="/"||t.endsWith("index.html")?(S(),await ge(),await L(o),await we()):t.endsWith("my-posts.html")?(S(),await Q(o)):t.endsWith("post.html")?(S(),await z()):t.endsWith("saved.html")?(S(),await X(o)):t.startsWith("/post/")?(S(),z()):(S(),await L(o)),Ie()}document.addEventListener("DOMContentLoaded",async()=>{const t=await ae();window.currentUser=t,re(),V(),Pe(),me(),le();const o=localStorage.getItem("theme")||"light";Y(o),await Z(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),ye()});window.addEventListener("pageshow",t=>{if(t.persisted){const o=localStorage.getItem("theme")||"light";Y(o),V()}});window.addEventListener("popstate",()=>{Z()});
