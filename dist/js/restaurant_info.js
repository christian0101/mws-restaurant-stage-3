let restaurant,reviews;var map;document.addEventListener("DOMContentLoaded",e=>{DBHelper.registerServiceWorker(),this._toastsView=new Toast,fetchRestaurantFromURL()}),window.initMap=(()=>{self.restaurant&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return;const e=getParameterByName("id");e?DBHelper.fetchDataById("restaurants",e,(t,n)=>{self.restaurant=n,!t||n?DBHelper.fetchReviewsByRestaurantId(e,(e,t)=>{self.reviews=t.reverse(),e&&showNotification(e),fillRestaurantHTML(),Helper.lazyLoad()}):showNotification(t)}):showNotification("No restaurant id in URL")}),fillRestaurantHTML=((e=self.restaurant)=>{fillBreadcrumb();const t=document.getElementsByTagName("head")[0],n=document.createElement("meta");n.setAttribute("name","description"),n.setAttribute("content",`Detailed information about ${e.name}`),t.append(n);const a=document.getElementById("restaurant-name");a.innerHTML=e.name,a.title="restaurant name";const r=document.createElement("input");r.type="checkbox",r.name="favourite",r.value="favourite",r.id="favourite",r.checked=e.is_favorite,r.setAttribute("onchange","updateIsFavourite()");const i=document.createElement("label");i.setAttribute("for","favourite"),a.appendChild(r),a.appendChild(i);const o=document.getElementById("restaurant-address");o.innerHTML=e.address,o.title="restaurant address";const s=DBHelper.imageUrlForRestaurant(e,!0),l=document.getElementById("restaurant-img");l.className="restaurant-img",l.classList.add("lazy"),l.src=s,l.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),l.setAttribute("data-srcset",DBHelper.imageSRCSetUrlsForRestaurant(e,["1x","2x"])),l.alt=e.photograph?DBHelper.getPhotoDescription(e):"no picture found";const d=document.getElementById("restaurant-cuisine");d.innerHTML=e.cuisine_type,d.title="restaurant cuisine type",e.operating_hours&&fillRestaurantHoursHTML(),fillSubmitReviewFormHTML(),fillReviewsHTML()}),updateIsFavourite=((e=self.restaurant)=>{const t=e.is_favorite?0:1;let n=new XMLHttpRequest;n.addEventListener("load",function(n){showNotification(`Restaurant is ${t?"favourite now :)":"not favourite anymore :("}`),e.is_favorite=!!t}),n.addEventListener("error",function(e){showNotification("Oops! Something went wrong. :(")}),n.open("PUT",window.location.href,!0),n.send(`is_favorite=${t}&restaurant_id=${e.id}`)}),showNotification=((e,t={buttons:["dismiss"]})=>{this._toastsView.create(e,t)}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,r.className="openhours-day",a.appendChild(r);const i=document.createElement("td");i.innerHTML=e[n],i.className="openhours-time",a.appendChild(i),t.appendChild(a)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),0===e.length){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.className="review-name",n.title="reviewer's name",t.appendChild(n);const a=document.createElement("p"),r=new Date(e.createdAt).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});a.innerHTML=r,a.className="review-date",a.title="date when review was posted",t.appendChild(a);const i=document.createElement("p");i.innerHTML=`Rating: ${e.rating}`,i.className="review-rating",i.title="given rating",t.appendChild(i);const o=document.createElement("p");return o.innerHTML=e.comments,o.className="review-comments",o.title="comments from the reviewer",t.appendChild(o),t}),fillSubmitReviewFormHTML=((e=self.restaurant)=>{const t=document.getElementById("reviews-list"),n=document.createElement("li"),a=document.createElement("form");a.id="form-review",a.method="POST",a.setAttribute("aria-label","Add review for restaurant");const r=document.createElement("input");r.id="restaurant_id",r.name="restaurant_id",r.type="hidden",r.value=e.id,a.appendChild(r);const i=document.createElement("p");i.className="review-name";const o=document.createElement("label");o.innerHTML="* Name:",o.for="uName",o.title="reviewer's name",i.appendChild(o);const s=document.createElement("input");s.id="uName",s.name="name",s.placeholder="Your Name",s.setAttribute("aria-required","true"),s.setAttribute("aria-label","Your name"),o.appendChild(s),a.appendChild(i);const l=document.createElement("p"),d=(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});l.innerHTML=d,l.className="review-date",l.title="date when review is posted",a.appendChild(l);const c=document.createElement("p");c.className="review-rating";const m=document.createElement("label");m.innerHTML="Rating:";const u=document.createElement("select");u.name="rating";for(var p=1;p<=5;p++){const e=document.createElement("option");e.value=p,e.innerHTML=p,u.appendChild(e)}m.appendChild(u),c.appendChild(m),a.appendChild(c);const h=document.createElement("p");h.className="review-comments";const w=document.createElement("label");w.innerHTML="* Comments:";const f=document.createElement("textarea");f.name="comments",f.id="commentsText",f.setAttribute("aria-required","true"),f.setAttribute("aria-label","Additional comments for the review"),h.appendChild(w),h.appendChild(f),a.appendChild(h);const v=document.createElement("p"),g=document.createElement("button");g.id="submitBtn",g.type="submit",g.innerHTML="Submit Review!",g.value="Submit",g.setAttribute("aria-label","Submit review"),v.appendChild(g),a.appendChild(v),n.appendChild(a),t.appendChild(n),a.addEventListener("submit",function(e){e.preventDefault(),submitReview(a)})}),submitReview=(e=>{const t=new FormData(e),n={};let a=!1;if(t.forEach(function(e,t){const r=escape(e);""===r&&(showNotification(`Oh no! Something went wrong, please check ${t} field`),a=!0),n[t]=r}),a)return;let r=e.parentNode.parentNode;const i=(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});n.createdAt=i,DBHelper._updateDB("new",n);let o=createReviewHTML(n);return navigator.serviceWorker.ready.then(e=>e.sync.register("send-reviews")).then(()=>{showNotification("Your review will be posted as soon as possible."),r.insertBefore(o,e.parentNode),r.removeChild(e.parentNode)}).catch(()=>{showNotification("Error")})}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwicmV2aWV3cyIsIm1hcCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiREJIZWxwZXIiLCJyZWdpc3RlclNlcnZpY2VXb3JrZXIiLCJ0aGlzIiwiX3RvYXN0c1ZpZXciLCJUb2FzdCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJ3aW5kb3ciLCJpbml0TWFwIiwic2VsZiIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJsYXRsbmciLCJzY3JvbGx3aGVlbCIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJpZCIsImdldFBhcmFtZXRlckJ5TmFtZSIsImZldGNoRGF0YUJ5SWQiLCJlcnJvciIsImZldGNoUmV2aWV3c0J5UmVzdGF1cmFudElkIiwicmV2ZXJzZSIsInNob3dOb3RpZmljYXRpb24iLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJIZWxwZXIiLCJsYXp5TG9hZCIsImZpbGxCcmVhZGNydW1iIiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZGVzY3JpcHRpb24iLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwibmFtZSIsImFwcGVuZCIsImlubmVySFRNTCIsInRpdGxlIiwiZmF2b3VyaXRlVG9nZ2xlIiwidHlwZSIsInZhbHVlIiwiY2hlY2tlZCIsImlzX2Zhdm9yaXRlIiwidG9nZ2xlTGJsIiwiYXBwZW5kQ2hpbGQiLCJhZGRyZXNzIiwiaW1nU3JjIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1hZ2UiLCJjbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJzcmMiLCJpbWFnZVNSQ1NldFVybHNGb3JSZXN0YXVyYW50IiwiYWx0IiwiZ2V0UGhvdG9EZXNjcmlwdGlvbiIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImZpbGxTdWJtaXRSZXZpZXdGb3JtSFRNTCIsImZpbGxSZXZpZXdzSFRNTCIsInVwZGF0ZUlzRmF2b3VyaXRlIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwibG9jYXRpb24iLCJocmVmIiwic2VuZCIsIm1zZyIsIm9wdGlvbnMiLCJidXR0b25zIiwiY3JlYXRlIiwib3BlcmF0aW5nSG91cnMiLCJob3VycyIsImtleSIsInJvdyIsImRheSIsInRpbWUiLCJjb250YWluZXIiLCJsZW5ndGgiLCJub1Jldmlld3MiLCJ1bCIsImZvckVhY2giLCJyZXZpZXciLCJjcmVhdGVSZXZpZXdIVE1MIiwibGkiLCJkYXRlIiwiY3JlYXRlZEF0IiwiRGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIm1vbnRoIiwieWVhciIsInJhdGluZyIsImNvbW1lbnRzIiwiZm9ybSIsIm1ldGhvZCIsInJlc3RhdXJhbnRJRCIsIm5hbWVTaGVsbCIsIm5hbWVMYmwiLCJmb3IiLCJuYW1lSW5wdXQiLCJwbGFjZWhvbGRlciIsIm5vdyIsInJhdGluZ1NoZWxsIiwicmF0aW5nTGJsIiwicmF0aW5nT3B0aW9ucyIsImkiLCJvcHRpb24iLCJjb21tZW50c1NoZWxsIiwiY29tbWVudHNMYmwiLCJjb21tZW50c1RleHQiLCJzdWJtaXRTaGVsbCIsInN1Ym1pdEJ0biIsInByZXZlbnREZWZhdWx0Iiwic3VibWl0UmV2aWV3IiwiRkQiLCJGb3JtRGF0YSIsImJhZERhdGEiLCJzYWZlU3RyIiwiZXNjYXBlIiwicGFyZW50Tm9kZSIsIl91cGRhdGVEQiIsInJldmlld05vZGUiLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVhZHkiLCJ0aGVuIiwicmVnIiwic3luYyIsInJlZ2lzdGVyIiwiaW5zZXJ0QmVmb3JlIiwicmVtb3ZlQ2hpbGQiLCJjYXRjaCIsImJyZWFkY3J1bWIiLCJ1cmwiLCJyZXBsYWNlIiwicmVzdWx0cyIsIlJlZ0V4cCIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiXSwibWFw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QUN0QnZHLFNBQVMwSCxVQUFVLE1BQU90QyxHQUUxQixJQUFJdUMsRUFBYXRDLGlCQUFpQkQsR0FFbEMsT0FBT3dDLFVBQVVDLGNBQWNDLE1BQU1DLEtBQUtDLEdBQ2pDQSxFQUFJQyxLQUFLQyxTQUFTLGlCQUN4QkgsS0FBSyxLQUNOdkcsaUJBQWlCLG1EQUNqQjBELEVBQUdpRCxhQUFhUixFQUFZNUIsRUFBSzBCLFlBQ2pDdkMsRUFBR2tELFlBQVlyQyxFQUFLMEIsY0FDbkJZLE1BQU0sS0FDUDdHLGlCQUFpQixhQU9yQkksZUFBaUIsRUFBQ2xDLEVBQWFjLEtBQUtkLGNBQ2xDLE1BQU00SSxFQUFhekksU0FBU2UsZUFBZSxjQUNyQzBFLEVBQUt6RixTQUFTbUMsY0FBYyxNQUNsQ3NELEVBQUdyRCxhQUFhLGVBQWdCLFFBQ2hDcUQsRUFBR2xELFVBQVkxQyxFQUFXd0MsS0FDMUJvRyxFQUFXMUYsWUFBWTBDLEtBTXpCbkUsbUJBQXFCLEVBQUNlLEVBQU1xRyxLQUNyQkEsSUFDSEEsRUFBTWpJLE9BQU80RCxTQUFTQyxNQUN4QmpDLEVBQU9BLEVBQUtzRyxRQUFRLFVBQVcsUUFDL0IsTUFDRUMsRUFEWSxJQUFJQyxjQUFjeEcsc0JBQ2R5RyxLQUFLSixHQUN2QixPQUFLRSxFQUVBQSxFQUFRLEdBRU5HLG1CQUFtQkgsRUFBUSxHQUFHRCxRQUFRLE1BQU8sTUFEM0MsR0FGQSIsImZpbGUiOiJyZXN0YXVyYW50X2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgcmVzdGF1cmFudCwgcmV2aWV3cztcbnZhciBtYXA7XG5cbi8qKlxuICogRmV0Y2ggZGF0YSBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICBEQkhlbHBlci5yZWdpc3RlclNlcnZpY2VXb3JrZXIoKTtcbiAgdGhpcy5fdG9hc3RzVmlldyA9IG5ldyBUb2FzdCgpO1xuICBmZXRjaFJlc3RhdXJhbnRGcm9tVVJMKCk7XG59KTtcblxuLyoqXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXG4gKi9cbndpbmRvdy5pbml0TWFwID0gKCkgPT4ge1xuICBpZiAoc2VsZi5yZXN0YXVyYW50KSB7XG4gICAgc2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgem9vbTogMTYsXG4gICAgICBjZW50ZXI6IHNlbGYucmVzdGF1cmFudC5sYXRsbmcsXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2VcbiAgICB9KTtcbiAgICBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHNlbGYucmVzdGF1cmFudCwgc2VsZi5tYXApO1xuICB9XG59XG5cbi8qKlxuICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICovXG5mZXRjaFJlc3RhdXJhbnRGcm9tVVJMID0gKCkgPT4ge1xuICBpZiAoc2VsZi5yZXN0YXVyYW50KSB7IC8vIHJlc3RhdXJhbnQgYWxyZWFkeSBmZXRjaGVkIVxuICAgIC8vY2FsbGJhY2sobnVsbCwgc2VsZi5yZXN0YXVyYW50KVxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBpZCA9IGdldFBhcmFtZXRlckJ5TmFtZSgnaWQnKTtcbiAgaWYgKCFpZCkge1xuICAgIC8vIG5vIGlkIGZvdW5kIGluIFVSTFxuICAgIHNob3dOb3RpZmljYXRpb24oJ05vIHJlc3RhdXJhbnQgaWQgaW4gVVJMJyk7XG4gICAgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIERCSGVscGVyLmZldGNoRGF0YUJ5SWQoJ3Jlc3RhdXJhbnRzJywgaWQsIChlcnJvciwgcmVzdGF1cmFudCkgPT4ge1xuICAgICAgc2VsZi5yZXN0YXVyYW50ID0gcmVzdGF1cmFudDtcbiAgICAgIGlmIChlcnJvciAmJiAhcmVzdGF1cmFudCkge1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBEQkhlbHBlci5mZXRjaFJldmlld3NCeVJlc3RhdXJhbnRJZChpZCwgKGVycm9yLCByZXZpZXdzKSA9PiB7XG4gICAgICAgIHNlbGYucmV2aWV3cyA9IHJldmlld3MucmV2ZXJzZSgpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBzaG93Tm90aWZpY2F0aW9uKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgICAgICBIZWxwZXIubGF6eUxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgZmlsbEJyZWFkY3J1bWIoKTtcblxuICBjb25zdCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG4gIGRlc2NyaXB0aW9uLnNldEF0dHJpYnV0ZSgnbmFtZScsICdkZXNjcmlwdGlvbicpO1xuICBkZXNjcmlwdGlvbi5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCBgRGV0YWlsZWQgaW5mb3JtYXRpb24gYWJvdXQgJHtyZXN0YXVyYW50Lm5hbWV9YCk7XG4gIGhlYWQuYXBwZW5kKGRlc2NyaXB0aW9uKTtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgbmFtZS50aXRsZSA9ICdyZXN0YXVyYW50IG5hbWUnO1xuICBjb25zdCBmYXZvdXJpdGVUb2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBmYXZvdXJpdGVUb2dnbGUudHlwZSA9ICdjaGVja2JveCc7XG4gIGZhdm91cml0ZVRvZ2dsZS5uYW1lID0gJ2Zhdm91cml0ZSc7XG4gIGZhdm91cml0ZVRvZ2dsZS52YWx1ZSA9ICdmYXZvdXJpdGUnO1xuICBmYXZvdXJpdGVUb2dnbGUuaWQgPSAnZmF2b3VyaXRlJztcbiAgZmF2b3VyaXRlVG9nZ2xlLmNoZWNrZWQgPSByZXN0YXVyYW50LmlzX2Zhdm9yaXRlO1xuICBmYXZvdXJpdGVUb2dnbGUuc2V0QXR0cmlidXRlKCdvbmNoYW5nZScsICd1cGRhdGVJc0Zhdm91cml0ZSgpJyk7XG4gIGNvbnN0IHRvZ2dsZUxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIHRvZ2dsZUxibC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdmYXZvdXJpdGUnKTtcbiAgbmFtZS5hcHBlbmRDaGlsZChmYXZvdXJpdGVUb2dnbGUpO1xuICBuYW1lLmFwcGVuZENoaWxkKHRvZ2dsZUxibCk7XG5cbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG4gIGFkZHJlc3MudGl0bGUgPSAncmVzdGF1cmFudCBhZGRyZXNzJztcblxuICBjb25zdCBpbWdTcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgdHJ1ZSk7XG4gIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaW1nJyk7XG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XG4gIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2xhenknKTtcbiAgaW1hZ2Uuc3JjID0gaW1nU3JjO1xuICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpKTtcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcsIERCSGVscGVyLmltYWdlU1JDU2V0VXJsc0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgWycxeCcsICcyeCddKSk7XG4gIGltYWdlLmFsdCA9IChyZXN0YXVyYW50LnBob3RvZ3JhcGgpID8gREJIZWxwZXIuZ2V0UGhvdG9EZXNjcmlwdGlvbihyZXN0YXVyYW50KSA6XG4gICdubyBwaWN0dXJlIGZvdW5kJztcblxuICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuICBjdWlzaW5lLnRpdGxlID0gJ3Jlc3RhdXJhbnQgY3Vpc2luZSB0eXBlJztcblxuICAvLyBmaWxsIG9wZXJhdGluZyBob3Vyc1xuICBpZiAocmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpIHtcbiAgICBmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCgpO1xuICB9XG4gIC8vIGZpbGwgc3VibWl0IHJldmlldyBmb3JtXG4gIGZpbGxTdWJtaXRSZXZpZXdGb3JtSFRNTCgpO1xuICAvLyBmaWxsIHJldmlld3NcbiAgZmlsbFJldmlld3NIVE1MKCk7XG59XG5cbi8qKlxuICogSGFkbGUgZmF2b3VyaXRlIHRvZ2dsZVxuICovXG4gdXBkYXRlSXNGYXZvdXJpdGUgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICAgY29uc3QgaXNfZmF2b3JpdGUgPSAocmVzdGF1cmFudC5pc19mYXZvcml0ZSkgPyAwIDogMTtcbiAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgLy8gRGVmaW5lIHdoYXQgaGFwcGVucyBvbiBzdWNjZXNzZnVsIGRhdGEgc3VibWlzc2lvblxuICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgIHNob3dOb3RpZmljYXRpb24oYFJlc3RhdXJhbnQgaXMgJHsoaXNfZmF2b3JpdGUpID8gJ2Zhdm91cml0ZSBub3cgOiknIDogJ25vdCBmYXZvdXJpdGUgYW55bW9yZSA6KCd9YCk7XG4gICAgIHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUgPSAoaXNfZmF2b3JpdGUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgfSk7XG5cbiAgIC8vIERlZmluZSB3aGF0IGhhcHBlbnMgaW4gY2FzZSBvZiBlcnJvclxuICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICBzaG93Tm90aWZpY2F0aW9uKCdPb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZy4gOignKTtcbiAgIH0pO1xuXG4gICB4aHIub3BlbignUFVUJywgd2luZG93LmxvY2F0aW9uLmhyZWYsIHRydWUpO1xuICAgeGhyLnNlbmQoYGlzX2Zhdm9yaXRlPSR7aXNfZmF2b3JpdGV9JnJlc3RhdXJhbnRfaWQ9JHtyZXN0YXVyYW50LmlkfWApO1xuIH1cblxuLyoqXG4gKiBEaXNwbGF5IG5vdGlmaWNhdGlvbnMuXG4gKi9cbnNob3dOb3RpZmljYXRpb24gPSAobXNnLCBvcHRpb25zID0ge2J1dHRvbnM6IFsnZGlzbWlzcyddfSkgPT4ge1xuICB0aGlzLl90b2FzdHNWaWV3LmNyZWF0ZShtc2csIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzID0gc2VsZi5yZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycykgPT4ge1xuICBjb25zdCBob3VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWhvdXJzJyk7XG4gIGZvciAobGV0IGtleSBpbiBvcGVyYXRpbmdIb3Vycykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cbiAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGRheS5pbm5lckhUTUwgPSBrZXk7XG4gICAgZGF5LmNsYXNzTmFtZSA9ICdvcGVuaG91cnMtZGF5JztcbiAgICByb3cuYXBwZW5kQ2hpbGQoZGF5KTtcblxuICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRpbWUuaW5uZXJIVE1MID0gb3BlcmF0aW5nSG91cnNba2V5XTtcbiAgICB0aW1lLmNsYXNzTmFtZSA9ICdvcGVuaG91cnMtdGltZSc7XG4gICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xuXG4gICAgaG91cnMuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJldmlld3NIVE1MID0gKHJldmlld3MgPSBzZWxmLnJldmlld3MpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgdGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gIGlmIChyZXZpZXdzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IG5vUmV2aWV3cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBub1Jldmlld3MuaW5uZXJIVE1MID0gJ05vIHJldmlld3MgeWV0ISc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5vUmV2aWV3cyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xuICByZXZpZXdzLmZvckVhY2gocmV2aWV3ID0+IHtcbiAgICB1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXZpZXdIVE1MKHJldmlldykpO1xuICB9KTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuY3JlYXRlUmV2aWV3SFRNTCA9IChyZXZpZXcpID0+IHtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICBuYW1lLmNsYXNzTmFtZSA9ICdyZXZpZXctbmFtZSc7XG4gIG5hbWUudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBsaS5hcHBlbmRDaGlsZChuYW1lKTtcblxuICBjb25zdCBkYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBvcHRpb25zID0ge21vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYyd9O1xuICBjb25zdCBjcmVhdGVkQXQgPSBuZXcgRGF0ZShyZXZpZXcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLXVzJywgb3B0aW9ucyk7XG4gIGRhdGUuaW5uZXJIVE1MID0gY3JlYXRlZEF0O1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXZpZXctZGF0ZSc7XG4gIGRhdGUudGl0bGUgPSAnZGF0ZSB3aGVuIHJldmlldyB3YXMgcG9zdGVkJztcbiAgbGkuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICByYXRpbmcuaW5uZXJIVE1MID0gYFJhdGluZzogJHtyZXZpZXcucmF0aW5nfWA7XG4gIHJhdGluZy5jbGFzc05hbWUgPSAncmV2aWV3LXJhdGluZyc7XG4gIHJhdGluZy50aXRsZSA9ICdnaXZlbiByYXRpbmcnO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGNvbW1lbnRzLmNsYXNzTmFtZSA9ICdyZXZpZXctY29tbWVudHMnO1xuICBjb21tZW50cy50aXRsZSA9ICdjb21tZW50cyBmcm9tIHRoZSByZXZpZXdlcic7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogIENyZWF0ZSBhIEhUTUwgc3VibWl0IGZvcm0gYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFN1Ym1pdFJldmlld0Zvcm1IVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG5cbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICBmb3JtLmlkID0gJ2Zvcm0tcmV2aWV3JztcbiAgZm9ybS5tZXRob2QgPSAnUE9TVCc7XG4gIGZvcm0uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0FkZCByZXZpZXcgZm9yIHJlc3RhdXJhbnQnKTtcblxuICBjb25zdCByZXN0YXVyYW50SUQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICByZXN0YXVyYW50SUQuaWQgPSAncmVzdGF1cmFudF9pZCc7XG4gIHJlc3RhdXJhbnRJRC5uYW1lID0gJ3Jlc3RhdXJhbnRfaWQnO1xuICByZXN0YXVyYW50SUQudHlwZSA9ICdoaWRkZW4nO1xuICByZXN0YXVyYW50SUQudmFsdWUgPSByZXN0YXVyYW50LmlkO1xuICBmb3JtLmFwcGVuZENoaWxkKHJlc3RhdXJhbnRJRCk7XG5cbiAgY29uc3QgbmFtZVNoZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lU2hlbGwuY2xhc3NOYW1lID0gJ3Jldmlldy1uYW1lJztcbiAgY29uc3QgbmFtZUxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIG5hbWVMYmwuaW5uZXJIVE1MID0gJyogTmFtZTonO1xuICBuYW1lTGJsLmZvciA9ICd1TmFtZSc7XG4gIG5hbWVMYmwudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBuYW1lU2hlbGwuYXBwZW5kQ2hpbGQobmFtZUxibCk7XG5cbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgbmFtZUlucHV0LmlkID0gJ3VOYW1lJztcbiAgbmFtZUlucHV0Lm5hbWUgPSAnbmFtZSdcbiAgbmFtZUlucHV0LnBsYWNlaG9sZGVyID0gJ1lvdXIgTmFtZSc7XG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcmVxdWlyZWQnLCAndHJ1ZScpXG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnWW91ciBuYW1lJyk7XG4gIG5hbWVMYmwuYXBwZW5kQ2hpbGQobmFtZUlucHV0KTtcbiAgZm9ybS5hcHBlbmRDaGlsZChuYW1lU2hlbGwpO1xuXG4gIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IG9wdGlvbnMgPSB7bW9udGg6ICdsb25nJywgZGF5OiAnbnVtZXJpYycsIHllYXI6ICdudW1lcmljJ307XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi11cycsIG9wdGlvbnMpO1xuICBkYXRlLmlubmVySFRNTCA9IG5vdztcbiAgZGF0ZS5jbGFzc05hbWUgPSAncmV2aWV3LWRhdGUnO1xuICBkYXRlLnRpdGxlID0gJ2RhdGUgd2hlbiByZXZpZXcgaXMgcG9zdGVkJztcbiAgZm9ybS5hcHBlbmRDaGlsZChkYXRlKTtcblxuICBjb25zdCByYXRpbmdTaGVsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgcmF0aW5nU2hlbGwuY2xhc3NOYW1lID0gJ3Jldmlldy1yYXRpbmcnO1xuICBjb25zdCByYXRpbmdMYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICByYXRpbmdMYmwuaW5uZXJIVE1MID0gJ1JhdGluZzonO1xuICBjb25zdCByYXRpbmdPcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gIHJhdGluZ09wdGlvbnMubmFtZSA9ICdyYXRpbmcnO1xuICBmb3IgKHZhciBpID0gMTsgaSA8PSA1OyBpKyspIHtcbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24udmFsdWUgPSBpO1xuICAgIG9wdGlvbi5pbm5lckhUTUwgPSBpO1xuICAgIHJhdGluZ09wdGlvbnMuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfVxuICByYXRpbmdMYmwuYXBwZW5kQ2hpbGQocmF0aW5nT3B0aW9ucyk7XG4gIHJhdGluZ1NoZWxsLmFwcGVuZENoaWxkKHJhdGluZ0xibCk7XG4gIGZvcm0uYXBwZW5kQ2hpbGQocmF0aW5nU2hlbGwpO1xuXG4gIGNvbnN0IGNvbW1lbnRzU2hlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbW1lbnRzU2hlbGwuY2xhc3NOYW1lID0gJ3Jldmlldy1jb21tZW50cyc7XG4gIGNvbnN0IGNvbW1lbnRzTGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29tbWVudHNMYmwuaW5uZXJIVE1MID0gJyogQ29tbWVudHM6JztcbiAgY29uc3QgY29tbWVudHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgY29tbWVudHNUZXh0Lm5hbWUgPSAnY29tbWVudHMnO1xuICBjb21tZW50c1RleHQuaWQgPSAnY29tbWVudHNUZXh0JztcbiAgY29tbWVudHNUZXh0LnNldEF0dHJpYnV0ZSgnYXJpYS1yZXF1aXJlZCcsICd0cnVlJylcbiAgY29tbWVudHNUZXh0LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdBZGRpdGlvbmFsIGNvbW1lbnRzIGZvciB0aGUgcmV2aWV3Jyk7XG4gIGNvbW1lbnRzU2hlbGwuYXBwZW5kQ2hpbGQoY29tbWVudHNMYmwpO1xuICBjb21tZW50c1NoZWxsLmFwcGVuZENoaWxkKGNvbW1lbnRzVGV4dCk7XG4gIGZvcm0uYXBwZW5kQ2hpbGQoY29tbWVudHNTaGVsbCk7XG5cbiAgY29uc3Qgc3VibWl0U2hlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBzdWJtaXRCdG4uaWQgPSAnc3VibWl0QnRuJztcbiAgc3VibWl0QnRuLnR5cGUgPSAnc3VibWl0JztcbiAgc3VibWl0QnRuLmlubmVySFRNTCA9ICdTdWJtaXQgUmV2aWV3ISc7XG4gIHN1Ym1pdEJ0bi52YWx1ZSA9ICdTdWJtaXQnO1xuICBzdWJtaXRCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1N1Ym1pdCByZXZpZXcnKTtcbiAgc3VibWl0U2hlbGwuYXBwZW5kQ2hpbGQoc3VibWl0QnRuKTtcbiAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXRTaGVsbCk7XG5cbiAgbGkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gIHVsLmFwcGVuZENoaWxkKGxpKTtcblxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHN1Ym1pdFJldmlldyhmb3JtKTtcbiAgfSk7XG59XG5cbi8qKlxuKiBTdWJtaXQgcmV2aWV3cyB0aG91Z2ggamF2YXNjcmlwdC5cbiovXG5zdWJtaXRSZXZpZXcgPSAoZm9ybSkgPT4ge1xuICAvLyBCaW5kIHRoZSBGb3JtRGF0YSBvYmplY3QgYW5kIHRoZSBmb3JtIGVsZW1lbnRcbiAgY29uc3QgRkQgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG5cbiAgY29uc3QgcmV2aWV3ID0ge307XG4gIGxldCBiYWREYXRhID0gZmFsc2U7XG4gIEZELmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIGNvbnN0IHNhZmVTdHIgPSBlc2NhcGUodmFsdWUpO1xuICAgIGlmIChzYWZlU3RyID09PSAnJykge1xuICAgICAgc2hvd05vdGlmaWNhdGlvbihgT2ggbm8hIFNvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgY2hlY2sgJHtrZXl9IGZpZWxkYCk7XG4gICAgICBiYWREYXRhID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV2aWV3W2tleV0gPSBzYWZlU3RyO1xuICB9KTtcblxuICAvLyBkb24ndCBwb3N0IGJhZGx5IGZvcm1lZCByZXZpZXdzXG4gIGlmIChiYWREYXRhKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHVsID0gZm9ybS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHttb250aDogJ2xvbmcnLCBkYXk6ICdudW1lcmljJywgeWVhcjogJ251bWVyaWMnfTtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLXVzJywgb3B0aW9ucyk7XG4gIHJldmlld1snY3JlYXRlZEF0J10gPSBub3c7XG4gIERCSGVscGVyLl91cGRhdGVEQignbmV3JywgcmV2aWV3KTtcblxuICBsZXQgcmV2aWV3Tm9kZSA9IGNyZWF0ZVJldmlld0hUTUwocmV2aWV3KTtcblxuICByZXR1cm4gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVhZHkudGhlbihyZWcgPT4ge1xuICAgIHJldHVybiByZWcuc3luYy5yZWdpc3Rlcignc2VuZC1yZXZpZXdzJylcbiAgfSkudGhlbigoKSA9PiB7XG4gICAgc2hvd05vdGlmaWNhdGlvbignWW91ciByZXZpZXcgd2lsbCBiZSBwb3N0ZWQgYXMgc29vbiBhcyBwb3NzaWJsZS4nKTtcbiAgICB1bC5pbnNlcnRCZWZvcmUocmV2aWV3Tm9kZSwgZm9ybS5wYXJlbnROb2RlKTtcbiAgICB1bC5yZW1vdmVDaGlsZChmb3JtLnBhcmVudE5vZGUpO1xuICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgc2hvd05vdGlmaWNhdGlvbignRXJyb3InKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBicmVhZGNydW1iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyZWFkY3J1bWInKTtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICdwYWdlJylcbiAgbGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuICBicmVhZGNydW1iLmFwcGVuZENoaWxkKGxpKTtcbn1cblxuLyoqXG4gKiBHZXQgYSBwYXJhbWV0ZXIgYnkgbmFtZSBmcm9tIHBhZ2UgVVJMLlxuICovXG5nZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSwgdXJsKSA9PiB7XG4gIGlmICghdXJsKVxuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApLFxuICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG4gIGlmICghcmVzdWx0cylcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKCFyZXN1bHRzWzJdKVxuICAgIHJldHVybiAnJztcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cbiJdfQ==
