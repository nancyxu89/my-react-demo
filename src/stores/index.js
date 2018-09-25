import {observable, action, runInAction} from "mobx"
import http from "../api/request"
class Store {
    @observable token = ''
    @observable number = 0
    @observable defaultActive = '1'
    @action add = () => {
        this.number++
    }
    @action login = async(params) => {
        const rst = await http.post('http://result.eolinker.com/Xqkc6Hsab40971d62256e684b7e73c3e9008076b8db5f32?uri=/react/login', params)
        runInAction(() => {
            this.token = rst.data.token
        })
    }
    @action setDefaultActive = (num) => {
        this.defaultActive = num
    }
}
const stores = new Store()
stores.add()

// function startCount() {
//     let count = 0
//     let interval
//     interval = setInterval(()=> {
//         stores.add()
//         count++
//         if (count > 10) {
//             clearInterval(interval)
//         }
//     }, 2000)
// }
// startCount()
export default stores