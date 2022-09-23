// pages/bluetooth1/bluetooth1.js
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
let revData = ''
Page({

    /**
     * 页面的初始数据
     */
    data: {

        devices: [],
        deviceId: '',
        serviceId: '',
        services: [],
        name: '',
        characteristics: [],
        characteristicId: '',
        showData: '',
        input_1: '',
        input_2:'',

        inputKey: true,
        showFlag: true,
        showFlag_lanyashebei: false,
        read: false,
        write: false,
        showKeyboard: false,
        showFlag_tezhengzhi: false,
        discoverFlag: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        wx.openBluetoothAdapter({
            success(res) {
                console.log(res)
            }
        })
        let that = this
        wx.startBluetoothDevicesDiscovery({
            services: [],
            success(res) {
                console.log(res)
                that.setData({
                    discoverFlag: res.isDiscovering
                })
            }
        })
        wx.getBluetoothAdapterState({
            success(res) {
                console.log(res)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.getBluetoothAdapterState({
            success(res) {
                console.log(res)
            }
        })
        wx.openBluetoothAdapter({
            success(res) {
                console.log(res)
            }
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    openAdapter() {
        wx.openBluetoothAdapter({
            success(res) {
                console.log(res)
            }
        })
    },
    startdiscover() {
        let that = this
        wx.startBluetoothDevicesDiscovery({
            services: [],
            success(res) {
                console.log(res)
                that.setData({
                    discoverFlag: res.isDiscovering
                })

            }
        })
    },
    getdiscover() {
        let that = this
        function ab2hex(buffer) {
            var hexArr = Array.prototype.map.call(
                new Uint8Array(buffer),
                function (bit) {
                    return ('00' + bit.toString(16)).slice(-2)
                }
            )
            return hexArr.join('');
        }
        wx.startBluetoothDevicesDiscovery({
            services: [],
            success(res) {
                console.log(res)
                that.setData({
                    discoverFlag: res.isDiscovering

                })
                wx: wx.showLoading({
                    title: '寻找中',
                })
            }
        })
        if (this.data.discoverFlag) {
            // ArrayBuffer转16进度字符串示例
            wx.onBluetoothDeviceFound(function (res) {
                let devices = res.devices;
                console.log('new device list has founded')
                console.dir(devices)
                console.log(ab2hex(devices[0].advertisData))
                wx.getBluetoothDevices({
                    success: function (res) {
                        console.log(res)
                        that.setData({
                            devices: res.devices
                        })
                    },
                    wx: wx.hideLoading({
                        title: '',
                    })
                })

                if (that.data.devices.length >= 4) {
                    wx.stopBluetoothDevicesDiscovery({
                        success(res) {
                            console.log(res)
                        }
                    })
                    //   wx:wx.hideLoading({
                    //     title: '',
                    //   })
                }
            })
        }
    },
    create(e) {
        let that = this
        console.log(e)
        let index = e.currentTarget.dataset.index
        wx.createBLEConnection({
            deviceId: that.data.devices[index].deviceId,
            wx: wx.showLoading({
                title: '连接中',
            }),
            success(res) {
                console.log(res)
                that.setData({
                    deviceId: that.data.devices[index].deviceId,
                    name: that.data.devices[index].name,
                    showFlag: false,
                    showFlag_lanyashebei: true,
                })
                wx: wx.hideLoading({
                    title: '',
                })
                wx.getBLEDeviceServices({
                    // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立连接
                    deviceId: that.data.deviceId,
                    success(res) {
                        console.log('device services:', res.services)
                        that.setData({
                            services: res.services

                        })
                    }
                })
            }
        })
    },
    choose(e) {
        console.log(e)
        let that = this
        let index = e.currentTarget.dataset.index
        let serviceId = this.data.services[index].uuid
        this.setData({
            serviceId: serviceId,
            showFlag_tezhengzhi: true

        })
        wx.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立链接
            deviceId: this.data.deviceId,
            // 这里的 serviceId 需要在 wx.getBLEDeviceServices 接口中获取
            serviceId: this.data.serviceId,
            success(res) {
                console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                that.setData({
                    characteristics: res.characteristics,
                })
            }
        })
    },
    disconnect() {
        let that = this
        wx.closeBLEConnection({
            deviceId: this.data.deviceId,
            success(res) {
                console.log(res)
                that.setData({
                    showFlag: true,
                    showFlag_lanyashebei: false,
                    showFlag_tezhengzhi: false,
                    showKeyboard: false,
                })
            },
        })
    },
    select(e) {
        let that = this
        console.log(e)
        let index = e.currentTarget.dataset.index
        let characteristicId = this.data.characteristics[index].uuid
        this.setData({
            characteristicId: characteristicId,
            showKeyboard: true,
        })
        wx.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: this.data.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: this.data.serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: this.data.characteristicId,
            success(res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                // ArrayBuffer转16进制字符串示例
                function ab2hex(buffer) {
                    let hexArr = Array.prototype.map.call(
                        new Uint8Array(buffer),
                        function (bit) {
                            return ('00' + bit.toString(16)).slice(-2)
                        }
                    )
                    return hexArr.join('');
                }
                wx.onBLECharacteristicValueChange(function (res) {
                    console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
                    console.log(ab2hex(res.value))
                })// ArrayBuffer转16进制字符串示例
                function ab2hex(buffer) {
                    let hexArr = Array.prototype.map.call(
                        new Uint8Array(buffer),
                        function (bit) {
                            return ('00' + bit.toString(16)).slice(-2)
                        }
                    )
                    return hexArr.join('');
                }
                wx.onBLECharacteristicValueChange(function (res) {
                    console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
                    console.log(ab2hex(res.value))
                    console.log(ab2str(res.value))
                    let value = ab2str(res.value)
                    revData += value
                    //修改
                    if (value==300) {
                        revData = value
                    }
                    that.setData({
                        showData: revData
                    })
                })
            }
        })
    },
    sendData(e) {
        console.log(e)
        let value = e.detail.value
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
            dataView.setUint8(i, value[i].charCodeAt())
        }
        wx.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: this.data.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: this.data.serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: this.data.characteristicId,
            // 这里的 value 是ArrayBuffer类型
            value: buffer,
            success(res) {
                console.log(buffer)
                console.log('writeBLECharacteristicValue success', res.errMsg)
                wx.showToast({
                    title: '发送成功',
                })
            },
            fail(res) {
                wx.showToast({
                    title: '发送失败',
                })
            }
        })
    },
    click: function (event) {
        let value = event.currentTarget.dataset.value
        console.log("value：" + value)
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindReplaceInput: function (e) {
        var value = e.detail.value
        var pos = e.detail.cursor
        var left
        if (pos !== -1) {
            // 光标在中间
            left = e.detail.value.slice(0, pos)
            // 计算光标的位置
            pos = left.replace(/11/g, '2').length
        }

        // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        }

        // 或者直接返回字符串,光标在最后边
        // return value.replace(/11/g,'2'),
    },
    bindHideKeyboard: function (e) {
        if (e.detail.value === '123') {
            // 收起键盘
            wx.hideKeyboard()
        }
    },
    sendData_1(e) {
        console.log("input_1:" + this.data.input_1)
        let value = this.data.input_1
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
            dataView.setUint8(i, value[i].charCodeAt())
        }
        wx.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: this.data.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: this.data.serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: this.data.characteristicId,
            // 这里的 value 是ArrayBuffer类型
            value: buffer,
            success(res) {
                console.log(buffer)
                console.log('writeBLECharacteristicValue success', res.errMsg)
                wx.showToast({
                    title: '发送成功',
                })
            },
            fail(res) {
                wx.showToast({
                    title: '发送失败',
                })
            }
        })
    },

    anjian_1: function (e) {
        this.setData({
            input_1: e.detail.value
        })
    },
    sendData_2(e) {
        console.log("input_2:" + this.data.input_2)
        let value = this.data.input_2
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
            dataView.setUint8(i, value[i].charCodeAt())
        }
        wx.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: this.data.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: this.data.serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: this.data.characteristicId,
            // 这里的 value 是ArrayBuffer类型
            value: buffer,
            success(res) {
                console.log(buffer)
                console.log('writeBLECharacteristicValue success', res.errMsg)
                wx.showToast({
                    title: '发送成功',
                })
            },
            fail(res) {
                wx.showToast({
                    title: '发送失败',
                })
            }
        })
    },
    anjian_2: function (e) {
        this.setData({
            input_2: e.detail.value
        })
    },
})