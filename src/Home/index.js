import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
import device from '@system.device'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    modalShow: false,
    dateNow: '',
    footerAd: {},
    currentIndex: 0,
    collectIcon: '/Common/collect-icon.png',
    isCollect: false,
    collectList: []
  },
  async onInit() {
    this.getData()
    //   this.queryFooterAd()
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
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/saylove/index?key=${$appDef.key}`)
    if(data.code === 200) {
      this.newsList = data.newslist
      $appDef.storageHandle.get('list').then(d => {
        if(d) {
          try{
            let res = JSON.parse(d)
            this.collectList = [...res]
            if(this.newsList[0] && res.indexOf(this.newsList[0].content) >= 0) {
              this.collectIcon = '/Common/collect-active.png'
              this.isCollect = true
            } else {
              this.collectIcon = '/Common/collect-icon.png'
              this.isCollect = false
            }
          }catch(err) {
            this.collectIcon = '/Common/collect-icon.png'
            this.isCollect = false
          }
        } else {
          this.collectIcon = '/Common/collect-icon.png'
          this.isCollect = false
        }
      })
    }
  },
  onShow() {
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
    // // 上报广告曝光
    // this.nativeAd.reportAdShow({
    //     adId: ""
    // })
    // // 上报广告点击
    // this.nativeAd.reportAdClick({
    //     adId: ""
    // })
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
  closeModal() {
      this.modalShow = false
  },
  changeTabactive(e) {
    this.currentIndex = e.index
  },
  collect(item) {
    const $appDef = this.$app.$def
    $appDef.storageHandle.get('list').then(d => {
      if(d) {
        try{
          let data = JSON.parse(d)
          if(data.indexOf(item.content) < 0) {
            data.push(item.content)
            $appDef.storageHandle.set('list', JSON.stringify(data)).then(res => {
              this.collectList = [...data]
              prompt.showToast({
                message: '收藏成功'
              })
              this.isCollect = true
            })
          }
        } catch(err) {
          console.log(err)
        }
      } else {
        $appDef.storageHandle.set('list', JSON.stringify([item.content])).then(res => {
          this.collectList = [item.content]
          prompt.showToast({
            message: '收藏成功'
          })
          this.isCollect = true
        })
      }
    })
    this.collectIcon = '/Common/collect-active.png'
  },
})