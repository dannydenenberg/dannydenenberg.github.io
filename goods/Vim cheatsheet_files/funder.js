(function () {
  let timeout;

  function init(attempts) {
    clearTimeout(timeout)
    attempts = attempts || 1
    if (attempts > 3) return
    if (typeof CodeFundAd === 'undefined') {
      timeout = setTimeout(function () { init(attempts + 1) }, 350)
      return
    }
    new CodeFundAd({"selector":"#codefund_ad","template":"centered","theme":"light","fallback":false,"urls":{"impression":"https://codefund.app/display/f6e0e160-13bf-4d4d-b092-67fe0fb8309f.gif","campaign":"https://codefund.app/impressions/f6e0e160-13bf-4d4d-b092-67fe0fb8309f/click?campaign_id=836\u0026creative_id=673\u0026property_id=51\u0026template=centered\u0026theme=light","poweredBy":"https://codefund.app/invite/lN4RA92tcuA","adblock":"https://cdn2.codefund.app/assets/px.js","uplift":"https://codefund.app/impressions/f6e0e160-13bf-4d4d-b092-67fe0fb8309f/uplift?advertiser_id=632"},"creative":{"name":"DigitalOcean ($100 credit)","headline":"DigitalOcean","body":"Test out the most developer-friendly cloud platform with a $100 credit.","cta":"Learn more","imageUrls":{"icon":"https://cdn2.codefund.app/y6tnkep1GLGXqRi1zqgkUjYD","small":"https://cdn2.codefund.app/ZxH6kzWzpZvCTjU6GpFbUi2Q","large":"https://cdn2.codefund.app/PG2q9Ks6vkfd4pVZfHJbGGen","wide":"https://cdn2.codefund.app/x8k52sPzSFC3ThxZ5heaojA1"}}})
  }

  const codefundStylesheetId = 'codefund-style'
  const codefundScriptId = 'codefund-script'

  if (!document.getElementById(codefundStylesheetId)) {
    const stylesheet = document.createElement('link')
    stylesheet.setAttribute('id', codefundStylesheetId)
    stylesheet.setAttribute('rel', 'stylesheet')
    stylesheet.setAttribute('media', 'all')
    stylesheet.setAttribute('href', 'https://codefund.app/packs/css/code_fund_ad-d22c5e16.css')
    stylesheet.addEventListener('load', init)
    document.head.appendChild(stylesheet)
  }

  if (document.getElementById(codefundScriptId)) {
    init()
  } else {
    const script = document.createElement('script')
    script.setAttribute('id', codefundScriptId)
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', 'https://codefund.app/packs/js/code_fund_ad-3e0b91c3a4e52246a8ec.js')
    script.addEventListener('load', init)
    document.head.appendChild(script)
  }
})()
