import{a as u,C as M,s as d,b as x,c as j,A as p,h as U,d as H,u as q,e as oe,m as F,f as ne,g as ae,i as re,j as V,l as le,k as Y}from"./api-BOA6rqPC.js";async function ie(e){const n=e.dataset.slug;if(!n)return;const a=window.location.pathname.endsWith("post.html"),t=a?document.getElementById("singlePostContainer"):e.closest(".post");if(!t)return;const s=t.querySelector(".comments-section"),o=s?.querySelector(".comments-list");!s||!o||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await K(n,o))}async function ce(e){if(e.dataset.deleting==="true")return;e.dataset.deleting="true";const n=e.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){e.dataset.deleting="false";return}try{const t=await u(`${M}/${n}`,{method:"DELETE"}),s=await t.json();if(t.ok){const o=e.closest(".comment");o&&o.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):e.closest(".post"))?.querySelector(".comment-count");if(l){let i=parseInt(l.textContent)||0;i=Math.max(i-1,0),l.textContent=i,l.title=`${i} comment${i!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(t){console.error("Error deleting comment:",t),d("Error deleting comment. Please try again.","error")}finally{e.dataset.deleting="false"}}async function K(e,n,a=3){try{n.innerHTML='<p class="loading-comments">Loading comments...</p>';const t=await u(`${M}/post/${e}?_=${Date.now()}`);if(!t.ok)throw new Error("Failed to fetch comments");const s=await t.json();if(n.innerHTML="",s.length===0){n.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const o=s.slice(0,a);if(A(o,n),s.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${s.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",A(s,l);let i=!1;r?.addEventListener("click",()=>{i=!i,i?(n.innerHTML="",n.appendChild(l),n.appendChild(r),l.style.display="block",r.textContent="View less comments"):(n.innerHTML="",A(o,n),r.textContent=`View all ${s.length} comments`,n.appendChild(r))}),n.appendChild(r)}}catch(t){console.error("Error fetching comments:",t),n.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function A(e,n){const a=window.currentUser?.id||window.currentUser?._id;e.forEach(t=>{const s=document.createElement("div");s.classList.add("comment");const o=typeof t.authorId=="object"?t.authorId._id:t.authorId,r=a&&o&&o.toString()===a.toString();s.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${t.authorId?.name||"Anonymous"}:</strong> ${W(t.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${t._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(t.createdAt).toLocaleString()}">
        ${I(t.createdAt)}
      </small>
    `,n.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${t.authorId?._id}`})})}async function de(e,n,a,t){try{const s=await u(`${M}/post/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n})});if(s.ok){const r=(await s.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
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
      `,a.prepend(l),t&&t){let i=parseInt(t.textContent)||0;t.textContent=i+1,t.title=`${i+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),d("Failed to post comment","error")}}async function G(e,n){try{const a=await u(`${M}/post/${e}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(n.textContent="0",n.title="No comments yet"):(n.textContent=s,n.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),n.textContent="0"}}async function ue(e){const n=e.target.closest(".comment-form"),a=n.querySelector(".comment-form button");if(!n)return;e.preventDefault();const t=n.querySelector(".comment-input"),s=t.value.trim();if(!s)return;let o,r,l,i;window.location.pathname.endsWith("post.html")?(o=document.getElementById("singlePostContainer"),r=o.querySelector(".comments-list"),l=o.querySelector(".comment-btn").dataset.slug,i=o.querySelector(".comment-count")):(o=n.closest(".post"),r=o.querySelector(".comments-list"),l=o.querySelector(".like-btn").dataset.slug,i=o.querySelector(".comment-count"));const c=h=>{a.disabled=h,a.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),t.value="",c(!1);return}await de(l,s,r,i),t.value=""}catch{c(!1)}finally{c(!1)}}function me(){document.addEventListener("submit",ue)}const N=document.querySelectorAll(".search");function R(){return[...N].find(e=>e.value.trim())?.value.trim()||""}let f={all:[],featured:[],mine:[],saved:[]},k=1;function O(e){return e&&e.startsWith("http")?e:"/Images/fallback.jpg"}function $(){const e=new URLSearchParams(window.location.search);return{page:Number(e.get("page"))||1,category:e.get("category")||"",search:e.get("search")||""}}function E({page:e,category:n,search:a},{replace:t=!1}={}){const s=new URL(window.location);e===1?s.searchParams.delete("page"):s.searchParams.set("page",e),n?s.searchParams.set("category",n):s.searchParams.delete("category"),a?s.searchParams.set("search",a):s.searchParams.delete("search"),t?history.replaceState({page:e,category:n,search:a},"",s):history.pushState({page:e,category:n,search:a},"",s)}function S(){const{category:e,search:n}=$(),a=document.getElementById("categoryFilter");a&&(a.value=e||"all"),N.forEach(t=>{t.value=n||""})}async function L(e,n=6){try{const a=$(),t=e??a.page,s=document.getElementById("categoryFilter")?.value||a.category,o=R()||a.search;E({page:t,category:s!=="all"?s:"",search:o},{replace:!0});const r=new URLSearchParams({page:t,limit:n});s&&s!=="all"&&r.append("category",s),o&&r.append("search",o),t===1?x("allPostsContainer",n):j();const i=await(await u(`${p}?${r.toString()}`)).json();f.all=Array.isArray(i.posts)?i.posts:[],k=i.totalPages??1,_("allPostsContainer"),T("allPostsContainer",t,k)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{U(),H()}}async function ge(e=3){try{x("featuredPostsContainer",e);const a=await(await u(`${p}?page=1&limit=${e}`)).json();f.featured=Array.isArray(a.posts)?a.posts:[],_("featuredPostsContainer",e)}catch(n){console.error("Failed to load featured posts",n)}finally{U()}}async function Q(e,n=6){try{const a=$(),t=e??a.page,s=R()||a.search;a.search,E({page:t,search:s},{replace:!0});const o=new URLSearchParams({page:t,limit:n});s&&o.append("search",s),t===1?x("allPostsContainer",n):j();const r=await u(`${p}/mine?${o.toString()}`);if(!r.ok){const i=await r.text();throw new Error(i||"Failed to fetch your posts")}const l=await r.json();f.mine=Array.isArray(l.posts)?l.posts:[],k=l.totalPages||1,_("myPostsContainer"),T("myPostsContainer",t,k)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{U(),H()}}function I(e){const n=Math.floor((Date.now()-new Date(e))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],t=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const o=Math.floor(n/s.seconds);if(o>=1)return t.format(-o,s.label)}return"Just now"}function W(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML.replace(/\n/g,"<br>")}function _(e,n=null){const a=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(e);if(!t)return;t.innerHTML="";let s=[];if(e==="allPostsContainer"?s=[...f.all]:e==="featuredPostsContainer"?s=[...f.featured]:e==="myPostsContainer"?s=[...f.mine]:e==="savedPostsContainer"&&(s=[...f.saved]),n&&(s=s.slice(0,n)),s.length===0){e==="myPostsContainer"?t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:t.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}s.forEach(o=>{const r=document.createElement("div");r.classList.add("post");const l=o.content.length>150?o.content.substring(0,150)+"...":o.content,i=typeof o.authorId=="object"&&o.authorId!==null?o.authorId._id:o.authorId,c=typeof o.authorId=="object"&&o.authorId!==null?o.authorId.name:o.authorName||"Unknown",h=a&&String(i)===String(a);r.innerHTML=`
      ${o.image?`<a href="post.html?slug=${o.slug}">
             <img src="${O(o.image)}" alt="${o.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${o.category}</p>
        <h2>
          <a href="post.html?slug=${o.slug}" class="post-link">${o.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${o.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${i}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(o.date).toLocaleString()}">
          ${I(o.date)}
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
    `,t.appendChild(r);const m=r.querySelector(".post-image");m&&(m.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=r.querySelector(".like-btn"),P=g.querySelector("i"),y=r.querySelector(".liked-by");y.dataset.slug=o.slug,y.dataset.likedBy=JSON.stringify(o.likedBy||[]),g.classList.toggle("liked",o.likedByUser),P.className=o.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",o.likesCount?(y.textContent=o.likesCount===1?`Liked by ${o.likedBy[0]}`:`Liked by ${o.likedBy[0]} and ${o.likedBy.length-1} others`,y.classList.remove("disabled")):(y.textContent="No likes yet",y.classList.add("disabled"));const C=r.querySelector(".comment-count");G(o.slug,C)})}async function fe(e,n,a,t){const s=new FormData;s.append("title",e),s.append("content",n),s.append("category",a),t&&s.append("image",t);const o=await u(`${p}`,{method:"POST",body:s});if(!o.ok)throw new Error("Failed to add post");return await o.json()}async function he(e){if(confirm("Are you sure you want to delete this post?"))try{const n=await u(`${p}/${e}`,{method:"DELETE"});if(!n.ok){const t=await n.text();throw new Error(t||"Failed to delete post")}d("Post deleted successfully!","success");const{page:a}=$();window.location.pathname.endsWith("my-posts.html")?Q(a):L(a)}catch(n){console.error("Error deleting post:",n),d("Failed to delete post!","error")}}function pe(e){e&&(localStorage.setItem("editSlug",e),window.location.href="write.html")}function ye(){const e=document.getElementById("postForm"),n=document.querySelector(".add-post-btn");if(!e)return;const a=localStorage.getItem("editSlug"),t=s=>{n.disabled=s,n.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await u(`${p}/${a}`);if(!s.ok)throw new Error("Post not found");const o=await s.json();if(document.getElementById("title").value=o.title||"",document.getElementById("content").value=o.content||"",document.getElementById("category").value=o.category||"",o.image){const r=document.getElementById("imagePreview");r.src=o.image,r.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),e.onsubmit=async function(s){s.preventDefault();const o=new FormData;o.append("title",document.getElementById("title").value),o.append("content",document.getElementById("content").value),o.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&o.append("image",r);try{t(!0);const l=await u(`${p}/${a}`,{method:"PUT",body:o});l.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),d("Failed to update post!","error")}finally{t(!1)}}):(localStorage.removeItem("editSlug"),e?.addEventListener("submit",async function(s){s.preventDefault();const o=document.getElementById("title").value,r=document.getElementById("content").value,l=document.getElementById("category").value,i=document.getElementById("image").files[0];console.log("Submitting new post:",{title:o,content:r,category:l,imageFile:i});try{t(!0);const c=await fe(o,r,l,i);console.log("Post created successfully!",c),d("Post created successfully!","success"),e.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{t(!1)}}))}async function z(){const n=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(n&&u(`/api/posts/${n}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!n){try{let ee=function(v){w.dataset.saved=v?"true":"false",w.classList.toggle("saved",v);const b=w.querySelector("i");b.classList.toggle("fa-solid",v),b.classList.toggle("fa-regular",!v)};const a=await u(`${p}/${n}`);if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),s=window.currentUser?._id||window.currentUser?.id,o=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",l=s&&String(o)===String(s),i=document.getElementById("singlePostContainer");i.innerHTML=`
      ${t.image?`<img src="${O(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${o}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(t.date).toLocaleString()}">
        ${I(t.date)}
      </small>
      <div class="content">
        <p>${W(t.content)}</p>
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
    `;const c=i.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=i?.querySelector(".like-btn"),m=h?.querySelector("i"),g=i?.querySelector(".liked-by");g.dataset.slug=t.slug,g.dataset.likedBy=JSON.stringify(t.likedBy||[]),h.classList.toggle("liked",t.likedByUser),m.className=t.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",t.likesCount?(g.textContent=t.likesCount===1?`Liked by ${t.likedBy[0]}`:`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`,g.classList.remove("disabled")):(g.textContent="No likes yet",g.classList.add("disabled"));const P=i.querySelector(".comment-count");G(t.slug,P);const y=document.querySelector(".comments-section"),C=y.querySelector(".comments-list");y&&C&&await K(t.slug,C,1/0);const w=i.querySelector(".bookmark");w?.addEventListener("click",async()=>{const v=w.dataset.slug,b=w.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const te=b?`/api/posts/${v}/unsave`:`/api/posts/${v}/save`;try{const B=await u(te,{method:"POST"}),se=await B.json();if(!B.ok)throw new Error(se.message||"Failed to toggle bookmark");ee(!b),d(b?"Removed from saved posts":"Post saved","success")}catch(B){console.error("Failed to toggle bookmark",B),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}ke(n)}}const we=async()=>{const n=await(await u(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=n.map((t,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${t.slug}" class="trending-title">${t.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function ve(e){const n=document.getElementById("related-posts-container");if(!e.length){n.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}n.innerHTML=e.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const ke=async e=>{try{const a=await(await u(`${p}/slug/${e}/related`)).json();ve(a)}catch(n){console.error("Failed to fetch related posts.",n)}},$e=document.getElementById("savedPostsContainer");async function X(e,n=6){const a=$e;try{const t=$(),s=e??t.page,o=R()||t.search;E({page:s,search:o},{replace:!0});const r=new URLSearchParams({page:s,limit:n});o&&r.append("search",o),s===1?x("allPostsContainer",n):j();const l=await u(`${p}/saved/me?${r.toString()}`);if(!l.ok)throw new Error("Failed to fetch");const i=await l.json();if(f.saved=Array.isArray(i.posts)?i.posts:[],k=i.totalPages||1,!a)return;if(f.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=f.saved.map(c=>`
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async h=>{h.stopPropagation();const m=c.dataset.slug;try{await u(`${p}/${m}/unsave`,{method:"POST"}),f.saved=f.saved.filter(P=>P.slug!==m),c.closest(".post-card").remove(),d("Removed from saved posts","success");const{page:g}=$();f.saved.length===0&&g>1?X(g-1):T("savedPostsContainer",g,k)}catch(g){console.error(g),d("Failed to remove","error")}})}),T("savedPostsContainer",s,k)}catch(t){console.error(t),a.innerHTML="<p>Error loading saved posts.</p>"}finally{U(),H()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{E({page:1}),L(1)});let J;N.forEach(e=>e?.addEventListener("keyup",()=>{clearTimeout(J),J=setTimeout(()=>{E({page:1}),L(1)},400)}));function T(e,n,a){const t=document.getElementById("pagination");if(t){t.innerHTML="";for(let s=1;s<=a;s++){const o=document.createElement("button");o.textContent=s,o.className=s===n?"pg-active":"",o?.addEventListener("click",async()=>{E({page:s}),L(s)}),t.appendChild(o)}}}async function be(e){const n=e.dataset.slug,a=e.querySelector("i"),t=e.querySelector(".like-count"),s=e.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){d("Please log in to like or unlike posts.","error");return}const o=e.classList.contains("liked");try{const r=await u(`/api/posts/${n}/${o?"unlike":"like"}`,{method:"POST"}),l=await r.json();if(r.ok){e.classList.toggle("liked",!o),a.className=o?"fa-regular fa-heart":"fa-solid fa-heart";const i=l.likesCount??l.likes??0;t.textContent=i,s&&(i?(s.textContent=i===1?"1 like":`${i} likes`,s.classList.remove("disabled")):(s.textContent="No likes yet",s.classList.add("disabled")),Array.isArray(l.likedBy)&&(s.dataset.slug=n,s.dataset.likedBy=JSON.stringify(l.likedBy)))}else d(`Failed to update likes: ${l.message}`,"error")}catch(r){console.error("Like action failed:",r),d("Error updating like. Please try again.","error")}}const Se=async e=>{const n=e.dataset.slug,a=`${window.location.origin}/post/${n}`,t=`shared_${n}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:a}):(await navigator.clipboard.writeText(a),d("Link copied to clipboard!","success")),sessionStorage.getItem(t)||(sessionStorage.setItem(t,"true"),u(`/api/posts/${n}/share`,{method:"POST"}).catch(()=>{}));const s=e.querySelector(".share-count");s&&(s.textContent=Number(s.textContent)+1)}catch(s){d("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",s)}};let D=!1;async function Le(e){if(D)return;const n=encodeURIComponent(e),a=document.getElementById(`likesModal-${n}`),t=document.getElementById(`likesList-${n}`);if(!(!a||!t)&&!a.classList.contains("active")){D=!0,a.classList.remove("hidden"),requestAnimationFrame(()=>a.classList.add("active")),t.innerHTML="<li>Loading...</li>";try{const o=await(await u(`/api/posts/${e}/likes`)).json();if(t.innerHTML="",!Array.isArray(o.users)||o.users.length===0){t.innerHTML="<li>No likes yet</li>";return}o.users.forEach(r=>{const l=document.createElement("li");l.textContent=r,t.appendChild(l)})}catch(s){t.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",s)}}}function Ee(e){const n=encodeURIComponent(e),a=document.getElementById(`likesModal-${n}`);a&&(D=!1,a.classList.remove("active"),setTimeout(()=>{a.classList.add("hidden")},300))}function Pe(){document.addEventListener("click",async e=>{const n=e.target.closest(".edit-btn");if(n){e.preventDefault(),e.stopPropagation(),pe(n.dataset.slug);return}const a=e.target.closest(".delete-btn");if(a){e.preventDefault(),e.stopPropagation(),he(a.dataset.slug);return}const t=e.target.closest(".like-btn");if(t){e.preventDefault(),be(t);return}const s=e.target.closest(".comment-btn");if(s){e.preventDefault(),ie(s);return}const o=e.target.closest(".share-btn");if(o){e.preventDefault(),Se(o);return}const r=e.target.closest(".likes-info");if(r&&!r.classList.contains("disabled")){e.preventDefault(),e.stopPropagation();const m=r.dataset.slug;if(!m)return;Le(m);return}const l=document.querySelector(".likes-modal.active");if(l&&!l.contains(e.target)){const m=l.id.replace("likesModal-","");Ee(m)}const i=e.target.closest(".delete-comment-btn");i&&(e.preventDefault(),e.stopPropagation(),ce(i));const c=e.target.closest(".menu-btn"),h=e.target.closest(".menu-options");!c&&!h&&document.querySelectorAll(".menu-options").forEach(m=>m.classList.add("hidden")),c&&c.nextElementSibling.classList.toggle("hidden"),q?.classList.contains("show")&&!q.contains(e.target)&&![...oe].some(m=>m.contains(e.target))&&q.classList.remove("show"),F?.classList.contains("active")&&!F.contains(e.target)&&!ne.contains(e.target)&&F.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function Ie(){const e=`scroll:${window.location.pathname}${window.location.search}`,n=sessionStorage.getItem(e);n!==null&&(window.scrollTo(0,Number(n)),sessionStorage.removeItem(e))}async function Z(){const e=window.location.pathname,{page:n}=$();e==="/"||e.endsWith("index.html")?(S(),await ge(),await L(n),await we()):e.endsWith("my-posts.html")?(S(),await Q(n)):e.endsWith("post.html")?(S(),await z()):e.endsWith("saved.html")?(S(),await X(n)):e.startsWith("/post/")?(S(),z()):(S(),await L(n)),Ie()}document.addEventListener("DOMContentLoaded",async()=>{const e=await ae();window.currentUser=e,re(),V(),Pe(),me(),le();const n=localStorage.getItem("theme")||"light";Y(n),await Z(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),ye()});window.addEventListener("pageshow",e=>{if(e.persisted){const n=localStorage.getItem("theme")||"light";Y(n),V()}});window.addEventListener("popstate",()=>{Z()});
