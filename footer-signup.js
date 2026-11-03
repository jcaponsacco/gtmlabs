/* G2M Foundation 19 Footer — signup is a clearly labeled front-end preview only.
   Replace this handler with a consent-aware email service integration before launch. */
(function(){
  const form=document.getElementById('footerSubscribeForm');
  const status=document.getElementById('footerSubscribeStatus');
  if(!form || !status)return;
  form.addEventListener('submit', function(event){
    event.preventDefault();
    if(!form.reportValidity())return;
    status.textContent='Preview only — subscriptions are not connected. No data was sent or saved.';
  });
})();
