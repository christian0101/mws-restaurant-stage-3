let queue=[];function Toast(t,e,s){const o=this;this.text=t,this.duration=e,this.buttons=s,this.answer=new Promise(function(t){o._answerResolver=t}),this.gone=new Promise(function(t){o._goneResolver=t})}Toast.prototype.create=((t="No message",e=null,s=["dismiss"])=>{const o=new Toast(t,e,s),n=document.createElement("div");n.id="toast",n.className="toast",n.tabIndex="-1";const a=document.createElement("span");if(a.innerHTML=t,a.className="toast-text",n.appendChild(a),s){const t=document.createElement("span");t.className="toast-buttons",s.forEach(e=>{const s=document.createElement("button");s.id=e,s.innerHTML=e,s.className="unbutton",t.appendChild(s)}),n.appendChild(t),t.addEventListener("click",function(t){const e=t.target;e&&(o._answerResolver(e.innerHTML),o.dismiss(n,o))}),t.addEventListener("scroll",function(e){t.scrollLeft>10?a.className="toast-text_scrolled":a.className="toast-text"})}return queue.push({toastElement:n,toast:o}),o.show(o),o}),Toast.prototype.show=(()=>{if(!document.getElementById("toast")){const t=queue.shift();document.body.appendChild(t.toastElement),t.toastElement.focus(),t.toast.duration&&(this._hideTimeout=setTimeout(()=>{t.toast.dismiss(t.toastElement,t.toast)},1e3*t.toast.duration))}}),Toast.prototype.dismiss=((t,e)=>(clearTimeout(this._hideTimeout),e._answerResolver(),t.classList.add("toast-dismissed"),setTimeout(()=>{t.parentNode.removeChild(t),queue.length>0&&e.show()},400),e._goneResolver()));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvYXN0LmpzIl0sIm5hbWVzIjpbInF1ZXVlIiwiVG9hc3QiLCJ0ZXh0IiwiZHVyYXRpb24iLCJidXR0b25zIiwidG9hc3QiLCJ0aGlzIiwiYW5zd2VyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJfYW5zd2VyUmVzb2x2ZXIiLCJnb25lIiwiX2dvbmVSZXNvbHZlciIsInByb3RvdHlwZSIsImNyZWF0ZSIsIm1lc3NhZ2UiLCJ0b2FzdEVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImNsYXNzTmFtZSIsInRhYkluZGV4IiwidGV4dEVsZW1lbnQiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImJ1dHRvbnNFbGVtZW50IiwiZm9yRWFjaCIsImJ1dHRvbiIsInRvYXN0QnV0dG9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidGFyZ2V0IiwiZGlzbWlzcyIsInNjcm9sbExlZnQiLCJwdXNoIiwic2hvdyIsImdldEVsZW1lbnRCeUlkIiwibm90aWZpY2F0aW9uIiwic2hpZnQiLCJib2R5IiwiZm9jdXMiLCJfaGlkZVRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiQUFJQSxJQUFJQSxNQUFRLEdBS1osU0FBU0MsTUFBTUMsRUFBTUMsRUFBVUMsR0FDN0IsTUFBTUMsRUFBUUMsS0FDZEEsS0FBS0osS0FBT0EsRUFDWkksS0FBS0gsU0FBV0EsRUFDaEJHLEtBQUtGLFFBQVVBLEVBRWZFLEtBQUtDLE9BQVMsSUFBSUMsUUFBUSxTQUFTQyxHQUNqQ0osRUFBTUssZ0JBQWtCRCxJQUcxQkgsS0FBS0ssS0FBTyxJQUFJSCxRQUFRLFNBQVNDLEdBQy9CSixFQUFNTyxjQUFnQkgsSUFVMUJSLE1BQU1ZLFVBQVVDLE9BQVMsRUFBQ0MsRUFBVSxhQUFjWixFQUFXLEtBQU1DLEVBQVUsQ0FBQyxjQUM1RSxNQUFNQyxFQUFRLElBQUlKLE1BQU1jLEVBQVNaLEVBQVVDLEdBRXJDWSxFQUFlQyxTQUFTQyxjQUFjLE9BQzVDRixFQUFhRyxHQUFLLFFBQ2xCSCxFQUFhSSxVQUFZLFFBQ3pCSixFQUFhSyxTQUFXLEtBQ3hCLE1BQU1DLEVBQWNMLFNBQVNDLGNBQWMsUUFLM0MsR0FKQUksRUFBWUMsVUFBWVIsRUFDeEJPLEVBQVlGLFVBQVksYUFDeEJKLEVBQWFRLFlBQVlGLEdBRXJCbEIsRUFBUyxDQUNYLE1BQU1xQixFQUFpQlIsU0FBU0MsY0FBYyxRQUM5Q08sRUFBZUwsVUFBWSxnQkFDM0JoQixFQUFRc0IsUUFBU0MsSUFDZixNQUFNQyxFQUFjWCxTQUFTQyxjQUFjLFVBQzNDVSxFQUFZVCxHQUFLUSxFQUNqQkMsRUFBWUwsVUFBWUksRUFDeEJDLEVBQVlSLFVBQVksV0FDeEJLLEVBQWVELFlBQVlJLEtBRTdCWixFQUFhUSxZQUFZQyxHQUV6QkEsRUFBZUksaUJBQWlCLFFBQVMsU0FBU0MsR0FDaEQsTUFBTUgsRUFBU0csRUFBTUMsT0FDaEJKLElBQ0x0QixFQUFNSyxnQkFBZ0JpQixFQUFPSixXQUM3QmxCLEVBQU0yQixRQUFRaEIsRUFBY1gsTUFHOUJvQixFQUFlSSxpQkFBaUIsU0FBVSxTQUFTQyxHQUM3Q0wsRUFBZVEsV0FBYSxHQUM5QlgsRUFBWUYsVUFBWSxzQkFFeEJFLEVBQVlGLFVBQVksZUFROUIsT0FIQXBCLE1BQU1rQyxLQUFLLENBQUNsQixhQUFBQSxFQUFjWCxNQUFBQSxJQUMxQkEsRUFBTThCLEtBQUs5QixHQUVKQSxJQU1USixNQUFNWSxVQUFVc0IsS0FBTyxNQUNyQixJQUFLbEIsU0FBU21CLGVBQWUsU0FBVSxDQUNyQyxNQUFNQyxFQUFlckMsTUFBTXNDLFFBQzNCckIsU0FBU3NCLEtBQUtmLFlBQVlhLEVBQWFyQixjQUN2Q3FCLEVBQWFyQixhQUFhd0IsUUFFdEJILEVBQWFoQyxNQUFNRixXQUNyQkcsS0FBS21DLGFBQWVDLFdBQVcsS0FDN0JMLEVBQWFoQyxNQUFNMkIsUUFBUUssRUFBYXJCLGFBQWNxQixFQUFhaEMsUUFDcEMsSUFBOUJnQyxFQUFhaEMsTUFBTUYsY0FRNUJGLE1BQU1ZLFVBQVVtQixRQUFVLEVBQUNoQixFQUFjWCxLQUN2Q3NDLGFBQWFyQyxLQUFLbUMsY0FDbEJwQyxFQUFNSyxrQkFFTk0sRUFBYTRCLFVBQVVDLElBQUksbUJBRTNCSCxXQUFXLEtBQ1QxQixFQUFhOEIsV0FBV0MsWUFBWS9CLEdBQ2hDaEIsTUFBTWdELE9BQVMsR0FDakIzQyxFQUFNOEIsUUFFUCxLQUVJOUIsRUFBTU8iLCJmaWxlIjoiVG9hc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRvYXN0IG5vdGlmaWNhdGlvbnMuXG4gKi9cblxubGV0IHF1ZXVlID0gW107XG5cbi8qKlxuICogVG9hc3QgbnRpZmljYXRpb24gY29udHJ1Y3Rvci5cbiAqL1xuZnVuY3Rpb24gVG9hc3QodGV4dCwgZHVyYXRpb24sIGJ1dHRvbnMpIHtcbiAgY29uc3QgdG9hc3QgPSB0aGlzO1xuICB0aGlzLnRleHQgPSB0ZXh0O1xuICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIHRoaXMuYnV0dG9ucyA9IGJ1dHRvbnM7XG5cbiAgdGhpcy5hbnN3ZXIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgdG9hc3QuX2Fuc3dlclJlc29sdmVyID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdGhpcy5nb25lID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHRvYXN0Ll9nb25lUmVzb2x2ZXIgPSByZXNvbHZlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdG9hc3Qgbm90aWZpY2F0aW9uLlxuICogQHBhcmFtIG1lc3NhZ2UgdGV4dCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSBkdXJhdGlvbiB0aW1lIGluIHNlY29uZHMgYmVmb3JlIGRpc21pc3NpbmdcbiAqIEBwYXJhbSBidXR0b25zIGFycmF5IG9mIGJ1dHRvbnNcbiAqL1xuVG9hc3QucHJvdG90eXBlLmNyZWF0ZSA9IChtZXNzYWdlID0gJ05vIG1lc3NhZ2UnLCBkdXJhdGlvbiA9IG51bGwsIGJ1dHRvbnMgPSBbJ2Rpc21pc3MnXSkgPT4ge1xuICBjb25zdCB0b2FzdCA9IG5ldyBUb2FzdChtZXNzYWdlLCBkdXJhdGlvbiwgYnV0dG9ucyk7XG5cbiAgY29uc3QgdG9hc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRvYXN0RWxlbWVudC5pZCA9ICd0b2FzdCc7XG4gIHRvYXN0RWxlbWVudC5jbGFzc05hbWUgPSAndG9hc3QnO1xuICB0b2FzdEVsZW1lbnQudGFiSW5kZXggPSAnLTEnO1xuICBjb25zdCB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgdGV4dEVsZW1lbnQuY2xhc3NOYW1lID0gJ3RvYXN0LXRleHQnO1xuICB0b2FzdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dEVsZW1lbnQpO1xuXG4gIGlmIChidXR0b25zKSB7XG4gICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYnV0dG9uc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3RvYXN0LWJ1dHRvbnMnXG4gICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgIGNvbnN0IHRvYXN0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB0b2FzdEJ1dHRvbi5pZCA9IGJ1dHRvbjtcbiAgICAgIHRvYXN0QnV0dG9uLmlubmVySFRNTCA9IGJ1dHRvbjtcbiAgICAgIHRvYXN0QnV0dG9uLmNsYXNzTmFtZSA9ICd1bmJ1dHRvbic7XG4gICAgICBidXR0b25zRWxlbWVudC5hcHBlbmRDaGlsZCh0b2FzdEJ1dHRvbik7XG4gICAgfSk7XG4gICAgdG9hc3RFbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbnNFbGVtZW50KTtcblxuICAgIGJ1dHRvbnNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGlmICghYnV0dG9uKSByZXR1cm47XG4gICAgICB0b2FzdC5fYW5zd2VyUmVzb2x2ZXIoYnV0dG9uLmlubmVySFRNTCk7XG4gICAgICB0b2FzdC5kaXNtaXNzKHRvYXN0RWxlbWVudCwgdG9hc3QpO1xuICAgIH0pO1xuXG4gICAgYnV0dG9uc0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChidXR0b25zRWxlbWVudC5zY3JvbGxMZWZ0ID4gMTApIHtcbiAgICAgICAgdGV4dEVsZW1lbnQuY2xhc3NOYW1lID0gJ3RvYXN0LXRleHRfc2Nyb2xsZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dEVsZW1lbnQuY2xhc3NOYW1lID0gJ3RvYXN0LXRleHQnO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcXVldWUucHVzaCh7dG9hc3RFbGVtZW50LCB0b2FzdH0pO1xuICB0b2FzdC5zaG93KHRvYXN0KTtcblxuICByZXR1cm4gdG9hc3Q7XG59XG5cbi8qKlxuICogRGlzcGxheSB0b2FzdCBub3RpZmljYXRpb24gZnJvbSBxdWV1ZS5cbiAqL1xuVG9hc3QucHJvdG90eXBlLnNob3cgPSAoKSA9PiB7XG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvYXN0JykpIHtcbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBxdWV1ZS5zaGlmdCgpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uLnRvYXN0RWxlbWVudCk7XG4gICAgbm90aWZpY2F0aW9uLnRvYXN0RWxlbWVudC5mb2N1cygpO1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi50b2FzdC5kdXJhdGlvbikge1xuICAgICAgdGhpcy5faGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbm90aWZpY2F0aW9uLnRvYXN0LmRpc21pc3Mobm90aWZpY2F0aW9uLnRvYXN0RWxlbWVudCwgbm90aWZpY2F0aW9uLnRvYXN0KTtcbiAgICAgIH0sIG5vdGlmaWNhdGlvbi50b2FzdC5kdXJhdGlvbiAqIDEwMDApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc21pc3MgdG9hc3Qgbm90aWZpY2F0aW9uLlxuICovXG5Ub2FzdC5wcm90b3R5cGUuZGlzbWlzcyA9ICh0b2FzdEVsZW1lbnQsIHRvYXN0KSA9PiB7XG4gIGNsZWFyVGltZW91dCh0aGlzLl9oaWRlVGltZW91dCk7XG4gIHRvYXN0Ll9hbnN3ZXJSZXNvbHZlcigpO1xuXG4gIHRvYXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b2FzdC1kaXNtaXNzZWQnKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB0b2FzdEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0b2FzdEVsZW1lbnQpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICB0b2FzdC5zaG93KCk7XG4gICAgfVxuICB9LCA0MDApO1xuXG4gIHJldHVybiB0b2FzdC5fZ29uZVJlc29sdmVyKCk7XG59XG4iXX0=
