import prompt from '@system.prompt';
import ad from '@service.ad';
import router from '@system.router';
import device from '@system.device'
export default {
    data: {
        list: [],
        visible: false
    },
    toDetail(item) {
        router.push({
            uri: '/Detail',
            params: {
                content: item
            }
        })
    }
}