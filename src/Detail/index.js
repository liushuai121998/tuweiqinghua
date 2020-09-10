import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
import device from '@system.device'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  data: {
    content: '',
    footerAdShow: false,
    dateNow: '',
    footerAd: {}
  },
  async onInit() {
    this.dateNow = this.$app.$def.parseTime(Date.now(), '{y}-{m}-{d}')
    const deviceInfo = await device.getInfo()
    const brand = deviceInfo.data.brand
    if(brand === 'OPPO') {
      console.log('xxx')
    } else if(brand === 'vivo') {
      this.insertAd()
      this.queryFooterAd()
    }
  },
  longPress(item, e) {
    clipboard.set({
      text: `${item.content}`,
      success () {
        prompt.showToast({
          message: '复制成功'
        })
      }
    })
  },
  hideFooterAd() {
      this.footerAdShow = false
      this.nativeAd && this.nativeAd.destroy()
  },
  queryFooterAd() {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: '2d6b2c2182664ba3a2667ce8f81d8bc9'
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      // prompt.showToast({
      //   message: this.footerAd
      // })
      this.footerAdShow = true
    })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
//   插屏广告
  insertAd() {
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: 'd226656c3adf4623adc0f58e2aa3b656'
      })
      this.interstitialAd.onLoad(()=> {
          this.interstitialAd.show();
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  back() {
      router.back()
  }
})